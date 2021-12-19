import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../utils/constants';
import { FAQS } from '../../routes';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#f3f3f3',
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

    button: {
        alignSelf: 'center',
        marginTop: theme.spacing(6),

        [theme.breakpoints.down('sm')]: {
            alignSelf: 'stretch'
        }
    }
}));

const FAQs = () => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <Typography variant="h3" className={classes.header}>Frequently Asked Questions</Typography>
            <Typography variant="h6" align="center">We now have an FAQ list that we hope will help you answer some of the more common ones.</Typography>
            <section className={classes.container}>
            </section>
            <Button to={FAQS} component={Link} variant="contained" color="primary" className={classes.button}>GO TO FAQs</Button>
        </section>
    );
};

export default FAQs;