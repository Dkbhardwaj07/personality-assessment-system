import React, { useState, useEffect, useRef } from "react";
import { Container, TextField, Button, Typography, Paper, Alert, CircularProgress } from "@mui/material";
import axios from "axios";

const PersonalityForm = () => {
    const [formData, setFormData] = useState({ name: "", email: "", response: "" });
    const [analysis, setAnalysis] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [realTimeData, setRealTimeData] = useState(null); // Store real-time messages
    const socketRef = useRef(null); // Use ref to store WebSocket instance

    useEffect(() => {
        socketRef.current = new WebSocket("ws://127.0.0.1:8000/ws");

        socketRef.current.onopen = () => {
            console.log("WebSocket connection established");
        };

        socketRef.current.onmessage = (event) => {
            console.log("🔴 Real-time update received:", event.data);
            setRealTimeData(event.data);
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            socketRef.current.close();
        };
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setLoading(true);
        setAnalysis(null);

        const trimmedData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            response: formData.response.trim(),
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/submit_response", trimmedData);
            setAnalysis(response.data.personality_traits);
            setSuccessMessage("Response submitted successfully!");

            // Emit event to the WebSocket server
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify(trimmedData));
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.detail || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            style={{
                backgroundImage: 'url("https://example.com/your-image.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '20px',
                borderRadius: '8px'
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, marginTop: 5, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Personality Assessment
                </Typography>

                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
                
                {realTimeData && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        🔥 Real-time Update: {realTimeData}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} margin="normal" variant="outlined" required />
                    <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" variant="outlined" required />
                    <TextField fullWidth label="Response" name="response" value={formData.response} onChange={handleChange} margin="normal" variant="outlined" multiline rows={4} required />

                    <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                    </Button>
                </form>

                {analysis && (
                    <Paper sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h6">Personality Analysis</Typography>
                        <pre>{JSON.stringify(analysis, null, 2)}</pre>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
};

export default PersonalityForm;