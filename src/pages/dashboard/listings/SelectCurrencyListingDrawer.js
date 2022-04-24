import { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, Fade, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CurrencyEur, CurrencyNgn } from 'mdi-material-ui';

import { MAKE_LISTING } from '../../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiPaper-root': {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
            margin: '0 auto',
            width: '40vw',
            padding: theme.spacing(2),
            overflowX: 'hidden',

            [theme.breakpoints.down('md')]: {
                width: '85vw'
            }
        }
    },

    button: {
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2)
    }
}));

const SelectCurrencyListingDrawer = forwardRef((props, ref) => {
    const classes = useStyles();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const toggleDrawer = () => setOpen(!open);

    useImperativeHandle(ref, () => ({
        toggleDrawer: toggleDrawer
    }));

    const handleEurButtonClick = () => {
        navigate(MAKE_LISTING, { state: { eur: true } });
        toggleDrawer();
    };

    const handleNgnButtonClick = () => {
        navigate(MAKE_LISTING, { state: { ngn: true } });
        toggleDrawer();
    };

    return (
        <Drawer anchor="bottom" open={open} onClose={toggleDrawer} className={classes.root}>
            <Fade in={open}>
                <Grid container direction="row" spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">What currency are you willing to SELL?</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            className={classes.button}
                            variant="contained" 
                            color="primary"
                            size="large"
                            fullWidth
                            disableElevation
                            disableRipple
                            disableFocusRipple
                            disableTouchRipple
                            startIcon={<CurrencyEur />}
                            onClick={handleEurButtonClick}
                        >
                            SELL EUR
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button 
                            className={classes.button}
                            variant="outlined" 
                            color="primary"
                            size="large"
                            fullWidth
                            disableElevation
                            disableRipple
                            disableFocusRipple
                            disableTouchRipple
                            startIcon={<CurrencyNgn />}
                            onClick={handleNgnButtonClick}
                        >
                            SELL NGN
                        </Button>
                    </Grid>
                </Grid>
            </Fade>
        </Drawer>
    );
});

export default SelectCurrencyListingDrawer;