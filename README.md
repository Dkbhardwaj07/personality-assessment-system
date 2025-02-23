# Personality Assessment System

## Overview
The **Personality Assessment System** is a web-based application that evaluates user personality traits based on responses to a predefined set of questions. The system processes responses, applies assessment algorithms, and provides insights into personality traits.

## Features
- User authentication and profile management
- Personality trait assessment based on predefined criteria
- Admin panel for managing assessments and user data
- Interactive frontend with real-time feedback
- REST API for seamless integration

---

## Tech Stack
### **Frontend:**
- React.js (UI framework)
- Material-UI (UI components)
- Axios (API communication)

### **Backend:**
- Python (Fastapi framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- JWT (Authentication)

---

## Setup Instructions
### **Prerequisites**
- Python 3.x installed
- Node.js & npm installed
- PostgreSQL installed and configured
- Git installed

### **Backend Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/Dkbhardwaj07/personality-assessment-system.git
   cd personality-assessment-system/backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   venv\Scripts\activate  # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables (e.g., `.env` file):
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/personality_db
   SECRET_KEY=your_secret_key
   ```
5. Run database migrations:
   ```bash
   flask db upgrade
   ```
6. Start the backend server:
   ```bash
   python app.py
   ```

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure API endpoints in `.env`:
   ```bash
   REACT_APP_API_URL=http://127.0.0.1:5000
   ```
4. Start the frontend server:
   ```bash
   npm start
   ```

---

## API Endpoints
### **User Authentication**
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and return JWT token

### **Personality Assessment**
- `POST /api/assessment/submit` - Submit user responses for analysis
- `GET /api/assessment/result` - Fetch personality assessment results

### **Admin**
- `GET /api/admin/users` - Fetch all users (admin only)

---

## Contribution Guidelines
### **Steps to Contribute**
1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/personality-assessment-system.git
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
4. Make your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```
5. Push to your fork and submit a pull request:
   ```bash
   git push origin feature-branch
   ```

---

## Deployment
To deploy the project on a live server:
- Use **Docker** for containerization
- Deploy backend using **Heroku/AWS/GCP**
- Deploy frontend using **Vercel/Netlify**

---

## License
This project is licensed under the MIT License.

---

## Contact
For any issues or feature requests, reach out to:
- **Email:** hackathon@compunneldigital.com
- **GitHub Issues:** [Open an issue](https://github.com/Dkbhardwaj07/personality-assessment-system/issues)

---

Happy Coding! 🚀

