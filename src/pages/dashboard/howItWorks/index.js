import { useEffect } from 'react';
import { 
    Box,
    // Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
        padding: theme.spacing(0, 5),

        [theme.breakpoints.down('sm')]: {
            padding: 0
        },
        
        '& header': {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            
            [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
            },
            
            '& h6': {
                fontWeight: 600
            },

            '& p': {
                color: theme.palette.primary.main,
                cursor: 'pointer',

                [theme.breakpoints.down('sm')]: {
                    marginTop: theme.spacing(2)
                },
            }
        }
    }
}));

const HowItWorks = ({ handleSetTitle }) => {
    const classes = useStyles();

    useEffect(() => {
        handleSetTitle('How it works');
        // eslint-disable-next-line
    }, []);

    return (
        <Box component="section" className={classes.root}>
            <header>
                How it works
            </header>
        </Box>
    );
};

export default HowItWorks;