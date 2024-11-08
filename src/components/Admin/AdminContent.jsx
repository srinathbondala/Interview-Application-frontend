import { Paper, Grid, Container, Box ,TextField, Button, Typography} from "@mui/material";
import SimpleCard from "./AdminCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import Form from "./AdminForm"; // Import your form component

const MainBody = () => {
    const navigation = useNavigate();
    const [data,setData]=useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        if(localStorage.getItem('userType')!=="admin"|| !localStorage.getItem('jwtToken'))
        {
            navigation('/');
        }
        const token = Cookies.get('token');
        if (!token) {
            alert('authenticated id have expired. Please login again');
            navigation('/login');
        }
        axios.get('http://localhost:8080/auth/top-company').then(
            response => {
                setData(response.data);
                setFilteredData(response.data);
                console.log(response.data);
            }
        ).catch(error => {
            setError('Failed to fetch data.');
            console.error(error);
        })
    }, [navigation]);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() !== '') {
            const filtered = data.filter(company => 
                company._id.companyName.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    return (
        <Container sx={{ marginTop: 2 ,flexWrap:"wrap" }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: 2,
                }}
            >
                <TextField
                    label="Search by Company Name"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </Box>
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
                    {filteredData.map((item, index) => (
                        <Grid item xs={12} sm={6} md={6} key={index}>
                            {/* <Paper elevation={3}> */}
                                <SimpleCard {...item} />
                            {/* </Paper> */}
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default MainBody;
