import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import RecruiterDashboard from "./components/RecruiterDashboard";
import ResultsPage from "./pages/ResultsPage";
import Analytics from "./pages/Analytics"; 
import { Container, Button } from "@mui/material";

function App() {
  return (
    <Router>
      <Container>
        <Button component={Link} to="/">Home</Button>
        <Button component={Link} to="/results">View Results</Button>
        <Button component={Link} to="/dashboard">Recruiter Dashboard</Button>
        <Button component={Link} to="/analytics">Analytics</Button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/dashboard" element={<RecruiterDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
