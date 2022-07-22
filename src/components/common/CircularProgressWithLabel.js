import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography } from '@mui/material';

const CircularProgressWithLabel = ({ minutes, seconds, ...rest }) => {
    return (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" {...rest} color="secondary" />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="error">
                {/* <Typography variant="caption" component="div" color="textSecondary" color> */}
                    {`${minutes}:${seconds}`}
                </Typography>
            </Box>
        </Box>
    );
};

CircularProgressWithLabel.propTypes = {
    minutes: PropTypes.string.isRequired,
    seconds: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired //The value of the progress indicator for the determinate variant. Value between 0 and 100.
};

export default CircularProgressWithLabel;