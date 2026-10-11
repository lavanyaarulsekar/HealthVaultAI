# HealthVaultAI

HealthVaultAI is a web application designed to help users organize and manage their health information in one place.

## Features

- Health Profile
- Medical Records
- Medicine Management
- Appointment Management
- AI Health Assistant
- Medical Report Summarization
- Health Timeline
- Emergency Health Card
- Settings Management

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- PostgreSQL
- Google Gemini API

## Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd healthvault
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

Open the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and add the required environment variables. Obtain your own API credentials and database connection details.

**Never commit your `.env` file or publish API keys and database passwords.**

### 4. Start the backend

From the `server` directory, run:

```bash
node server.js
```

### 5. Start the frontend

Open a second terminal in the project root and run:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Important Notes

- A configured PostgreSQL database is required for database-backed features.
- AI features require valid API credentials.
- This project is under development and should be tested before public deployment.
- Use dummy data for demonstrations. Do not upload real or sensitive medical information to a public repository.

## License

No license has been specified yet.