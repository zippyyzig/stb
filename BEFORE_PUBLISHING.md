# Before Publishing — Smart Tech Bazaar Mobile App

This document covers every step you must complete before submitting the Smart Tech Bazaar app
to the Google Play Store and Apple App Store using Median.co as your wrapper.
Follow each section in order. Do not skip any step.

---

## Table of Contents

1. [Accounts & Memberships You Must Have](#1-accounts--memberships-you-must-have)
2. [Deploy Your Website to Production](#2-deploy-your-website-to-production)
3. [Update Placeholder Values in Code](#3-update-placeholder-values-in-code)
4. [App Icons & Splash Screens](#4-app-icons--splash-screens)
5. [Set Up OneSignal for Push Notifications](#5-set-up-onesignal-for-push-notifications)
6. [Set Up Median.co App Project](#6-set-up-medianco-app-project)
7. [Android — Google Play Store](#7-android--google-play-store)
8. [iOS — Apple App Store](#8-ios--apple-app-store)
9. [Privacy Policy & Legal Pages](#9-privacy-policy--legal-pages)
10. [Final Pre-Submission Checklist](#10-final-pre-submission-checklist)

---

## 1. Accounts & Memberships You Must Have

Before you begin, make sure you have paid for and registered all of the following accounts.
None of these can be skipped.

| Account | Cost | Where to Sign Up |
|---|---|---|
| Median.co account | Starts at $99/year per platform | https://median.co/pricing |
| Google Play Developer account | One-time $25 registration fee | https://play.google.com/console |
| Apple Developer Program membership | $99/year | https://developer.apple.com/programs/ |
| OneSignal account (push notifications) | Free tier available | https://onesignal.com |

---

## 2. Deploy Your Website to Production

Your Median.co wrapper wraps a **live URL**, not local code. You must deploy the app to
a production domain before building the mobile wrapper.

**Steps:**

1. Deploy the Next.js app to Vercel (or any host) and confirm it is live at your domain,
   for example `https://smarttechbazaar.com`.
2. Confirm the following URLs are accessible (visit each one in your browser):
   - `https://YOUR-DOMAIN.com/` — Home page loads correctly
   - `https://YOUR-DOMAIN.com/manifest.json` — Returns JSON, not a 404
   - `https://YOUR-DOMAIN.com/.well-known/assetlinks.json` — Returns JSON, not a 404
   - `https://YOUR-DOMAIN.com/.well-known/apple-app-site-association` — Returns JSON, not a 404
   - `https://YOUR-DOMAIN.com/api/health` — Returns `{"status":"ok",...}`
3. Make sure your site uses **HTTPS**. Both app stores require a secure connection and
   Median.co will refuse to wrap an HTTP-only site.
4. Make sure all pages load correctly on a real mobile device browser before wrapping.

---

## 3. Update Placeholder Values in Code

Several files contain placeholder values that you must replace with your real information
before publishing. Each one is listed below with the exact file path and what to change.

---

### 3a. Android Digital Asset Links

**File:** `public/.well-known/assetlinks.json`

Replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with the actual SHA-256 fingerprint of your
Android signing key.

**How to get the fingerprint:**

1. In Google Play Console, go to **Setup > App signing**.
2. Under "App signing key certificate", copy the SHA-256 fingerprint shown there.
3. Paste it into the file, replacing `REPLACE_WITH_YOUR_SHA256_FINGERPRINT`.

The file should look like this when done:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.smarttechbazaar.app",
      "sha256_cert_fingerprints": [
        "AB:CD:12:34:EF:..."
      ]
    }
  }
]
```

**Also update `package_name`** if you chose a different package name in Play Console.
The current value is `com.smarttechbazaar.app`. It must match exactly what you registered
in the Play Console.

---

### 3b. Apple App Site Association (iOS Universal Links)

**File:** `public/.well-known/apple-app-site-association`

Replace both occurrences of `TEAM_ID` with your 10-character Apple Developer Team ID.

**How to find your Team ID:**

1. Log in to https://developer.apple.com/account
2. Click on your name in the top-right corner, then "Membership details"
3. Your Team ID is listed there (e.g. `A1B2C3D4E5`)

The file should look like this when done:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "A1B2C3D4E5.com.smarttechbazaar.app",
        ...
      }
    ]
  },
  "webcredentials": {
    "apps": [
      "A1B2C3D4E5.com.smarttechbazaar.app"
    ]
  }
}
```

**Also update the bundle identifier** (`com.smarttechbazaar.app`) if you chose a different
one in App Store Connect. It must match exactly.

---

### 3c. App Store & Play Store Rating Links

**File:** `hooks/use-app-rating.ts`

Find this line:

```ts
window.open("https://apps.apple.com/app/id__YOUR_APP_ID__", "_blank");
```

Replace `__YOUR_APP_ID__` with your numeric Apple App Store app ID.

**How to find your App ID:**

1. Go to https://appstoreconnect.apple.com
2. Select your app
3. Go to **App Information** — your Apple ID (a number like `6504123456`) is shown there

The corrected line should look like:

```ts
window.open("https://apps.apple.com/app/id6504123456", "_blank");
```

The Play Store link below it already uses the package name and requires no change
if you kept `com.smarttechbazaar.app` as your package name.

---

### 3d. Deep Link Scheme (Optional but Recommended)

**File:** `hooks/use-deep-linking.ts`

The custom URL scheme is currently set to `stb://`. If you want to change this
(for example to `smarttechbazaar://`), find all occurrences of `stb://` in the file
and replace them. Also register the same custom scheme in Median.co when configuring
your app (covered in Step 6).

---

## 4. App Icons & Splash Screens

The app currently ships with placeholder generated icons. You must replace these with
**high-quality, properly sized icons** before submitting to either store.
Reviewers will reject an app with blurry, pixelated, or clearly placeholder icons.

### 4a. Create Your Final App Icon

- Design a **1024×1024 px** master icon in PNG format (no transparency for iOS).
- The icon must have no text, no screenshots, no Apple or Google trademarked images.
- It must not look like an existing app icon.

**Tools you can use:**

- Figma (free) — design the icon, export at 1024×1024
- Adobe Illustrator
- Canva

### 4b. Generate All Required Sizes

Once you have the 1024×1024 master icon:

1. Go to https://www.appicon.co/ (free tool)
2. Upload your 1024×1024 PNG
3. Check all platforms (iOS, Android)
4. Download the ZIP — it contains all required sizes

### 4c. Place Icons in the Project

Replace the placeholder files in `public/icons/` with your generated icons:

| File | Required Size |
|---|---|
| `public/icons/icon-512x512.png` | 512×512 px |
| `public/icons/icon-192x192.png` | 192×192 px |
| `public/icons/icon-32x32.png` | 32×32 px |

Update `public/manifest.json` to reference the correct file types (`"type": "image/png"`)
if you switch from `.jpg` to `.png`.

Also update `app/layout.tsx` icon paths to match your final filenames.

### 4d. Splash Screens for iOS

iOS requires launch (splash) screen images. Create a simple splash screen with your logo
on a white or brand-colored background and export at these sizes:

| File to create | Size |
|---|---|
| `public/splash/apple-splash-2048-2732.png` | 2048×2732 px |
| `public/splash/apple-splash-1668-2388.png` | 1668×2388 px |
| `public/splash/apple-splash-1536-2048.png` | 1536×2048 px |
| `public/splash/apple-splash-1290-2796.png` | 1290×2796 px |
| `public/splash/apple-splash-1179-2556.png` | 1179×2556 px |
| `public/splash/apple-splash-1170-2532.png` | 1170×2532 px |
| `public/splash/apple-splash-1125-2436.png` | 1125×2436 px |
| `public/splash/apple-splash-750-1334.png` | 750×1334 px |

Median.co also has a splash screen configuration inside its dashboard that can override
or supplement these files — configure it in Step 6.

---

## 5. Set Up OneSignal for Push Notifications

Push notifications are critical. Both stores look for evidence of real native features.
An app that is purely a web wrapper with no native capability will be rejected.

### 5a. Create a OneSignal Account and App

1. Go to https://onesignal.com and create a free account.
2. Click **New App/Website** and name it "Smart Tech Bazaar".
3. Select **Google Android** first, complete the setup, then repeat for **Apple iOS**.

### 5b. Android (FCM Setup)

1. Go to https://console.firebase.google.com and create a new Firebase project (free).
2. Add an Android app with package name `com.smarttechbazaar.app`.
3. Download `google-services.json` — you will need to give this to Median.co.
4. In Firebase, go to **Project Settings > Cloud Messaging** and copy your **Server Key**.
5. Back in OneSignal Android setup, paste the Server Key when prompted.

### 5c. iOS (APNs Setup)

1. In your Apple Developer account, go to **Certificates, Identifiers & Profiles**.
2. Under **Keys**, create a new key, enable **Apple Push Notifications service (APNs)**.
3. Download the `.p8` key file (you can only download it once — save it safely).
4. Note down your **Key ID** and **Team ID**.
5. In OneSignal iOS setup, upload the `.p8` file and enter the Key ID and Team ID.

### 5d. Get Your OneSignal App ID and REST API Key

After completing setup, your OneSignal App ID is shown on the dashboard.
It looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

Save this — you need to enter it in Median.co in the next step.

### 5e. Configure Server-Side Push Notifications

The app sends push notifications from the server when:
- An order is placed (customer receives confirmation)
- Order status changes (shipped, delivered, cancelled, etc.)
- Support ticket receives a reply
- Support ticket is resolved

To enable server-side push notifications, add these environment variables to your
Vercel project (or `.env.local` for local testing):

```
ONESIGNAL_APP_ID=your-app-id-here
ONESIGNAL_REST_API_KEY=your-rest-api-key-here
```

**To get your REST API Key:**

1. In OneSignal dashboard, go to **Settings > Keys & IDs**.
2. Copy the **REST API Key** (starts with `os_v2_app_...` for newer accounts).
3. Add it to your environment variables.

**Important:** The REST API Key is secret and must never be exposed in client-side code.
It is only used in server-side API routes.

---

## 6. Set Up Median.co App Project

This is where you configure the actual mobile app wrapper.

1. Log in to https://median.co and click **Create New App**.
2. Enter your live website URL (e.g. `https://smarttechbazaar.com`).
3. Give the app a name: **Smart Tech Bazaar**.

### 6a. App Appearance

- Upload your app icon (1024×1024 PNG, no transparency).
- Set the splash screen background color to `#FFFFFF` (white) or `#E31837` (brand red).
- Upload your splash screen image (your logo centered on the background color).
- Set the status bar style to **Light** (white icons on red header).

### 6b. Navigation

- **Disable** the default Median.co navigation bar — the website already has its own header.
- Enable **pull-to-refresh** for a native feel.
- Set the **initial URL** to `https://YOUR-DOMAIN.com/`.

### 6c. Push Notifications (OneSignal)

- Enable the **OneSignal plugin** in Median.co.
- Paste your **OneSignal App ID** from Step 5d.
- Set the **prompt timing** to "After 3 seconds on first launch" or use the soft-ask prompt
  (the `PushNotificationBanner` component already handles this in the web app).

### 6d. Permissions

Enable the following device permissions in the Median.co configuration:

| Permission | Reason |
|---|---|
| Push Notifications | Order updates, promotions |
| Camera | Product image uploads, profile photo |
| Photo Library | Upload images |
| Location (optional) | Show nearby stores or delivery estimates |

### 6e. Custom URL Scheme (Deep Linking)

- Register the URL scheme `stb` so deep links like `stb://product/123` work.
- Under **URL Handling**, add your domain `smarttechbazaar.com` so universal links work.

### 6f. CSS to Inject (App-Specific Styling)

In Median.co's **CSS Injection** field, add the following to hide the web footer
inside the app (the footer is unnecessary in native apps):

```css
footer { display: none !important; }
```

### 6g. JavaScript to Inject (Optional)

If you want Median.co to set the `native-app` body class explicitly on load:

```javascript
document.body.classList.add('native-app');
```

### 6h. Android-Specific Configuration

- **Package name:** `com.smarttechbazaar.app` (must match `assetlinks.json`)
- **Minimum Android version:** 7.0 (API 24) or higher
- Upload `google-services.json` from Firebase (from Step 5b) when prompted.
- Enable **App Signing** and note the SHA-256 fingerprint for `assetlinks.json` (Step 3a).

### 6i. iOS-Specific Configuration

- **Bundle identifier:** `com.smarttechbazaar.app` (must match `apple-app-site-association`)

### 6j. Social Login (Google Sign-In) — CRITICAL

**This step is required to fix the "stuck on firebaseapp.com" issue during Google Sign-In.**

The app uses Median.co's native Social Login plugin instead of Firebase's web-based OAuth
popup. This ensures Google Sign-In works correctly inside the native app without opening
an external browser that can't redirect back to the app.

#### Known Credentials (already wired into code)

| Credential | Value | Status |
|---|---|---|
| Web Client ID | `393630939714-ccgciu2tmtf7me0souh2vt7a1ctqe1bf.apps.googleusercontent.com` | DONE — in code |
| SHA-1 Fingerprint | `D7:A4:FE:2F:A0:D0:08:15:D5:B2:9A:5A:B7:02:3D:78:3C:43:23:D0` | Use in Google Cloud Console |
| iOS Client ID | (not yet provided) | TODO |
| iOS URL Scheme | (not yet provided) | TODO |

#### Android Setup (use your SHA-1 above)

1. In the Median.co dashboard, go to **Native Plugins > Social Login**.
2. Enable **Google Sign-In** and paste the Web Client ID above.
3. In Google Cloud Console, go to **APIs & Services > Credentials**.
4. Create an **OAuth 2.0 Client ID** of type **Android**.
5. Enter package name: `com.smarttechbazaar.app`
6. Enter the SHA-1 fingerprint shown above: `D7:A4:FE:2F:A0:D0:08:15:D5:B2:9A:5A:B7:02:3D:78:3C:43:23:D0`
7. Save — Google will generate an Android Client ID. Paste it into Median.co if it asks.

> IMPORTANT — `assetlinks.json` needs a **SHA-256**, not SHA-1.
> Get the SHA-256 from: Play Console > Release > Setup > App Integrity > App signing key certificate.
> Then update `/public/.well-known/assetlinks.json` with that value.

#### iOS Setup (TODO — need iOS Client ID)

1. In Google Cloud Console, create an **OAuth 2.0 Client ID** of type **iOS**.
2. Enter Bundle ID: `com.smarttechbazaar.app`
3. Copy the generated **iOS Client ID** and paste it in Median.co Social Login > iOS Client ID.
4. Copy the **iOS URL Scheme** (reversed client ID, format: `com.googleusercontent.apps.XXXXX`).
5. In Median.co under **URL Schemes**, add the reversed client ID.
6. Update this document with the iOS Client ID and URL Scheme once obtained.

#### Sign in with Apple (iOS only — required by App Store guidelines)

Apple requires apps with third-party social login to also offer "Sign in with Apple".

1. In Median.co, enable **Sign in with Apple** under Social Login.
2. In your Apple Developer account, enable "Sign in with Apple" for your App ID.
3. The app code already supports native Apple Sign-In when the plugin is enabled.

#### How the Code Works

The login and register pages automatically detect if they are inside a Median.co native app:

- **Native app:** Uses `median.socialLogin.google.login({ clientId: WEB_CLIENT_ID })` which
  triggers the native Google SDK. No browser is opened. The result is returned directly to JS.

- **Web browser:** Falls back to Firebase `signInWithPopup()` which works correctly in browsers.

The Web Client ID is embedded in both `lib/firebase.ts` and `lib/native-app.ts`. No further
code changes are needed once the Median.co Social Login plugin is configured in their dashboard.
- **Minimum iOS version:** 16.0 or higher
- Enable **Push Notifications** capability in the iOS configuration.
- Enable **Associated Domains** capability and add `applinks:YOUR-DOMAIN.com`.

---

## 7. Android — Google Play Store

### 7a. Create Your App in Play Console

1. Go to https://play.google.com/console
2. Click **Create app**.
3. Fill in:
   - App name: **Smart Tech Bazaar**
   - Default language: **English (India)** or your primary language
   - App or game: **App**
   - Free or paid: **Free**
4. Accept the declarations and click **Create app**.

### 7b. Store Listing

Fill out all required fields under **Grow > Store presence > Main store listing**:

- **App name:** Smart Tech Bazaar (max 30 characters)
- **Short description:** Shop computer accessories, CCTV, printers & IT solutions (max 80 characters)
- **Full description:** Write at least 4000 characters describing the app features, what users can do, and why it is useful. Do NOT copy-paste generic text — Google will flag it.
- **App icon:** Upload your 512×512 PNG icon
- **Feature graphic:** Create a 1024×500 px banner image (required)
- **Screenshots:** Upload at least 2 phone screenshots (1080×1920 px recommended)
  Take real screenshots of your app on a device or emulator.

### 7c. App Content (Important — Do Not Skip)

Under **Policy > App content**, fill out every section:

- **Privacy policy:** Paste the full URL to your privacy policy page, e.g. `https://YOUR-DOMAIN.com/privacy`
- **Ads:** Select "No, this app does not contain ads" (unless you have ads)
- **App access:** Select "All or most functionality is accessible without special access" or provide test credentials if login is required — provide a demo account (email + password) for the reviewer
- **Content rating:** Complete the questionnaire. For a shopping app, you will likely receive a rating of "Everyone"
- **Target audience:** Select the appropriate age range (e.g. 18+)
- **Data safety:** Complete the Data Safety form — see Section 9 for what to declare

### 7d. Release

1. Under **Release > Production**, click **Create new release**.
2. Upload the signed `.aab` file generated by Median.co.
3. Write release notes.
4. Roll out to 100% (or start with a smaller percentage for a staged rollout).
5. Submit for review. Initial reviews take 3–7 business days.

---

## 8. iOS — Apple App Store

### 8a. Create Your App in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click **My Apps**, then the **+** button and **New App**.
3. Fill in:
   - Platform: **iOS**
   - Name: **Smart Tech Bazaar**
   - Primary language: **English (India)** or your choice
   - Bundle ID: Select `com.smarttechbazaar.app` (must already be registered in your developer account)
   - SKU: A unique identifier, e.g. `stb-ios-001`
   - User access: **Full access**

### 8b. App Store Listing

Under **App Information** and **Pricing and Availability**:

- **Category:** Shopping (Primary), Business (Secondary)
- **Privacy Policy URL:** `https://YOUR-DOMAIN.com/privacy` (required)
- **Price:** Free

Under **Prepare for Submission** (your version):

- **App name:** Smart Tech Bazaar
- **Subtitle:** Computer Accessories & IT Solutions (max 30 characters, optional)
- **Keywords:** computer accessories, CCTV, printers, networking, IT solutions, B2B, wholesale, India (max 100 characters total, comma-separated)
- **Description:** Write a full description of the app. Mention all native features — push notifications, account management, order tracking.
- **What's New:** Write brief release notes for version 1.0
- **Support URL:** `https://YOUR-DOMAIN.com/contact` or your support email URL
- **Screenshots:** Required sizes:
  - iPhone 6.7": 1290×2796 px (at least 3 screenshots)
  - iPhone 5.5": 1242×2208 px (at least 3 screenshots)
  - iPad 12.9" (if you support iPad): 2048×2732 px

### 8c. App Review Information (Critical)

Apple reviewers must be able to test your app. Fill in the **App Review Information** section:

- **Sign-in required:** YES
- **Username:** Create a test account specifically for Apple review, e.g. `appreviewer@smarttechbazaar.com`
- **Password:** Set a password for this test account
- **Notes for reviewer:** Write 2–3 sentences explaining what the app does and what the reviewer should test. For example:
  > "Smart Tech Bazaar is a B2B and B2C e-commerce app for computer accessories and IT equipment. Use the provided credentials to browse products, add items to cart, and view order history. Push notifications can be enabled from the notification prompt that appears on first use."

Without valid test credentials, Apple will reject the app with "We were unable to review your app".

### 8d. Export Compliance

When prompted:
- **Does your app use encryption?** — Select **Yes** if you use HTTPS (you do).
- **Does it qualify for the exemption?** — Select **Yes** (standard HTTPS qualifies under the encryption exemption for US export compliance).
- This avoids needing to file an annual self-classification report.

### 8e. Age Rating

Complete the **Age Rating** questionnaire. A shopping app with no adult content will
receive a **4+** or **12+** rating.

### 8f. Build Upload

1. Median.co will generate a `.ipa` file (or you can have them submit directly via Xcode Cloud).
2. Upload the `.ipa` using **Transporter** (Mac app, free on App Store) or Xcode.
3. Wait for the build to process (15–30 minutes) then select it under your version.
4. Click **Submit for Review**.
5. Apple reviews typically take 24–72 hours for the first submission.

---

## 9. Privacy Policy & Legal Pages

Both stores require a publicly accessible privacy policy that is accurate and complete.

### What Must Be in Your Privacy Policy

The privacy policy at `/privacy` already exists in the app. Verify it covers all of the following. If anything is missing, add it.

**Data you collect:**

- [ ] Account information (name, email, phone number)
- [ ] Order history and transaction data
- [ ] Device information (for push notifications)
- [ ] Usage data (pages visited)

**How data is used:**

- [ ] To process orders
- [ ] To send order status notifications
- [ ] To send promotional notifications (only if user opts in)
- [ ] For customer support

**Third-party services used:**

- [ ] OneSignal (push notifications) — link to https://onesignal.com/privacy_policy
- [ ] Payment gateway (Razorpay, Stripe, etc.) — link to their privacy policy

**User rights:**

- [ ] Right to access their data (Data Export feature — already built at `/dashboard/security`)
- [ ] Right to delete their account (Account Deletion feature — already built at `/dashboard/delete-account`)
- [ ] Right to opt out of marketing notifications (Notification Settings — already built at `/dashboard/notifications`)

**Contact information:**

- [ ] Your company name and address
- [ ] A contact email address for privacy inquiries

### Google Play Data Safety Form

In Play Console under **Policy > App content > Data safety**, declare:

| Data Type | Collected? | Shared? | Notes |
|---|---|---|---|
| Name | Yes | No | Required for account creation |
| Email address | Yes | No | Required for account and login |
| Phone number | Yes | No | Required for orders |
| User IDs | Yes | No | Internal account identifier |
| Purchase history | Yes | No | Order tracking |
| Device IDs | Yes | No | Push notification token |

Select that data is collected but **not sold**, and is used only for **app functionality** and **analytics**.

---

## 10. Final Pre-Submission Checklist

Go through this list one item at a time before you click submit on either store.

### Code & Configuration

- [ ] `public/.well-known/assetlinks.json` — SHA-256 fingerprint is real (not the placeholder)
- [ ] `public/.well-known/apple-app-site-association` — `TEAM_ID` replaced with real Team ID
- [ ] `hooks/use-app-rating.ts` — Apple App Store ID replaced (not `__YOUR_APP_ID__`)
- [ ] `public/manifest.json` — `id` field matches your package name / bundle ID
- [ ] All icon files are real, high-quality PNG images (not placeholder JPGs)
- [ ] Website is deployed to production and accessible over HTTPS

### Median.co App Configuration

- [ ] App name, icon, and splash screen are set correctly
- [ ] OneSignal App ID is entered and push notifications are tested on a real device
- [ ] Web footer is hidden via CSS injection
- [ ] Deep link URL scheme `stb` is registered
- [ ] Domain `smarttechbazaar.com` is added to URL handling
- [ ] Android package name matches `assetlinks.json`
- [ ] iOS bundle ID matches `apple-app-site-association`

### Functionality Testing (Test on a Real Device)

- [ ] App opens without a white screen or loading error
- [ ] Home page, products, product detail all load correctly
- [ ] User can register a new account
- [ ] User can log in and log out
- [ ] User can browse and add products to the cart
- [ ] Checkout flow completes without errors
- [ ] Push notification permission prompt appears
- [ ] A test push notification can be received (send from OneSignal dashboard)
- [ ] Account deletion flow works end-to-end
- [ ] Data export downloads a valid JSON file
- [ ] Offline page appears when there is no internet connection
- [ ] Back button works correctly on Android (does not exit the app unexpectedly)

### Google Play Specific

- [ ] Store listing is complete with all screenshots, icon, and feature graphic
- [ ] Data Safety form is filled out
- [ ] Content rating questionnaire is completed
- [ ] Privacy policy URL is entered
- [ ] Test credentials are added in App content section
- [ ] Signed `.aab` file is uploaded

### Apple App Store Specific

- [ ] All required screenshot sizes are uploaded (6.7" and 5.5" required)
- [ ] Privacy policy URL is entered
- [ ] Test account credentials are entered in App Review Information
- [ ] Age rating questionnaire is completed
- [ ] Export compliance is answered
- [ ] Associated Domains (`applinks:YOUR-DOMAIN.com`) is enabled in the app capabilities
- [ ] Push Notifications capability is enabled
- [ ] Build is uploaded and processed

---

## Important Notes

**Package name / Bundle ID:** Once you publish to either store with a package name or
bundle ID, you can never change it. Choose carefully. The current value is
`com.smarttechbazaar.app`.

**App Review test account:** Create a permanent dedicated test account in your database
that you never delete. Apple and Google reviewers use it repeatedly, including for
future update reviews.

**Version numbers:** Your first release must be version `1.0.0`. Android build version
code must be a positive integer starting at 1. Every update must have a higher version
code.

**Responding to rejections:** If Apple or Google reject your app, they will give you a
specific reason. Do not resubmit without addressing the exact issue they mention.
You can reply to the rejection to ask for clarification before resubmitting.
