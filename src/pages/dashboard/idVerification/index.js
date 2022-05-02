import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountMultiple, ArrowRight, CardAccountDetailsOutline } from 'mdi-material-ui';
import PropTypes from 'prop-types';

import { getIdVerificationLink, getResidencePermitLink } from '../../../actions/customer';

import { ID_STATUS, COLORS, TRANSITION } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(5),
        padding: theme.spacing(0, 5),

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(0, 2)
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

    info: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),

        '& p': {
            textAlign: 'center'
        },

        '& p:first-child': {
            fontWeight: 'bold',
            marginBottom: theme.spacing(1)
        }
    },

    identity: {
        display: 'grid',
        gridTemplateColumns: '1fr 0.1fr 1fr',
        gap: theme.spacing(10),

        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: '1fr',
        },

        '& section': {
            backgroundColor: 'rgba(30, 98, 98, 0.92)',
            borderRadius: theme.shape.borderRadius,
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(3),

            '& div:first-child': {
                backgroundColor: COLORS.offWhite,
                borderRadius: theme.shape.borderRadius,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                width: '40px'
            },

            '& h6': {
                color: COLORS.offWhite,
                marginTop: theme.spacing(3)
            },

            '& p': {
                color: COLORS.offWhite,
                fontWeight: 300,
                marginBottom: theme.spacing(1),
                marginTop: theme.spacing(1),
            },

            '& div:last-child': {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: theme.spacing(2)
            }
        }
    },

    divider: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: theme.shape.borderRadius,
        alignSelf: 'center',
        height: '65%',
        width: '3px',

        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },

    icon: {
        color: theme.palette.primary.main,
    },

    verifyButton: {
        backgroundColor: COLORS.offWhite,
        color: theme.palette.primary.main,
        transition: TRANSITION,

        '&:hover': {
            backgroundColor: COLORS.offWhite
        }
    },

    unverifiedButton: {
        backgroundColor: '#c4c4c4',
        borderRadius: '30px',
        color: `${theme.palette.primary.main} !important`,
        padding: theme.spacing(0.6, 2)
    },

    arrowIcon: {
        transform: 'rotate(-20deg)'
    }
}));

const IDVerification = ({ getIdVerificationLink, getResidencePermitLink }) => {
    const classes = useStyles();

    const { email, idVerificationLink, residencePermitUrl } = useSelector(state => state.customer);
    const { idStatus, residencePermitStatus } = useSelector(state => state.customer.stats);

    const { APPROVED } = ID_STATUS;

    useEffect(() => {
        if (idStatus !== APPROVED && !idVerificationLink) {
            getIdVerificationLink(email);
        }
        if (residencePermitStatus !== APPROVED && !residencePermitUrl) {
            getResidencePermitLink();
        }
    }, [APPROVED, email, getIdVerificationLink, getResidencePermitLink, idVerificationLink, residencePermitUrl, idStatus, residencePermitStatus]);

    const verifyID = () => {
        window.open(idVerificationLink);
        // window.open('/dashboard/veriff')
    };

    const verifyEUID = () => {
        window.open(residencePermitUrl);
        // window.open('/dashboard/veriff')
    };

    return (
        <>
            <section className={classes.root}>
                <div className={classes.header}>
                    <div>
                        <Typography variant="h4" color="primary">ID Verification</Typography>
                        <Typography variant="body1" component="p">Kindly select your preferred ID type below</Typography>
                        <hr className={classes.hr} />
                    </div>
                </div>
                <div className={classes.info}>
                    <Typography variant="body1" component="p" color="primary">Upload Requirement</Typography>
                    <Typography variant="body1" component="p" color="primary">Required Preference: Ensure your camera is of high qualiity </Typography>
                </div>
                <div className={classes.identity}>
                    <section>
                        <div>
                            <CardAccountDetailsOutline className={classes.icon} />
                        </div>
                        <Typography variant="h6" color="primary">EU issued ID</Typography>
                        <Typography variant="body2" component="p" color="primary">Required to SELL and BUY.</Typography>
                        <div>
                            {residencePermitStatus !== APPROVED ? 
                                <>
                                    <Typography variant="body2" component="p" className={classes.unverifiedButton}>Unverified</Typography>
                                    <Button size="small" variant="contained" color="primary" className={classes.verifyButton} startIcon={<ArrowRight className={classes.arrowIcon} />} onClick={verifyEUID}>Verify</Button>
                                </>
                                :
                                <Typography variant="body2" component="p" className={classes.unverifiedButton}>Verified</Typography>
                            }
                        </div>
                    </section>
                    <div className={classes.divider}></div>
                    <section>
                        <div>
                            <AccountMultiple className={classes.icon} />
                        </div>
                        <Typography variant="h6" color="primary">Other ID</Typography>
                        <Typography variant="body2" component="p" color="primary">Required to BUY only.</Typography>
                        <div>
                            {idStatus !== APPROVED ? 
                                <>
                                    <Typography variant="body2" component="p" className={classes.unverifiedButton}>Unverified</Typography>
                                    <Button size="small" variant="contained" color="primary" className={classes.verifyButton} startIcon={<ArrowRight className={classes.arrowIcon} />} onClick={verifyID}>Verify</Button>
                                </>
                                :
                                <Typography variant="body2" component="p" className={classes.unverifiedButton}>Verified</Typography>
                            }
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
};

IDVerification.propTypes = {
    getIdVerificationLink: PropTypes.func.isRequired,
    getResidencePermitLink: PropTypes.func.isRequired
};

export default connect(undefined, { getIdVerificationLink, getResidencePermitLink })(IDVerification);