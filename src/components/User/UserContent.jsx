import { Paper, Grid, Container, Box, Typography, Button, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Snackbar, Alert } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import UserCard from "./UserCard";
import { useState, useEffect } from "react";
import axios from "axios";
import useToken from "../../useToken";

const UserContent = ({ islogged }) => {
    const { token } = useToken();

    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/auth/get-all-jobs', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [token]);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = data.filter(item =>
            item.companyName.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    const handleAddSkill = () => {
        if (skillInput && !selectedSkills.includes(skillInput)) {
            setSelectedSkills([...selectedSkills, skillInput]);
            setSkillInput('');
        }
    };

    const handleDeleteSkill = (skillToDelete) => {
        const updatedSkills = selectedSkills.filter(skill => skill !== skillToDelete);
        setSelectedSkills(updatedSkills);
        fetchJobsBySkills(updatedSkills);
    };

    const fetchJobsBySkills = (skills) => {
        if (skills.length === 0) {
            setFilteredData(data);
            return;
        }
        axios.get(`http://localhost:8080/user/get-job-by-skills`, {
            params: { skills: skills.join(',') },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            setFilteredData(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    };

    const applySkillsFilter = () => {
        if (selectedSkills.length === 0) {
            setOpenSnackbar(true);
            return;
        }
        fetchJobsBySkills(selectedSkills);
        setOpenFilter(false);
    };

    return (
        <>
            <Typography variant="h4" align="center">
                Top Companies
            </Typography>

            <Container sx={{ marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search by company name or role"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <IconButton onClick={() => setOpenFilter(true)} sx={{ ml: 2 }}>
                    <FilterListIcon />
                </IconButton>
            </Container>

            <Container sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {selectedSkills.map((skill, index) => (
                    <Chip key={index} label={skill} onDelete={() => handleDeleteSkill(skill)} />
                ))}
            </Container>

            <Container sx={{ marginTop: 2, flexWrap: "wrap" }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        gap: '1rem',
                    }}
                >
                   <Grid container spacing={2}>
                        {Array.isArray(filteredData) && filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <Grid item xs={12} sm={6} md={6} key={index}>
                                    <UserCard {...item} islogged={islogged} />
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" align="center" sx={{ width: '100%', mt: 3 }}>
                                No jobs found matching the selected criteria.
                            </Typography>
                        )}
                    </Grid>
                </Box>

                <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {token ? (
                        <Button variant="outlined" sx={{ mt: 3, mr: 1 }} component="a" href="/user/all">
                            View all companies
                        </Button>
                    ) : (
                        <Button variant="outlined" sx={{ mt: 3, mr: 1 }} component="a" href="/login">
                            View all companies
                        </Button>
                    )}
                </Container>
            </Container>

            <Dialog open={openFilter} onClose={() => setOpenFilter(false)}>
                <DialogTitle>Select Skills</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            label="Add skill"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                            fullWidth
                        />
                        <IconButton onClick={handleAddSkill}>
                            <AddCircleOutline />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {selectedSkills.map((skill, index) => (
                            <Chip key={index} label={skill} onDelete={() => handleDeleteSkill(skill)} />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFilter(false)}>Cancel</Button>
                    <Button onClick={applySkillsFilter} variant="contained">Apply</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
                    Please add at least one skill before applying the filter.
                </Alert>
            </Snackbar>
        </>
    );
};

export default UserContent;
