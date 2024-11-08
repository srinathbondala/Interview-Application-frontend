import React, { useState } from 'react';
import { TextField, Button, Box,Link, Typography, Grid, ToggleButtonGroup, ToggleButton, Alert} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import loginImage from '/imgs/signup2.png';

const Login = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('USER');
    const [alert, setAlert] = useState(null); 
    // const [formData,setFormData]=useState({
    //     username:'',
    //     email:'',
    //     password:''
    // })
    

    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        password: '',
        position: '',
    });
    const [fNameError,setNameError]=useState("");
    const [fEmailError,setEmailError]=useState("");
    const [fPasswordError,setPasswordError]=useState("");
    function handleTypeChange(e, newUserType) {
        setUserType(newUserType);
    }

    function handleChange(e) {
        const { name, value,password } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        if (name === 'username') setNameError('');
        if (name === 'email') setEmailError('');
        if (name === 'password') setPasswordError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const endpoint = userType === 'USER' ? 'http://localhost:8080/auth/register' : 'http://localhost:8080/auth/admin/register';
            // console.log(formData)

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                
                if (!response.ok) {
                    if(response.status===400 && response.message==='User already exists'){
                        setAlert({ message: 'User Email Already Exists', severity: 'error' });
                    }
                    else if(response.status===400 && response.message==='Username already exists'){
                        setAlert({ message: 'UserName Already Exists', severity: 'error' });
                    }
                    else{
                        setAlert({ message: 'User Already Exists', severity: 'error' });
                        throw new Error('Network response was not ok');
                    }
                }
                setAlert(null); 

            const data = await response.json();
            console.log('User created:', data);

            // Clear the form data
            setFormData({
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                dateOfBirth: '',
                password: '',
                position: ''
            });

            // Navigate based on userType
            navigate(userType === 'USER' ? '/login' : '/login', { state: data });
        } catch (error) {
            console.error('Error creating user:', error);
            setAlert({ message: 'User Email (or) UserName Already Exists', severity: 'error' });
            // Handle errors (e.g., show error message)
        }
        }
    };


    const isStrongPassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%]/.test(password);


    const validateForm = () => {
        let isValid = true;

        if (!formData.username) {
            setNameError("Name is Required");
            isValid = false;
        }
        if (!formData.email) {
            setEmailError("Email is Required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setEmailError("Email is not valid");
            isValid = false;
        }
        if (!formData.password) {
            setPasswordError("Password is Required");
            isValid = false;
        }else if (!isStrongPassword(formData.password)) {
            setPasswordError("Password must be at least 8 characters long and include uppercase, lowercase, digit, and one of @, #, $, %.");
            isValid = false;
        }

        return isValid;
    };

    return (
        <>
            {alert && <Alert variant="filled" severity={alert.severity}>{alert.message}</Alert>}
            <Grid container sx={{
                minHeight: '80vh',  /* Ensures the form takes enough space */
                paddingBottom: '2rem'
            }}>
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7faff', padding: 4 }}>
                    <Box sx={{ maxWidth: 400, width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <AccountCircleIcon sx={{ fontSize: 50 }} />
                        </Box>
                        <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                            Get Started
                        </Typography>
                        <Typography variant='body1' sx={{ textAlign: 'center', mb: 2 }}>
                            Please enter the details to Register yourself:)
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            value={userType}
                            onChange={handleTypeChange}
                            sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                        >
                            <ToggleButton value="USER">User</ToggleButton>
                            <ToggleButton value="ADMIN">Admin</ToggleButton>
                        </ToggleButtonGroup>
                        <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
                            <Grid item xs={12} onSubmit={handleSubmit}>
                                <TextField
                                    error={!!fNameError}
                                label="Username"
                                    name="username"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    helperText={fNameError}
                                
                            />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!!fEmailError}
                                label="Email"
                                    name="email"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.email}
                                    onChange={handleChange}
                                    helperText={fEmailError}
                            />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={!!fPasswordError}
                                label="Password"
                                    name="password"
                                    type='password'
                                    fullWidth
                                    variant="outlined"
                                    value={formData.password}
                                    onChange={handleChange}
                                    helperText={fPasswordError}
                            />
                            </Grid>
                            {userType === "ADMIN" && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="Secret Key"
                                        name="secretKey"
                                        type='password'
                                        fullWidth
                                        variant="outlined"
                                        value={formData.secretKey}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}
                            {userType === "ADMIN" && (
                                <Grid item xs={12}>
                                    <TextField
                                        label="Position"
                                        name="position" 
                                        fullWidth
                                        variant="outlined"
                                        value={formData.position}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={6}>
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {userType === "USER" && ( 
                                <Grid item xs={12}>
                                    <TextField
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        type="date"
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }} 
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    sx={{ mt: 2, borderRadius: '20px' }} 
                                >
                                    Register <PersonAddAlt1Icon sx={{ ml: 1 }} />
                                </Button>
                            </Grid>
                            <Typography variant='body1' sx={{ textAlign: 'center', mb: 2,mt:2,ml:10}}>
                          Login Here: <Link href="/login">Click Here</Link>
                        </Typography>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            height: '100%',
                            backgroundImage: `url(${loginImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default Login;