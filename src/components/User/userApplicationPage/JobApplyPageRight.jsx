// import {  Paper, Box, Typography, Button} from '@mui/material';
// import ShowProfileCompletion from './ShowProfileCompletion';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {useEffect, useState} from "react";
// function JobApplyPageRight({jobId}) {
//   const [areAllFieldsValid, setAreAllFieldsValid] = useState(false);
//   const [alreadyApplied, setAlreadyApplied] = useState(false);
//   const navigator = useNavigate();

//   useEffect(() => {
//     const userDetails = localStorage.getItem('Details');
//     if (userDetails) {
//       const userDetailsJson = JSON.parse(userDetails);
//       if (userDetailsJson.acadamicDetailsKey !==null && userDetailsJson.profactionalDetailsKey !==null) {
//         setAreAllFieldsValid(true);
//       }
//       userDetailsJson.jobApplicationKeys.forEach((jobApplicationKey) => {
//         if (jobApplicationKey == jobId) {
//           setAlreadyApplied(true);
//         }
//       });
//     }
//   }, []);
//   const applyJobByUser =async ()=>{
//       try {
//        if(confirm('Are you sure you want to apply for this job?')){
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
//                 'Content-Type': 'application/json'
//             }
//         };

//         const response = await axios.post('https://interview-application-backend.onrender.com/user/apply-job', { jobId }, config);
//         console.log('Job applied successfully:', response.data);
//         const userDetails = JSON.parse(localStorage.getItem('Details'));
//         userDetails.jobApplicationKeys.push(jobId);
//         localStorage.setItem('Details', JSON.stringify(userDetails));
//         alert(response.data.message);
//         navigator(-1);
//         return response.data;
//       }
//       } catch (error) {
//           console.log(error);
//           // console.error('Error applying for the job:', error.response ? error.response.data.error : error.message);
//           throw error;
//       }
//     }
//   return (
//     <Paper elevation={3} sx={{ p: 2 ,flexGrow: 1, bgcolor: 'white', minWidth: '200px',borderRadius: 1}}>
//         <Box sx={{textAlign:"center"}}>
//             <Typography variant="h6" align="center" gutterBottom> Apply For Job</Typography>
//             <hr />
//             {(areAllFieldsValid && !alreadyApplied) ? (<Button variant="contained" color="primary" fullWidth onClick={()=>{applyJobByUser(); }}>Apply</Button>) : (<>{alreadyApplied ?(<Typography variant="body1" align="center" sx={{color:"green"}} gutterBottom>Already Applied</Typography>):(<ShowProfileCompletion />) }</>)}   
//         </Box>
//     </Paper>
//   );
// }
// export default JobApplyPageRight;
import { Paper, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, Snackbar } from '@mui/material';
import ShowProfileCompletion from './ShowProfileCompletion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function JobApplyPageRight({ jobId }) {
  const [areAllFieldsValid, setAreAllFieldsValid] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = localStorage.getItem('Details');
    if (userDetails) {
      const userDetailsJson = JSON.parse(userDetails);
      if (userDetailsJson.acadamicDetailsKey !== null && userDetailsJson.profactionalDetailsKey !== null) {
        setAreAllFieldsValid(true);
      }
      userDetailsJson.jobApplicationKeys.forEach((jobApplicationKey) => {
        if (jobApplicationKey === jobId) {
          setAlreadyApplied(true);
        }
      });
    }
  }, [jobId]);

  const handleApplyJob = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post('https://interview-application-backend.onrender.com/user/apply-job', { jobId }, config);
      console.log('Job applied successfully:', response.data);
      const userDetails = JSON.parse(localStorage.getItem('Details'));
      userDetails.jobApplicationKeys.push(jobId);
      localStorage.setItem('Details', JSON.stringify(userDetails));
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
      setAlreadyApplied(true);
      return response.data;
    } catch (error) {
      // console.error('Error applying for the job:', error.response ? error.response.data.error : error.message);
      setSnackbarMessage('Error applying for the job. Please try again.');
      setSnackbarOpen(true);
      throw error;
    }
  };

  const handleConfirmApply = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (confirm) => {
    if (confirm) {
      handleApplyJob();
    }
    setOpenDialog(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, flexGrow: 1, bgcolor: 'white', minWidth: '200px', borderRadius: 1 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" align="center" gutterBottom>
          Apply For Job
        </Typography>
        <hr />
        {areAllFieldsValid && !alreadyApplied ? (
          <Button variant="contained" color="primary" fullWidth onClick={handleConfirmApply}>
            Apply
          </Button>
        ) : (
          <>
            {alreadyApplied ? (
              <Typography variant="body1" align="center" sx={{ color: 'green' }} gutterBottom>
                Already Applied
              </Typography>
            ) : (
              <ShowProfileCompletion />
            )}
          </>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => handleCloseDialog(false)}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to apply for this job?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleCloseDialog(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Paper>
  );
}

export default JobApplyPageRight;
