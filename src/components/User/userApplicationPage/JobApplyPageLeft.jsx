import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box, Divider } from '@mui/material';

function JobApplyPageLeft() {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/user/get-by-id/${jobId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setJobDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 2, width: '70%', bgcolor: 'white', flexGrow: 1, borderRadius: 1 }}>
      <Typography variant="h5">{jobDetails?.role}</Typography>
      <Typography variant="subtitle1">{jobDetails?.companyName}</Typography>
      <Divider sx={{ my: 2, background:"black" }} />
      <Box>
        <Typography variant="body1"><strong>Location:</strong> {jobDetails?.location}</Typography>
        <Typography variant="body1"><strong>Employment Type:</strong> {jobDetails?.employmentType}</Typography>
        <Typography variant="body1"><strong>CTC:</strong> {jobDetails?.salaryRange}</Typography>
        <Typography variant="body1"><strong>Experience:</strong> {jobDetails?.experienceRange}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1"><strong>Description:</strong></Typography>
        <Typography variant="body2">{jobDetails?.description}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1"><strong>Bond Details:</strong> {jobDetails?.bondDetails}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1"><strong>Registration Ended:</strong> {jobDetails?.registrationEnded}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1"><strong>Eligible Criteria:</strong></Typography>
        <Typography variant="body2">{jobDetails?.eligibilityCriteria}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1"><strong>Selection Process:</strong></Typography>
        <Typography variant="body2">{jobDetails?.selectionProcess}</Typography>
        <Divider sx={{ my: 2 }} />
      </Box>
    </Paper>
  );
}

export default JobApplyPageLeft;
