import { useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import AlertTitle from "@material-ui/lab/AlertTitle";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

const Toast = forwardRef((props, ref) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const { msg, duration, title, type, dispatchType } = props;

    useImperativeHandle(ref, () => ({
        handleClick: () => {
            setOpen(true);
        },

        close: () => {
            setOpen(false);
        },
    }));

    const handleClose = (event, reason) => {
        if (!!dispatchType) {
            dispatch({ type: dispatchType });
        }
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
        if (props.onClose) {
            props.onClose();
        }
    };

    // types: success, warning, error, info,

    return (
        <div className={classes.root}>
            <Snackbar
                open={open}
                autoHideDuration={duration}
                onClose={handleClose}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                }}
            >
                <Alert
                    variant="standard"
                    onClose={handleClose}
                    severity={type}
                    action={props.action || null}
                >
                    {title && <AlertTitle>{title}</AlertTitle>}
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    );
});

Toast.propTypes = {
    msg: PropTypes.string.isRequired,
    title: PropTypes.string,
    type: PropTypes.string.isRequired,
    duration: PropTypes.number,
    onClose: PropTypes.func,
};

Toast.defaultProps = {
    type: "error",
    duration: 3000,
};

export default Toast;
