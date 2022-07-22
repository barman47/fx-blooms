import { useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Backdrop,
    Box,
	Button,
    Fade,
    Modal,
	Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { PROFILE } from '../../../routes';

import { COLORS, SHADOW } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '35vw',
        boxShadow: SHADOW,
        padding: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            width: '50vw'
        },
        
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            width: '90vw'
        }
    },

    label: {
        color: COLORS.offBlack,
        fontWeight: 300,
        margin: theme.spacing(2, 0)
    }
}));

const PinOtpModal = forwardRef((props, ref) => {
	const classes = useStyles();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleCancel = () => {
        navigate(-1);
        setOpen(false);
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
        setOpen(false);
    };

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
                <Box component="section" className={classes.root}>
                    <Typography variant="h5" color="primary">Phone Number not verified</Typography>
                    <Typography variant="body2" component="p" className={classes.label}>Kindly verify your phone number. Verification is required to receive SMS notifications</Typography>
                    <Box>
                        <Button
                            color="secondary"
                            variant="contained"
                            size="small"
                            onClick={handleCancel}
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            size="small"
                            onClick={() => navigate(PROFILE)}
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple
                            style={{ marginLeft: '1rem' }}
                        >
                            Verify Phone
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
	);
});

export default PinOtpModal;