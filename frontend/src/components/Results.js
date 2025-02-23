import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Results = ({ results }) => {
  console.log("Results prop:", results);
  if (!results) return null;

  const aggregateScores = (results) => {
    const totalScores = results.reduce((acc, result) => {
      acc.openness += result.openness || 0;
      acc.conscientiousness += result.conscientiousness || 0;
      acc.extraversion += result.extraversion || 0;
      acc.agreeableness += result.agreeableness || 0;
      acc.neuroticism += result.neuroticism || 0;
      return acc;
    }, {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    });

    const count = results.length;
    return [
      { trait: "Openness", score: totalScores.openness / count },
      { trait: "Conscientiousness", score: totalScores.conscientiousness / count },
      { trait: "Extraversion", score: totalScores.extraversion / count },
      { trait: "Agreeableness", score: totalScores.agreeableness / count },
      { trait: "Neuroticism", score: totalScores.neuroticism / count },
    ];
  };

  const data = aggregateScores(results);

  console.log("Chart Data:", data); // Debugging

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Personality Results
      </Typography>
      
      <Box display="flex" justifyContent="center">
        <ResponsiveContainer width="90%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <XAxis dataKey="trait" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
};

export default Results;