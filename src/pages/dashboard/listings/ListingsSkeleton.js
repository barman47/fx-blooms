import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    skeletonContainer: {
		display: 'grid',
			gridTemplateColumns: '1fr',
			gap: theme.spacing(4),
			
		'& div': {
			display: 'grid',
			gridTemplateColumns: '1fr',
			gap: theme.spacing(2),
		}
	},

	skeletonHeader: {
		borderTopLeftRadius: theme.shape.borderRadius,
		borderTopRightRadius: theme.shape.borderRadius
	},
	
	skeletonBody: {
		borderBottomLeftRadius: theme.shape.borderRadius,
		borderBottomRightRadius: theme.shape.borderRadius
	},

	skeleton: {
		width: '100%'
	}
}));

const ListingsSkeleton = () => {
    const classes = useStyles();

    return (
        <section className={classes.skeletonContainer}>
            <div>
                <Skeleton variant="rect" height={40} className={classes.skeletonHeader} />
                <Skeleton variant="rect" height={90} className={classes.skeletonBody} />
            </div>
            <div>
                <Skeleton variant="rect" height={40} className={classes.skeletonHeader} />
                <Skeleton variant="rect" height={90} className={classes.skeletonBody} />
            </div>
            <div>
                <Skeleton variant="rect" height={40} className={classes.skeletonHeader} />
                <Skeleton variant="rect" height={90} className={classes.skeletonBody} />
            </div>
            <div>
                <Skeleton variant="rect" height={40} className={classes.skeletonHeader} />
                <Skeleton variant="rect" height={90} className={classes.skeletonBody} />
            </div>
            <div>
                <Skeleton variant="rect" height={40} className={classes.skeletonHeader} />
                <Skeleton variant="rect" height={90} className={classes.skeletonBody} />
            </div>
            <div>
                <Skeleton variant="rect" height={40} className={classes.skeletonHeader} />
                <Skeleton variant="rect" height={90} className={classes.skeletonBody} />
            </div>
            <div>
                <Skeleton variant="rect" height={40} className={classes.skeletonHeader} />
                <Skeleton variant="rect" height={90} className={classes.skeletonBody} />
            </div>
            <div>
                <Skeleton variant="rect" height={40} className={classes.skeletonHeader} />
                <Skeleton variant="rect" height={90} className={classes.skeletonBody} />
            </div>
        </section>
    );
};

export default ListingsSkeleton;