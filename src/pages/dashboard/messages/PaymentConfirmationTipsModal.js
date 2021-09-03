import { useState, forwardRef, useImperativeHandle } from 'react';
import { 
    Backdrop,
	Button,
    Fade,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
        width: '25vw',
        boxShadow: SHADOW,
        padding: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            width: '40vw',
        },

        [theme.breakpoints.down('sm')]: {
            width: '65vw',
        },
    },

    title: {
        fontWeight: 600
    },

    list: {
        '& li': {
            fontWeight: 300,
            marginBottom: theme.spacing(2)
        }
    },

    button: {
        fontWeight: 300,
        marginTop: theme.spacing(2)
    }
}));

const PaymentConfirmationTipsModal = forwardRef((props, ref) => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);

    const closeModal = () => {
        setOpen(false);
    };

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
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
                <div className={classes.container} direction="column">
                    <Typography variant="subtitle2" component="span" className={classes.title}>Payment Confirmation Tips</Typography>
                    <ul className={classes.list}>
                        <li>Make sure you have confirmed payment in your banking app before sending funds.</li>
                        <li>Do not rely on payment receipts or proof of payments (screenshots).</li>
                    </ul>
                    <Button className={classes.button} variant="contained" color="primary" onClick={closeModal} fullWidth>Okay</Button>
                </div>
            </Fade>
        </Modal>
	);
});

export default PaymentConfirmationTipsModal;