import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS, SHADOW } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
	root: {
        borderRadius: '5px',
        boxShadow: SHADOW,
        display: 'grid',
        gridTemplateColumns: '1fr',

        '& header': {
            backgroundColor: COLORS.lightTeal,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: [[theme.spacing(2), theme.spacing(3)]],

            [theme.breakpoints.down('sm')]: {
                padding: [[theme.spacing(1), theme.spacing(2)]]
            },

            '& p': {
                fontWeight: 300,
                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(1)
                },
            }
        },

        '& div': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: [[theme.spacing(4), theme.spacing(3)]],

            [theme.breakpoints.down('sm')]: {
                padding: [[theme.spacing(1), theme.spacing(2)]]
            },

            '& span': {
                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(1)
                },  
            }
        }
	},

    button: {
        padding: [[theme.spacing(0.5), theme.spacing(5)]],
        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(0.1), theme.spacing(0.5)]],
            minWidth: 'initial'
        }
    },

    buttonLabel: {
        [theme.breakpoints.down('sm')]: {
            padding: [[theme.spacing(0.5), theme.spacing(0.2)]],
        }
    }
}));

const Listing = () => {
    const classes = useStyles();

    return (
        <section className={classes.root}>
            <header>
                <Typography variant="body2" component="p">Listed by: walecalfos</Typography>
                <Typography variant="body2" component="p">100% Listings, 89% Completion</Typography>
            </header>
            <div>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Have</span>
                    &#8364;25,000.00
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>I Want</span>
                    &#8358;(NGN)
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Minimum Amount</span>
                    &#8364;5,000.00
                </Typography>
                <Typography variant="subtitle2" component="span">
                    <span style={{ display: 'block', fontWeight: 300, marginBottom: '10px' }}>Exchange rate</span>
                    &#8358;650 to &#8364;1
                </Typography>
                <Button 
                    to="#!"
                    component={RouterLink} 
                    variant="contained" 
                    size="small" 
                    color="primary"
                    disableElevation
                    classes={{ 
                        contained: classes.button,
                        root: classes.button
                        // roo: classes.buttonLabel 
                    }}
                >
                    Contact
                </Button>
            </div>
        </section>
    );
};

export default Listing;
