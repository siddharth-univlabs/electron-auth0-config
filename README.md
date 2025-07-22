# Electron Auth0 Splash App

This Electron app displays a splash screen video, then authenticates users with Auth0. If the user is logged in, they are taken to the dashboard; otherwise, they are prompted to log in with Auth0.

## Features
- Splash screen video on launch
- Auth0 authentication (custom protocol for desktop security)
- Dashboard for authenticated users
- Blue and white modern UI

## Setup Instructions

### 1. Install Dependencies
```
npm install
```

### 2. Configure Auth0

If you want to use your own Auth0 application, you must update the **client ID** and **domain** in the app:

- Open `index.html` in the project root.
- Find these lines near the top of the `<script>` section:
  ```js
  const auth0Domain = 'dev-i6zohne55c1mcy4z.us.auth0.com';
  const auth0ClientId = '9B5pBTvqG4FgW8oWtX2b8kZ63D45pHmH';
  ```
- Replace the values with your own Auth0 **Domain** and **Client ID** from your Auth0 dashboard.

#### Example:
```js
const auth0Domain = 'YOUR_DOMAIN.auth0.com';
const auth0ClientId = 'YOUR_CLIENT_ID';
```

### 3. Update Allowed Callback URLs in Auth0
- Go to your Auth0 dashboard > Applications > Your App > Settings.
- Set **Allowed Callback URLs** to:
  ```
  csmapp://callback
  ```
- Set **Allowed Logout URLs** to:
  ```
  csmapp://callback
  ```
- Save changes.

### 4. Run the App
```
npm start
```

## Notes
- The splash screen video file should be named `CSM 16x9.mp4` and placed in the project root.
- This app uses a custom protocol (`csmapp://callback`) for secure desktop authentication.
- For production, set up your own Auth0 social provider keys (not dev keys).

## Troubleshooting
- If you see a white screen after login, make sure the callback URL is set correctly in Auth0 and the app is not navigating to `csmapp://callback` as a page.
- If you change the protocol name, update it in both the Electron main process and Auth0 settings.

---

**Enjoy your secure Electron Auth0 app!** 