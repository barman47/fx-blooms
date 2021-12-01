import { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AddAccountDrawer from './AddAccountDrawer';
import BankAccount from './BankAccount';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme =>({
    root: {
        marginTop: theme.spacing(-8)
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

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

const BankAccounts = () => {
    const classes = useStyles();

    const { accounts } = useSelector(state => state.bankAccounts);

    const [showAddAccountDrawer, setShowAddAccountDrawer] = useState(false);

    const toggleShowAddAccountDrawer = () => setShowAddAccountDrawer(!showAddAccountDrawer);

    return (
        <>
            <section className={classes.root}>
                <div className={classes.header}>
                    <Typography variant="body1" component="p">Here are your linked accounts.</Typography>
                    <Button variant="text" color="primary" onClick={toggleShowAddAccountDrawer}>Add Receiving Account</Button>
                </div>
                <div className={classes.bankAccounts}>
                    {accounts ? accounts.map(account => (
                        <BankAccount 
                            key={account.accountID}
                            bankName={account.bankName}
                            accountName={account.accountName}
                            sortCode="09-00-09"
                            currency={account.currency}
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
            <AddAccountDrawer drawerOpen={showAddAccountDrawer} toggleDrawer={toggleShowAddAccountDrawer} />
        </>
    );
}

export default BankAccounts;