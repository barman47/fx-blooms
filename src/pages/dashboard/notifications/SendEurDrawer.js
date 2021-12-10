import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
	Button,
    Drawer,
    Grid,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';
import formatNumber from '../../../utils/formatNumber';

const useStyles = makeStyles(theme => ({
    drawer: {
        padding: theme.spacing(1, 4),
        width: '30vw',

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(4),
            width: '50vw'
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            width: '80vw'
        }
    },

    header: {
        color: theme.palette.primary.main,
    },

    text: {
        color: COLORS.offBlack,
        fontWeight: 300,
        fontSize: theme.spacing(1.7),
        marginTop: theme.spacing(1),
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
        padding: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            gap: theme.spacing(1)
        },
    },

    accountDetailsHeader: {
        color: COLORS.offBlack,
        fontWeight: 600,
        fontSize: theme.spacing(1.7),
    },

    accountContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },

        '& section': {
            bodrder: '1px solid red',
            display: 'flex',
            flexDirection: 'column'
        }
    },

    accountDetailsText: {
        color: COLORS.offBlack,
        fontWeight: 300,
    },

    transferAmount: {
        backgroundColor: 'rgba(81, 103, 103, 1)',
        border: 'none',
        borderRadius: theme.shape.borderRadius,
        color: COLORS.offWhite,
        padding: theme.spacing(1.5, 2.5)
    }
}));

const SendEurDrawer = ({ toggleDrawer, drawerOpen }) => {
	const classes = useStyles();
    const [open, setOpen] = useState(false);
    
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        setOpen(drawerOpen);
    }, [drawerOpen]);

	return (
        <>
            <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={true} onClose={toggleDrawer}>
                <Grid container direction="row" spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.header}>Send EUR</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" component="p" className={classes.text}>Check how much you need to send to buyer below and make a transfer to the account details provided below.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>I Will Send</Typography>
                        <Typography variant="subtitle1" component="p" className={classes.transferAmount}>&#8364;3,250</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" component="p" className={classes.accountDetails}>Seller Account Details</Typography>
                        <section className={classes.accountDetailsContainer}>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Name</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>Uzoanya Dominic</Typography>
                            </div>
                            <div className={classes.accountContainer}>
                                <section>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Account Number</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>0043031752</Typography>
                                </section>
                                <section>
                                    <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Bank</Typography>
                                    <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>Diamond Bank</Typography>
                                </section>
                            </div>
                            <div>
                                <Typography variant="subtitle1" component="p" className={classes.accountDetailsHeader}>Transaction Reference</Typography>
                                <Typography variant="subtitle2" component="span" className={classes.accountDetailsText}>Hello FXBLOOMS money</Typography>
                            </div>
                        </section>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" disableElevation fullWidth disabled={loading ? true : false}>I've Made Payment of </Button>
                    </Grid>
                </Grid>
            </Drawer>
        </>
	);
};

SendEurDrawer.propTypes = {
    account: PropTypes.object.isRequired
};

export default SendEurDrawer;
// export default connect(undefined, { addBid, account })(SendEurDrawer);