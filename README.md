# Aitinerary
<img width="1919" height="938" alt="image" src="https://github.com/user-attachments/assets/f1595233-6e3a-4661-8d9b-4c425106da99" />


<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/57ace4a8-a7d9-497e-8948-38fbd5e0d774" />

AI-powered travel planner built for the AMD Developer Hackathon. Aitinerary generates personalized, day-by-day trip itineraries based on your travel "vibe" — chill, adventure, luxury, or cultural — complete with an adaptive UI and clean, exportable plans.

Live demo: https://amd-hackathon-pi.vercel.app

## Features

- Generates structured, day-wise itineraries from a simple trip description
- Personalizes recommendations based on user-selected travel vibe
- Responsive UI for desktop and mobile
- AI-generated itinerary content ready for real-world travel use

## Tech Stack

- **Frontend:** React + Vite (JavaScript)
- **Backend:** Django (Python)
- **LLM providers:** Fireworks AI or Gemini (pick one)
- **Location data:** Geoapify

## Project Structure

```
AMD_Hackathon/
├── frontend/   # React (Vite) application
└── backend/    # Django API server
```

## Setup

You can run Aitinerary either with Docker (recommended, fastest) or manually on your machine.

### Prerequisites

- Docker & Docker Compose (for the Docker setup), **or**
- Node.js (v18+) + npm and Python 3.12 (for a manual setup)
- Git
- API keys: one of Fireworks AI **or** Gemini, plus a Geoapify API key

### 1. Clone the repository

```bash
git clone https://github.com/7078-cj/AMD_Hackathon.git
cd AMD_Hackathon
```

### 2. Configure environment variables

**Backend** — use `backend/.env.example` as a guide, copy it and fill in your own values:

```bash
cp backend/.env.example backend/.env
```

```dotenv
SECRET_KEY=secret key
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173

# choose only one LLM api key, either fireworks or gemini
FIREWORKS_AI_KEY=<Fireworks api key>
GEMINI_AI_KEY=<Gemini Api key>

GEOAPIFY_API_KEY=<Geoapify api key>
```

**Frontend** — use `frontend/.env.example` as a guide, copy it and fill in your own values:

```bash
cp frontend/.env.example frontend/.env
```

```dotenv
VITE_API_URL=http://127.0.0.1:8000/api/
VITE_WS_URL=ws://127.0.0.1:8000
```

### 3. Run with Docker (recommended)

From the repo root, once both `.env` files are in place:

```bash
docker compose up --build
```

This builds and starts both services:

- Backend (Django) → http://localhost:8000
- Frontend (React/Vite) → http://localhost:5173

The backend container automatically runs migrations (`python manage.py migrate`) before starting the server.

To stop:

```bash
docker compose down
```

### 4. Manual setup (without Docker)

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

**Frontend** (in a new terminal):

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

- Backend runs on: `http://127.0.0.1:8000`
- Frontend runs on: `http://localhost:5173`

## Usage

1. Start the backend and frontend (via Docker Compose or manually).
2. Open `http://localhost:5173` in your browser.
3. Describe your trip and desired vibe, and generate your itinerary.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

## License

MIT License