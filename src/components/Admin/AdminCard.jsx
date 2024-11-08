import React, { useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import { 
    Card, 
    CardHeader, 
    CardContent, 
    IconButton, 
    Typography, 
    Avatar, 
    Button 
} from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import ApplicationsDialog from '../ApplicationsDialog';

const SimpleCard = (props) => {
    // useGSAP(() => {
    //     gsap.fromTo('.card', { y: '200', opacity: 0 },
    //       { y: 0, opacity: 1, duration: 0.5, ease:'back.in', stagger: 0.25, delay: 0 });
    //   },[]);
    const { companyName, role, experience, technicalSkills, salaryRange, description, _id } = props._id;
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <Card className='card' elevation={2} sx={{ borderRadius: 2,background:`url('/imgs/cardBg5.jpg')`,backgroundPosition:'center',backgroundSize:'cover', transition: '0.3s', '&:hover': { boxShadow: 6 }, mb: 2,display:'flex',flexDirection:'column',height:'100%' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        {companyName[0].toUpperCase()}
                    </Avatar>
                }
                action={
                    <IconButton>
                        {/* <DeleteOutlined sx={{ color: 'black' }} /> */}
                        <Typography sx={{ color: 'black' , backgroundColor:'Background', borderRadius:'50%', padding:'8px', fontWeight:'bold'}}>{props.applicationCount}</Typography>
                    </IconButton>
                }
                title={
                    <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1.2rem' }}>
                        {companyName}
                    </Typography>
                }
                subheader={
                    <Typography sx={{ fontWeight: 'bold', color: 'grey', fontSize: '0.9rem' }}>
                        {role} ({experience} years)
                    </Typography>
                }
            />
            <CardContent>
                <Typography variant='body2' color='grey' sx={{ mb: 1 }}>Job Id : {_id}</Typography>
                <Typography variant='body2' color='grey' sx={{ 
                    mb: 1,
                    maxHeight: '1.5em',
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                }}>
                    Technical Skills: {technicalSkills.join(', ')}
                </Typography>
                {salaryRange && (
                    <Typography variant='body2' color='grey' sx={{ mb: 1 }}>
                        Salary Range: {salaryRange}
                    </Typography>
                )}
                {description && (
                    <Typography variant='body2' color='grey' sx={{ 
                        mb: 1,
                        maxHeight: '4.5em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                         }}>
                        {description}
                    </Typography>
                )}
            </CardContent>
            <Button sx={{ m: 1 }} variant="outlined" color="primary" onClick={handleDialogOpen}>
                View Applications
            </Button>

            {/* Dialog for Applications */}
            {dialogOpen?<ApplicationsDialog 
                open={dialogOpen} 
                onClose={handleDialogClose} 
                companyName={companyName} 
                jobId={_id}
            />:null}
        </Card>
    );
};

export default SimpleCard;
