# Apple App ID Registration Guide for STB App

## App Overview
**App Name:** STB (Tech Products E-commerce Store)  
**App Type:** E-commerce / Retail  
**Features:** Product browsing, shopping cart, checkout, user accounts, order tracking, push notifications

---

## Basic Registration Details

### Platform
- [x] iOS
- [x] iPadOS
- [ ] macOS (optional - for Mac Catalyst later)
- [ ] tvOS
- [ ] watchOS (optional - for future Apple Watch companion)
- [ ] visionOS

### App ID Prefix
`5TGG836W7V` (Your Team ID)

### Description
`STB - Tech Products Store`

### Bundle ID (Explicit - Recommended)
`com.stb.app` or `com.yourcompany.stb`

> Use reverse-domain style. Example: `com.stbstore.ios`

---

## REQUIRED Capabilities (Enable These)

These are essential for your e-commerce app to function properly:

| Capability | Why You Need It | Priority |
|------------|-----------------|----------|
| **Push Notifications** | Order updates, shipping notifications, promotions, cart reminders | **CRITICAL** |
| **Sign In with Apple** | Required if you offer third-party sign-in (Google, Facebook). Provides easy authentication | **CRITICAL** |
| **Apple Pay Payment Processing** | Seamless one-tap checkout for customers | **HIGH** |
| **In-App Purchase** | If selling digital goods, subscriptions, or gift cards | **HIGH** |
| **Associated Domains** | Universal links - deep linking from website/emails to app | **HIGH** |
| **Data Protection** | Encrypts user data (Complete protection recommended) | **HIGH** |
| **App Attest** | Fraud prevention, validates app integrity | **HIGH** |
| **iCloud** | Sync cart, wishlist, preferences across user devices | **MEDIUM** |
| **Maps** | Store locator, delivery tracking visualization | **MEDIUM** |

---

## RECOMMENDED Capabilities (Nice to Have)

| Capability | Why You Might Need It | Priority |
|------------|----------------------|----------|
| **Siri** | Voice commands: "Hey Siri, check my STB order" | MEDIUM |
| **App Groups** | Share data with app extensions (widgets, notifications) | MEDIUM |
| **Communication Notifications** | Rich notifications for customer support chat | LOW |
| **Time Sensitive Notifications** | For urgent alerts (order shipped, flash sales) | LOW |
| **Background GPU Access** | Only if using AR features for product visualization | LOW |
| **NFC Tag Reading** | Only if using NFC for product info or loyalty cards | LOW |
| **Wallet** | Store digital receipts, loyalty cards, tickets | LOW |
| **Access Wi-Fi Information** | Only if needed for specific features | LOW |

---

## NOT NEEDED for Your App

Skip these capabilities - they're not relevant for an e-commerce tech store:

- HealthKit, HomeKit, CarPlay (all variants)
- DriverKit (all variants)
- Game Center
- ClassKit
- Family Controls
- Critical Messaging/Alerts
- 5G Network Slicing
- Hotspot
- Personal VPN
- Network Extensions
- All CarPlay options
- FSKit, EnergyKit
- Journaling Suggestions
- Most development-only capabilities

---

## App Services

| Service | Needed? | Reason |
|---------|---------|--------|
| **MusicKit** | NO | Not a music app |
| **ShazamKit** | NO | Not audio recognition needed |
| **WeatherKit** | NO | Not weather-related |

---

## Capability Requests (Require Apple Approval)

Most of these require special approval from Apple. For your e-commerce app, you likely **DO NOT need** any of these unless:

| Request | Need It? | When to Request |
|---------|----------|-----------------|
| **Critical Alerts** | MAYBE | Only if you need alerts that bypass Do Not Disturb (e.g., security alerts) |
| **FinanceKit** | NO | Unless integrating banking features |
| **StoreKit External Purchase** | MAYBE | If selling outside App Store in EU |
| **Default Web Browser** | NO | You're not a browser |
| **All CarPlay options** | NO | Not automotive-related |

---

## Registration Checklist

### Step 1: Basic Info
```
Platform: iOS, iPadOS
App ID Prefix: 5TGG836W7V
Description: STB - Tech Products Store
Bundle ID: com.stbstore.ios (or your preferred domain)
```

### Step 2: Enable These Capabilities
1. [x] Push Notifications
2. [x] Sign In with Apple (Configure)
3. [x] Apple Pay Payment Processing
4. [x] In-App Purchase
5. [x] Associated Domains
6. [x] Data Protection (Complete)
7. [x] App Attest
8. [x] iCloud
9. [x] Maps

### Step 3: Optional Capabilities (Enable Later)
1. [ ] Siri
2. [ ] App Groups
3. [ ] Time Sensitive Notifications
4. [ ] Wallet

### Step 4: Capability Requests
- No requests needed initially
- Request Critical Alerts only if needed for security/fraud alerts

---

## Post-Registration Setup

After registering your App ID, you'll need to:

### 1. Push Notifications Setup
- Create APNs Key or Certificate in Apple Developer portal
- Configure in your backend (Firebase FCM or custom APNs)

### 2. Sign In with Apple Setup
- Configure Services ID
- Set up Return URLs
- Add domain verification

### 3. Apple Pay Setup
- Create Merchant ID
- Configure Payment Processing Certificate
- Add supported payment networks (Visa, Mastercard, Amex, etc.)

### 4. Associated Domains Setup
- Create `apple-app-site-association` file on your website
- Configure domains: `applinks:yourdomain.com`, `webcredentials:yourdomain.com`

### 5. iCloud Setup
- Create iCloud Container
- Configure CloudKit database for sync

---

## Summary - Quick Action Items

**ENABLE NOW (Required):**
1. Push Notifications
2. Sign In with Apple
3. Apple Pay Payment Processing
4. In-App Purchase
5. Associated Domains
6. Data Protection
7. App Attest

**ENABLE LATER (Optional):**
1. iCloud
2. Maps
3. Siri
4. App Groups
5. Wallet

**DO NOT REQUEST:**
- Most capability requests are not needed for e-commerce
- Only request Critical Alerts if absolutely necessary

---

## Environment Variables Needed

After setup, you'll need these in your app:

```env
# Apple Push Notifications
APNS_KEY_ID=your_key_id
APNS_TEAM_ID=5TGG836W7V
APNS_BUNDLE_ID=com.stbstore.ios

# Sign In with Apple
APPLE_CLIENT_ID=com.stbstore.ios
APPLE_TEAM_ID=5TGG836W7V
APPLE_KEY_ID=your_siwa_key_id
APPLE_PRIVATE_KEY=your_private_key

# Apple Pay
APPLE_MERCHANT_ID=merchant.com.stbstore
```

---

## Notes

1. **Sign In with Apple is MANDATORY** if you offer any third-party login (Google, Facebook, etc.) per App Store guidelines.

2. **Apple Pay** significantly increases conversion rates for iOS users - highly recommended for e-commerce.

3. **Push Notifications** are essential for cart abandonment recovery, order updates, and promotions.

4. Keep capabilities minimal at first - you can always add more later. Apple reviews additional capability requests, which can delay app approval.
