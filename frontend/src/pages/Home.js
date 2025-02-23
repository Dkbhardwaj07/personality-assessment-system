import React, { useState } from "react";
import PersonalityForm from "../components/PersonalityForm";
import Results from "../components/Results";

const Home = () => {
  const [results, setResults] = useState(null);
  return (
    <div>
      <PersonalityForm setResults={setResults} />
      {results && <Results results={results} />}
    </div>
  );
};

export default Home;
