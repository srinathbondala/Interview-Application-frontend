import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Grid,Link, ToggleButtonGroup, ToggleButton } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import loginImage from '/imgs/login2.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useToken from '../useToken';

const Login = ({logincallback}) => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null); 
    const [userType, setUserType] = useState('USER');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { saveToken } = useToken();
    const [fEmailError, setEmailError] = useState("");
    const [fPasswordError, setPasswordError] = useState("");

    const handleTypeChange = (e, newUserType) => {
        if (newUserType !== null) { 
            setUserType(newUserType);
            setFormData({ email: '', password: '' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email') setEmailError('');
        if (name === 'password') setPasswordError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const endpoint = userType === 'USER' ? 'http://localhost:8080/auth/login' : 'http://localhost:8080/auth/admin/login';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Login successful:', data)
                console.log(data);
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('Details',JSON.stringify(data.user));
                saveToken(data.token);
                localStorage.setItem('userType', userType==="USER"?"user":"admin");
                // Clear form data
                setFormData({ email: '', password: '' });
                setAlert(null); 
                logincallback(userType==="USER"?"user":"admin");
                console.log(userType);
                navigate(userType === 'USER' ? '/user' : '/admin', { state: data });
            } catch (error) {
                setAlert({ message: 'Please check your password (or) Sign Up before login', severity: 'error' });
                console.error('Error logging in:', error);
            }
        }
    };

    const isStrongPassword = (password) =>
        password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%]/.test(password);

    const validateForm = () => {
        let isValid = true;

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
        } else if (!isStrongPassword(formData.password)) {
            setPasswordError("Password must be at least 8 characters long and include uppercase, lowercase, digit, and one of @, #, $, %.");
            isValid = false;
        }

        return isValid;
    };
    return (
        <>
            {alert && <Alert variant="filled" severity={alert.severity}>{alert.message}</Alert>}
          
                <Grid container sx={{ height: '90vh' }}>
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
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7faff', padding: 4 }}>
                    <Box sx={{ maxWidth: 400, width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <AccountCircleIcon sx={{ fontSize: 50 }} />
                        </Box>
                        <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                            Welcome Again
                        </Typography>
                        <Typography variant='body1' sx={{ textAlign: 'center', mb: 2 }}>
                            Please enter your details to login:
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
                        <form onSubmit={handleSubmit}>
                            <TextField
                                error={!!fEmailError}
                                label="Email"
                                name="email"
                                type='email'
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleChange}
                                helperText={fEmailError}

                            />
                            <TextField
                                error={!!fPasswordError}
                                label="Password"
                                name="password"
                                type='password'
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={formData.password}
                                onChange={handleChange}
                                helperText={fPasswordError}

                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, borderRadius: '20px' }} // Rounded border
                            >
                                Login <LoginIcon sx={{ ml: 1 }} />
                            </Button>
                        </form>
                        <Typography variant='body1' sx={{ mt:2 }}>
                           Sign Up Here: <Link href="/signup">Click Here</Link>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default Login;