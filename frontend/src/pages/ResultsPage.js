import React, { useState } from "react";
import { TextField, Button, Container, Box } from "@mui/material";
import { getPersonalityProfile } from "../api";
import Results from "../components/Results";

const ResultsPage = () => {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);

  const fetchResults = async () => {
    console.log("fetchResults function called!"); // Debug log
    if (!email.trim()) {
      console.log("No email provided");
      return;
    }
  
    try {
      console.log("Fetching results for email:", email);
      const res = await getPersonalityProfile(email);
      
      console.log("API Response:", res.data); // Check API response
  
      if (!res.data || Object.keys(res.data).length === 0) {
        console.error("Empty or invalid API response");
        return;
      }
  
      setResults(res.data);
      console.log("Results set in state:", res.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };
  
  

  return (
    <Container maxWidth="md">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
      >
        <Box display="flex" gap={2} mb={3}>
          <TextField 
            label="Enter Email" 
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            sx={{ width: "300px" }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchResults}
          >
            Get Results
          </Button>
        </Box>
        
        {results && <Results results={results} />}
      </Box>
    </Container>
  );
};

export default ResultsPage;
