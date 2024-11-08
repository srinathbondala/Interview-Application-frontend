import { Paper, Grid, Container, Box,Pagination,Typography, Button } from "@mui/material";
import UserCard from "../components/User/UserCard";
import { useState, useEffect } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from "axios";

const AllCompanies = ({islogged}) => {
    const [data,setData]=useState([]);
    useEffect(() => {
        // axios.get('http://localhost:8080/user/get-all-jobs',{
        //     headers: {
        //         Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        //     }
        axios.get('http://localhost:8080/auth/top-company').then(
            response => {
                setData(response.data);
            }
        ).catch(error => {
            console.error(error);
        })
    }, [])
    const handleBackClick = () => {
        window.history.back();
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Button variant="text" color="primary" onClick={handleBackClick}>
                    <ArrowBackIcon/>
                </Button>
            </Box>
            <Container sx={{ marginTop: 2, flexWrap: "wrap" }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        gap: '1rem',
                    }}
                >
                    {/* Cards Section */}
                    <Grid container spacing={2}>
                        {data.map((item, index) => (
                            <Grid item xs={12} sm={6} md={6} key={index}>
                                {/* <Paper elevation={3}> */}
                                    <UserCard {...item._id} islogged={islogged}/>
                                {/* </Paper> */}
                            </Grid>
                        ))}
                        {/* <Pagination count={10} color="primary" /> */}
                    </Grid>
                </Box>
            </Container>      
        </>
    );
};

export default AllCompanies;



