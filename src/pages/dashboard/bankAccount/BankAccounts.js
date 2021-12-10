import { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AddAccountDrawer from './AddAccountDrawer';
import BankAccount from './BankAccount';

import { deleteAccount } from '../../../actions/bankAccounts';

const useStyles = makeStyles(theme =>({
    root: {
        marginTop: theme.spacing(-2)
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

const BankAccounts = ({ deleteAccount }) => {
    const classes = useStyles();

    const { accounts } = useSelector(state => state.bankAccounts);

    const [showAddAccountDrawer, setShowAddAccountDrawer] = useState(false);

    const toggleShowAddAccountDrawer = () => setShowAddAccountDrawer(!showAddAccountDrawer);

    const handleDeleteAccount = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this account?');
        if (confirmDelete) {
            deleteAccount(id);
        }
    };

    return (
        <>
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
                            bankName={account.bankName}
                            accountName={account.accountName}
                            accountNumber={account.accountNumber}
                            currency={account.currency}
                            handleDeleteAccount={() => handleDeleteAccount(account.accountID)}
                        />
                    ))
                    :
                        <div className={classes.noAccount}>
                            <Typography variant="h5">No Accounts Added</Typography>   
                            <Button variant="contained" color="primary" onClick={toggleShowAddAccountDrawer}>Add Receiving Account</Button>               
                        </div>
                    }
                </div>
            </section>
            <AddAccountDrawer drawerOpen={showAddAccountDrawer} toggleDrawer={toggleShowAddAccountDrawer} eur={true} ngn={true} />
        </>
    );
}

BankAccounts.propTypes = {
    deleteAccount: PropTypes.func
};

export default connect( undefined, { deleteAccount })(BankAccounts);