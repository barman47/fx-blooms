import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
    Box,
	Button,
    Drawer,
    Tab,
    Tabs,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    drawer: {
        padding: theme.spacing(4),
        width: '35vw',

        [theme.breakpoints.down('md')]: {
            width: '50vw'
        },

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
            width: '80vw'
        }
    },

    tabs: {
        marginTop: theme.spacing(4),
    },

    header: {
        color: theme.palette.primary.main,
    },

    tabLabel: {
        '& p': {
            fontWeight: 600,
            textTransform: 'capitalize'
        },

        '& small': {
            color: COLORS.darkGrey
        }
    },

    text: {
        color: COLORS.offBlack,
        marginTop: theme.spacing(2),
    },

    button: {
        marginTop: theme.spacing(5)
    },

    bankDetailsHeader: {
        color: theme.palette.primary.main,
        fontWeight: 600,
        marginTop: theme.spacing(2)
    },

    bankDetails: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),
        marginTop: theme.spacing(2),
        padding: theme.spacing(3),
    },

    bankDetailsTitle: {
        fontWeight: 600,
        marginBottom: theme.spacing(0.5),
    },

    accountNumberContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
    }
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
            <Box p={3}>
                <Typography>{children}</Typography>
            </Box>
            )}
        </div>
    );
}
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
  

const FundWalletDrawer = ({ toggleDrawer, drawerOpen }) => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);

    const [value, setValue] = useState(0);

    useEffect(() => {
        setOpen(drawerOpen);
    }, [drawerOpen]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const closeModal = () => {
        setOpen(false);
    };

	return (
        <Drawer PaperProps={{ className: classes.drawer }} anchor="right" open={open} onClose={toggleDrawer}>
            <Typography variant="h6" className={classes.header}>Fund Wallet</Typography>
            <Tabs value={value} onChange={handleChange} aria-label="fund-tabs" indicatorColor="primary" textColor="primary" variant="fullWidth" className={classes.tabs}>
                <Tab 
                    label={
                        <div className={classes.tabLabel}>
                            <Typography variant="subtitle1" component="p">Bank Transfer</Typography>
                            <Typography variant="subtitle2" component="small">FREE</Typography>
                        </div>
                    } 
                    {...a11yProps(0)} 
                    disableRipple
                />
                <Tab 
                    label={
                        <div className={classes.tabLabel}>
                            <Typography variant="subtitle1" component="p">Card Payment</Typography>
                            <Typography variant="subtitle2" component="small">1.8% FEE</Typography>
                        </div>
                    } 
                    {...a11yProps(1)} 
                    disableRipple
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Typography variant="body2" component="p" className={classes.text}>
                    To fund your wallet via bank transfer, it is mandatory that you include your wallet ID in your transaction reference.
                </Typography>
                <Typography variant="body2" component="p" className={classes.text}>
                    This is the only way we can track your funding transaction.
                </Typography>
                
                <Typography variant="body2" component="p" className={classes.bankDetailsHeader}>
                    Bank Details
                </Typography>
                <section className={classes.bankDetails}>
                    <div>
                        <Typography variant="body2" component="p" className={classes.bankDetailsTitle}>
                            Account Name
                        </Typography>
                        <Typography variant="body2" component="p" className={classes.bankDetailsText}>
                            FXBLOOMS OU
                        </Typography>
                    </div>
                    <div className={classes.accountNumberContainer}>
                        <div>
                            <Typography variant="body2" component="p" className={classes.bankDetailsTitle}>
                                Account Number
                            </Typography>
                            <Typography variant="body2" component="p" className={classes.bankDetailsText}>
                                0093884786
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="body2" component="p" className={classes.bankDetailsTitle}>
                                Sort
                            </Typography>
                            <Typography variant="body2" component="p" className={classes.bankDetailsText}>
                                03-03-00
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <Typography variant="body2" component="p" className={classes.bankDetailsTitle}>
                            Transaction reference
                        </Typography>
                        <Typography variant="body2" component="p" className={classes.bankDetailsText}>
                            889F5F
                        </Typography>
                    </div>
                </section>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography variant="body2" component="p" className={classes.text}>
                    To fund your wallet via your debit/credit card, you will be charged a transaction fee of 1.8% of your total transaction amount.
                </Typography>
                <Button onClick={closeModal} variant="contained" color="primary" fullWidth disableFocusRipple className={classes.button}>Proceed to Stripe</Button>
            </TabPanel>
        </Drawer>
	);
};

FundWalletDrawer.propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
    drawerOpen: PropTypes.bool.isRequired,
};

export default FundWalletDrawer;