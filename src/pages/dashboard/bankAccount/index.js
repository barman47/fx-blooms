import { useCallback, useEffect, useRef, useState } from 'react';
import { batch, connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AddAccountDrawer from './AddAccountDrawer';
import EditAccountDrawer from './EditAccountDrawer';
import BankAccount from './BankAccount';
import SuccessModal from '../../../components/common/SuccessModal';
import Toast from '../../../components/common/Toast';

import { deleteAccount } from '../../../actions/bankAccounts';
import { GET_ERRORS, SET_ACCOUNT, SET_ACCOUNT_MSG } from '../../../actions/types';

import isEmpty from '../../../utils/isEmpty';

const useStyles = makeStyles(theme =>({
    root: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
        }
    },

    header: {
        display: 'flex',
        flexDirection: 'column',
        
        '& div:first-child': {
            marginBottom: theme.spacing(2)
        },

        '& hr': {
            margin: 0,
            marginTop: theme.spacing(1),
            width: '20%'
        },

        '& p': {
            fontWeight: 300
        }
    },

    bankAccounts: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(4),
        marginTop: theme.spacing(4),
    },

    noAccount: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        '& h5': {
            marginBottom: theme.spacing(2)
        }
    }
}));

const BankAccounts = ({ deleteAccount, handleSetTitle }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { accounts, msg } = useSelector(state => state.bankAccounts);
    const errorsState = useSelector(state => state.errors);

    const [showAddAccountDrawer, setShowAddAccountDrawer] = useState(false);
    const [editAccount, setEditAccount] = useState(false);
    const [errors, setErrors] = useState({});

    const successModalRef = useRef();
    const toast = useRef();

    useEffect(() => {
        handleSetTitle('Bank Accounts');
        // eslint-disable-next-line
    }, []);
    
    const toggleEditAccountDrawer = useCallback(() => {
        setEditAccount(!editAccount)
    }, [editAccount]);

    const toggleShowAddAccountDrawer = useCallback(() => {
        setShowAddAccountDrawer(!showAddAccountDrawer);
    }, [showAddAccountDrawer]);

    useEffect(() => {
        if (msg && editAccount) {
            successModalRef.current.setModalText(msg);
            successModalRef.current.openModal();
        }
    }, [editAccount, msg, toggleEditAccountDrawer]);

    useEffect(() => {
        if (errorsState) {
            setErrors(errorsState);
        }
    }, [errorsState]);

    useEffect(() => {
        if (!isEmpty(errors)) {
            toast.current.handleClick();
            dispatch({
                type: GET_ERRORS,
                payload: {}
            });
        }
    }, [dispatch, errors]);

    const handleDeleteAccount = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this account?');
        if (confirmDelete) {
            deleteAccount(id);
        }
    };

    const handleEditAccount = (account) => {
        dispatch({
            type: SET_ACCOUNT,
            payload: account
        });
        toggleEditAccountDrawer();
    };

    const dismissAction = () => {
        batch(() => {
            dispatch({
                type: SET_ACCOUNT,
                payload: {}
            });
            dispatch({
                type: SET_ACCOUNT_MSG,
                payload: null
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
            {editAccount && <EditAccountDrawer toggleDrawer={toggleEditAccountDrawer} drawerOpen={editAccount} />}
            {msg && <SuccessModal ref={successModalRef} dismissAction={dismissAction} />}
            <section className={classes.root}>
                <div className={classes.header}>
                    <div>
                        <Typography variant="h4" color="primary">Bank Account</Typography>
                        <Typography variant="body1" component="p">Kindly provide your bank details below</Typography>
                        <hr className={classes.hr} />
                    </div>
                    <Button variant="text" color="primary" onClick={toggleShowAddAccountDrawer} style={{ alignSelf: 'flex-start' }}>Add Account</Button>
                </div>
                <div className={classes.bankAccounts}>
                    {accounts.length > 0 ? accounts.map(account => (
                        <BankAccount 
                            key={account.accountID}
                            accountID={account.accountID}
                            bankName={account.bankName}
                            accountName={account.accountName}
                            accountNumber={account.accountNumber}
                            currency={account.currency}
                            alias={account.nicKName || ''}
                            handleDeleteAccount={() => handleDeleteAccount(account.accountID)}
                            handleEditAccount={() => handleEditAccount(account)}
                        />
                    ))
                    :
                        <div className={classes.noAccount}>
                            <Typography variant="h5">No Accounts Added</Typography>   
                            <Button variant="contained" color="primary" onClick={toggleShowAddAccountDrawer}>Add New Account</Button>               
                        </div>
                    }
                </div>
            </section>
            <AddAccountDrawer drawerOpen={showAddAccountDrawer} toggleDrawer={toggleShowAddAccountDrawer} eur={true} ngn={true} />
        </>
    );
}

BankAccounts.propTypes = {
    deleteAccount: PropTypes.func,
    handleSetTitle: PropTypes.func
};

export default connect( undefined, { deleteAccount })(BankAccounts);