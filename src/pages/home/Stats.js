import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import downloads from '../../assets/img/downloads.svg';
import users from '../../assets/img/users.svg';
import clients from '../../assets/img/clients.svg';
import countries from '../../assets/img/countries.svg';
import bulbs from '../../assets/img/bulbs.png';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: theme.spacing(5),
        padding: [[theme.spacing(5), theme.spacing(10)]],

        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        },
        [theme.breakpoints.down('sm')]: {
            gap: theme.spacing(2),
            gridTemplateColumns: '1fr',
            paddingLeft: theme.spacing(2),
            // paddingRight: theme.spacing(1)
        },

        '& div:first-child': {
            '& h3': {
                fontWeight: 700,
                fontStyle: 'italic',
                marginBottom: theme.spacing(1),
                [theme.breakpoints.down('md')]: {
                    fontSize: theme.spacing(4)
                },
                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(3),
                    textAlign: 'center'
                }
            }
        },

        '& div:nth-child(3)': {
            '& h3': {
                fontWeight: 700,
                fontStyle: 'italic',
                [theme.breakpoints.down('md')]: {
                    fontSize: theme.spacing(4)
                },
                [theme.breakpoints.down('sm')]: {
                    fontSize: theme.spacing(3),
                    textAlign: 'center'
                }
            }
        }
    },

    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: theme.spacing(5)
    },

    stat: {
        display: 'flex',
        flexDirection: 'row',

        '& img': {
            alignSelf: 'center',
            marginRight: theme.spacing(2)
        },

        '& h6': {
            fontWeight: 700
        },

        '& span': {

        }
    },

    imageContainer: {
        margin: '0 auto',
        width: '90%'
    },

    image: {
        width: '100%'
    }
}));
const Stats = () => {
    const classes = useStyles();

    return (
        <section>
            <div className={classes.root}>
                <div>
                    <Typography variant="h3">Our 18 years of achievements</Typography>
                    <Typography variant="subtitle1" component="p">With our super powers we have reached this</Typography>
                </div>
                <div className={classes.stats}>
                    <div className={classes.stat}>
                        <img src={downloads} alt="downloads" />
                        <div>
                            <Typography variant="h6">10,000+</Typography>
                            <Typography variant="subtitle2" component="span">Downloads per day</Typography>
                        </div>
                    </div>
                    <div className={classes.stat}>
                        <img src={users} alt="users" />
                        <div>
                            <Typography variant="h6">2 Million</Typography>
                            <Typography variant="subtitle2" component="span">Users</Typography>
                        </div>
                    </div>
                    <div className={classes.stat}>
                        <img src={clients} alt="clients" />
                        <div>
                            <Typography variant="h6">500+</Typography>
                            <Typography variant="subtitle2" component="span">Clients</Typography>
                        </div>
                    </div>
                    <div className={classes.stat}>
                        <img src={countries} alt="countries" />
                        <div>
                            <Typography variant="h6">140</Typography>
                            <Typography variant="subtitle2" component="span">Countries</Typography>
                        </div>
                    </div>
                </div>
                <div>
                    <Typography variant="h3">Enter the world of fashion trends</Typography>
                </div>
                <div>
                    <Typography variant="subtitle1" component="p">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex blanditiis inventore voluptas, hic illo nisi accusamus porro quasi, repellat dolorum vero odit sit voluptate veniam.</Typography>
                </div>
            </div>
            <div className={classes.imageContainer}>
                <img src={bulbs} alt="bulbs" className={classes.image} />
            </div>
        </section>
    );
};

export default Stats;