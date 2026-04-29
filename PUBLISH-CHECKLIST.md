# Smart Tech Bazaar - App Store Publishing Checklist

This checklist covers everything needed to publish your app to both Google Play Store and Apple App Store.

---

## COMPLETED ITEMS

### Website Configuration
- [x] `manifest.json` - Properly configured with PNG icons
- [x] `/.well-known/assetlinks.json` - Android App Links configured with SHA-256 fingerprint
- [x] `/.well-known/apple-app-site-association` - iOS Universal Links configured with Team ID `5TGG836W7V`
- [x] `/api/health` - Health check endpoint returns `{"status":"ok",...}`
- [x] Splash screens - All 8 iOS splash screen sizes generated (PNG format)
- [x] App icons - PNG icons in all required sizes (192x192, 512x512, etc.)
- [x] OG Image - 1200x630 social sharing image created
- [x] robots.txt - Configured via `app/robots.ts`
- [x] sitemap.xml - Dynamic sitemap via `app/sitemap.ts`
- [x] Legal pages exist - Privacy Policy, Terms of Service, Shipping Policy

---

## REMAINING TASKS BEFORE PUBLISHING

### 1. Environment Variables (REQUIRED)

Set these in Vercel project settings before deployment:

| Variable | Description | Status |
|----------|-------------|--------|
| `MONGODB_URI` | MongoDB connection string | **REQUIRED** |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | **REQUIRED** |
| `NEXTAUTH_URL` | Your production URL (e.g., `https://smarttechbazaar.com`) | **REQUIRED** |
| `NEXT_PUBLIC_SITE_URL` | Same as NEXTAUTH_URL | **REQUIRED** |

**How to set:**
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add each variable for Production environment

---

### 2. Domain Configuration (REQUIRED)

**Before submitting to app stores, your domain must be:**
- [ ] Connected to Vercel (Settings > Domains)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] All URLs accessible without errors

**Test these URLs after deployment:**
```
https://smarttechbazaar.com/                              → Home page loads
https://smarttechbazaar.com/manifest.json                 → Returns JSON
https://smarttechbazaar.com/.well-known/assetlinks.json   → Returns JSON
https://smarttechbazaar.com/.well-known/apple-app-site-association → Returns JSON
https://smarttechbazaar.com/api/health                    → Returns {"status":"ok",...}
```

---

### 3. Update Site Configuration

Edit `lib/site-config.ts` with your real business information:

- [ ] Update `email` with real support email
- [ ] Update `phone` with real phone number
- [ ] Update `address` with real business address
- [ ] Update `geo` coordinates if address changed
- [ ] Update social media links (Facebook, Instagram, etc.)

---

### 4. Google Play Store Submission

#### 4a. Create Google Play Console Account
- [ ] Go to https://play.google.com/console
- [ ] Pay one-time $25 registration fee
- [ ] Complete account verification

#### 4b. App Listing Information Required
Prepare the following content:

| Item | Requirement |
|------|-------------|
| App Name | "Smart Tech Bazaar" (max 30 characters) |
| Short Description | Max 80 characters |
| Full Description | Max 4000 characters |
| App Icon | 512x512 PNG (use `public/icons/icon-512x512.png`) |
| Feature Graphic | 1024x500 PNG |
| Screenshots | Min 2 phone screenshots (1080x1920 or similar) |
| Screenshots | Min 1 tablet screenshot (if supporting tablets) |
| Privacy Policy URL | `https://smarttechbazaar.com/privacy` |
| Category | Shopping |
| Content Rating | Complete questionnaire |
| Target Audience | 13+ (no children's content) |

#### 4c. App Signing
- [x] SHA-256 fingerprint added to `assetlinks.json`
- [ ] Use Google Play App Signing (recommended)

#### 4d. Release Setup
- [ ] Create Internal Testing track first
- [ ] Test on real Android devices
- [ ] Then move to Production

---

### 5. Apple App Store Submission

#### 5a. Create Apple Developer Account
- [ ] Go to https://developer.apple.com
- [ ] Pay annual $99 fee
- [ ] Complete enrollment

#### 5b. App Store Connect Setup
- [ ] Create new app in App Store Connect
- [ ] Set Bundle ID: `com.smarttechbazaar.app`
- [ ] Set Team ID: `5TGG836W7V` (already configured)

#### 5c. App Listing Information Required

| Item | Requirement |
|------|-------------|
| App Name | "Smart Tech Bazaar" (max 30 characters) |
| Subtitle | Max 30 characters |
| Description | Max 4000 characters |
| Keywords | Max 100 characters, comma-separated |
| App Icon | 1024x1024 PNG (no transparency, no rounded corners) |
| Screenshots | iPhone 6.7" (1290x2796) - Min 2, Max 10 |
| Screenshots | iPhone 6.5" (1284x2778) - Min 2, Max 10 |
| Screenshots | iPhone 5.5" (1242x2208) - Min 2, Max 10 |
| Screenshots | iPad Pro 12.9" (2048x2732) - if supporting iPad |
| Privacy Policy URL | `https://smarttechbazaar.com/privacy` |
| Support URL | `https://smarttechbazaar.com/contact` |
| Marketing URL | `https://smarttechbazaar.com` (optional) |
| Age Rating | Complete questionnaire |
| Category | Shopping |

#### 5d. Associated Domains
- [x] `apple-app-site-association` configured
- [ ] Add Associated Domains capability in Xcode: `applinks:smarttechbazaar.com`

---

### 6. Median.co / PWA Wrapper Configuration

If using Median.co (or similar PWA-to-native wrapper):

#### 6a. Android Configuration
```json
{
  "appName": "Smart Tech Bazaar",
  "packageName": "com.smarttechbazaar.app",
  "initialUrl": "https://smarttechbazaar.com",
  "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"],
  "splashScreen": {
    "backgroundColor": "#FFFFFF"
  },
  "statusBar": {
    "style": "dark",
    "backgroundColor": "#E31837"
  }
}
```

#### 6b. iOS Configuration
```json
{
  "appName": "Smart Tech Bazaar",
  "bundleId": "com.smarttechbazaar.app",
  "teamId": "5TGG836W7V",
  "initialUrl": "https://smarttechbazaar.com",
  "statusBar": {
    "style": "dark"
  }
}
```

---

### 7. Pre-Submission Testing Checklist

Test on real devices before submission:

#### Functionality Tests
- [ ] Home page loads correctly
- [ ] Product browsing works
- [ ] Search functionality works
- [ ] Add to cart works
- [ ] User registration works
- [ ] User login works
- [ ] Checkout process works
- [ ] Order confirmation displays

#### PWA/Native Tests
- [ ] App installs correctly on device
- [ ] Splash screen displays with logo
- [ ] App icon appears correctly
- [ ] Push notifications work (if implemented)
- [ ] Deep links open correct pages
- [ ] Back button behavior is correct
- [ ] Offline handling (if implemented)

#### Performance Tests
- [ ] Pages load within 3 seconds on 4G
- [ ] Images load without broken links
- [ ] No console errors in production

---

### 8. Common Rejection Reasons to Avoid

#### Google Play Store
- [ ] Privacy policy is accessible and complete
- [ ] No placeholder content or "Lorem ipsum"
- [ ] App has real functionality (not just a website wrapper with no value)
- [ ] Correct content rating
- [ ] All declared permissions are used and explained

#### Apple App Store
- [ ] Privacy policy includes data collection details
- [ ] App provides value beyond website (native features recommended)
- [ ] No broken links or placeholder content
- [ ] Login/account features work correctly
- [ ] App description matches functionality
- [ ] Screenshots are accurate and not misleading

---

### 9. Post-Submission

After submitting:
- [ ] Monitor review status daily
- [ ] Respond to reviewer questions promptly
- [ ] If rejected, read feedback carefully and fix issues
- [ ] Plan for 1-3 day review time (Google) or 1-7 days (Apple)

---

## Quick Reference

| Platform | Console URL |
|----------|-------------|
| Google Play | https://play.google.com/console |
| Apple App Store | https://appstoreconnect.apple.com |
| Vercel Dashboard | https://vercel.com/dashboard |

| App Configuration |  |
|-------------------|--|
| Package Name (Android) | `com.smarttechbazaar.app` |
| Bundle ID (iOS) | `com.smarttechbazaar.app` |
| Apple Team ID | `5TGG836W7V` |
| Theme Color | `#E31837` |
| Background Color | `#FFFFFF` |

---

## Files Reference

| File | Purpose |
|------|---------|
| `public/manifest.json` | PWA manifest |
| `public/.well-known/assetlinks.json` | Android App Links |
| `public/.well-known/apple-app-site-association` | iOS Universal Links |
| `public/icons/icon-512x512.png` | App store icon |
| `public/splash/` | iOS splash screens |
| `public/og-image.png` | Social sharing image |
| `app/(main)/privacy/page.tsx` | Privacy policy page |
| `app/(main)/terms/page.tsx` | Terms of service page |
| `lib/site-config.ts` | Site configuration |
