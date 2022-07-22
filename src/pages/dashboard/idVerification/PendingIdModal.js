import { 
    Backdrop,
	Button,
    Fade,
    Link,
    Modal,
	Typography 
} from '@mui/material';
import { makeStyles } from '@mui/styles';

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

const PendingIdModal = ({ open, handleCloseModal }) => {
    const classes = useStyles();
    
	return (
        <>
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
                    <div className={classes.modalContent}>
                        <Information className={classes.icon} />
                        <Typography variamt="h6">
                            Thank you for the verification. We are currently reviewing your document, and we will provide an update soon.
                        </Typography>
                        <Link 
                            underline="none"
                            component={Button}
                            onClick={handleCloseModal}
                        >
                            Okay
                        </Link>
                    </div>
                </Fade>
            </Modal>
        </>
	);
};

export default PendingIdModal;