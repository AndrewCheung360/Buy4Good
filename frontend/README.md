# Buy4Good Mobile App

This is the React Native mobile application for Buy4Good, built with Expo.

For complete project documentation, setup instructions, and API information, please see the [main project README](../../README.md).

## Quick Start

1. Install dependencies
   ```bash
   npm install
   ```

2. Configure environment variables
   ```bash
   # Create .env file with required API keys
   cp .env.example .env
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

## Project Structure

```
app/
├── (tabs)/                 # Tab navigation screens
│   ├── dashboard.tsx       # Main dashboard
│   ├── explore.tsx         # Merchant browsing
│   ├── charities.tsx       # Charity selection
│   └── settings.tsx        # User settings
├── components/             # Reusable UI components
├── webview/               # Merchant webview integration
└── _layout.tsx            # Root layout and navigation

context/
├── auth.tsx               # Authentication context

data/
├── mockData.ts            # Mock data for development

utils/
├── plaid.ts               # Plaid integration utilities
└── supabase.ts            # Supabase client configuration
```

## Key Features

- 🔐 Google OAuth authentication
- 🏦 Plaid bank account integration
- 🛒 Partner merchant shopping
- 💝 Charity selection and donation tracking
- 📊 Interactive donation analytics dashboard
- 📱 Real-time activity feed

For detailed setup instructions, API documentation, and contribution guidelines, see the [main README](../../README.md).
