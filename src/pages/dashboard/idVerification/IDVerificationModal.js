import { useState, forwardRef, useImperativeHandle } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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

import { COLORS, SHADOW } from '../../../utils/constants';
import { VERIFF } from '../../../routes';

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

const IDVerificationModal = forwardRef((props, ref) => {
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

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={() => setOpen(false)}
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
                            To ensure utmost security, all users are required to verify their identity.
                            <br />
                            <strong>N.B We only accept international passport, drivers licenses.</strong>
                        </Typography>
                        <Grid container direction="row">
                            <Grid item xs={6}>
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    component={RouterLink}
                                    to={VERIFF}
                                >   
                                    Verify My ID
                                </Button>        
                            </Grid>
                            <Grid item xs={6}>
                                <Button 
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    onClick={closeModal}
                                >   
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

IDVerificationModal.propTypes = {
    dismissAction: PropTypes.func
};

export default IDVerificationModal;