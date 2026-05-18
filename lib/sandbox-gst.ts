/**
 * Sandbox GST Verification Library
 * 
 * Integrates with Sandbox.co.in API for real GST verification
 * Documentation: https://developer.sandbox.co.in
 */

const SANDBOX_BASE_URL = "https://api.sandbox.co.in";

interface SandboxAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Response from Search GSTIN API (abbreviated field names)
interface SandboxGSTSearchResponse {
  code: number;
  timestamp: number;
  transaction_id?: string;
  data?: {
    gstin: string;
    lgnm?: string; // Legal name
    tradeNam?: string; // Trade name
    stj?: string; // State jurisdiction
    stjCd?: string; // State jurisdiction code
    ctj?: string; // Center jurisdiction
    ctjCd?: string; // Center jurisdiction code
    rgdt?: string; // Registration date
    dty?: string; // Dealer type / taxpayer type
    cxdt?: string; // Cancellation date
    sts?: string; // Status (Active/Cancelled/Suspended)
    ctb?: string; // Constitution of business
    nba?: string[]; // Nature of business activities
    pradr?: {
      addr?: {
        bnm?: string;
        st?: string;
        loc?: string;
        bno?: string;
        dst?: string;
        stcd?: string;
        pncd?: string;
      };
      ntr?: string;
    };
    einvoiceStatus?: string;
  };
  message?: string;
  error?: {
    message: string;
    code: string;
  };
}

export interface GSTVerificationResult {
  valid: boolean;
  verified: boolean;
  error?: string;
  data?: {
    gstin: string;
    businessName: string;
    legalName: string;
    state: string;
    stateCode: string;
    registrationDate: string;
    constitutionOfBusiness: string;
    taxpayerType: string;
    status: string;
    address?: string;
    tradeName?: string;
  };
}

// Cache for access tokens
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Authenticate with Sandbox API to get access token
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    console.log("[v0] Using cached Sandbox token");
    return cachedToken.token;
  }

  const apiKey = process.env.SANDBOX_API_KEY;
  const apiSecret = process.env.SANDBOX_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error("[v0] Sandbox API credentials not configured");
    throw new Error("Sandbox API credentials not configured");
  }

  console.log("[v0] Authenticating with Sandbox API...");

  const response = await fetch(`${SANDBOX_BASE_URL}/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "x-api-secret": apiSecret,
      "x-api-version": "1.0",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[v0] Sandbox auth error:", response.status, errorText);
    throw new Error(`Failed to authenticate with Sandbox API: ${response.status}`);
  }

  const data: SandboxAuthResponse = await response.json();
  console.log("[v0] Sandbox authentication successful");
  
  // Cache the token
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };

  return data.access_token;
}

/**
 * Verify GST number using Sandbox API
 * 
 * @param gstin - 15-character GST number to verify
 * @returns Verification result with business details if valid
 */
export async function verifyGSTNumber(gstin: string): Promise<GSTVerificationResult> {
  // Basic format validation first
  const formatValidation = validateGSTFormat(gstin);
  if (!formatValidation.valid) {
    return {
      valid: false,
      verified: false,
      error: formatValidation.error,
    };
  }

  try {
    const accessToken = await getAccessToken();

    console.log("[v0] Verifying GST number:", gstin);

    // Use the Search GSTIN endpoint
    const response = await fetch(`${SANDBOX_BASE_URL}/gst/compliance/public/search/gstin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken,
        "x-api-key": process.env.SANDBOX_API_KEY!,
        "x-api-version": "1.0",
      },
      body: JSON.stringify({
        gstin: gstin.toUpperCase(),
      }),
    });

    const responseText = await response.text();
    console.log("[v0] Sandbox API response status:", response.status);
    console.log("[v0] Sandbox API response:", responseText);

    let data: SandboxGSTSearchResponse;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("[v0] Failed to parse Sandbox response");
      return {
        valid: false,
        verified: false,
        error: "Failed to parse API response. Please try again.",
      };
    }

    // Handle various error responses
    if (response.status === 422) {
      return {
        valid: false,
        verified: true,
        error: "Invalid GST number format",
      };
    }

    if (response.status === 401 || response.status === 403) {
      // Clear cached token on auth errors
      cachedToken = null;
      return {
        valid: false,
        verified: false,
        error: "GST verification service temporarily unavailable",
      };
    }

    // Check if GSTIN was found
    if (!data.data || !data.data.gstin) {
      // GST not found in database
      const errorMsg = data.message || data.error?.message || "GST number not found in government database";
      return {
        valid: false,
        verified: true,
        error: errorMsg,
      };
    }

    const gstData = data.data;
    
    // Check GST status - accept only Active GSTs
    const status = gstData.sts?.toLowerCase() || "";
    const isActive = status === "active" || status === "act";

    // Build address string
    let address = "";
    if (gstData.pradr?.addr) {
      const addr = gstData.pradr.addr;
      const parts = [addr.bno, addr.bnm, addr.st, addr.loc, addr.dst, addr.pncd].filter(Boolean);
      address = parts.join(", ");
    }

    // Get state from state jurisdiction
    const stateName = gstData.stj || STATE_CODES[gstin.substring(0, 2)] || "";
    const stateCode = gstData.stjCd || gstin.substring(0, 2);

    if (!isActive) {
      return {
        valid: false,
        verified: true,
        error: `GST is ${gstData.sts || "inactive"}. Only active GST numbers are accepted.`,
        data: {
          gstin: gstData.gstin,
          businessName: gstData.tradeNam || gstData.lgnm || "",
          legalName: gstData.lgnm || "",
          state: stateName,
          stateCode: stateCode,
          registrationDate: gstData.rgdt || "",
          constitutionOfBusiness: gstData.ctb || "",
          taxpayerType: gstData.dty || "",
          status: gstData.sts || "",
          address: address,
          tradeName: gstData.tradeNam,
        },
      };
    }

    return {
      valid: true,
      verified: true,
      data: {
        gstin: gstData.gstin,
        businessName: gstData.tradeNam || gstData.lgnm || "",
        legalName: gstData.lgnm || "",
        state: stateName,
        stateCode: stateCode,
        registrationDate: gstData.rgdt || "",
        constitutionOfBusiness: gstData.ctb || "",
        taxpayerType: gstData.dty || "",
        status: gstData.sts || "Active",
        address: address,
        tradeName: gstData.tradeNam,
      },
    };
  } catch (error) {
    console.error("[v0] GST verification error:", error);
    
    // If API fails, return error but mark as not verified
    return {
      valid: false,
      verified: false,
      error: "Could not verify GST with government database. Please try again.",
    };
  }
}

/**
 * Validate GST number format (without API call)
 */
export function validateGSTFormat(gstin: string): { valid: boolean; error?: string; stateCode?: string } {
  if (!gstin) {
    return { valid: false, error: "GST number is required" };
  }

  const upperGST = gstin.toUpperCase().trim();

  if (upperGST.length !== 15) {
    return { valid: false, error: "GST number must be exactly 15 characters" };
  }

  // Format: 2 digits (state code) + 5 letters (PAN first 5) + 4 digits + 1 letter + 1 alphanumeric + Z + 1 check digit
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (!gstRegex.test(upperGST)) {
    return { valid: false, error: "Invalid GST number format" };
  }

  const stateCode = upperGST.substring(0, 2);
  const validStateCodes = Object.keys(STATE_CODES);

  if (!validStateCodes.includes(stateCode)) {
    return { valid: false, error: "Invalid state code in GST number" };
  }

  return { valid: true, stateCode };
}

// State codes mapping
const STATE_CODES: { [key: string]: string } = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra",
  "28": "Andhra Pradesh (Old)",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
};
