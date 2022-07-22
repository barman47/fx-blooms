import PropTypes from 'prop-types';
import { 
    Backdrop,
    Fade,
    Modal
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    img: {
        borderRadius: theme.shape.borderRadius,
        width: '50%',

        [theme.breakpoints.down('sm')]: {
            width: '90%'
        }
    }
}));

const ImagePreviewModal = ({ open, handleCloseModal, img, alt }) => {
	const classes = useStyles();

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
                <img src={img} alt={alt} className={classes.img} />
            </Fade>
        </Modal>
	);
};

ImagePreviewModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default ImagePreviewModal;