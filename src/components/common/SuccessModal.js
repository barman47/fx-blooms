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
import { CheckboxMarkedCircle } from 'mdi-material-ui';

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

const SuccessModal = forwardRef((props, ref) => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

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

        setModalText: (text) => {
            setText(text);
        }
    }));

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            disableBackdropClick
            disableEscapeKeyDown
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
                        <CheckboxMarkedCircle className={classes.icon} />
                        <Typography variant="subtitle1">
                            {text}
                        </Typography>
                        <Button onClick={closeModal} color="primary">Okay</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

SuccessModal.propTypes = {
    dismissAction: PropTypes.func
};

export default SuccessModal;