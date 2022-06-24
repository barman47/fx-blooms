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
import { Information } from 'mdi-material-ui';

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
        width: '35vw',
        height: '25vw',
        boxShadow: SHADOW,
        padding: theme.spacing(5, 10),

        [theme.breakpoints.down('md')]: {
            height: '50vw',
            width: '50vw',
        },
        
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            height: '40vh',
            width: '90vw'
        }
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

const TimeElapsedModal = forwardRef((props, ref) => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);

    const { dismissAction } = props;

    const closeModal = () => {
        setOpen(false);
        if (dismissAction) {
            dismissAction();
        }
    };

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },

        closeModal: () => {
            setOpen(false);
        }
    }));

    const handleOnClose = (e, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        closeModal();
    }

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            disableEscapeKeyDown
            onClose={handleOnClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} className={classes.item}>
                        <Information className={classes.icon} />
                        <Typography variant="subtitle1">
                            Sorry! the seller failed to transfer within the stipulated time. The Transaction has been cancelled. You may accept or create another offer.
                        </Typography>
                        <Button onClick={closeModal} color="primary">Okay</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

TimeElapsedModal.propTypes = {
    dismissAction: PropTypes.func
};

export default TimeElapsedModal;