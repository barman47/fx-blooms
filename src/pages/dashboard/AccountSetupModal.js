import { useState, forwardRef, useImperativeHandle } from 'react';
import { 
    Backdrop,
	Button,
    Fade,
	Grid,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
        width: '20vw',
        height: '20vw',
        boxShadow: SHADOW,
        padding: theme.spacing(2, 5),

        [theme.breakpoints.down('lg')]: {
            width: '30vw',
            height: '30vw',
        },
        [theme.breakpoints.down('md')]: {
            width: '35vw',
            height: '35vw',
        },
        [theme.breakpoints.down('sm')]: {
            width: '90vw',
            height: '30vh'
        },
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center'
    },
}));

const AccountSetupModal = forwardRef((props, ref) => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);

    const { dismissAction } = props;

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
                        <Typography variant="h6" color="primary">First, let's verify your Identity</Typography>
                        <Typography variant="subtitle1">We are required by law to verify users' identity before buying or selling.</Typography>
                        <Button variant="contained" color="primary" onClick={dismissAction}>Okay, Verify Me</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

export default AccountSetupModal;