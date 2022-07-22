import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { 
    Backdrop,
    Box,
	Button,
    Fade,
    IconButton,
    Modal,
	Typography 
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close, Information } from 'mdi-material-ui';

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '35vw',
        // height: '25vw',
        boxShadow: SHADOW,
        padding: theme.spacing(2),

        [theme.breakpoints.down('md')]: {
            // height: '50vw',
            width: '50vw',
        },
        
        [theme.breakpoints.down('sm')]: {
            // padding: theme.spacing(5, 2),
            // height: '40vh',
            width: '80vw'
        },

        '& p': {
            marginBottom: theme.spacing(2)
        }
    },

    iconButton: {
        alignSelf: 'flex-end'
    },


    icon: {
        color: theme.palette.secondary.main,
        fontSize: theme.spacing(5),
        marginBottom: theme.spacing(2)
    }
}));

const UnsupportedInstitutionModal = forwardRef((props, ref) => {
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
                <Box component="section" className={classes.container}>
                    <IconButton onClick={closeModal} className={classes.iconButton}>
                        <Close />
                    </IconButton>
                    <Information className={classes.icon} />
                    <Typography variant="subtitle1" component="p">
                        Sorry! You can not fund with the selected bank. Here is a list of the banking institutions we support.
                    </Typography>
                    <Button onClick={closeModal} color="primary" size="small" variant="contained">View Supported Institutions</Button>
                </Box>
            </Fade>
        </Modal>
	);
});

UnsupportedInstitutionModal.propTypes = {
    dismissAction: PropTypes.func
};

export default UnsupportedInstitutionModal;