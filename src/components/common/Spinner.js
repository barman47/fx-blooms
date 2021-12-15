import { useRef } from 'react';
import { 
    Backdrop,
    CircularProgress,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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
                <CircularProgress color="inherit" />
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