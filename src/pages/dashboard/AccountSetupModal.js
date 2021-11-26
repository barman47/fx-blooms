import { useState } from 'react';
// import { useHistory } from 'react-router-dom';
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

const AccountSetupModal = () => {
	const classes = useStyles();
    // const history = useHistory();

    const [open, setOpen] = useState(false);

    // useEffect(() => {
    //     if (!sessionStorage.getItem(ACCOUNT_SETUP)) {

    //     }
    // }, []);

    // const setupAccount = () => {
    //     sessionStorage.setItem(ACCOUNT_SETUP, true);
    // };

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
                        <Typography variant="subtitle1">
                            You are required to complete your account setup and verification in order to be able to use FXBLOOMS
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => setOpen(false)}>Go to Set Up Account</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
};

export default AccountSetupModal;