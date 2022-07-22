import { useRef } from 'react';
import { 
    Backdrop,
    // CircularProgress,
    Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';

import img from '../../assets/img/loader.svg';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
}));

const Spinner = ({ text }) => {
    const classes = useStyles();
    const spinner = useRef();

    return (
        <div>
            <Backdrop ref={spinner} className={classes.backdrop} open={true}>
                {/* <CircularProgress color="inherit" /> */}
                <img src={img} alt="Spinner" />
                <Typography variant="h5" className={classes.text}>
                    {text}
                </Typography>
            </Backdrop>
        </div>
    );
};

Spinner.propTypes = {
    text: PropTypes.string
};

Spinner.defaultProps = {
    text: 'One Moment . . .'
};
export default Spinner;