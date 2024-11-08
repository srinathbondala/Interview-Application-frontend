import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Grid, Paper, Container, Button, CircularProgress, Grid2, Card , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useToken from '../../useToken';
import Remarks from './Remarks';
const Application = () => {
    const { token } = useToken();
    if (!token) {
        alert('You need to login first');
        window.location = '/login';
    }
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentsState, setComments] = useState([]);
    const [presentStatus, setPresentStatus] = useState('');
    const [sheduledDateTime, setSheduledDateTime] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const jwtToken = localStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8080/admin/get-user-details/${id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                if(response.status !== 200){
                    if(response.status === 401){
                        alert("Jwt expired. Please login again.");
                        window.location.href = '/login';
                    }
                    alert("Something went wrong");
                }
                console.log(response.data);
                setApplications(response.data[0]);
                setPresentStatus(response.data[0].status);
                setComments(response.data[0].comments);
                setSheduledDateTime(response.data[0].sheduledDateTime);
            } catch (error) {
                console.error('Error:', error);
                setError('Error fetching application details.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchApplicationDetails();
    }, [id]);
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Box sx={{ padding: 3 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }
    const handleDisableUser = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/admin/disable-user/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
            if (res.status !== 200) {
                alert("Something went wrong");
            } else {
                alert("User disabled successfully");
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
        setOpenDialog(false); 
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleSuccess = async (id) => {
        try {
            const decision = confirm("Are you sure you want to accept this application?");
            if (decision) {
                const res = await axios.put(`http://localhost:8080/admin/accept-application/${id}`,{},{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                if(res.status !== 200){
                    alert("Something went wrong");
                }
                else{
                    alert("Application accepted successfully");
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleReject = async (id) => {
        try {
            const decision = confirm("Are you sure you want to Reject this application?");
            if (decision) {
                const res = await axios.put(`http://localhost:8080/admin/reject-application/${id}`,{},{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                if(res.status !== 200){
                    alert("Something went wrong");
                }
                else{
                    alert("Application rejected successfully");
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const { _id, userId, jobId, status, appliedDate, latestChangesAt} = applications || {};
    const { firstName, lastName, email, phone, address, dateOfBirth, acadamicDetailsKey, profactionalDetailsKey } = userId || {};
    const { education = {}, intermediate = {}, school = {} } = acadamicDetailsKey || {};
    const { skills = [], experience = 'Not provided', achievements = [] } = profactionalDetailsKey || {};

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Button onClick={() => { window.history.back(); }}>Back to Jobs</Button>
            <Divider />
            <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={1}>
                <Container>
                    <Grid2 container spacing={2} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
                            Application Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item><Typography><strong>Status:</strong>
                                {presentStatus === 'Applied' ? <Typography variant="h7" gutterBottom sx={{ color: 'green' }}> New Application</Typography> : (
                                    presentStatus === 'Rejected' ? <Typography variant="h7" gutterBottom sx={{ color: 'red' }}> Rejected</Typography> : <Typography variant="h7" gutterBottom sx={{ color: 'orange' }}> {presentStatus}</Typography>
                                )}
                            </Typography></Grid>
                            <Grid item><Typography><strong>Applied Date:</strong> {appliedDate ? new Date(appliedDate).toLocaleDateString() : 'Not provided'}</Typography></Grid>
                            <Grid item><Typography><strong>Last Updated:</strong> {latestChangesAt ? new Date(latestChangesAt).toLocaleDateString() : 'Not provided'}</Typography></Grid>
                        </Grid>
                    </Grid2>
                </Container>
                <hr />
                <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={1}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#424242' }}>
                        User Information
                    </Typography>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}><Typography><strong>Name:</strong> {firstName || 'Not provided'} {lastName || ''}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Email:</strong> {email || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Phone:</strong> {phone || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Address:</strong> {address || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Date of Birth:</strong> {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : 'Not provided'}</Typography></Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={1}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#424242' }}>
                        Academic Details
                    </Typography>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}><Typography><strong>College:</strong> {education.college || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Grade:</strong> {education.grade || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Passing Year:</strong> {education.passingYear || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Branch:</strong> {education.branch || 'Not provided'}</Typography></Grid>

                        <Grid item xs={12} sm={6}><Typography><strong>Intermediate Institute:</strong> {intermediate.institute || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Stream:</strong> {intermediate.stream || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Intermediate Grade:</strong> {intermediate.grade || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Passing Year:</strong> {intermediate.passedYear || 'Not provided'}</Typography></Grid>

                        <Grid item xs={12} sm={6}><Typography><strong>School Name:</strong> {school.schoolName || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Grade:</strong> {school.grade || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>School Passing Year:</strong> {school.passedYear || 'Not provided'}</Typography></Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={1}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#424242' }}>
                        Professional Details
                    </Typography>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}><Typography><strong>Skills:</strong> {skills.length ? skills.join(', ') : 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Experience:</strong> {experience || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Achievements:</strong> {achievements.length ? achievements.join(', ') : 'Not provided'}</Typography></Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={1}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#424242' }}>
                        Job Information
                    </Typography>
                    <hr />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}><Typography><strong>Role:</strong> {jobId.role || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Company Name:</strong> {jobId.companyName || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12} sm={6}><Typography><strong>Salary Range:</strong> {jobId.salaryRange || 'Not provided'}</Typography></Grid>
                        <Grid item xs={12}><Typography><strong>Description:</strong> {jobId.description || 'Not provided'}</Typography></Grid>
                    </Grid>
                </Paper>
                {
                    presentStatus === 'Applied' ? (
                        <Container>
                            <Button variant="contained" color="primary" onClick={() => { handleSuccess(_id) }} sx={{marginRight:"10px"}}>Accept</Button>
                            <Button variant="contained" color="error" onClick={() => { handleReject(_id) }}>Reject</Button>
                        </Container>
                    ):(
                        <Card sx={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
                            <Button 
                                variant='contained'
                                sx={{ margin: "10px 5px"}} 
                                onClick={handleDialogOpen}
                            >Disable User</Button>
                        </Card>
                    )
                }
                {
                    (presentStatus !== 'Applied' && presentStatus !== 'Rejected') && (
                        <Remarks id={id} commentArray={commentsState} setComments={setComments} userName={firstName+" "+lastName} email={email} jobRole={jobId.role} status={presentStatus} setStatus={setPresentStatus} company={jobId.companyName} setSheduledDateTime = {setSheduledDateTime} sheduledDateTime={sheduledDateTime} phone={phone}/>
                    )
                }
                <Dialog
                    open={openDialog}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm Disable User"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to disable this user? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button onClick={handleDisableUser} autoFocus>
                            Disable
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
            <Paper sx={{ padding: 3, marginBottom: 3 }} elevation={1}>
                {Array.isArray(sheduledDateTime) && sheduledDateTime.length > 0 ? (
                <>
                <Typography variant="h5" gutterBottom sx={{ color: '#424242' }}>
                    Interview Scheduling Details
                </Typography>

                {sheduledDateTime.map((dateTime, index) => (
                    <Grid container spacing={2} key={index}>
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Interview {index + 1}:</strong> {dateTime ? new Date(dateTime).toLocaleString() : 'Not provided'}
                        </Typography>
                    </Grid>
                    </Grid>
                ))}
                </>
            ) : (
                <Typography variant="h6" sx={{ color: '#9e9e9e' }}>
                No scheduling details available.
                </Typography>
            )}
            </Paper>
        </Box>
    );
};

export default Application;
