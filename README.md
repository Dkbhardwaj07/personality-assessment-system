# Personality Assessment System

## Overview
The **Personality Assessment System** is a web-based application designed to evaluate users' personalities based on a questionnaire. The system consists of a **FastAPI** backend and a **React** frontend, enabling users to take assessments and view their results.

## Features
- User authentication (registration & login)
- Personality test based on predefined questions
- Real-time result generation
- Admin panel for managing questions and users

## Tech Stack
### Backend (FastAPI)
- FastAPI (Python-based web framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- JWT Authentication

### Frontend (React)
- React.js
- Material-UI (UI components)
- Axios (API communication)

### Additional Tools
- Docker (Containerization)
- GitHub Actions (CI/CD)

## Installation
### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL
- Git
- Docker (optional)

### Backend Setup (FastAPI)
1. Clone the repository:
   ```sh
   git clone https://github.com/Dkbhardwaj07/personality-assessment-system.git
   cd personality-assessment-system
   ```
2. Navigate to the backend directory:
   ```sh
   cd backend
   ```
3. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate   # On Mac/Linux
   venv\Scripts\activate      # On Windows
   ```
4. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
5. Set up the environment variables:
   ```sh
   cp .env.example .env
   ```
   Edit `.env` with your database and JWT settings.
6. Run database migrations:
   ```sh
   alembic upgrade head
   ```
7. Start the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup (React)
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm start
   ```
   The frontend will be available at `http://localhost:3000`.

## API Endpoints
### Authentication
- `GET /submit-response` - Submits user responses for assessment
### Personality Test
- `GET /get-results` - Fetch test questions
- `POST /submit-test` - Submit answers and receive results

## Contribution Guidelines
1. Fork the repository.
2. Create a feature branch:
   ```sh
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```sh
   git push origin feature-name
   ```
5. Open a pull request.

## Deployment
### Docker (Optional)
You can deploy the app using Docker:
```sh
docker-compose up --build
```

### GitHub Actions
A CI/CD pipeline is set up using GitHub Actions for automatic deployment.

## License
This project is licensed under the MIT License.

## Contact
For queries, contact **hackathon@compunneldigital.com**.

