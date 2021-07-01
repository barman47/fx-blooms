import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    Backdrop,
    CircularProgress,
	Button,
    Fade,
	Grid,
    Modal,
	TextField,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

import { addAccount } from '../../../actions/account';
import isEmpty from '../../../utils/isEmpty';
import { COLORS, SHADOW } from '../../../utils/constants';
import validateAddAccountNumber from '../../../utils/validation/account/add';
import { ADDED_ACCOUNT } from '../../../actions/types';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: SHADOW
    },

    container: {
		backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
		padding: theme.spacing(4, 2),
        width: '30%',

        [theme.breakpoints.down('lg')]: {
            width: '40%'
        },

        [theme.breakpoints.down('md')]: {
            width: '50%'
        },

        [theme.breakpoints.down('sm')]: {
            overflowY: 'auto',
            width: '85%'
        },

        '& header': {
            marginBottom: theme.spacing(4),
            textAlign: 'center',
            
            '& h6': {
                fontWeight: 600,
            },

            '& span': {
                [theme.breakpoints.down('sm')]: {
                    display: 'inline-block',
                    textAlign: 'left',
                }
            }
        }
	}
}));

const SellerAccountModal = ({ addAccount, open, handleCloseModal }) => {
	const classes = useStyles();

    const dispatch = useDispatch();
    const { msg } = useSelector(state => state.account);

	const [AccountName, setAccountName] = useState('');
    const [AccountNumber, setAccountNumber] = useState('');
    const [BankName, setBankName] = useState('');
    const [loading, setLoading] = useState(false);

    const toast = useRef();
    const successModal = useRef();

    // eslint-disable-next-line
	const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
        }
    }, [errors]);

    useEffect(() => {
        if (msg) {
            successModal.current.openModal();
            successModal.current.setModalText(msg);
            setAccountName('');
            setAccountNumber('');
            setBankName('');
            setLoading('');
            dispatch({ 
                type: ADDED_ACCOUNT
            });
        }
    }, [dispatch, handleCloseModal, msg]);

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        
        const data = { AccountName, AccountNumber, BankName };
        const { errors, isValid } = validateAddAccountNumber(data);

        if (!isValid) {
            return setErrors({ msg: 'Invalid Account Details', ...errors });
        }
        setErrors({});
        setLoading(true);
        addAccount(data);
    };

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleCloseModal}
            closeAfterTransition
            disableBackdropClick={loading ? true : false}
            disableEscapeKeyDown={loading ? true : false}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <section className={classes.container}>
                    <SuccessModal ref={successModal} />
                    {!isEmpty(errors) && 
                        <Toast 
                            ref={toast}
                            title="ERROR"
                            duration={5000}
                            msg={errors.msg || ''}
                            type="error"
                        />
                    }
                    <header>
                        <div>
                            <Typography variant="h6">Add Account Details</Typography>
                            <Typography variant="subtitle1" component="span">You are required to provide your bank details after your second listing.</Typography>
                        </div>
                    </header>
                    <form onSubmit={onSubmit} noValidate>
                        <Grid container direction="row" spacing={2} className={classes.formContainer}>
                            <Grid item xs={12}>
                                <TextField
                                    value={AccountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Account Name"
                                    label="Account Name" 
                                    helperText={errors.AccountName}
                                    fullWidth
                                    required
                                    disabled={loading ? true : false}
                                    error={errors.AccountName ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={AccountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter IBAN"
                                    label="IBAN" 
                                    helperText={errors.AccountNumber || 'Your account number'}
                                    fullWidth
                                    required
                                    disabled={loading ? true : false}
                                    error={errors.AccountNumber ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    value={BankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    type="text"
                                    variant="outlined" 
                                    placeholder="Enter Bank Name"
                                    label="Bank Name" 
                                    helperText={errors.BankName}
                                    fullWidth
                                    required
                                    disabled={loading ? true : false}
                                    error={errors.BankName ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    fullWidth
                                    disabled={loading ? true : false}
                                >
                                    {!loading ? 'Submit' : <CircularProgress style={{ color: '#f8f8f8' }} />}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </section>
            </Fade>
        </Modal>
	);
};

SellerAccountModal.propTypes = {
    addAccount: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default connect(undefined, { addAccount })(SellerAccountModal);