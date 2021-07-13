import { Avatar, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { COLORS } from '../../../utils/constants';

import avatar from '../../../assets/img/avatar.jpg';

const useStyles = makeStyles(theme => ({
	message: {
		borderBottom: `1px solid ${COLORS.borderColor}`,
		borderRight: `1px solid ${COLORS.borderColor}`,
        cursor: 'pointer',
		padding: theme.spacing(1), 
        
		'& span': {
            color: COLORS.grey,
			fontWeight: 300
		},
        
        '&:first-child': {
            borderTop: `1px solid ${COLORS.borderColor}`
        },

        '&:hover': {
            backgroundColor: COLORS.offWhite
        }
	}
}));

const Message = () => {
	const classes = useStyles();

    return (
        <Grid container direction="row" justify="space-between" alignItems="center" className={classes.message}>
            <Grid item>
                <Grid container direction="row" alignItems="center" spacing={1}>
                    <Grid item>
                        <Avatar src={avatar} alt="Avatar Alt" />
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1" component="p">carolfernandes</Typography>
                        <Typography variant="subtitle2" component="span" style={{ fontStyle: 'italic' }}>Hello</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container direction="column">
                    <Grid item>
                        <Typography variant="subtitle2" component="span">11:30pm</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" component="span">Today</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Message;