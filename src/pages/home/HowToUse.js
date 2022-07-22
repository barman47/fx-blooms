import { Link } from 'react-router-dom';
import { Button, Divider, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';

import { COLORS } from '../../utils/constants';
import { SIGN_UP, HOW_IT_WORKS } from '../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#f7f7f7',
        color: COLORS.offBlack,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(5),

        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    header: {
        fontWeight: 700,
        marginBottom: theme.spacing(3),
        textAlign: 'center',

        [theme.breakpoints.down('sm')]: {
            fontSize: `${theme.spacing(1)} !important`
        }
    },

    container: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr 2fr 1fr 2fr 1fr',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(7),
        padding: theme.spacing(0, 8),

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr 1fr',
        }
    },

    circle: {
        justifySelf: 'center',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),
        transition: 'all 0.3s ease-in-out',

        '&:hover': {
            transform: 'scale(1.1)',
        },

        [theme.breakpoints.down('md')]: {
            display: 'none' 
        }
    },

    mobileCircle: {
        justifySelf: 'center',
        borderRadius: '50%',
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),
        transition: 'all 0.3s ease-in-out',

        '&:hover': {
            transform: 'scale(1.1)',
        },

        [theme.breakpoints.down('md')]: {
            display: 'flex' 
        }
    },

    circle1: {
        backgroundColor: '#ccd9d9',
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    circle2: {
        backgroundColor: '#86a9a9',
        borderRadius: '50%',
        
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    circle3: {
        backgroundColor: theme.palette.primary.main,
        width: theme.spacing(1),
        height: theme.spacing(1),
    },

    divider: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        },
    },

    number: {
        color: `${COLORS.offWhite} !important` ,
        fontWeight: 700
    },

    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        justifyContent: 'center',
        gap: theme.spacing(10),
        marginTop: theme.spacing(4),

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: 'repeat(2, 1fr)',
        },

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        }
    },

    contentContainer: {
        borderBottom: '3px solid #86a9a9',
        borderRadius: '10px',
        paddingBottom: theme.spacing(2),

        '& h6': {
            marginBottom: theme.spacing(3)
        },

        '& p': {
            color: COLORS.offBlack,
            fontWeight: 300
        }
    },

    mobileCircleContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing(4),
    },

    button: {
        alignSelf: 'center',
        marginTop: theme.spacing(6),

        [theme.breakpoints.down('sm')]: {
            alignSelf: 'stretch'
        }
    }
}));

const HowToUse = () => {
    const classes = useStyles();

    return (
        <section className={classes.root} id={HOW_IT_WORKS}>
            <Typography variant="h3" className={classes.header}>How to Use</Typography>
            <Typography variant="h6" align="center">Quick description of how to get started with FXBLOOMS</Typography>
            <section className={classes.container}>
                <div className={clsx(classes.circle, classes.circle1)}>
                    <div className={clsx(classes.circle, classes.circle2)}>
                        <div className={clsx(classes.circle, classes.circle3)}>
                            <Typography variant="body2" component="p" className={classes.number}>1</Typography>
                        </div>
                    </div>
                </div>
                <Divider className={classes.divider} />
                <div className={clsx(classes.circle, classes.circle1)}>
                    <div className={clsx(classes.circle, classes.circle2)}>
                        <div className={clsx(classes.circle, classes.circle3)}>
                            <Typography variant="body2" component="p" className={classes.number}>2</Typography>
                        </div>
                    </div>
                </div>
                <Divider className={classes.divider} />
                <div className={clsx(classes.circle, classes.circle1)}>
                    <div className={clsx(classes.circle, classes.circle2)}>
                        <div className={clsx(classes.circle, classes.circle3)}>
                            <Typography variant="body2" component="p" className={classes.number}>3</Typography>
                        </div>
                    </div>
                </div>
                <Divider className={classes.divider} />
                <div className={clsx(classes.circle, classes.circle1)}>
                    <div className={clsx(classes.circle, classes.circle2)}>
                        <div className={clsx(classes.circle, classes.circle3)}>
                            <Typography variant="body2" component="p" className={classes.number}>4</Typography>
                        </div>
                    </div>
                </div>
            </section>
            <section className={classes.content}>
                <div className={classes.contentContainer}>
                    <div className={classes.mobileCircleContainer}>
                        <div className={clsx(classes.mobileCircle, classes.circle1)}>
                            <div className={clsx(classes.mobileCircle, classes.circle2)}>
                                <div className={clsx(classes.mobileCircle, classes.circle3)}>
                                    <Typography variant="body2" component="p" className={classes.number}>1</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Typography variant="h6" align="center">Get Onboard</Typography>
                    <Typography variant="body2" component="p" align="center">Create a free account in minutes.</Typography>
                </div>
                <div className={classes.contentContainer}>
                    <div className={classes.mobileCircleContainer}>
                        <div className={clsx(classes.mobileCircle, classes.circle1)}>
                            <div className={clsx(classes.mobileCircle, classes.circle2)}>
                                <div className={clsx(classes.mobileCircle, classes.circle3)}>
                                    <Typography variant="body2" component="p" className={classes.number}>2</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Typography variant="h6" align="center">Meet Community Members</Typography>
                    <Typography variant="body2" component="p" align="center">Log in to your account to see listings by other users.</Typography>
                </div>
                <div className={classes.contentContainer}>
                    <div className={classes.mobileCircleContainer}>
                        <div className={clsx(classes.mobileCircle, classes.circle1)}>
                            <div className={clsx(classes.mobileCircle, classes.circle2)}>
                                <div className={clsx(classes.mobileCircle, classes.circle3)}>
                                    <Typography variant="body2" component="p" className={classes.number}>3</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Typography variant="h6" align="center">Complete Verification Process</Typography>
                    <Typography variant="body2" component="p" align="center">Provide the required document for verification when you initiate your first transaction.</Typography>
                </div>
                <div className={classes.contentContainer}>
                    <div className={classes.mobileCircleContainer}>
                        <div className={clsx(classes.mobileCircle, classes.circle1)}>
                            <div className={clsx(classes.mobileCircle, classes.circle2)}>
                                <div className={clsx(classes.mobileCircle, classes.circle3)}>
                                    <Typography variant="body2" component="p" className={classes.number}>4</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Typography variant="h6" align="center">Initiate Your First Transaction</Typography>
                    <Typography variant="body2" component="p" align="center">Make a listing or find the most suitable offer.</Typography>
                </div>
            </section>
            <Button to={SIGN_UP} component={Link} variant="contained" color="primary" className={classes.button}>GET STARTED</Button>
        </section>
    );
};

export default HowToUse;