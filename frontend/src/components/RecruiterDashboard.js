import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  TablePagination,
} from "@mui/material";

const RecruiterDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/personality-profile");
      setCandidates(response.data);
      setFilteredCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Search & Filter Function
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    const filtered = candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(value) ||
        candidate.email.toLowerCase().includes(value)
    );
    setFilteredCandidates(filtered);
    setPage(0); // Reset pagination
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2>Recruiter Dashboard</h2>

      {/* Search Bar */}
      <TextField
        label="Search by Name or Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearch}
      />

      {/* Loading State */}
      {loading && <CircularProgress />}
      
      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Table */}
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell>Openness</TableCell>
                <TableCell>Conscientiousness</TableCell>
                <TableCell>Extraversion</TableCell>
                <TableCell>Agreeableness</TableCell>
                <TableCell>Neuroticism</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.openness}</TableCell>
                    <TableCell>{candidate.conscientiousness}</TableCell>
                    <TableCell>{candidate.extraversion}</TableCell>
                    <TableCell>{candidate.agreeableness}</TableCell>
                    <TableCell>{candidate.neuroticism}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredCandidates.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default RecruiterDashboard;
