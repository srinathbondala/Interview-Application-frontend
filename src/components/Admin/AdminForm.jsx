import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Chip, IconButton, Grid, Snackbar } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AddIcon from '@mui/icons-material/Add';
import { AddCircleOutline } from '@mui/icons-material';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'

const Form = () => {
    useGSAP(() => {
        gsap.fromTo('.animatedForm', { x: '400', opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease:'back.in', stagger: 0.25, delay: 0.5 });
      })
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        experience: '',
        salary: '',
        location: '',
        technicalSkills: [],
        bondDetails: '',
        selectionProcess: '',
        eligibilityCriteria: '',
        skillInput: '',
        employmentType: '',
        description: '',
        registrationDeadline: '',  // Updated for date format
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const validateForm = () => {
        const {
            companyName, role, location, experience, salary, description, bondDetails, employmentType, eligibilityCriteria, selectionProcess, technicalSkills
        } = formData;
        
        if (!companyName) return 'Company Name is required';
        if (!role) return 'Role is required';
        if (!location) return 'Location is required';
        if (!experience) return 'Experience is required';
        if (!salary) return 'Salary is required';
        if (!description) return 'Description is required';
        if (!bondDetails) return 'Bond Details are required';
        if (!employmentType) return 'Employment type is required';
        if (!eligibilityCriteria) return 'Eligibility Criteria is required';
        if (!selectionProcess) return 'Selection Process is required';
        if (technicalSkills.length === 0) return 'At least one skill is required';
        return null;
    };

    const handleSubmit = async (e) => {
        window.location.reload();
        e.preventDefault();
        handleAddSkill()
        const errorMessage = validateForm();
        if (errorMessage) {
            setSnackbarMessage(errorMessage);
            setSnackbarOpen(true);
            return;
        }
        try {
            const randomJobId = Math.floor(Math.random() * 10000);  // Generate job ID here
    
            const response = await fetch('http://localhost:8080/admin/add-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify({
                    ...formData,
                    jobId: randomJobId,  
                    registrationEnded: formData.registrationDeadline, 
                    experienceRange: formData.experience, 
                    salaryRange: formData.salary,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log(data);
    
            // Clear form data
            setFormData({
                companyName: '',
                role: '',
                experience: '',
                salary: '',
                location: '',
                technicalSkills: [],
                bondDetails: '',
                selectionProcess: '',
                eligibilityCriteria: '',
                skillInput: '',
                employmentType: '',
                description: '',
                registrationDeadline: '',
            });
        } catch (error) {
            console.error('Error:', error.message);
            setSnackbarMessage('Failed to submit the job data. Please try again later.');
            setSnackbarOpen(true);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddSkill = () => {
        if (formData.skillInput.trim() && !formData.technicalSkills.includes(formData.skillInput)) {
            setFormData((prevState) => ({
                ...prevState,
                technicalSkills: [...prevState.technicalSkills, formData.skillInput.trim()],
                skillInput: ''
            }));
        }
    };

    const handleDeleteSkill = (skillToDelete) => {
        setFormData((prevState) => ({
            ...prevState,
            technicalSkills: prevState.technicalSkills.filter(skill => skill !== skillToDelete)
        }));
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const experienceRanges = ['0-1 years', '2-3 years', '3-5 years', '5+ years'];
    const salaryRanges = ['2-3 LPA', '4-5 LPA', '6-9 LPA', '10+ LPA'];
    const employmentTypes = ['Remote', 'Full Time', 'Part Time'];

    return (
        <Box className='animatedForm' sx={{ mx: 'auto', mt: 4, backgroundColor: "#f7faff", borderRadius: 2, padding: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', textTransform: 'uppercase', backdropFilter: 'blur', display: "flex", alignItems: "center" }} gutterBottom>
                New Application <NoteAddIcon />
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Company Name"
                            name="companyName"
                            fullWidth
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Role"
                            name="role"
                            fullWidth
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Location"
                            name="location"
                            fullWidth
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            name="description"
                            fullWidth
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Bond Details"
                            name="bondDetails"
                            fullWidth
                            value={formData.bondDetails}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Employment Type"
                            name="employmentType"
                            fullWidth
                            value={formData.employmentType}
                            onChange={handleChange}
                        >
                            {employmentTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Experience"
                            name="experience"
                            fullWidth
                            value={formData.experience}
                            onChange={handleChange}
                        >
                            {experienceRanges.map((range) => (
                                <MenuItem key={range} value={range}>
                                    {range}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="Salary"
                            name="salary"
                            fullWidth
                            value={formData.salary}
                            onChange={handleChange}
                        >
                            {salaryRanges.map((range) => (
                                <MenuItem key={range} value={range}>
                                    {range}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TextField
                                    label="Technical Skills"
                                    name="skillInput"
                                    fullWidth
                                    value={formData.skillInput}
                                    onChange={handleChange}
                                />
                                <IconButton onClick={handleAddSkill}>
                                    <AddCircleOutline />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {formData.technicalSkills.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        onDelete={() => handleDeleteSkill(skill)}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Eligibility Criteria"
                            name="eligibilityCriteria"
                            fullWidth
                            value={formData.eligibilityCriteria}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Selection Process"
                            name="selectionProcess"
                            fullWidth
                            value={formData.selectionProcess}
                            onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Registration Deadline"
                                name="registrationDeadline"
                                type="date"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={formData.registrationDeadline}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<AddIcon />}
                                fullWidth
                            >
                                Add Job
                            </Button>
                        </Grid>
                    </Grid>
                </form>
    
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={snackbarMessage}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Box>
        );
    };
    
    export default Form;
    
