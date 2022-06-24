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
import { SUPPORTED_FUNDING_INSTITUTIONS } from '../../../utils/supportedInstitutions';

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
        width: '35vw',
        height: '25vw',
        overflowY: 'auto',
        boxShadow: SHADOW,
        padding: theme.spacing(2),

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

    title: {
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1),
        fontWeight: 600
    },

    insitution: {
        fontWeight: 300,
        marginBottom: theme.spacing(1)
    },                    

}));

const SupportedFundingInstitutionsModal = forwardRef((props, ref) => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);

    const closeModal = () => {
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
        // if (reason === 'backdropClick') {
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
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.title}>Supported Funding Institutions</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {SUPPORTED_FUNDING_INSTITUTIONS.map((insitution, index) => (
                            <Typography key={index} variant="body2" component="p" className={classes.insitution}>{insitution.fullName}</Typography>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" size="small" onClick={closeModal} color="primary">Okay</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

SupportedFundingInstitutionsModal.propTypes = {
    dismissAction: PropTypes.func
};

export default SupportedFundingInstitutionsModal;