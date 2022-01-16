import { useState, forwardRef, useImperativeHandle } from 'react';
import { 
    Backdrop,
    Box,
	Button,
    Fade,
	Grid,
    Modal,
	Tooltip,
	Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CheckboxMarkedCircle } from 'mdi-material-ui';
import {
    FacebookShareButton,
    FacebookIcon,
    InstapaperShareButton,
    InstapaperIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TwitterShareButton,
    TwitterIcon,
    TelegramShareButton,
    TelegramIcon,
    WhatsappShareButton,
    WhatsappIcon
} from 'react-share';

import { COLORS, SHADOW } from '../../utils/constants';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        backgroundColor: COLORS.lightTeal,
        borderRadius: theme.shape.borderRadius,
        width: '45vw',
        height: '30vw',
        boxShadow: SHADOW,
        padding: theme.spacing(5, 10),

        [theme.breakpoints.down('md')]: {
            height: '50vw',
            width: '60vw',
        },
        
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(5, 2),
            height: '60vh',
            width: '90vw'
        }
    },

    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        textAlign: 'center',

        '& p': {
            fontWeight: 300
        }
    },

    icon: {
        color: theme.palette.primary.main,
        fontSize: theme.spacing(5)
    },

    shareContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: theme.spacing(2),
        marginBottom: theme.spacing(2),

        [theme.breakpoints.down('sm')]: {
            width: '60%',
            gridTemplateColumns: 'repeat(3, 1fr)',
        }
        // width: '100%',
    },

    button: {
        borderRadius: theme.shape.borderRadius,
        height: theme.spacing(5.5),
        width: theme.spacing(5.5)
    }
}));

const TransactionCompleteModal = forwardRef((props, ref) => {
	const classes = useStyles();

    const [open, setOpen] = useState(false);

    const URL = 'https://www.fxblooms.com';

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setOpen(true);
        },

        closeModal: () => {
            setOpen(false);
        }
    }));

	return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            disableBackdropClick
            disableEscapeKeyDown
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} className={classes.item}>
                        <CheckboxMarkedCircle className={classes.icon} />
                        <Typography variant="subtitle1" component="p">Your transaction is now completed, thanks for using FXBLOOMS.</Typography>
                        <Typography variant="subtitle1" component="p">Kindly tell others about your experience.</Typography>
                        <Box component="div" className={classes.shareContainer}>
                            <Tooltip title="Share via Facebook" arrow>
                                <FacebookShareButton
                                    url={URL}
                                >
                                    <FacebookIcon  className={classes.button} />
                                </FacebookShareButton>
                            </Tooltip>
                            <Tooltip title="Share via Instagram" arrow>
                                <InstapaperShareButton
                                    url={URL}
                                >
                                    <InstapaperIcon  className={classes.button} />
                                </InstapaperShareButton>
                            </Tooltip>
                            <Tooltip title="Share via LinkedIn" arrow>
                                <LinkedinShareButton
                                    url={URL}
                                >
                                    <LinkedinIcon  className={classes.button} />
                                </LinkedinShareButton>
                            </Tooltip>
                            <Tooltip title="Share via Twitter" arrow>
                                <TwitterShareButton
                                    url={URL}
                                >
                                    <TwitterIcon  className={classes.button} />
                                </TwitterShareButton>
                            </Tooltip>
                            <Tooltip title="Share via Telegram" arrow>
                                <TelegramShareButton
                                    url={URL}
                                >
                                    <TelegramIcon  className={classes.button} />
                                </TelegramShareButton>
                            </Tooltip>
                            <Tooltip title="Share via Whatsapp" arrow>
                                <WhatsappShareButton
                                    url={URL}
                                >
                                    <WhatsappIcon  className={classes.button} />
                                </WhatsappShareButton>
                            </Tooltip>
                        </Box>
                        <Button variant="contained" onClick={() => setOpen(false)} color="primary" fullWidth>Close</Button>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
	);
});

export default TransactionCompleteModal;