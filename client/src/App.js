import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, Paper, Snackbar, Alert, Divider } from '@mui/material';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [voterId, setVoterId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [punongBarangayId, setPunongBarangayId] = useState('');
  const [selectedKagawad, setSelectedKagawad] = useState([]);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // State to control success/error type
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/candidates');
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  const handleAddVoter = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/voters', {
        firstName: firstName,
        lastName: lastName,
        voterId: voterId,
      });
      setMessage(`Voter added successfully: ${response.data.firstName} ${response.data.lastName}`);
      setAlertType('success'); // Set alert type to success
      setOpenSnackbar(true);
      // Clear voter input fields after successful addition
      setFirstName('');
      setLastName('');
      setVoterId('');
    } catch (error) {
      setMessage(`Error adding voter: ${error.response?.data?.error || error.message}`);
      setAlertType('error'); // Set alert type to error
      setOpenSnackbar(true);
    }
  };

  const handleCastVote = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/votes', {
        voterId: voterId,
        punongBarangayId: punongBarangayId,
        kagawadIds: selectedKagawad,
      });
      setMessage(`${response.data.message}`);
      setAlertType('success'); // Set alert type to success
      setOpenSnackbar(true);
    } catch (error) {
      // Display the error message from the backend response
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage('An error occurred while casting your vote.');
      }
      setAlertType('error'); // Set alert type to error
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      {/* Add Voter Section */}
      <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
        <Typography variant="h5" gutterBottom align="center">Add New Voter</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Voter ID"
              fullWidth
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddVoter}
              disabled={!firstName || !lastName || !voterId} // Disable button if fields are empty
            >
              Add Voter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Voting Section */}
      <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
        <Typography variant="h4" gutterBottom align="center">E-Voting System</Typography>

        {/* Display Candidates */}
        <Typography variant="h5" gutterBottom>Available Candidates</Typography>
        {candidates.length === 0 ? (
          <Typography>Loading candidates...</Typography>
        ) : (
          <>
            <FormControl component="fieldset" sx={{ marginBottom: 4 }}>
              <FormLabel component="legend">Punong Barangay</FormLabel>
              <RadioGroup
                aria-label="punongBarangay"
                value={punongBarangayId}
                onChange={(e) => setPunongBarangayId(e.target.value)}
              >
                {candidates.filter(candidate => candidate.position === "PunongBarangay").map((candidate) => (
                  <FormControlLabel
                    key={candidate._id}
                    value={candidate._id}
                    control={<Radio />}
                    label={`${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {candidates.filter(candidate => candidate.position !== "PunongBarangay").length > 0 && (
              <FormControl component="fieldset" sx={{ marginBottom: 4 }}>
                <FormLabel component="legend">Kagawad</FormLabel>
                <Grid container spacing={2}>
                  {candidates.filter(candidate => candidate.position !== "PunongBarangay").map((candidate) => (
                    <Grid item xs={12} sm={6} key={candidate._id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={candidate._id}
                            checked={selectedKagawad.includes(candidate._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (selectedKagawad.length < 7) {
                                  setSelectedKagawad([...selectedKagawad, e.target.value]);
                                }
                              } else {
                                setSelectedKagawad(selectedKagawad.filter(id => id !== e.target.value));
                              }
                            }}
                          />
                        }
                        label={`${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormControl>
            )}
          </>
        )}

        {/* Cast Vote Button */}
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={handleCastVote}
          disabled={!voterId || !punongBarangayId} // Disable if no voter or candidate selected
        >
          Cast Vote
        </Button>
      </Paper>

      {/* Snackbar for Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
