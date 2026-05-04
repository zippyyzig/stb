# Before Publishing — Smart Tech Bazaar Mobile App

This document covers every step needed to publish the Smart Tech Bazaar app to the Google Play Store and Apple App Store using Median.co as your wrapper.

**Last Updated:** Based on current app configuration

---

## Table of Contents

1. [Current Configuration Status](#1-current-configuration-status)
2. [Accounts & Memberships Required](#2-accounts--memberships-required)
3. [Environment Variables](#3-environment-variables)
4. [Remaining Code Updates](#4-remaining-code-updates)
5. [OneSignal Push Notifications](#5-onesignal-push-notifications)
6. [Median.co Configuration](#6-medianco-configuration)
7. [Google Play Store Submission](#7-google-play-store-submission)
8. [Apple App Store Submission](#8-apple-app-store-submission)
9. [Pre-Submission Testing Checklist](#9-pre-submission-testing-checklist)
10. [Post-Submission](#10-post-submission)

---

## 1. Current Configuration Status

### COMPLETED Items

| Item | File | Status |
|------|------|--------|
| Android App Links | `public/.well-known/assetlinks.json` | DONE - SHA-256: `82:60:EA:EC:BB:B6:62:0E:B8:AC:29:64:C6:50:12:EC:6E:9F:77:61:A4:0D:28:32:8C:A2:34:14:F2:9D:05:17` |
| iOS Universal Links | `public/.well-known/apple-app-site-association` | DONE - Team ID: `5TGG836W7V` |
| PWA Manifest | `public/manifest.json` | DONE - App ID: `com.smarttechbazaar.app` |
| App Icons | `public/icons/` | DONE - PNG icons (192x192, 512x512) |
| Splash Screens | `public/splash/` | DONE - All 8 iOS sizes generated |
| OG Image | `public/og-image.png` | DONE - 1200x630 social sharing image |
| Health Endpoint | `/api/health` | DONE - Returns `{"status":"ok",...}` |
| Privacy Policy | `/privacy` | DONE |
| Terms of Service | `/terms` | DONE |
| Shipping Policy | `/shipping` | DONE |
| Site Config | `lib/site-config.ts` | DONE |
| Push Notifications (Client) | `hooks/use-push-notifications.ts` | DONE |
| Push Notifications (Server) | `lib/push-notifications.ts` | DONE - OneSignal REST API integrated |
| Native App Detection | `lib/native-app.ts` | DONE |
| Deep Linking | `hooks/use-deep-linking.ts` | DONE - URL scheme: `stb://` |
| App Rating Dialog | `components/app/AppRatingDialog.tsx` | DONE |
| Offline Page | `app/offline/page.tsx` | DONE |
| Error Handling | `app/error.tsx`, `app/not-found.tsx` | DONE |
| robots.txt | `app/robots.ts` | DONE |
| sitemap.xml | `app/sitemap.ts` | DONE |

### REMAINING Items

| Item | Status | Action Required |
|------|--------|-----------------|
| Apple App Store ID | PENDING | Replace `__YOUR_APP_ID__` in `hooks/use-app-rating.ts` |
| Production Razorpay Keys | PENDING | Replace test keys with live keys |
| SEO Indexing | DISABLED | Change `index: false` to `index: true` in `app/layout.tsx` when ready |
| Business Contact Info | NEEDS UPDATE | Update phone/email in `lib/site-config.ts` |

---

## 2. Accounts & Memberships Required

| Account | Cost | URL | Status |
|---------|------|-----|--------|
| Median.co | $99+/year per platform | https://median.co/pricing | Required |
| Google Play Developer | One-time $25 | https://play.google.com/console | Required |
| Apple Developer Program | $99/year | https://developer.apple.com/programs/ | Required |
| OneSignal | Free tier | https://onesignal.com | CONFIGURED |
| Firebase (for Google Sign-In) | Free | https://console.firebase.google.com | CONFIGURED |
| Razorpay | Per transaction | https://razorpay.com | CONFIGURED (test mode) |
| ImageKit | Free tier | https://imagekit.io | CONFIGURED |
| MongoDB Atlas | Free tier | https://mongodb.com | CONFIGURED |
| Vercel | Free tier | https://vercel.com | CONFIGURED |

---

## 3. Environment Variables

### Currently Configured (in `.env.example`)

```bash
# MongoDB
MONGODB_URI=mongodb+srv://... (CONFIGURED)

# ImageKit
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/sabkatechbazar (CONFIGURED)
IMAGEKIT_PUBLIC_KEY=public_TWHqSdyjv7kGh032TGbBKZb/AIc= (CONFIGURED)
IMAGEKIT_PRIVATE_KEY=private_LygDURJqV/8OVn5bN3moIAWdd84= (CONFIGURED)

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production (CHANGE FOR PRODUCTION)
NEXTAUTH_URL=http://localhost:3000 (CHANGE FOR PRODUCTION)

# Firebase (Google Sign-in)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAyuKH1MP_MttahHqtRyh8sJMsZtNw33GU (CONFIGURED)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sabkatechbazar.firebaseapp.com (CONFIGURED)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sabkatechbazar (CONFIGURED)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sabkatechbazar.firebasestorage.app (CONFIGURED)
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=393630939714 (CONFIGURED)
NEXT_PUBLIC_FIREBASE_APP_ID=1:393630939714:web:227ef59d3c9e770c624bdb (CONFIGURED)

# Razorpay (TEST KEYS - CHANGE FOR PRODUCTION)
RAZORPAY_KEY_ID=rzp_test_SdrRacK0lWfohO (CHANGE FOR PRODUCTION)
RAZORPAY_KEY_SECRET=rvsn07IwQKe9Hrj2rQrE2IiJ (CHANGE FOR PRODUCTION)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SdrRacK0lWfohO (CHANGE FOR PRODUCTION)

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XZtLy2nIoGQ8mDbG_... (CONFIGURED)

# OneSignal Push Notifications
ONESIGNAL_APP_ID=70c19aa3-9238-4543-acf1-0c564fc4af5a (CONFIGURED)
ONESIGNAL_REST_API_KEY=os_v2_app_odazvi4shbcuhlhrbrle7rfpliovgz5l5lee22mcuhnhikag4oxxulsvpxhq5wx7jgieto6vokyxrdpu3sryyh72ll4zju4q2syg7hy (CONFIGURED)
```

### Production Changes Required

Before going live, update these in Vercel Dashboard > Settings > Environment Variables:

| Variable | Current | Production Value |
|----------|---------|------------------|
| `NEXTAUTH_SECRET` | Placeholder | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://smarttechbazaar.com` |
| `NEXT_PUBLIC_SITE_URL` | Not set | `https://smarttechbazaar.com` |
| `RAZORPAY_KEY_ID` | Test key (`rzp_test_...`) | Live key (`rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Test secret | Live secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Test key | Live key |

---

## 4. Remaining Code Updates

### 4a. Apple App Store ID (REQUIRED)

**File:** `hooks/use-app-rating.ts` (Line ~104)

Find:
```typescript
window.open("https://apps.apple.com/app/id__YOUR_APP_ID__", "_blank");
```

Replace `__YOUR_APP_ID__` with your numeric Apple App Store ID (e.g., `6504123456`).

**How to get your App ID:**
1. Go to https://appstoreconnect.apple.com
2. Select your app
3. Go to **App Information** — your Apple ID is shown there

### 4b. Enable SEO Indexing (when ready for public)

**File:** `app/layout.tsx`

Find the robots metadata and change from:
```typescript
robots: {
  index: false,
  follow: false,
}
```

To:
```typescript
robots: {
  index: true,
  follow: true,
}
```

### 4c. Update Business Contact Info (RECOMMENDED)

**File:** `lib/site-config.ts`

Update with real business information:
- `business.email` — Real support email
- `business.phone` — Real phone number
- `business.address` — Real business address
- `business.geo` — Correct coordinates
- `business.socialLinks` — Real social media URLs

---

## 5. OneSignal Push Notifications

### Current Status: CONFIGURED

| Platform | Status | Notes |
|----------|--------|-------|
| Web Push | CONFIGURED | Working |
| Android (FCM) | CONFIGURED | You confirmed FCM is set up |
| iOS (APNs) | PENDING | Requires Apple Developer account |

### OneSignal Credentials

```
App ID: 70c19aa3-9238-4543-acf1-0c564fc4af5a
REST API Key: os_v2_app_odazvi4shbcuhlhrbrle7rfpliovgz5l5lee22mcuhnhikag4oxxulsvpxhq5wx7jgieto6vokyxrdpu3sryyh72ll4zju4q2syg7hy
```

### Server-Side Push Integration (DONE)

Push notifications are automatically sent for:
- Order placed confirmation
- Order status updates (shipped, delivered, cancelled, etc.)
- Support ticket replies
- Support ticket resolved

**Files updated:**
- `lib/push-notifications.ts` — Core push notification service
- `app/api/payment/verify/route.ts` — Sends push on order placed
- `app/api/admin/orders/[id]/route.ts` — Sends push on status change
- `app/api/admin/tickets/[id]/reply/route.ts` — Sends push on ticket reply
- `app/api/admin/tickets/[id]/route.ts` — Sends push on ticket resolved

### iOS APNs Setup (REQUIRED for iOS)

1. Go to https://developer.apple.com > Certificates, Identifiers & Profiles
2. Under **Keys**, create a new key with **Apple Push Notifications service (APNs)** enabled
3. Download the `.p8` key file (save it securely — you can only download once)
4. Note your **Key ID** and **Team ID** (already have: `5TGG836W7V`)
5. In OneSignal dashboard, go to **Settings > Platforms > Apple iOS**
6. Upload the `.p8` file and enter Key ID and Team ID
7. Save

---

## 6. Median.co Configuration

### App Details

| Setting | Value |
|---------|-------|
| App Name | Smart Tech Bazaar |
| Website URL | `https://smarttechbazaar.com` |
| Package Name (Android) | `com.smarttechbazaar.app` |
| Bundle ID (iOS) | `com.smarttechbazaar.app` |
| Team ID (iOS) | `5TGG836W7V` |
| Theme Color | `#E31837` |
| Background Color | `#FFFFFF` |

### Native Plugins to Enable

| Plugin | Configuration |
|--------|---------------|
| OneSignal | App ID: `70c19aa3-9238-4543-acf1-0c564fc4af5a` |
| Social Login (Google) | Web Client ID: `393630939714-ccgciu2tmtf7me0souh2vt7a1ctqe1bf.apps.googleusercontent.com` |
| Social Login (Apple) | Enable for iOS |
| Pull to Refresh | Enable |
| Camera | Enable (for product reviews/profile photos) |
| Photo Library | Enable |

### URL Scheme Configuration

| Setting | Value |
|---------|-------|
| Custom URL Scheme | `stb` |
| Associated Domains | `smarttechbazaar.com` |

### CSS Injection (Optional)

To hide the web footer in the native app:
```css
footer { display: none !important; }
```

### Android-Specific

- Minimum Android Version: 7.0 (API 24)
- Upload `google-services.json` from Firebase
- SHA-256 fingerprint configured in `assetlinks.json`

### iOS-Specific

- Minimum iOS Version: 16.0
- Enable Push Notifications capability
- Enable Associated Domains capability: `applinks:smarttechbazaar.com`

---

## 7. Google Play Store Submission

### 7a. Store Listing Information

| Item | Value/Requirement |
|------|-------------------|
| App Name | Smart Tech Bazaar (max 30 chars) |
| Short Description | Shop computer accessories, CCTV, printers & IT solutions (max 80 chars) |
| Full Description | 4000 characters describing features |
| Category | Shopping |
| Content Rating | Complete questionnaire (likely "Everyone") |
| App Icon | 512x512 PNG — use `public/icons/icon-512x512.png` |
| Feature Graphic | Create 1024x500 PNG banner |
| Screenshots | Min 2 phone screenshots (1080x1920 or similar) |
| Privacy Policy | `https://smarttechbazaar.com/privacy` |

### 7b. Data Safety Form

| Data Type | Collected? | Shared? |
|-----------|------------|---------|
| Name | Yes | No |
| Email address | Yes | No |
| Phone number | Yes | No |
| User IDs | Yes | No |
| Purchase history | Yes | No |
| Device IDs | Yes | No (used for push notifications only) |

### 7c. App Content

- **App access:** Provide test credentials for reviewers
- **Test account:** Create a dedicated reviewer account
- **Target audience:** 13+ (no children's content)

### 7d. Release

1. Create Internal Testing track first
2. Test on real devices
3. Create Production release
4. Upload `.aab` file from Median.co
5. Submit for review (3-7 days)

---

## 8. Apple App Store Submission

### 8a. App Store Connect Setup

| Setting | Value |
|---------|-------|
| Bundle ID | `com.smarttechbazaar.app` |
| Team ID | `5TGG836W7V` |
| SKU | `stb-ios-001` |
| Category | Shopping (Primary), Business (Secondary) |
| Price | Free |

### 8b. App Information

| Item | Value/Requirement |
|------|-------------------|
| App Name | Smart Tech Bazaar |
| Subtitle | Computer Accessories & IT Solutions (max 30 chars) |
| Keywords | computer accessories, CCTV, printers, networking, IT solutions, B2B, wholesale, India (max 100 chars) |
| Description | Full description of features |
| Privacy Policy URL | `https://smarttechbazaar.com/privacy` |
| Support URL | `https://smarttechbazaar.com/contact` |

### 8c. Screenshots Required

| Device | Size | Quantity |
|--------|------|----------|
| iPhone 6.7" | 1290x2796 | Min 2 |
| iPhone 5.5" | 1242x2208 | Min 2 |
| iPad 12.9" (if supporting) | 2048x2732 | Min 2 |

### 8d. App Review Information

**CRITICAL:** Apple will reject without valid test credentials.

- **Sign-in required:** YES
- **Username:** Create test account: `appreviewer@smarttechbazaar.com`
- **Password:** Set a secure password
- **Notes for reviewer:**
  > "Smart Tech Bazaar is a B2B and B2C e-commerce app for computer accessories and IT equipment. Use the provided credentials to browse products, add items to cart, and view order history. Push notifications can be enabled from the notification prompt that appears on first use."

### 8e. Export Compliance

- **Uses encryption?** YES (HTTPS)
- **Qualifies for exemption?** YES (standard HTTPS qualifies)

### 8f. Build Upload

1. Median.co generates `.ipa` file
2. Upload via **Transporter** (Mac app) or Xcode
3. Wait for processing (15-30 minutes)
4. Select build and submit
5. Review time: 1-7 days

---

## 9. Pre-Submission Testing Checklist

### Functionality Tests

- [ ] Home page loads correctly
- [ ] Product browsing and search work
- [ ] Category filtering works
- [ ] Add to cart works
- [ ] User registration works
- [ ] User login works (email/password)
- [ ] Google Sign-In works in native app
- [ ] Checkout flow completes
- [ ] Payment (Razorpay) works
- [ ] Order confirmation displays
- [ ] Order history loads in dashboard
- [ ] Order detail page shows timeline
- [ ] Support ticket creation works
- [ ] Support ticket replies work
- [ ] Profile editing works
- [ ] Address management works
- [ ] Password change works
- [ ] Account deletion works
- [ ] Data export works

### Push Notification Tests

- [ ] Permission prompt appears on first launch
- [ ] Push notification received after order placed
- [ ] Push notification received when order shipped
- [ ] Push notification received when ticket replied
- [ ] Tapping notification opens correct page

### Native App Tests

- [ ] App installs correctly
- [ ] Splash screen displays
- [ ] App icon appears correctly
- [ ] Deep links work (`stb://product/...`)
- [ ] Universal links work (website URLs open in app)
- [ ] Back button works correctly on Android
- [ ] Pull to refresh works
- [ ] Offline page appears when no internet
- [ ] App rating dialog appears after 3 sessions

### Performance Tests

- [ ] Pages load within 3 seconds on 4G
- [ ] Images load without broken links
- [ ] No console errors in production
- [ ] App doesn't crash

---

## 10. Post-Submission

### After Submitting

- [ ] Monitor review status daily
- [ ] Respond to reviewer questions promptly
- [ ] If rejected, read feedback carefully and fix specific issues
- [ ] Do not resubmit without addressing the exact rejection reason

### Typical Review Times

| Platform | First Submission | Updates |
|----------|------------------|---------|
| Google Play | 3-7 business days | 1-3 days |
| Apple App Store | 1-7 days | 1-2 days |

### Common Rejection Reasons

**Google Play:**
- Privacy policy missing or incomplete
- Placeholder content ("Lorem ipsum")
- App provides no value beyond website
- Incorrect content rating
- Undeclared permissions

**Apple App Store:**
- Missing demo account credentials
- App is just a website wrapper with no native features
- Broken links or placeholder content
- Login doesn't work
- Description doesn't match functionality

### Your Native Features (to mention in store listing)

These justify the app is not just a web wrapper:
- Native push notifications (order updates, support replies)
- Native Google Sign-In
- Native Apple Sign-In (iOS)
- App rating prompts
- Offline handling
- Deep linking support
- Biometric authentication (future)
- Camera access for reviews

---

## Quick Reference

### URLs

| Purpose | URL |
|---------|-----|
| Google Play Console | https://play.google.com/console |
| Apple App Store Connect | https://appstoreconnect.apple.com |
| Apple Developer | https://developer.apple.com |
| OneSignal Dashboard | https://onesignal.com |
| Firebase Console | https://console.firebase.google.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| Razorpay Dashboard | https://dashboard.razorpay.com |

### App Identifiers

| Platform | Identifier |
|----------|------------|
| Android Package | `com.smarttechbazaar.app` |
| iOS Bundle ID | `com.smarttechbazaar.app` |
| Apple Team ID | `5TGG836W7V` |
| OneSignal App ID | `70c19aa3-9238-4543-acf1-0c564fc4af5a` |
| Firebase Project | `sabkatechbazar` |
| Deep Link Scheme | `stb://` |

### Key Files

| File | Purpose |
|------|---------|
| `public/manifest.json` | PWA manifest |
| `public/.well-known/assetlinks.json` | Android App Links |
| `public/.well-known/apple-app-site-association` | iOS Universal Links |
| `public/icons/icon-512x512.png` | App store icon |
| `public/splash/` | iOS splash screens |
| `lib/site-config.ts` | Business/SEO configuration |
| `lib/push-notifications.ts` | Server-side push notifications |
| `lib/native-app.ts` | Native app detection & features |
| `hooks/use-app-rating.ts` | App rating prompts |
| `.env.example` | Environment variables template |
