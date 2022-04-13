import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
    Fade,
	Grid,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CheckboxMarkedCircle } from 'mdi-material-ui';

import { COLORS, SHADOW } from '../../utils/constants';
import { SET_CURRENT_CUSTOMER } from '../../actions/types';
import { LOGIN } from '../../routes';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '50vw',
        height: '30vh',
        boxShadow: SHADOW,
        padding: theme.spacing(5, 10),

        [theme.breakpoints.down('lg')]: {
            height: '50vh',
        },
        [theme.breakpoints.down('md')]: {
            height: '40vh',
            width: '70vw',
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            height: '40vh',
            width: '90vw',
        },
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center'
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(5)
    }
}));

const SignUpSuccessModal = ({ open, handleCloseModal, text }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const navigate = useNavigate();

    const handleButtonClick = () => {
        handleCloseModal();
        dispatch({
            type: SET_CURRENT_CUSTOMER,
            payload: {}
        });
        navigate(LOGIN);
    };

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleCloseModal}
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} className={classes.item}>
                        <CheckboxMarkedCircle className={classes.icon} />
                        <Typography variant="subtitle1">
                            {text}
                        </Typography>
                        <Button onClick={handleButtonClick} color="primary">Okay</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
};

SignUpSuccessModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired
};

export default SignUpSuccessModal;