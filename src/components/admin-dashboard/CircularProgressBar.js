import { Box, CircularProgress, } from '@material-ui/core';



const CircularProgressBar = ({ topMargin }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: topMargin }}>
    <CircularProgress />
  </Box>
)

export default CircularProgressBar