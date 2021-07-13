import { useState } from 'react';
import { Button, Divider, Grid, Radio, TextField, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),  
        paddingRight: theme.spacing(2),  
    },

    button: {
        marginBottom: theme.spacing(2),
        paddingBottom: theme.spacing(1.5),
        paddingTop: theme.spacing(1.5),
    }
}));

const Actions = () => {
    const classes = useStyles();
    const theme = useTheme();

    const [successfulTransaction, setSuccessfulTransaction] = useState(false);
    const [ratingComment, setRatingComment] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
		<section className={classes.root}>
			<Typography variant="subtitle1" component="p">Actions</Typography>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Button 
                        variant="outlined" 
                        color="primary"
                        fullWidth
                        className={classes.button}
                    >
                        Edit Listing
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        fullWidth
                    >
                        Cancel Negotiation
                    </Button>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item>
                    <div style={{textAlign: 'center' }}>
                        <Typography variant="subtitle1" component="p" style={{ fontSize: theme.spacing(1.5) }}>Is this a successful transaction?</Typography>
                        <Radio 
                            value="yes"
                            color="primary"
                            onChange={() => setSuccessfulTransaction(!successfulTransaction)}
                            name="successful-transaction"
                        />
                        Yes
                        &nbsp;&nbsp;&nbsp;
                        <Radio 
                            value="yes"
                            color="primary"
                            onChange={() => setSuccessfulTransaction(!successfulTransaction)}
                            name="successful-transaction"
                        />
                        No
                    </div>
                </Grid>
                <Grid item>
                    <Divider />
                </Grid>
                <Grid item>
                    <form onSubmit={onSubmit}>
                        <Grid container direction="column" spacing={3}>
                            <Grid item>
                                <Typography variant="subtitle1" component="p">Rate this user</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1" component="p">Star Rating Here . . .</Typography>
                            </Grid>
                            <Grid item>
                                <TextField 
                                    type="text"
                                    variant="outlined"
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    placeholder="Enter message"
                                    multiline
                                    rows={5}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <Button 
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Submit       
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
		</section>
    );
};

export default Actions;