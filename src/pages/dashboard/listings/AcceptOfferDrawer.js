import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Box,
	Button,
    Drawer,
    Grid,
    FormControl,
    FormHelperText,
    IconButton,
    Select,
    MenuItem,
    TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AlertOutline, Close } from 'mdi-material-ui';

import { acceptOffer } from '../../../actions/listings';
import {SET_ACCOUNT, SET_ACCOUNT_MSG, SET_BID, SET_LISTING_MSG } from '../../../actions/types';
import { getAccount } from '../../../actions/bankAccounts';
import { COLORS } from '../../../utils/constants';
import isEmpty from '../../../utils/isEmpty';

import AddAccountDrawer from '../bankAccount/AddAccountDrawer';
import SuccessModal from '../../../components/common/SuccessModal';
import { TRANSACTIONS } from '../../../routes';

const useStyles = makeStyles(theme => ({
    drawer: {
        padding: theme.spacing(1, 4),
        width: '35vw',

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4),
            width: '50vw'
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            width: '90vw'
        },

        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    },

    header: {
        color: theme.palette.primary.main,
    },

    accountDetails: {
        color: theme.palette.primary.main,
        fontWeight: 600,
        marginBottom: theme.spacing(1)
    },

    accountDetailsContainer: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            gap: theme.spacing(1)
        },

        '& div': {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            alignItems: 'center',
            gap: theme.spacing(2)
        }
    },

    accountDetailsHeader: {
        color: COLORS.offBlack,
        fontWeight: 600,
        fontSize: theme.spacing(1.7),
    },

    accountDetailsText: {
        color: COLORS.offBlack,
        fontWeight: 300,
    },

    addAccountButton: {
        alignSelf: 'flex-end'
    },

    button: {
        margin: theme.spacing(2, 0),
    },
}));

const AcceptOfferDrawer = ({ acceptOffer, toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { accounts } = useSelector(state => state.bankAccounts);
    const bankAccountMsg = useSelector(state => state.bankAccounts.msg);
    const { listing, msg } = useSelector(state => state.listings);
    const errorsState = useSelector(state => state.errors);
    const { wallet } = useSelector(state => state.wallets);

    const [receivingAccount, setReceivingAccount] = useState('');
    const [addAccountDrawerOpen, setAddAccountDrawerOpen] = useState(false);
    const [reference, setReference] = useState('');

    const [errors, setErrors] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const successModal = useRef();

    useEffect(() => {
        // if (isEmpty(account) && !isEmpty(listing)) {
        //     getAccount(listing.sellersAccountId);
        // }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setOpen(drawerOpen);
        dispatch({
            type: SET_ACCOUNT,
            payload: {}
        });
        if (!drawerOpen) {
            setErrors({});
        }
    }, [dispatch, drawerOpen]);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            setLoading(false);
        }
    }, [msg]);

    useEffect(() => {
        setLoading(false);
        setErrors(errorsState);
    }, [errorsState]);

    useEffect(() => {
        // Automatically select newly added account
        if (accounts.length > 0 && accounts[0].currency === 'NGN' && bankAccountMsg) {
            successModal.current.openModal();
            successModal.current.setModalText(bankAccountMsg);
            setLoading(false);
            setReceivingAccount(accounts[0].bankName);
        }
    }, [accounts, bankAccountMsg]);

    // const getBidIds = (bids) => {
    //     const bidIds = [];
    //     bids.forEach(bid => bidIds.push(bid.id));
    //     return bidIds;
    // };

    const handleAddAccount = () => {
        setAddAccountDrawerOpen(true);
        setReceivingAccount('');
    };

    const toggleAddAccountDrawer = () => setAddAccountDrawerOpen(!addAccountDrawerOpen);

    useEffect(() => {
        setOpen(drawerOpen);
        dispatch({
            type: SET_ACCOUNT,
            payload: {}
        });
        if (!drawerOpen) {
            setErrors({});
        }
    }, [dispatch, drawerOpen]);

    useEffect(() => {
        setLoading(false);
        setErrors(errorsState);
    }, [errorsState]);

    const dismissSuccessModal = () => {
        successModal.current.closeModal();
        setLoading(false);
        toggleDrawer();
        batch(() => {
            dispatch({
                type: SET_LISTING_MSG,
                payload: null
            });
            dispatch({
                type: SET_ACCOUNT_MSG,
                payload: null
            });
            dispatch({ 
                type: SET_BID, 
                payload: {}
            });
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
        });
        navigate(TRANSACTIONS);
    };

    const getAccountId = (account) => {
        const bank = accounts.find(item => item.bankName === account || item.nicKName === account);
        return bank.accountID;
    };

    const handleAcceptOffer = () => {
        if (isEmpty(receivingAccount)) {
            return setErrors({ receivingAccount: 'Please select an account' });
        }
        setLoading(true);
        acceptOffer({
            listingId: listing.id,
            accountId: getAccountId(receivingAccount),
            reference,
            walletId: wallet.id
        }, listing);
    };

    return (
        <>
            <SuccessModal ref={successModal} dismissAction={dismissSuccessModal} />
            {addAccountDrawerOpen && <AddAccountDrawer toggleDrawer={toggleAddAccountDrawer} drawerOpen={addAccountDrawerOpen} eur={false} ngn={true} />}
            <Drawer 
                ModalProps={{ 
                    // disableBackdropClick: true,
                    disableEscapeKeyDown: true,
                }}
                PaperProps={{ className: classes.drawer }} 
                anchor="right" 
                open={true} 
                // open={loading ? true : open} 
                onClose={toggleDrawer}
            >
                <Box component="header">
                    <Typography variant="h6" className={classes.header}>Accept NGN Offer</Typography>
                    <IconButton 
                        color="primary" 
                        disableFocusRipple
                        variant="text"
                        onClick={toggleDrawer}
                    >
                        <Close />
                    </IconButton>
                </Box>
                <Grid container direction="row">
                    <Grid item xs={6} lg={5}>
                        <Typography variant="h6" color="primary">Actions Required</Typography>
                    </Grid>
                    <Grid item xs={6} lg={1}>
                        <AlertOutline style={{ color: '#F67171', position: 'relative', top: 3 }} />
                    </Grid>
                </Grid>
                <ol>
                    <li><Typography variant="body2" component="p">Provide an NGN receiving account.</Typography></li>
                    <li><Typography variant="body2" component="p">Enter a payment reference (OPTIONAL)</Typography></li>
                    <li><Typography variant="body2" component="p">Accept NGN offer</Typography></li>
                </ol>
                <Grid container direction="row">
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" component="span">Receiving Account</Typography>
                        <FormControl 
                            variant="outlined" 
                            error={errors.receivingAccount ? true : false } 
                            fullWidth 
                            required
                            disabled={loading ? true : false}
                        >
                            <Select
                                labelId="ReceivingAccount"
                                value={receivingAccount}
                                onChange={(e) => setReceivingAccount(e.target.value)}
                            >
                                <MenuItem value="" disabled>Select your receiving account</MenuItem>
                                {accounts.map((account) => {
                                    if (account.currency === 'NGN') {
                                        return (
                                            <MenuItem key={account.accountID} value={account.nicKName || account.bankName}>{account.nicKName || account.bankName}</MenuItem>
                                        )
                                    }
                                    return null;
                                })}
                            </Select>
                            <FormHelperText>{errors.receivingAccount}</FormHelperText>
                            <Button variant="text" color="primary" align="right" onClick={handleAddAccount} className={classes.addAccountButton}>Add New Account</Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" component="span">Payment Reference (OPTIONAL)</Typography>
                        <TextField 
                            value={reference}
                            placeholder="Enter Payment Reference"
                            onChange={(e) => setReference(e.target.value)}
                            disabled={loading ? true : false}
                            type="text"
                            variant="outlined" 
                            fullWidth
                        />
                        <FormHelperText>Enter the reference you want added to the payment</FormHelperText>
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            type="submit"
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            disableFocusRipple
                            className={classes.button}
                            disabled={loading ? true : false}
                            onClick={handleAcceptOffer}
                        >
                            {loading ? 'One Moment . . .' : 'Accept NGN Offer'}
                        </Button>
                    </Grid>
                </Grid>
            </Drawer>
        </>
    );
};

AcceptOfferDrawer.propTypes = {
    acceptOffer: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired
};

export default connect(undefined, { acceptOffer, getAccount })(AcceptOfferDrawer);