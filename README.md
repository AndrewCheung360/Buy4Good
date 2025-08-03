<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/AndrewCheung360/Buy4Good/">
    <img width="468" height="304" alt="image" src="https://github.com/user-attachments/assets/7a6dd86b-5b0f-4b95-8bb4-013ab8b943db" />

  </a>

<h3 align="center">Buy4Good</h3>

  <p align="center">
    A mobile app that turns everyday purchases into charitable donations through affiliate partnerships
    <br />
    <a href="https://github.com/AndrewCheung360/Buy4Good"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/AndrewCheung360/Buy4Good">View Demo</a>
    ·
    <a href="https://github.com/AndrewCheung360/Buy4Good/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/AndrewCheung360/Buy4Good/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#api-documentation">API Documentation</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

<img width="1000" height="600" alt="image" src="https://github.com/user-attachments/assets/c53461f9-439c-4481-bfd6-66231a7ecfa0" />


Buy4Good is a comprehensive mobile application that seamlessly integrates charitable giving into everyday shopping. Users can connect their bank accounts, shop at partner merchants, and automatically donate a percentage of their purchases to their chosen charities. The app features real-time transaction tracking, donation analytics, and a curated selection of verified nonprofit organizations.

### Key Benefits:
* **Effortless Giving**: Turn purchases into donations automatically
* **Transparency**: Track exactly where your money goes with detailed analytics
* **Partner Network**: Shop at major brands and retailers through affiliate partnerships
* **Impact Visualization**: See your collective impact with interactive dashboards
* **Secure**: Bank-grade security with Plaid integration for transaction monitoring

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

**Frontend (Mobile App):**
* [![React Native][ReactNative]][ReactNative-url]
* [![Expo][Expo]][Expo-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]
* [![Supabase][Supabase]][Supabase-url]

**Backend (API Server):**
* [![Python][Python]][Python-url]
* [![FastAPI][FastAPI]][FastAPI-url]
* [![Pydantic][Pydantic]][Pydantic-url]

**External Integrations:**
* [![Plaid][Plaid]][Plaid-url] - Bank account connection and transaction monitoring
* **Pledge.to API** - Nonprofit organization data and donation processing
* **Google OAuth** - User authentication

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features

**Mobile App Features:**
- 🔐 **Secure Authentication** - Google OAuth integration
- 🏦 **Bank Integration** - Connect spending cards via Plaid
- 🛒 **Merchant Shopping** - Browse and shop at partner brands
- 💝 **Charity Selection** - Choose from verified nonprofit organizations
- 📊 **Donation Dashboard** - Track donation history and impact
- 📱 **Real-time Activity** - See recent donations and transactions
- 🎯 **Cause Filtering** - Find charities by cause categories
- 📈 **Analytics** - Visualize donation breakdown by cause

**Backend API Features:**
- 🌐 **RESTful API** - Comprehensive endpoints for all app functionality
- 💸 **Donation Processing** - Handle charitable donations via Pledge.to
- 🏢 **Organization Management** - Fetch and manage nonprofit data
- 🔄 **Transaction Simulation** - Mock affiliate network transactions
- 🪝 **Webhook Handling** - Process affiliate network callbacks
- 🏥 **Health Monitoring** - Comprehensive health checks
- 📚 **Auto Documentation** - Interactive API docs with Swagger

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This project consists of two main components: a React Native mobile app (frontend) and a FastAPI server (backend). Follow the instructions below to set up both components locally.

### Prerequisites

**For Frontend:**
* Node.js (v18 or higher)
* npm or yarn
* Expo CLI
* iOS Simulator (Mac) or Android Studio

**For Backend:**
* Python 3.8+
* pip (Python package manager)

**API Keys Required:**
* Plaid API keys (sandbox and production)
* Pledge.to API key
* Supabase project credentials
* Google OAuth credentials

### Installation

#### 1. Clone the Repository
```sh
git clone https://github.com/AndrewCheung360/Buy4Good.git
cd Buy4Good
```

#### 2. Backend Setup

```sh
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys:
# PLEDGE_TO_API_KEY=your_production_api_key_here
# PLEDGE_TO_SANDBOX_API_KEY=your_sandbox_api_key_here
# USE_SANDBOX_FOR_DONATIONS=true

# Start the server
python main.py
```

#### 3. Frontend Setup

```sh
cd frontend/Buy4Good

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# EXPO_PUBLIC_PLAID_CLIENT_ID=your_plaid_client_id
# EXPO_PUBLIC_PLEDGE_API_TOKEN=your_pledge_api_token
# EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the development server
npx expo start
```

#### 4. Database Setup (Supabase)

1. Create a new Supabase project
2. Run the SQL migrations in `database/migrations/`
3. Configure Row Level Security (RLS) policies
4. Update your `.env` with Supabase credentials

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

### Mobile App Usage

1. **Sign Up/Login**: Authenticate using Google OAuth
2. **Connect Bank Account**: Use Plaid to securely link your spending card
3. **Browse Charities**: Explore nonprofit organizations by cause category
4. **Select Favorites**: Choose charities to support with your purchases
5. **Shop**: Browse partner merchants and make purchases
6. **Track Impact**: View your donation history and analytics on the dashboard

### API Usage

The backend provides a comprehensive REST API for all app functionality:

```javascript
// Example: Create a donation
const response = await fetch('http://localhost:8000/api/v1/donations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "donor@example.com",
    first_name: "John",
    last_name: "Doe",
    amount: "25.00",
    organization_id: "3685b542-61d5-45da-9580-162dca725966"
  })
});
```

_For complete API documentation, visit the interactive docs at `http://localhost:8000/docs` when running the backend._

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Structure

```
Buy4Good/
├── frontend/Buy4Good/          # React Native mobile app
│   ├── app/                    # App screens and navigation
│   │   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── components/        # Reusable UI components
│   │   └── webview/           # Merchant webview screens
│   ├── assets/                # Images and static assets
│   ├── context/               # React context providers
│   ├── data/                  # Mock data and types
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript type definitions
├── backend/                   # FastAPI server
│   ├── routes/                # API route modules
│   │   ├── donations.py       # Donation endpoints
│   │   ├── organizations.py   # Organization endpoints
│   │   ├── transactions.py    # Transaction simulation
│   │   └── health.py          # Health check endpoints
│   ├── services/              # Business logic services
│   │   └── pledge_client.py   # Pledge.to API client
│   ├── models.py              # Pydantic data models
│   ├── config.py              # Configuration settings
│   └── main.py                # FastAPI application entry
└── database/                  # Database schema and migrations
    └── migrations/            # SQL migration files
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## API Documentation

The backend provides comprehensive API documentation through FastAPI's automatic documentation generation:

- **Interactive API Docs (Swagger UI)**: `http://localhost:8000/docs`
- **Alternative Docs (ReDoc)**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/donations` | POST | Create a new donation |
| `/api/v1/organizations` | GET | List nonprofit organizations |
| `/api/v1/organizations/{id}` | GET | Get organization details |
| `/api/v1/simulate-transaction` | POST | Simulate affiliate transaction |
| `/api/v1/webhook` | POST | Handle affiliate webhooks |
| `/health` | GET | Comprehensive health check |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] **Phase 1: Core Foundation**
  - [x] User authentication with Google OAuth
  - [x] Bank account integration via Plaid
  - [x] Basic charity browsing and selection
  - [x] Donation tracking dashboard

- [ ] **Phase 2: Enhanced Shopping Experience**
  - [ ] Real-time affiliate transaction processing
  - [ ] Push notifications for donations
  - [ ] Advanced analytics and reporting
  - [ ] Social sharing features

- [ ] **Phase 3: Scale & Optimization**
  - [ ] Additional payment method support
  - [ ] Corporate partnership program
  - [ ] Advanced charity recommendation engine
  - [ ] Multi-language support

- [ ] **Phase 4: Platform Expansion**
  - [ ] Web application version
  - [ ] Admin dashboard for nonprofits
  - [ ] API for third-party integrations
  - [ ] White-label solutions

See the [open issues](https://github.com/AndrewCheung360/Buy4Good/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

### Development Guidelines

1. **Frontend**: Follow React Native and TypeScript best practices
2. **Backend**: Adhere to FastAPI conventions and Python PEP 8
3. **Testing**: Write tests for new features and bug fixes
4. **Documentation**: Update README and API docs for any changes

### Contribution Process

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/AndrewCheung360/Buy4Good/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AndrewCheung360/Buy4Good" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Andrew Cheung - [@andrewcheung](https://linkedin.com/in/andrewcheung) - andrewcheung360@gmail.com

Project Link: [https://github.com/AndrewCheung360/Buy4Good](https://github.com/AndrewCheung360/Buy4Good)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Expo](https://expo.dev/) - For the excellent React Native development platform
* [FastAPI](https://fastapi.tiangolo.com/) - For the high-performance Python web framework
* [Plaid](https://plaid.com/) - For secure bank account integration
* [Pledge.to](https://pledge.to/) - For nonprofit organization data and donation processing
* [Supabase](https://supabase.com/) - For the backend-as-a-service platform
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template) - For this amazing README template

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/AndrewCheung360/Buy4Good.svg?style=for-the-badge
[contributors-url]: https://github.com/AndrewCheung360/Buy4Good/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/AndrewCheung360/Buy4Good.svg?style=for-the-badge
[forks-url]: https://github.com/AndrewCheung360/Buy4Good/network/members
[stars-shield]: https://img.shields.io/github/stars/AndrewCheung360/Buy4Good.svg?style=for-the-badge
[stars-url]: https://github.com/AndrewCheung360/Buy4Good/stargazers
[issues-shield]: https://img.shields.io/github/issues/AndrewCheung360/Buy4Good.svg?style=for-the-badge
[issues-url]: https://github.com/AndrewCheung360/Buy4Good/issues
[license-shield]: https://img.shields.io/github/license/AndrewCheung360/Buy4Good.svg?style=for-the-badge
[license-url]: https://github.com/AndrewCheung360/Buy4Good/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/andrewcheung
[product-screenshot]: frontend/Buy4Good/assets/images/screenshot.png

[ReactNative]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[ReactNative-url]: https://reactnative.dev/
[Expo]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white
[Expo-url]: https://expo.dev/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Python]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://python.org/
[FastAPI]: https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi
[FastAPI-url]: https://fastapi.tiangolo.com/
[Pydantic]: https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge&logo=pydantic&logoColor=white
[Pydantic-url]: https://pydantic.dev/
[Supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
[Plaid]: https://img.shields.io/badge/Plaid-000000?style=for-the-badge&logo=plaid&logoColor=white
[Plaid-url]: https://plaid.com/
