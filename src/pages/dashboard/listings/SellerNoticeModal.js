import { useEffect, useState } from 'react';
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

        '& p': {
            fontWeight: 300
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
        color: '#ffa500',
        fontSize: theme.spacing(5)
    }
}));

const SellerNoticeModal = () => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);
    const HAS_SEEN_SELLER_WARNING = 'hasSeenSellerWarning';

    useEffect(() => {
        if (!localStorage.getItem(HAS_SEEN_SELLER_WARNING)) {
            setOpen(true);
        }
        // eslint-disable-next-line
    }, []);


    const closeModal = () => {
        setOpen(false);
        localStorage.setItem(HAS_SEEN_SELLER_WARNING, true);
    };

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
                        <Information className={classes.icon} />
                        <Typography variant="h5">Seller's Notice</Typography>
                        <Typography variant="subtitle1" component="p">
                            To avoid being a victim of malicious users, NEVER transfer EUR before actually receiving the NGN equivalent! Once the SELLER  confirms the payment and transfers the EUR to the BUYER, the transaction is considered done and can not be disputed.
                        </Typography>
                        <Button onClick={closeModal} color="primary">Okay</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
};

export default SellerNoticeModal;