import { Box, Button, Typography} from '@mui/material';
function ShowProfileCompletion() {
  return (
    <Box>
        <Typography>Please Comple Profile</Typography>
        <br />
        <Button variant="contained" color="primary" fullWidth href='/user'>Complete Profile</Button>
    </Box>
  );
}
export default ShowProfileCompletion;