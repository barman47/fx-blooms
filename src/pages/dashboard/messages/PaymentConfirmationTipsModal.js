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
                <div container className={classes.container} direction="column">
                    <Typography variant="subtitle2" component="span" className={classes.title}>Tips and Recommendations</Typography>
                    <ul className={classes.list}>
                        <li>The seller should confirm the NGN(&#8358;) payment in their account before sending the EUR(&#163;) equivalent.</li>
                        <li>We recommend that the SELLER uses instant EUR(&#163;) payment when possible.</li>
                        <li>Both the SELLER and the BUYER must verify and confirm account details and payment reference provided.</li>
                        <li>After a successful transaction, please rate the other party involved. Positive ratings will increase your trust level on FXBLOOMS</li>
                    </ul>
                    <Button className={classes.button} variant="contained" color="primary" onClick={closeModal} fullWidth>Okay</Button>
                </div>
            </Fade>
        </Modal>
	);
});

export default PaymentConfirmationTipsModal;