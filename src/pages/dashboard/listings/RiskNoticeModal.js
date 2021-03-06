import { useEffect, useState } from 'react';
import { 
    Backdrop,
	Button,
    Fade,
    Modal,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Information } from 'mdi-material-ui';

import { COLORS, SHADOW } from '../../../utils/constants';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: theme.spacing(1),
        alignItems: 'center',
        width: '25vw',
        height: 'auto',
        boxShadow: SHADOW,
        padding: theme.spacing(5),

        [theme.breakpoints.down('md')]: {
            width: '45vw',
        },
        
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            height: 'auto',
            width: '80vw',
        },

        '& p': {
            fontWeight: 300,
            textAlign: 'justify'
        },

        '& div': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    },

    icon: {
        color: '#ffa500',
        fontSize: theme.spacing(5)
    }
}));

const RiskNoticeModal = () => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);
    const HAS_SEEN_RISK_NOTICE = 'hasSeenRiskNotice';

    useEffect(() => {
        if (!localStorage.getItem(HAS_SEEN_RISK_NOTICE)) {
            setOpen(true);
        }
        // eslint-disable-next-line
    }, []);


    const closeModal = () => {
        setOpen(false);
        localStorage.setItem(HAS_SEEN_RISK_NOTICE, true);
    };

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            disableEscapeKeyDown
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <section className={classes.container}>
                    <div>
                        <Information className={classes.icon} />
                    </div>
                    <Typography variant="h5" align="center">Notice</Typography>
                    <Typography variant="subtitle1" component="p">
                        Depending on the type of activitiy a USER wants to carry out, USERS will be subjected to more verifications and requirements as measures put in place to ensure utmost security on the FXBLOOMS platform.
                    </Typography>
                    <Button onClick={closeModal} color="primary">Okay, I Understand</Button>
                </section>
            </Fade>
        </Modal>
	);
};

export default RiskNoticeModal;