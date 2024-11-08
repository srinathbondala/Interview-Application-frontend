import React, { useEffect, useState } from 'react';
import { Button, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid2, MenuItem, Select , IconButton} from "@mui/material";
import { Snackbar, Alert } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Remarks = ({ id, commentArray, setComments, userName, email, jobRole , status, setStatus, company, setSheduledDateTime,sheduledDateTime, phone}) => { 
    const [remarks, setRemarks] = useState(''); 
    const [open, setOpen] = useState(false);
    const [template, setTemplate] = useState('');
    const [dialogType, setDialogType] = useState('');
    const statuses = ["Pending", "Accepted", "Shortlisted", "Rejected", "Selected"];
    const [localStatus, setLocalStatus] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [subject, setSubject] = useState('');
    
    // State for interview scheduling
    // const [interviewDate, setInterviewDate] = useState('');
    // const [interviewTime, setInterviewTime] = useState('');
    const [interviewDateTime, setInterviewDateTime] = useState(''); 

    useEffect(() => {
        setLocalStatus(status);
    }, [status]);

    const notificationTemplate = `

    Dear ${userName},

    We hope this email finds you well. We would like to inform you that the status of your job application for the role of ${jobRole} has been updated to ${status}.

    Please log in to your account to view the details.

    If you have any questions, feel free to reach out to us.

    Thank you for your interest in joining ${company}.

    Best regards,
    Application Track Team
    applicationTrack@gmail.com`;

    const interviewTemplate = `
    Subject: Interview Invitation for ${jobRole} at ${company}

    Dear ${userName},

    We are pleased to inform you that you have been shortlisted for the next phase of our recruitment process for the position of ${jobRole} at ${company}.

    We would like to invite you for an interview, scheduled as follows:
    - Date and Time: ${interviewDateTime}
    - Mode: [Online/Offline]
    - Location: [If applicable]

    Please confirm your availability for the interview at your earliest convenience. If you have any questions or need further information, feel free to contact us.

    We look forward to speaking with you soon.

    Best regards,
    Application Track Team
    applicationTrack@gmail.com`;

    useEffect(() => {
        if(!Array.isArray(commentArray)) {
            setComments([]);
        }
    }, [commentArray]);

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setTemplate(type === 'notification' ? notificationTemplate : interviewTemplate);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTemplate(''); 
        setSubject('');
    };

    // const handleSend = () => {
    //     if (dialogType === 'notification') {
    //         console.log('Notification Sent:', template);
    //     } else if (dialogType === 'interview') {
    //         console.log('Interview Scheduled with details:', template);
    //     }
    //     handleClose();
    // };

    const handleSend = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            let response;
            
            if (dialogType === 'notification') {
                response = await fetch(`https://interview-application-backend.onrender.com/admin/send-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify({
                        email: email,
                        subject: subject,
                        text: template,
                    }),
                });
            } else if (dialogType === 'interview') {
                console.log(id);
                response = await fetch(`https://interview-application-backend.onrender.com/admin/sheduled-date-time/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify({
                        email: email,
                        subject: `Interview Invitation for ${jobRole}`,
                        text: template,
                        sheduledDateTime: interviewDateTime,
                    }),
                });
            }
    
            if (response.ok) {
                const data = await response.json();
                console.log(dialogType === 'notification' ? 'Notification Sent' : 'Interview Scheduled', data);
                setSnackbarMessage(dialogType === 'notification' ? 'Notification sent successfully' : 'Interview scheduled successfully');
                setSnackbarSeverity('success');
                if(dialogType === 'interview') {
                    setSheduledDateTime([...sheduledDateTime, interviewDateTime]);
                }
                setOpenSnackbar(true);
                console.log(email);
            } else {
                if (response.status === 401) {
                    alert('Jwt expired. Please login again.');
                    window.location.href = '/login';
                } else {
                    console.error('Failed to send email');
                    setSnackbarMessage('Failed to send email');
                    setSnackbarSeverity('error');
                    setOpenSnackbar(true);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage('An error occurred while sending');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            handleClose();
        }
    };
    

    const handleAddRemark = async () => {
        try {
            setRemarks("");
            const jwtToken = localStorage.getItem('jwtToken');
            const response = await fetch(`https://interview-application-backend.onrender.com/admin/add-comment/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ comment: remarks })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Remark added successfully: ', data);
                setComments([...commentArray, data.newComment]);
            } else {
                if (response.status === 401) {
                    alert('Jwt expired. Please login again.');
                    window.location.href = '/login';
                }
                console.error('Failed to add remark');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSaveStatus = async () => {
        try {
            const jwtToken = localStorage.getItem('jwtToken');
            const response = await fetch(`https://interview-application-backend.onrender.com/admin/change-status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ status: localStatus, latestChangesAt: new Date() })
            });

            if (response.ok) {
                const updatedApplication = await response.json();
                setStatus(localStatus);
                console.log('Status updated successfully:');
            } else {
                if (response.status === 401) {
                    alert('Jwt expired. Please login again.');
                    window.location.href = '/login';
                }
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleChange = (event) => {
        setLocalStatus(event.target.value);
    };

    return (
        <div className="remarks">
            <div style={{ padding: "10px" }}>
                <h3>Remarks</h3>
                {commentArray.map((value, index) => (
                    <Paper key={index} sx={{ display: "flex", justifyContent: "space-between", padding: "16px", marginBottom: "16px" }}>
                        <Typography><strong>{index + 1}.  </strong>{value.comment}</Typography>
                        <Typography variant="body2">{value.timestamp.toString()}</Typography>
                    </Paper>
                ))}
                <h4>Change Status</h4>
                <Grid2 container spacing={2} alignItems="center">
                    <Grid2 item xs={12} sm={5}>
                        <Select
                            fullWidth
                            value={localStatus}
                            onChange={handleChange}
                            sx={{ padding: "4px", height: "40px", width: "200px", background: "white" }}
                        >
                            {statuses.map((option) => (
                                <MenuItem 
                                    key={option} 
                                    value={option} 
                                    disabled={statuses.indexOf(option) < statuses.indexOf(status)}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid2>

                    <Grid2 item xs={12} sm={7} sx={{ textAlign: { xs: "center", sm: "right" } }}>
                        <Button variant="contained" color="primary" sx={{ margin: "10px 5px" }} onClick={handleSaveStatus}>
                            Save Status
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ margin: "10px 5px" }} 
                            onClick={() => handleOpenDialog('notification')}
                        >
                            Send Notification
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ margin: "10px 5px" }} 
                            onClick={() => handleOpenDialog('interview')}
                        >
                            Schedule Interview
                        </Button>
                        <IconButton
                            component="a"
                            href={`https://wa.me/${phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ ml: 1, fontSize: 'medium' }}
                        >
                            <WhatsAppIcon sx={{fontSize: 'x-large'}} color="success" />
                        </IconButton>
                    </Grid2>
                </Grid2>
            </div>
            <div style={{ padding: "10px" }}>
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks here..."
                    style={{ width: "100%", padding: "8px" }}
                />
                <Button variant="contained" color="primary" style={{ marginTop: "10px" }} onClick={handleAddRemark}>
                    Add Remark
                </Button>
            </div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" sx={{ '& .MuiDialog-paper': { height: '90%', maxHeight: '90%' } }}>
                <DialogTitle>{dialogType === 'notification' ? 'Send Notification' : 'Schedule Interview'}</DialogTitle>
                <hr />
                <DialogContent>
                    {dialogType === 'interview' && (
                        <TextField
                            label="Interview Date & Time"
                            type="datetime-local"
                            value={interviewDateTime}
                            onChange={(e) => setInterviewDateTime(e.target.value)}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ marginTop: '20px', marginBottom: '20px' }}
                        />
                    )}
                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{ marginTop: '20px', marginBottom: '20px' }}
                    />
                    <TextField
                        label={dialogType === 'notification' ? "Notification Template" : "Interview Schedule Template"}
                        multiline
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSend} color="primary">
                        {dialogType === 'notification' ? 'Send' : 'Schedule'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Remarks;