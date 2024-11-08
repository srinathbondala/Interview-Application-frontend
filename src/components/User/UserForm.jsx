import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box, Grid, Chip, MenuItem, IconButton, Snackbar } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { Step, Stepper, StepLabel } from '@mui/material';
import axios from 'axios';
const UserForm = () => {
  const location = useLocation()
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('Details'))||{});
  const experienceRanges = ['0-1 years', '2-3 years', '3-5 years', '5+ years'];
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    dob: '',
    phonenumber: '',
    address: '',
    // Initialize academic details
    college: '',
    grade: '',
    branch: '',
    passedoutyear: '',
    // Initialize professional details
    role: '',
    skills: [],
    achievements: [],
    resume: null,
    // Initialize intermediate details
    intermediate: '',
    intermediate_grade: '',
    intermediate_stream: '',
    intermediate_year: '',
    // Initialize school details
    school: '',
    school_grade: '',
    school_year: '',
    experience: '',
  });

  const [skillInput, setSkillInput] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (userData) {
      setFormData((prevData) => ({
        ...prevData,
        firstname: userData.firstName || '',
        lastname: userData.lastName || '',
        email: userData.email || '',
        dob: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().substring(0, 10) : '',
        phonenumber: userData.phone || '',
        address: userData.address || '',
        college: userData.acadamicDetailsKey?.education?.college || '',
        grade: userData.acadamicDetailsKey?.education?.grade || '',
        branch: userData.acadamicDetailsKey?.education?.branch || '',
        passedoutyear: userData.acadamicDetailsKey?.education?.passingYear || '',
        role: userData.profactionalDetailsKey?.interestedRole || '',
        skills: userData.profactionalDetailsKey?.skills || [],
        achievements: userData.profactionalDetailsKey?.achievements || [],
        intermediate: userData.acadamicDetailsKey?.intermediate?.institute || '',
        intermediate_grade: userData.acadamicDetailsKey?.intermediate?.grade || '',
        intermediate_stream: userData.acadamicDetailsKey?.intermediate?.stream || '',
        intermediate_year: userData.acadamicDetailsKey?.intermediate?.passedYear || '',
        school: userData.acadamicDetailsKey?.school?.schoolName || '',
        school_grade: userData.acadamicDetailsKey?.school?.grade || '',
        school_year: userData.acadamicDetailsKey?.school?.passedYear || '',
        experience: userData.profactionalDetailsKey?.experience || '',
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };
  // console.log(userData);
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput)) {
      setFormData((prevState) => ({
        ...prevState,
        skills: [...prevState.skills, skillInput],
      }));
    }
    setSkillInput('');
  };

  const handleDeleteSkill = (skillToDelete) => {
    setFormData((prevState) => ({
      ...prevState,
      skills: prevState.skills.filter((skill) => skill !== skillToDelete),
    }));
  };
  const validateForm = () => {
    const { firstname, lastname, address, dob, phonenumber, college, grade, passedoutyear, role, achievements, experience, intermediate, intermediate_grade,
      intermediate_stream, intermediate_year, school,resume, school_grade, school_year } = formData;

    let errorMessages = [];

    if (page === 0) {
      if (!firstname || !lastname || !phonenumber || !address || !dob) {
        return 'All personal details are required.';
      }
    } else if (page === 1) {
      if (!college) errorMessages.push('College is required.');
      if (!grade) errorMessages.push('Grade is required.');
      if (!passedoutyear) errorMessages.push('Passing year is required.');
      if (!formData.branch) errorMessages.push('Branch is required.');
      if (!intermediate) errorMessages.push('Intermediate is required.');
      if (!intermediate_grade) errorMessages.push('Intermediate Grade is required.');
      if (!intermediate_year) errorMessages.push('Intermediate Year is required.');
      if (!intermediate_stream) errorMessages.push('Intermediate Stream is required.');
      if (!school) errorMessages.push('School is required.');
      if (!school_grade) errorMessages.push('School Grade is required.');
      if (!school_year) errorMessages.push('School Year is required.');
    } else if (page === 2) {
      if (!role) errorMessages.push('Role is required.');
      if (!achievements) errorMessages.push('Achievements are required.');
      if (!experience) errorMessages.push('Experience is required.');
      // if(!resume)errorMessages.push('need to upload resume');
      if (formData.skills.length === 0) errorMessages.push('At least one skill is required.');
    }

    return errorMessages.length > 0 ? errorMessages.join(' ') : null;
  };

  const handlePageChange = (direction) => {
    if (direction > 0) {
      const errorMessage = validateForm();
      if (errorMessage) {
        setSnackbarMessage(errorMessage);
        setSnackbarOpen(true);
        return;
      }
    }
    setPage((prev) => prev + direction);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
      return;
    }

    const requestBody = {
        personalData: {
            firstName: formData.firstname,
            lastName: formData.lastname,
            phone: formData.phonenumber,
            address: formData.address,
            dateOfBirth: formData.dob,
        },
        educationData: {
          education: {
            college: formData.college,
            grade: formData.grade,
            passingYear: formData.passedoutyear,
            branch: formData.branch
          },
          intermediate: {
            institute: formData.intermediate,
            stream: formData.intermediate_stream,
            grade: formData.intermediate_grade,
            passedYear: formData.intermediate_year
          },
          school: {
            schoolName: formData.school,
            grade: formData.school_grade,
            passedYear: formData.school_year
          }
        },
        professionalData: {
            role: formData.role,
            skills: formData.skills,
            achievements: formData.achievements,
            experience: formData.experience,
            resume: formData.resume ? formData.resume.name : null,
        },
      }

    const token = localStorage.getItem('jwtToken');

    try {
      const response = await axios.put('http://localhost:8080/user/update-profile', requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSnackbarMessage('Form submitted successfully!');
      localStorage.setItem('Details',JSON.stringify(response.data));
      console.log(response.data);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      setSnackbarMessage('Failed to submit form. Please try again.');
      setSnackbarOpen(true);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const renderPersonalDetails = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Personal Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField label="Firstname" name="firstname" fullWidth value={formData.firstname} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Lastname" name="lastname" fullWidth value={formData.lastname} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleChange} />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Date of Birth" fullWidth type="date" name="dob" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Phone number" name="phonenumber" fullWidth value={formData.phonenumber} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Address" multiline rows={4} name="address" fullWidth value={formData.address} onChange={handleChange} required />
        </Grid>
      </Grid>
    </Box>
  );

  const renderAcademicDetails = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Education</Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField label="College" name="college" fullWidth value={formData.college} onChange={handleChange} required />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Grade" name="grade" fullWidth value={formData.grade} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Passing year" name="passedoutyear" fullWidth value={formData.passedoutyear} onChange={handleChange} required />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Branch" name="branch" fullWidth value={formData.branch} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Intermediate (Class 12)" name="intermediate" value={formData.intermediate} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Stream" name="intermediate_stream" value={formData.intermediate_stream} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Grade" name="intermediate_grade" value={formData.intermediate_grade} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Passed year" name="intermediate_year" value={formData.intermediate_year} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={12}>
          <TextField label="School (Class 10)" name="school" value={formData.school} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Grade" name="school_grade" value={formData.school_grade} onChange={handleChange} fullWidth required />
        </Grid>
        <Grid item xs={4}>
          <TextField label="Passed year" name="school_year" value={formData.school_year} onChange={handleChange} fullWidth required />
        </Grid>
      </Grid>
    </Box>
  );

  const renderProfessionalDetails = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Professional Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Interested role" name="role" fullWidth value={formData.role} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Add skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                fullWidth
              />
              <IconButton onClick={handleAddSkill}>
                <AddCircleOutline />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.skills.map((skill, index) => (
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
        <Grid item xs={12}>
          <TextField label="Achievements" name="achievements" fullWidth value={formData.achievements} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" fullWidth component="label">
            Upload Resume
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {formData.resume && <Typography variant="body2" sx={{ mt: 1 }}>{formData.resume.name}</Typography>}
        </Grid>
      </Grid>
    </Box>
  );

  const reviewProfile = () => (
    <Box>
      <Typography variant="h5" gutterBottom>Review Your Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Personal Details</Typography>
          <Typography>Firstname: {formData.firstname}</Typography>
          <Typography>Lastname: {formData.lastname}</Typography>
          <Typography>Email: {formData.email}</Typography>
          <Typography>Address: {formData.address}</Typography>
          <Typography>Phone Number: {formData.phonenumber}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Academic Details</Typography>
          <Typography>College: {formData.college}</Typography>
          <Typography>Grade: {formData.grade}</Typography>
          <Typography>intermediate: {formData.intermediate}</Typography>
          <Typography>intermediate_grade: {formData.intermediate_grade}</Typography>
          <Typography>intermediate_stream: {formData.intermediate_stream}</Typography>
          <Typography>intermediate_year: {formData.intermediate_year}</Typography>
          <Typography>school: {formData.school}</Typography>
          <Typography>school_grade: {formData.school_grade}</Typography>
          <Typography>school_year: {formData.school_year}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Professional Details</Typography>
          <Typography>Role: {formData.role}</Typography>
          <Typography>Experiance: {formData.experience}</Typography>
          <Typography>Skills: {formData.skills}</Typography>
          <Typography>Achievements: {formData.achievements}</Typography>
          {formData.resume && <Typography>Resume: {formData.resume.name}</Typography>}
        </Grid>
      </Grid>
    </Box>
  );
  const steps = ['Personal Details', 'Academic Details', 'Professional Details', 'Review'];
  return (
    <>
      <Typography variant="h4" align="center">
        Profile
      </Typography>
      <Stepper activeStep={page} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ p: 4, backgroundColor: '#f7faff', borderRadius: 2, padding: 2, mx: 'auto', mt: 4, maxWidth: '80vw',mb: 4}}>
        <form onSubmit={(e)=>{handleSubmit(e)}}>
          {page === 0 && renderPersonalDetails()}
          {page === 1 && renderAcademicDetails()}
          {page === 2 && renderProfessionalDetails()}
          {page === 3 && reviewProfile()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            {page > 0  ? (
              <Button variant="contained" onClick={() => handlePageChange(-1)}>Previous</Button>
            ) : (
              <Box sx={{ width: '100px' }} /> 
            )}
            {page < 3 ? (
              <Button variant="contained" onClick={() => handlePageChange(1)} type='button' >Next</Button>
            ) : (
              <Button variant="contained" type="submit">Submit</Button>
            )}
          </Box>
        </form>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Box>
    </>
  );
};

export default UserForm;