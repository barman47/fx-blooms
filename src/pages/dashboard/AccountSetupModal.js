import { useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ID_VERIFICATION } from '../../routes';

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
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },

        closeModal: () => {
            setOpen(false);
        }
    }));

    const handleVerifyId = () => {
        setOpen(false);
        navigate(ID_VERIFICATION);
    };

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
                        <Typography variant="subtitle1">All users are required to verify their  identity in order to buy or sell on FXBLOOMS.</Typography>
                        <Grid container direction="row">
                            <Grid item xs={6}>
                                <Button variant="text" size="small" color="secondary" onClick={() => setOpen(false)}>Skip</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="contained" size="small" color="primary" onClick={handleVerifyId}>Okay, Verify Me</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

export default AccountSetupModal;