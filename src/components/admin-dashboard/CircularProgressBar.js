import { Box, CircularProgress, } from '@material-ui/core';



const CircularProgressBar = ({ topMargin, newWidth, newHeight, iconColor }) => (
  <Box component="span" sx={{ display: 'flex', justifyContent: 'center', marginTop: topMargin ?? '' }}>
    <CircularProgress style={{ width: newWidth, height: newHeight, color: iconColor }} />
  </Box>
)

export default CircularProgressBar