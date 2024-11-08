import React from 'react';
import { Box, Button, Avatar, Typography } from '@mui/material';

const UserSideBar = ({ user, onProfileClick, onTopCompaniesClick, onJobsClick}) => {
    return (
        <Box 
            sx={{ 
                marginTop: 7,
                borderRadius: 2,
                minWidth: '250px', 
                height: '60vh', 
                display: 'flex', 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                flexDirection: 'column', 
                alignItems: 'center', 
                padding: '16px', 
                boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.3)'
            }}
        >
            <Avatar 
                sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 2 
                }} 
                src={'/imgs/boy.jpg'} 
            />
            <Typography variant="h6" sx={{ mb: 2 }}>
                {JSON.parse(localStorage.getItem('Details')).username}
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mb: 1 }} 
                onClick={onProfileClick}
            >
                Profile
            </Button>
            <Button 
                variant="outlined" 
                color="secondary" 
                fullWidth 
                sx={{ mb: 1 }} 
                onClick={onJobsClick}
            >
                Applied Jobs
            </Button>
            <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                onClick={onTopCompaniesClick}
            >
                Top Companies
            </Button>
        </Box>
    );
};

export default UserSideBar;
