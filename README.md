# React Native Passkey POC

## Install deps

```bash
npm i
npx expo prebuild
npx pod-install
cd express && npm i
```

## Run Express server

```js
node express/server.js
```

Make sure to update `TEAM_ID` and `BUNDLE_ID` to match yours (see `app.json`).

Start ngrok:

```bash
ngrok http 3000
```

## Setup Xcode Associated Domain

- Open your project using `xed ios`
- Go to Signing & Capabilities
- Click + Capability
- Add "Associated Domains"
- Add an entry: webcredentials:something.ngrok.app (using your ngrok domain)

## Set Associated Domain

- open `src/app/index.tsx` and update `ASSOCIATED_DOMAIN` with your ngrok domain

## Run the app

```bash
npm run ios
```
