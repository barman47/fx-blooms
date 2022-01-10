import { useState, forwardRef, useImperativeHandle } from 'react';
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
import { CheckCircleOutline } from 'mdi-material-ui';

import { COLORS, SHADOW } from '../../../utils/constants';

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
        textAlign: 'center',

        '& strong': {
            color: theme.palette.primary.main
        }
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(5)
    }
}));

const BidSuccessModal = forwardRef((props, ref) => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);

    const { toggleDrawer } = props;

    const proceed = () => {
        setOpen(false);
        setTimeout(() => {
            toggleDrawer();
        }, 1000);
    };

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },

        closeModal: () => {
            setOpen(false);
        }
    }));

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            disableEscapeKeyDown
            disableBackdropClick
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} className={classes.item}>
                        <CheckCircleOutline className={classes.icon} />
                        <Typography variant="subtitle1" component="p">Bid Placed Successfully</Typography>
                        <Button onClick={proceed} color="primary" variant="contained">Proceed to Transfer NGN</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

BidSuccessModal.propTypes = {
    toggleDrawer: PropTypes.func.isRequired
};

export default BidSuccessModal;