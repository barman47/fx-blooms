import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
    Fade,
    Link,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';
import { Information } from 'mdi-material-ui';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
        width: '30vw',

        [theme.breakpoints.down('md')]: {
            width: '40vw'
        },

        [theme.breakpoints.down('md')]: {
            width: '75vw'
        },
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(5),
        margin: '0 auto',
        width: 'initial'
    }
}));

const ResidencePermitModal = ({ url, open, handleCloseModal }) => {
    const classes = useStyles();
    
	return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                // disableBackdropClick
                // disableEscapeKeyDown
                open={open}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.modalContent}>
                        <Information className={classes.icon} />
                        <Typography variamt="h6">
                            To ensure utmost security on our platform, all first time SELLERS of EUR are required to verify their EU issued ID.
                        </Typography>
                        <strong>N.B We only accept EU Issued ID.</strong>
                        <Link 
                            underline="none"
                            component={Button}
                            onClick={() => {
                                window.location.href = url;
                            }}
                        >
                            Okay, Verify My Permit
                        </Link>
                    </div>
                </Fade>
            </Modal>
        </>
	);
};

ResidencePermitModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default ResidencePermitModal;