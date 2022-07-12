import { useState, forwardRef, useImperativeHandle } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Backdrop,
    Box,
	Button,
    Fade,
	Grid,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InformationOutline } from 'mdi-material-ui';

import { COLORS, SHADOW } from '../../../utils/constants';
import { DASHBOARD_HOME, FUND_WALLET } from '../../../routes';

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
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    }
}));

const ZeroBalanceModal = forwardRef((props, ref) => {
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
        },
    }));

    const handleOnClose = (e, reason) => {
        if (reason === 'backdropClick') {
            return;
        }
        // if (reason === 'clickaway') {
        //     return;
        // }
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
                        <InformationOutline className={classes.icon} />
                        <Typography variant="subtitle1">
                            To sell EUR, you need to fund your wallet
                        </Typography>
                        <Box component="div" className={classes.buttonContainer}>
                            <Button size="small" component={RouterLink} to={FUND_WALLET} color="primary" variant="contained">Fund Wallet</Button>
                            <Button size="small" component={RouterLink} to={DASHBOARD_HOME} color="secondary" variant="contained">Cancel</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

ZeroBalanceModal.propTypes = {
    dismissAction: PropTypes.func
};

export default ZeroBalanceModal;