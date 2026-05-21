# iOS App Store Compliance Checklist

This document tracks compliance with Apple's App Store Review Guidelines for the Smart Tech Bazaar iOS app.

## Guideline 4.8 - Login Services (RESOLVED)

**Status:** IMPLEMENTED

**Issue:** Apple rejected the app because it used Google Sign-In without offering Sign in with Apple as an equivalent option.

**Resolution:** Sign in with Apple has been implemented alongside Google Sign-In.

### Implementation Details

1. **User Model** (`models/User.ts`)
   - Added `appleId` field to store Apple's unique user identifier
   - Field is indexed with sparse option for efficient lookups

2. **Authentication Provider** (`lib/auth.ts`)
   - Added Apple credentials provider with ID `apple`
   - Handles user creation, account linking, and session management
   - Apple users are automatically marked as email verified

3. **Login Page** (`app/auth/login/page.tsx`)
   - Sign in with Apple button displayed in native iOS app context
   - Uses Median.co's native Social Login plugin for seamless authentication
   - Falls back gracefully on web browsers

4. **Register Page** (`app/auth/register/page.tsx`)
   - Sign up with Apple button displayed in native iOS app context
   - Same native authentication flow as login

5. **Native App Integration** (`lib/native-app.ts`)
   - `nativeAppleSignIn()` function handles native Apple Sign-In via Median.co
   - Properly decodes identity tokens to extract user information
   - Handles Apple's privacy features (hidden email relay)

### Apple's Requirements Met

- [x] Login option limits data collection to user's name and email
- [x] Login option allows users to keep email private (Apple's Hide My Email)
- [x] Login option does not collect interactions for advertising without consent
- [x] Sign in with Apple is displayed as prominently as Google Sign-In

---

## Other iOS App Store Guidelines

### Guideline 2.1 - App Completeness

- [x] App is fully functional and not a beta/demo
- [x] All features work without crashes
- [x] Placeholder content has been removed

### Guideline 2.3 - Accurate Metadata

- [x] App description accurately reflects functionality
- [x] Screenshots show actual app UI
- [ ] **ACTION REQUIRED:** Update screenshots to show Sign in with Apple button

### Guideline 3.1.1 - In-App Purchases (if applicable)

- [x] Physical goods/services can use external payment (Razorpay)
- [ ] Digital goods must use Apple's IAP (not currently applicable)

### Guideline 4.2 - Minimum Functionality

- [x] App provides meaningful functionality beyond a website
- [x] Native features utilized (push notifications, haptic feedback, etc.)

### Guideline 5.1.1 - Data Collection and Privacy

- [x] Privacy policy is accessible
- [x] App describes data collection in App Store Connect
- [x] User consent obtained for notifications
- [x] No data collected without user knowledge

### Guideline 5.1.2 - Data Use and Sharing

- [x] User data not shared with third parties for advertising
- [x] Data used only for app functionality

---

## Median.co Configuration Checklist

### Sign in with Apple Setup

1. **Apple Developer Account:**
   - [ ] Create App ID with Sign in with Apple capability
   - [ ] Create Services ID for web authentication (if needed)
   - [ ] Generate private key for server-to-server auth

2. **Median.co Dashboard:**
   - [ ] Enable Social Login plugin
   - [ ] Configure Apple Sign-In with Bundle ID
   - [ ] Ensure Sign in with Apple capability is in provisioning profile

### Push Notifications Setup

- [ ] OneSignal App ID configured
- [ ] APNs certificates uploaded to OneSignal
- [ ] Push notification entitlement in provisioning profile

---

## Pre-Submission Checklist

Before resubmitting to App Store Review:

1. [ ] Build and test Sign in with Apple on real device
2. [ ] Verify Apple button appears on login/register screens
3. [ ] Test complete sign-up flow with Apple ID
4. [ ] Test sign-in with existing Apple account
5. [ ] Update App Store screenshots to show Apple button
6. [ ] Test on multiple iOS versions (15+)
7. [ ] Verify error handling for cancelled sign-in
8. [ ] Test account linking (existing email + Apple ID)

---

## Response to App Review

When resubmitting, include this note to the reviewer:

> We have implemented Sign in with Apple as an equivalent login option to Google Sign-In, in compliance with Guideline 4.8. The Sign in with Apple button is now prominently displayed on both the login and registration screens within the iOS app. Users can:
>
> 1. Sign up with Apple (new account creation)
> 2. Sign in with Apple (returning users)
> 3. Use Apple's Hide My Email feature for privacy
>
> We have also updated our screenshots to reflect this change.

---

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-05-21 | 1.0.1 | Added Sign in with Apple for Guideline 4.8 compliance |

---

## Contact

For questions about iOS compliance, contact the development team.
