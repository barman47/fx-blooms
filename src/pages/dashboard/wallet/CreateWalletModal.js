import { useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import { 
    Backdrop,
    Button,
    Fade,
	Grid,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

import { createWallet, getWallets } from '../../../actions/wallets';

import { COLORS, SHADOW } from '../../../utils/constants';
import { SET_WALLET, SET_WALLET_MSG } from '../../../actions/types';
import isEmpty from '../../../utils/isEmpty';

import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '30vw',
        // height: '25vh',
        boxShadow: SHADOW,
        padding: theme.spacing(2, 5),
        
        [theme.breakpoints.down('md')]: {
            width: '35vw',
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            width: '80vw',
        },
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',

        '& p': {
            fontWeight: 300
        }
    }
}));

const CreateWalletModal = ({ createWallet, getWallets, open, toggleCreateWalletDrawer }) => {
	const classes = useStyles();
    const dispatch = useDispatch();

    const { customerId, firstName, lastName, email, phoneNo } = useSelector(state => state.customer);
    // const errorsState = useSelector(state => state.errors);
    const { msg } = useSelector(state => state.wallets);

    const [isOpen, setIsOpen] = useState(false);
    const [errors] = useState({});
    const [loading, setLoading] = useState(false);

    const successModal = useRef();

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    useEffect(() => {
        if (msg) {
            getWallets(customerId);
            setLoading(false);
            toggleCreateWalletDrawer();
            successModal.current.setModalText(msg);
            successModal.current.openModal();
        }
    }, [customerId, getWallets, msg, toggleCreateWalletDrawer]);

    // useEffect(() => {
    //     if (!isEmpty(errors)) {
    //         toast.current.handleClick();
    //     }
    // }, [errors]);

    // useEffect(() => {
    //     if (errorsState?.msg) {
    //         setErrors({ ...errorsState });
    //         setLoading(false);
    //         dispatch({
    //             type: GET_ERRORS,
    //             payload: {}
    //         });
    //     }
    // }, [dispatch, errorsState, errors]);

    const handleCreateWallet = () => {
        setLoading(true);
        // Remove thsi before deployment
        // dispatch({
        //     type: SET_WALLET_MSG,
        //     payload: null
        // });
        createWallet({
            customerId,
            firstName,
            lastName,
            email,
            phoneNumber: phoneNo
        });
    };

    const dismissAction = () => {
        batch(() => {
            dispatch({
                type: SET_WALLET_MSG,
                payload: null
            });
            dispatch({
                type: SET_WALLET,
                payload: { currency: 'EUR' }
            });
        });
    };

	return (
        <>
            {!isEmpty(errors) && 
                <Toast 
                    ref={toast}
                    title="ERROR"
                    duration={5000}
                    msg={errors.msg || ''}
                    type="error"
                />
            }
            <SuccessModal ref={successModal} dismissAction={dismissAction} />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={isOpen}
                onClose={() => toggleCreateWalletDrawer()}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isOpen}>
                    <Grid container spacing={3} className={classes.container}>
                        <Grid item xs={12} className={classes.item}>
                            <Typography variant="subtitle1" component="p">
                                This action requires an EUR wallet. Kindly create your wallet.
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row">
                                <Grid item lg={6}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        disableRipple
                                        disableFocusRipple
                                        disableTouchRipple
                                        onClick={handleCreateWallet}
                                        disabled={loading}
                                    >
                                        Create Wallet
                                    </Button>
                                </Grid>
                                <Grid item lg={6}>
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                        disableRipple
                                        disableFocusRipple
                                        disableTouchRipple
                                        onClick={() => toggleCreateWalletDrawer()}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Fade>
            </Modal>
        </>
	);
};

CreateWalletModal.propTypes = {
    createWallet: PropTypes.func.isRequired,
    getWallets: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    toggleCreateWalletDrawer: PropTypes.func.isRequired
};

export default connect(undefined, { createWallet, getWallets })(CreateWalletModal);