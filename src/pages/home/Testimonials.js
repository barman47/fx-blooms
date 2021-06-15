import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import hubspot from '../../assets/img/hubspot.svg';
import airbnb from '../../assets/img/airbnb.svg';
import my from '../../assets/img/my.svg';

import { COLORS } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: theme.spacing(5),
        padding: [[theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr',
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5)
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },
    },

    left: {
        justifySelf: 'flex-end',
        display: 'flex',
        flexDirection: 'column',
        width: '80%',

        [theme.breakpoints.down('md')]: {
            width: '100%'
        },

        '& h3': {
            fontStyle: 'italic',
            fontWeight: '800',
            [theme.breakpoints.down('md')]: {
                textAlign: 'center'
            }
        },

        '& p': {
            margin: [[theme.spacing(2), 0]]
        }
    },

    text: {
        [theme.breakpoints.down('md')]: {
            textAlign: 'center'
        }
    },

    paper: {
        borderRadius: '8px',
        padding: [[theme.spacing(4), theme.spacing(7)]],
        
        '& p': {
            margin: [[theme.spacing(2), 0, 0, 0]]
        },

        '& h6': {
            fontWeight: 600,
            marginTop: theme.spacing(2)
        },

        '& span': {
            color: COLORS.grey,
            lineHeight: '24px'
        }
    },

    leftPaper: {
        alignSelf: 'flex-end',
        width: '55%',
        [theme.breakpoints.down('md')]: {
            alignSelf: 'flex-start',
            width: '84%'
        },
        [theme.breakpoints.down('sm')]: {
            alignSelf: 'flex-start',
            width: '68%'
        }
    },

    right: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            width: '100%'
        },

        '& div:last-child': {
            width: '45%',
            [theme.breakpoints.down('md')]: {
                width: '84%'
            },
            [theme.breakpoints.down('sm')]: {
                alignSelf: 'flex-start',
                width: '68%'
            }
        }
    },

    rightPaper: {
        width: '60%',
        [theme.breakpoints.down('md')]: {
            width: '84%'
        },
        [theme.breakpoints.down('sm')]: {
            alignSelf: 'flex-start',
            width: '68%'
        }
    }
}));

const Testimonials = () => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <div className={classes.left}>
                <Typography variant="h3">
                    Real Stories from Real Customers
                </Typography>
                <Typography variant="body1" component="p" className={classes.text}>
                    Get inspired by these stories.
                </Typography>
                <Paper elevation={15} className={clsx(classes.paper, classes.leftPaper)}>
                <img src={hubspot} alt="Hubspot Logo" />
                    <Typography variant="body1" component="p">
                        To quickly start my startup landing page design, I was looking for a landing page UI Kit. Landify is one of the best landing page UI kit I have come across. It’s so flexible, well organised and easily editable.
                    </Typography>
                    <Typography variant="h6">
                        Floyd Miles
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        Vice President, GoPro
                    </Typography>
                </Paper>
            </div>
            <div className={classes.right}>
                <Paper elevation={15} className={clsx(classes.paper, classes.rightPaper)}>
                    <img src={airbnb} alt="Airbnb Logo" />
                    <Typography variant="body1" component="p">
                        I used landify and created a landing page for my startup within a week. The Landify UI Kit is simple and highly intuitive, so anyone can use it.
                    </Typography>
                    <Typography variant="h6">
                        Jane Cooper
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        CEO, Airbnb
                    </Typography>
                </Paper>
                <Paper elevation={15} className={clsx(classes.paper, classes.rightPaper)}>
                    <img src={my} alt="My Logo" />
                    <Typography variant="body1" component="p">
                        Landify saved our time in designing my company page.
                    </Typography>
                    <Typography variant="h6">
                        Kristin Watson
                    </Typography>
                    <Typography variant="subtitle2" component="span">
                        Co-Founder, BookMyShow
                    </Typography>
                </Paper>
            </div>
        </section>
    );
};

export default Testimonials;