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

const AddedSubscriptionModal = ({ open, handleCloseModal }) => {
	const classes = useStyles();
    const handleButtonClick = () => {
        handleCloseModal();
    };

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleCloseModal}
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
                            Subscription Added Successfully
                        </Typography>
                        <Button onClick={handleButtonClick} color="primary">Okay</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
};

AddedSubscriptionModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default AddedSubscriptionModal;