# Apple App ID Registration Guide for STB App (Median.co Wrapper)

## IMPORTANT: Median.co is a WebView Wrapper

Since you're using **Median.co** to wrap your web app, you need **far fewer capabilities** than a native app. Median creates a WebView container around your existing website - it's NOT a native app built from scratch.

---

## What You ACTUALLY Need for Median.co + App Store

### Step 1: Apple Developer Account Setup

1. **Apple Developer Account** - $99/year at https://developer.apple.com/programs/enroll/
2. **Team ID**: `5TGG836W7V` (you already have this)

### Step 2: Register App ID in Apple Developer Portal

Go to: https://developer.apple.com/account/resources/identifiers/list

**Basic Info:**
```
Platform: iOS
Bundle ID: com.smarttechbazaar.app
Description: Smart Tech Bazaar - Tech Products Store
```

### Step 3: Capabilities to ENABLE (Only These!)

For a Median.co WebView wrapper, you only need **2-3 capabilities**:

| Capability | Required? | Why |
|------------|-----------|-----|
| **Push Notifications** | YES | Order updates, promotions (via OneSignal/Median) |
| **Associated Domains** | YES | Universal links from website/emails to app |
| **Sign In with Apple** | MAYBE | Only if you add Apple login via Median plugin |

### Step 4: Capabilities to SKIP

**DO NOT enable these** - they're for native apps, not WebView wrappers:

- Apple Pay (your web checkout already works via Razorpay)
- In-App Purchase (not needed for physical goods)
- iCloud
- Maps
- Siri
- HealthKit, HomeKit, CarPlay, etc.
- App Attest
- Background modes
- Data Protection (default is fine)
- Everything else

---

## Your App is Already Prepared!

Your STB website already has everything Apple requires:

| Requirement | Status | Location |
|-------------|--------|----------|
| Privacy Policy | DONE | `/privacy` |
| Terms & Conditions | DONE | `/terms` |
| Account Deletion | DONE | `/dashboard/delete-account` |
| Mobile Responsive | DONE | All pages |
| Apple App Site Association | DONE | `/.well-known/apple-app-site-association` |
| Contact Information | DONE | Footer + About page |

---

## Median.co Configuration Checklist

When setting up your app in Median.co App Studio:

### 1. General Settings
```
App Name: Smart Tech Bazaar
Website URL: https://smarttechbazaar.com
Bundle ID: com.smarttechbazaar.app
```

### 2. Navigation (Required for App Store Approval)
- Enable native **Tab Bar** or **Sidebar** navigation
- Hide your web header/footer in the app using CSS or Median's settings
- This makes your app feel "native" per Apple Guideline 4.2

### 3. Push Notifications (via OneSignal)
- Enable in Median's Native Plugins
- Get OneSignal App ID and configure in Median
- Your website already supports OneSignal (mentioned in Privacy Policy)

### 4. Universal Links
- Enable "Associated Domains" in Median
- Your AASA file is already configured at:
  `/.well-known/apple-app-site-association`

### 5. Sign In with Apple (Optional)
- Only enable if you want Apple login
- If you have Google/Facebook login, you MUST also offer Sign In with Apple
- Alternatively, hide social login buttons in the app and only show email/password

---

## App Store Submission Requirements

### Required Assets (Prepare These)

| Asset | Specifications |
|-------|----------------|
| App Icon | 1024x1024 PNG, no transparency, no alpha |
| Screenshots | iPhone 6.7" (1290x2796), iPhone 6.5" (1284x2778) |
| iPad Screenshots | iPad 12.9" (2048x2732) - if supporting iPad |
| App Preview Video | Optional, 15-30 seconds |

### Required Information

| Field | Your Value |
|-------|------------|
| App Name | Smart Tech Bazaar |
| Subtitle | Tech Products & IT Solutions |
| Category | Shopping |
| Secondary Category | Business (optional) |
| Age Rating | 4+ |
| Privacy Policy URL | https://smarttechbazaar.com/privacy |
| Support URL | https://smarttechbazaar.com/about |
| Copyright | 2025 Smart Tech Bazaar |

### App Store Description (Ready to Use)
```
Smart Tech Bazaar - Your one-stop shop for computer accessories, 
CCTV cameras, networking equipment, printers, and IT solutions.

FEATURES:
- Browse 1000+ tech products from top brands
- Easy checkout with multiple payment options (UPI, Cards, Net Banking)
- Track your orders in real-time
- Get notified about deals and order updates
- Secure account with easy management
- B2B wholesale pricing for businesses
- GST invoices for all orders

CATEGORIES:
- Laptops & Desktops
- Networking Equipment
- CCTV & Security Systems
- Printers & Scanners
- Storage Solutions
- Computer Accessories
- And much more!

Whether you're a business looking for B2B wholesale pricing or 
an individual customer, Smart Tech Bazaar has you covered with 
quality products and excellent service.

Based in Bangalore, serving customers across India.
```

### Keywords (100 characters max)
```
tech,computer,laptop,cctv,networking,printer,accessories,b2b,wholesale,it,bangalore
```

---

## Common Rejection Reasons & How to Avoid

### 1. "Minimum Functionality" (Guideline 4.2)
**Problem**: App is just a website wrapper
**Solution**: Your app has full e-commerce functionality - you're fine

### 2. "Web Wrapper Without Native Experience" (Guideline 4.2)
**Problem**: App doesn't feel like a native app
**Solution**: Add native tab bar/sidebar in Median settings, hide web navigation

### 3. "Missing Account Deletion" (Guideline 5.1.1)
**Problem**: Users can't delete their accounts
**Solution**: Already handled - you have `/dashboard/delete-account`

### 4. "Sign In with Apple Missing" (Guideline 4.8)
**Problem**: App has Google/Facebook login but no Apple login
**Solution**: Either add Apple login via Median plugin OR hide social logins in app

### 5. "Privacy Policy Link Missing"
**Problem**: No privacy policy accessible
**Solution**: Already handled - Privacy Policy at `/privacy`

### 6. "Broken Links or Features"
**Problem**: Some features don't work in app
**Solution**: Test thoroughly before submission

---

## Step-by-Step Publishing Process

### Option A: Self-Publish (Free, but requires Mac)
1. Configure app in Median.co App Studio
2. Download Xcode project from Median
3. Open in Xcode on a Mac
4. Set signing certificates (requires Apple Developer account)
5. Archive and upload to App Store Connect
6. Fill in App Store listing details
7. Submit for review (typically 24-48 hours, up to 5 days)

### Option B: Use Median's Publishing Service (Paid, recommended)
1. Configure app in Median.co App Studio
2. Purchase Median's publishing service
3. Provide Apple Developer credentials
4. They handle Xcode build, signing, and submission
5. **100% acceptance guarantee**
6. Reduced fee for future updates

---

## Summary: What to Select When Registering App ID

When registering your App ID at developer.apple.com/account/resources/identifiers:

**ENABLE (only these 2):**
- [x] Push Notifications
- [x] Associated Domains

**SKIP EVERYTHING ELSE** - Your web app handles payments, authentication, etc.

---

## After App Store Approval

Once approved, you'll need to:

1. **Set up App Store Connect** - Configure pricing (Free), availability (India, or worldwide)
2. **TestFlight** - Test with your team before public release
3. **Release** - Choose immediate release or manual release after approval
4. **Monitor Reviews** - Respond to user reviews in App Store Connect

---

## Google Play Store (Android)

Median.co also supports Android. For Google Play:

1. **Google Play Developer Account** - $25 one-time at https://play.google.com/apps/publish/signup
2. **Asset Links file** - Already at `/.well-known/assetlinks.json` (needs SHA256 fingerprint)
3. **Privacy Policy** - Same URL works
4. **App Signing** - Google manages signing keys

Android approval is typically faster (1-3 days).

---

## Final Checklist Before Submission

### Apple Developer Portal
- [ ] Apple Developer Account active ($99/year)
- [ ] App ID registered with Bundle ID: `com.smarttechbazaar.app`
- [ ] Push Notifications capability enabled
- [ ] Associated Domains capability enabled

### Median.co App Studio
- [ ] App configured with correct website URL
- [ ] Native navigation (tab bar or sidebar) enabled
- [ ] Web header/footer hidden in app
- [ ] Push notifications configured (OneSignal)
- [ ] Universal links enabled

### App Assets
- [ ] App icon (1024x1024 PNG, no transparency)
- [ ] iPhone screenshots (at least 6.5" and 6.7")
- [ ] iPad screenshots (if supporting iPad)

### Testing
- [ ] Test app on physical device via TestFlight
- [ ] All pages load correctly
- [ ] Checkout flow works
- [ ] Push notifications received
- [ ] Account deletion works
- [ ] Links from website open in app

### App Store Listing
- [ ] App name, subtitle, description ready
- [ ] Keywords optimized
- [ ] Privacy Policy URL set
- [ ] Support URL set
- [ ] Age rating completed
- [ ] Category selected (Shopping)

---

## Support Resources

- **Median.co Documentation**: https://median.co/docs
- **Median.co Support**: https://median.co/support
- **Apple Developer Support**: https://developer.apple.com/support/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
