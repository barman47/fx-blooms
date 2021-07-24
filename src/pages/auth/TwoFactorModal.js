import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
    Backdrop,
	Button,
    Fade,
	Grid,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Lock } from 'mdi-material-ui';

import { getBarcode } from '../../actions/twoFactor';
import { COLORS, SHADOW } from '../../utils/constants';
import { SETUP_2FA } from '../../routes';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '50vw',
        height: '30vh',
        boxShadow: SHADOW,
        padding: theme.spacing(5, 10),

        [theme.breakpoints.down('lg')]: {
            height: '50vh',
        },
        [theme.breakpoints.down('md')]: {
            height: '40vh',
            width: '70vw',
        },
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            height: '40vh',
            width: '90vw',
        },
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center',

        '& span:nth-child(3)': {
            fontWeight: 300
        }
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(5)
    }
}));

const TwoFactorModal = ({ open, getBarcode }) => {
	const classes = useStyles();
    const history = useHistory();


    const [modalOpen, setModalOpen] = useState(false);
    
    useEffect(() => {
        setModalOpen(open);
        if (open) {
            getBarcode();
        }
    }, [getBarcode, open]);

    const closeModal = () => {
        setModalOpen(false);
        return history.push(SETUP_2FA);
    };

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modalOpen}
            disableBackdropClick
            disableEscapeKeyDown
            onClose={() => setModalOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={modalOpen}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} className={classes.item}>
                        <Lock className={classes.icon} />
                        <Typography variant="h6">
                            2 Factor Authentication
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            FXBlooms requires that you set up your 2 factor authentication for extra security
                        </Typography>
                        <Button onClick={closeModal} color="primary">Set It Up</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
};

TwoFactorModal.propTypes = {
    getBarcode: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default connect(undefined, { getBarcode })(TwoFactorModal);