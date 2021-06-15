import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import robust from '../../assets/img/downloads.svg';
import flexibility from '../../assets/img/flexibility.svg';
import user from '../../assets/img/user-friendly.svg';
import layouts from '../../assets/img/users.svg';
import components from '../../assets/img/clients.svg';
import organized from '../../assets/img/organized.svg';

const useStyles = makeStyles(theme => ({
    root: {
        padding: [[theme.spacing(7), theme.spacing(5)]],
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },

    header: {
        margin: '0 auto',
        textAlign: 'center',
        width: '40%',

        '& h4': {
            fontWeight: 600,
            fontStyle: 'italic',
            marginBottom: theme.spacing(2)
        },
        [theme.breakpoints.down('md')]: {
            width: '60%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        }
    },

    features: {
        marginTop: theme.spacing(3),

        '& h5': {
            fontWeight: 600,
            fontStyle: 'italic',
            margin: [[theme.spacing(2), '0']]
        },

        '& span': {
            color: '#333333'
        }
    }
}));

const Features = () => {
    const classes = useStyles();
    return (
        <section className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h4">
                    Tailor-made features
                </Typography>
                <Typography variant="subtitle1">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus ipsam nisi rem ratione alias tenetur, fuga veniam dolorem?
                </Typography>
            </div>
            <Grid container className={classes.features} spacing={5}>
                <Grid item xs={12} md={6} lg={4} align="center">
                    <img src={robust} alt="Robust workflow" />
                    <Typography variant="h5">
                        Robust workflow
                    </Typography>
                    <Typography variant="body1" component="span">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus veritatis saepe soluta?
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align="center">
                    <img src={flexibility} alt="Flexiblity" />
                    <Typography variant="h5">
                        Flexibility
                    </Typography>
                    <Typography variant="body1" component="span">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus veritatis saepe soluta?
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align="center">
                    <img src={user} alt="User friendly" />
                    <Typography variant="h5">
                        User friendly
                    </Typography>
                    <Typography variant="body1" component="span">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus veritatis saepe soluta?
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align="center">
                    <img src={layouts} alt="Multiple Layouts" />
                    <Typography variant="h5">
                        Multiple layouts
                    </Typography>
                    <Typography variant="body1" component="span">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus veritatis saepe soluta?
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align="center">
                    <img src={components} alt="Better Components" />
                    <Typography variant="h5">
                        Better components
                    </Typography>
                    <Typography variant="body1" component="span">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus veritatis saepe soluta?
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={4} align="center">
                    <img src={organized} alt="Well organised" />
                    <Typography variant="h5">
                        Well organised
                    </Typography>
                    <Typography variant="body1" component="span">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus veritatis saepe soluta?
                    </Typography>
                </Grid>
            </Grid>
        </section>
    );
};

export default Features;