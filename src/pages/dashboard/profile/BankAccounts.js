import { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AddAccountDrawer from './AddAccountDrawer';
import BankAccount from './BankAccount';

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
    }
}));

const BankAccounts = (props) => {
    const classes = useStyles();

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
                    <BankAccount 
                        bankName="Chase Bank"
                        accountName="Wale Calfos"
                        sortCode="09-00-09"
                        currency="EUR"
                    />
                    <BankAccount 
                        bankName="Bank of America"
                        accountName="Wale Calfos"
                        sortCode="09-00-09"
                        currency="USD"
                    />
                    <BankAccount 
                        bankName="GTBank"
                        accountName="Wale Calfos"
                        sortCode="09-00-09"
                        currency="NGN"
                    />
                    <BankAccount 
                        bankName="Access Bank"
                        accountName="Wale Calfos"
                        sortCode="09-00-09"
                        currency="NGN"
                    />
                </div>
            </section>
            <AddAccountDrawer drawerOpen={showAddAccountDrawer} toggleDrawer={toggleShowAddAccountDrawer} />
        </>
    );
}

export default BankAccounts;