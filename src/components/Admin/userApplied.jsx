import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Container , Button} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'; 
import { useParams } from 'react-router-dom';
import useToken from '../../useToken';
const UserApplied = () => {
    const { token } = useToken();
    if (!token) {
        alert('You need to login first');
        window.location = '/login';
    }
    const { id } = useParams();
    const [data, setData] = useState([]);
    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        axios.get(`http://localhost:8080/admin/get-job-application/${id}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            console.log(response.data);
            setData(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, [id, token]);

    const columns = [
        { field: 'firstName', headerName: 'User Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'college', headerName: 'College', width: 150 },
        { field: 'grade', headerName: 'Grade', width: 100 },
        { field: 'passingYear', headerName: 'Passing Year', width: 120 },
        { field: 'branch', headerName: 'Branch', width: 150 },
        { field: 'skills', headerName: 'Skills', width: 200 },
        { field: 'experience', headerName: 'Experience', width: 150 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'appliedDate', headerName: 'Applied Date', width: 150 },
        { 
            field: 'view', 
            headerName: 'View', 
            width: 120, 
            renderCell: (params) => (
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => window.location.href = `/admin/application/${params.row.id}`}
                >
                    View
                </Button>
            ) 
        },
    ];

    const rows = data.map((item, index) => ({
        id: item._id, 
        firstName: item.userId?.firstName +" "+ item.userId?.lastName || 'N/A',
        email: item.userId?.email || 'N/A',
        college: item.userId?.acadamicDetailsKey?.education?.college || 'N/A',
        grade: item.userId?.acadamicDetailsKey?.education?.grade || 'N/A',
        passingYear: item.userId?.acadamicDetailsKey?.education?.passingYear || 'N/A',
        branch: item.userId?.acadamicDetailsKey?.education?.branch || 'N/A',
        skills: item.userId?.profactionalDetailsKey?.skills?.join(', ') || 'N/A',
        experience: item.userId?.profactionalDetailsKey?.experience || 'N/A',
        status: item.status || 'N/A',
        appliedDate: item.appliedDate ? new Date(item.appliedDate).toLocaleDateString() : 'N/A',
    }));

    return (
        <Container sx={{ marginTop: 2, flexWrap: "wrap" }}>
            <a href="/admin" style={{ textDecoration: 'none' }}>Go Back</a>
            <Box sx={{ height: '80vh', width: '100%', marginTop: 2 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </Container>
    );
};

export default UserApplied;
