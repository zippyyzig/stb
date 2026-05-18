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

interface SandboxGSTResponse {
  code: number;
  timestamp: number;
  data?: {
    gstin: string;
    business_name: string;
    legal_name: string;
    state_jurisdiction: string;
    state_jurisdiction_code: string;
    center_jurisdiction: string;
    date_of_registration: string;
    constitution_of_business: string;
    taxpayer_type: string;
    gstin_status: string;
    date_of_cancellation?: string;
    filing_status?: Array<{
      return_type: string;
      financial_year: string;
      tax_period: string;
      date_of_filing: string;
      status: string;
    }>;
    address?: string;
    nature_of_business_activities?: string[];
    trade_name?: string;
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

// Cache for access tokens (in-memory for now, consider Redis for production)
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Authenticate with Sandbox API to get access token
 */
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const apiKey = process.env.SANDBOX_API_KEY;
  const apiSecret = process.env.SANDBOX_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Sandbox API credentials not configured");
  }

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
    console.error("[v0] Sandbox auth error:", errorText);
    throw new Error("Failed to authenticate with Sandbox API");
  }

  const data: SandboxAuthResponse = await response.json();
  
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

    const data: SandboxGSTResponse = await response.json();

    // Handle API errors
    if (data.code !== 200 || !data.data) {
      const errorMessage = data.error?.message || data.message || "GST number not found or invalid";
      return {
        valid: false,
        verified: true,
        error: errorMessage,
      };
    }

    // Check if GST is active
    const gstData = data.data;
    const isActive = gstData.gstin_status?.toLowerCase() === "active";

    if (!isActive) {
      return {
        valid: false,
        verified: true,
        error: `GST is ${gstData.gstin_status || "inactive"}. Only active GST numbers are accepted.`,
        data: {
          gstin: gstData.gstin,
          businessName: gstData.business_name || gstData.trade_name || "",
          legalName: gstData.legal_name || "",
          state: gstData.state_jurisdiction || "",
          stateCode: gstData.state_jurisdiction_code || gstin.substring(0, 2),
          registrationDate: gstData.date_of_registration || "",
          constitutionOfBusiness: gstData.constitution_of_business || "",
          taxpayerType: gstData.taxpayer_type || "",
          status: gstData.gstin_status || "",
          address: gstData.address,
          tradeName: gstData.trade_name,
        },
      };
    }

    return {
      valid: true,
      verified: true,
      data: {
        gstin: gstData.gstin,
        businessName: gstData.business_name || gstData.trade_name || "",
        legalName: gstData.legal_name || "",
        state: gstData.state_jurisdiction || "",
        stateCode: gstData.state_jurisdiction_code || gstin.substring(0, 2),
        registrationDate: gstData.date_of_registration || "",
        constitutionOfBusiness: gstData.constitution_of_business || "",
        taxpayerType: gstData.taxpayer_type || "",
        status: gstData.gstin_status || "",
        address: gstData.address,
        tradeName: gstData.trade_name,
      },
    };
  } catch (error) {
    console.error("[v0] GST verification error:", error);
    
    // If API fails, fall back to format validation only
    // This ensures the system remains usable even if Sandbox API is down
    return {
      valid: formatValidation.valid,
      verified: false,
      error: "Could not verify GST with government database. Please try again later.",
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
  const validStateCodes = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36", "37", "38"
  ];

  if (!validStateCodes.includes(stateCode)) {
    return { valid: false, error: "Invalid state code in GST number" };
  }

  return { valid: true, stateCode };
}
