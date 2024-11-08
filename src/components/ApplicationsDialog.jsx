// ApplicationsDialog.jsx
import React from 'react';
import { useState , useEffect} from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    Grid2
} from '@mui/material';

const ApplicationsDialog = ({ open, onClose, companyName, jobId }) => {
    const [applicationsData, setApplicationsData] = useState({
        newApplications: [],
        progressApplications: [],
        rejectedApplications: []
    });
    const [loading, setLoading] = useState(true);
    const handleSuccess = async (id) => {
        try {
            const decision = confirm("Are you sure you want to accept this application?");
            if (decision) {
            const res = await axios.put(`http://localhost:8080/admin/accept-application/${id}`,{},{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
            const updatedNewApplications =[];
            let movedApplication = null;
            applicationsData.newApplications.forEach((app) => {
                if (app._id === id) {
                    app.status = 'Accepted';
                    movedApplication = app;
                } else {
                    updatedNewApplications.push(app);
                }
            });
            if (movedApplication) {
                setApplicationsData({
                    ...applicationsData,
                    newApplications: updatedNewApplications,
                    progressApplications: [...applicationsData.progressApplications, movedApplication]
                });
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
            const updatedNewApplications =[];
            let movedApplication = null;
            applicationsData.newApplications.forEach((app) => {
                if (app._id === id) {
                    app.status = 'Rejected';
                    movedApplication = app;
                } else {
                    updatedNewApplications.push(app);
                }
            });
            if (movedApplication) {
                setApplicationsData({
                    ...applicationsData,
                    newApplications: updatedNewApplications,
                    rejectedApplications: [...applicationsData.rejectedApplications, movedApplication]
                });
            }
        }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8080/admin/orderedJobs/${jobId}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
        })
            .then((res) => {
                setApplicationsData({
                    newApplications: res.data.applied,
                    progressApplications: res.data.others,
                    rejectedApplications: res.data.rejected,
                });
                // console.log(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [jobId]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#f4f4f4',
                    borderRadius: 4,
                    boxShadow: 4,
                    maxHeight: '85%',
                },
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                {companyName.toUpperCase()} Applications Overview
            </DialogTitle>
            <DialogContent sx={{ padding: '16px' }}>
            {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (    
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white', backgroundColor: '#1976d2', borderRadius: 2, pb: 1, padding: '8px 16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                New Applications
                            </Typography>
                            <Box sx={{ height: '60vh', overflowY: 'auto', padding: '8px', borderRadius: '8px' }}>
                                {applicationsData.newApplications.length===0 ? (<Paper>
                                    <Typography variant='body1' sx={{padding: 2}}>No Data Available</Typography>
                                </Paper>):<></>}
                                {applicationsData.newApplications.map((app, index) => (
                                    <Paper elevation={3} key={index} sx={{ padding: 2, mb: 2, borderRadius: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{app.userId.email}</Typography>
                                        <Typography variant="body2">Experience: {app.userId.profactionalDetailsKey.experience?app.userId.profactionalDetailsKey.experience: 'N/A' }</Typography>
                                        <Typography variant="body2">Achievements: {app.userId.profactionalDetailsKey.achievements.join(', ')}</Typography>
                                        <Typography variant="body2">Skills: {app.userId.profactionalDetailsKey.skills.join(', ')}</Typography>
                                        <Typography variant="body2">Grade: {app.userId.acadamicDetailsKey.education.grade}</Typography>
                                        <Typography variant="body2">Passing Year: {app.userId.acadamicDetailsKey.education.passingYear}</Typography>
                                        <Typography variant="body2">Stream: {app.userId.acadamicDetailsKey.education.branch}</Typography>

                                        <Divider sx={{ my: 1 }} />
                                        <Grid2 container gap={'5px'}>
                                            <Button variant="outlined" color="success" sx={{ mr: 1 }} onClick={()=>{handleSuccess(app._id)}}>Accept</Button>
                                            <Button variant="outlined" color="error" sx={{ mr: 1 }} onClick={()=>{handleReject(app._id)}}>Reject</Button>
                                            <Button variant="outlined" onClick={() => window.location.href = `/admin/application/${app._id}`}>View Data</Button>
                                        </Grid2>
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>

                        {/* Progress Column */}
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white', backgroundColor: '#8e8e8e', borderRadius: 2, pb: 1, padding: '8px 16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                In Progress
                            </Typography>
                            <Box sx={{ height: '60vh', overflowY: 'auto', padding: '8px', borderRadius: '8px' }}>
                            {applicationsData.progressApplications.length===0 ? (<Paper>
                                    <Typography variant='body1' sx={{padding: 2}}>No Data Available</Typography>
                                </Paper>):<></>}
                                {applicationsData.progressApplications.map((app, index) => (
                                    <Paper elevation={3} key={index} sx={{ padding: 2, mb: 2, borderRadius: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{app.userId.email}</Typography>
                                        <Typography variant="body2">Experience: {app.userId.profactionalDetailsKey.experience}</Typography>
                                        <Typography variant="body2">Achievements: {app.userId.profactionalDetailsKey.achievements.join(', ')}</Typography>
                                        <Typography variant="body2">Skills: {app.userId.profactionalDetailsKey.skills.join(', ')}</Typography>
                                        <Typography variant="body2">Grade: {app.userId.acadamicDetailsKey.education.grade}</Typography>
                                        <Typography variant="body2">Passing Year: {app.userId.acadamicDetailsKey.education.passingYear}</Typography>
                                        <Typography variant='body2'>Status: {app.status}</Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ height: '5px', backgroundColor: '#ccc', mt: 2, borderRadius: '5px' }}>
                                            <Box sx={{ width: '50%', height: '100%', backgroundColor: 'green', borderRadius: '5px' }} />
                                        </Box>
                                        <Grid2 container gap={'5px'} sx={{marginTop:'10px'}}>
                                            <Button variant="outlined" onClick={() => window.location.href = `/admin/application/${app._id}`}>View Application</Button>
                                        </Grid2>
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>

                        {/* Rejected Column */}
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white', backgroundColor: '#d93939', borderRadius: 2, pb: 1, padding: '8px 16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                                Rejected
                            </Typography>
                            <Box sx={{ height: '60vh', overflowY: 'auto', padding: '8px', borderRadius: '8px' }}>
                                {applicationsData.rejectedApplications.length===0 ? (<Paper>
                                    <Typography variant='body1' sx={{padding: 2}}>No Data Available</Typography>
                                </Paper>):<></>}
                                {applicationsData.rejectedApplications.map((app, index) => (
                                    <Paper elevation={3} key={index} sx={{ padding: 2, mb: 2, borderRadius: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{app.userId.email}</Typography>
                                        <Typography variant="body2">Experience: {app.userId.profactionalDetailsKey.experience}</Typography>
                                        <Typography variant="body2">Achievements: {app.userId.profactionalDetailsKey.achievements.join(', ')}</Typography>
                                        <Typography variant="body2">Skills: {app.userId.profactionalDetailsKey.skills.join(', ')}</Typography>
                                        <Typography variant="body2">Grade: {app.userId.acadamicDetailsKey.education.grade}</Typography>
                                        <Typography variant="body2">Passing Year: {app.userId.acadamicDetailsKey.education.passingYear}</Typography>
                                        <Typography variant='body2'>Status: {app.status}</Typography>
                                        <Box sx={{ height: '5px', backgroundColor: '#ccc', mt: 2, borderRadius: '5px' }}>
                                            <Box sx={{ width: '100%', height: '100%', backgroundColor: '#d93939', borderRadius: '5px' }} />
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Button variant="outlined" color="error">Rejected</Button>
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                )}
                </DialogContent>
            <DialogActions>
                <Button onClick={()=>{ window.location.href=`admin/user-applied/${jobId}`}} color="error" variant="outlined">
                    Explore
                </Button>
                <Button onClick={onClose} color="primary" variant="outlined">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApplicationsDialog;
