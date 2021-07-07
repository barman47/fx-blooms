// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Grid,
    Typography
} from '@material-ui/core';

import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(3),
    },

    title: {
        fontWeight: 600
    },

    link: {
        color: theme.palette.primary.main,
        cursor: 'pointer'
    },

    filterContainer: {
        marginTop: theme.spacing(2)
    },

    filter: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: [[theme.spacing(3), theme.spacing(2)]]
    },

    active: {
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
    },

    table: {
        backgroundColor: COLORS.lightTeal,
        marginTop: theme.spacing(3),

        '& header': {
            backgroundColor: COLORS.white,
            display: 'grid',
            gridTemplateColumns: '0.2fr 1fr 1.2fr 1.2fr 1.7fr 1.2fr 0.8fr',
            marginBottom: theme.spacing(3),
            
            '& span': {
                color: theme.palette.primary.main,
                fontWeight: 600,
                padding: theme.spacing(1),

                [theme.breakpoints.down('md')]: {
                    fontSize: theme.spacing(1.5)
                }
            }
        }
    },

    content: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(1)
    },

    customer: {
        backgroundColor: COLORS.white,
        display: 'grid',
        gridTemplateColumns: '0.2fr 1fr 1.2fr 1.2fr 1.7fr 1.2fr 0.8fr',

        '& span': {
            color: COLORS.offBlack,
            fontWeight: 400,
            padding: theme.spacing(1),

            [theme.breakpoints.down('md')]: {
                fontSize: theme.spacing(1.2)
            }
        }
    },

    customerLink: {
        color: `${theme.palette.primary.main} !important`,
        cursor: 'pointer'
    },

    button: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
}));

const Customers = () => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <Grid container direction="row" justify="space-between">
                <Grid item>
                    <Typography variant="body1" className={classes.title}>Customers</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" className={classes.link}>Download Records</Typography>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={5} className={classes.filterContainer}>
                <Grid item xs={6} md={3}>
                    <div className={classes.filter}>
                        <Typography variant="subtitle2" component="span">New</Typography>
                        <Typography variant="subtitle2" component="span">29</Typography>
                    </div>
                </Grid>
                <Grid item xs={6} md={3}>
                    <div className={classes.filter}>
                        <Typography variant="subtitle2" component="span">Verified</Typography>
                        <Typography variant="subtitle2" component="span">29</Typography>
                    </div>
                </Grid>
                <Grid item xs={6} md={3}>
                    <div className={classes.filter}>
                        <Typography variant="subtitle2" component="span">Rejected</Typography>
                        <Typography variant="subtitle2" component="span">29</Typography>
                    </div>
                </Grid>
                <Grid item xs={6} md={3}>
                    <div className={classes.filter}>
                        <Typography variant="subtitle2" component="span">All</Typography>
                        <Typography variant="subtitle2" component="span">29</Typography>
                    </div>
                </Grid>
            </Grid>
            <section className={classes.table}>
                <header>
                    <Typography variant="subtitle2" component="span">#</Typography>
                    <Typography variant="subtitle2" component="span">Full Name</Typography>
                    <Typography variant="subtitle2" component="span">Phone Number</Typography>
                    <Typography variant="subtitle2" component="span">ID Type</Typography>
                    <Typography variant="subtitle2" component="span">Email Address</Typography>
                    <Typography variant="subtitle2" component="span">Username</Typography>
                    <Typography variant="subtitle2" component="span"></Typography>
                </header>
                <main className={classes.content}>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <div className={classes.customer}>
                        <Typography variant="subtitle2" component="span">1</Typography>
                        <Typography variant="subtitle2" component="span">Kristin Watson</Typography>
                        <Typography variant="subtitle2" component="span">2348023456789</Typography>
                        <Typography variant="subtitle2" component="span">Driver's Licence</Typography>
                        <Typography variant="subtitle2" component="span">nomsouzoanya@yahoo.co.uk</Typography>
                        <Typography variant="subtitle2" component="span">cherubbandana</Typography>
                        <Typography variant="subtitle2" component="span" className={classes.customerLink}>View Details</Typography>
                    </div>
                    <Button color="primary" className={classes.button}>Load More</Button>
                </main>
            </section>
        </section>
    );
}

export default Customers;