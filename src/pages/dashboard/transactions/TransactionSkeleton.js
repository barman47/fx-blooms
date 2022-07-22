import { Box, makeStyles } from '@mui/material';
import Skeleton from '@material-ui/lab/Skeleton';

import { COLORS } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        alignItems: 'center',
        padding: theme.spacing(2),
        gap: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            gridTemplateColumns: 'repeat(3, 1fr)',
        },

        [theme.breakpoints.down('sm')]: {
            gap: theme.spacing(2),
            gridTemplateColumns: '1fr 1fr'
        }
    }
}));

const TransactionSkeleton = () => {
    const classes = useStyles();

    return (
        <Box component="section" className={classes.root}>
            <Box component="div">
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={50} />
            </Box>
            <Box component="div">
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={50} />
            </Box>
            <Box component="div">
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={50} />
            </Box>
            <Box component="div">
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={50} />
            </Box>
            <Box component="div">
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={50} />
            </Box>
            <Skeleton variant="text" height={50} />
        </Box>
    );
};

export default TransactionSkeleton;