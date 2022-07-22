import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import GenericButton from "../../../components/admin-dashboard/GenericButton";
import clsx from "clsx";
import { makeWithdrawalPayment } from "../../../actions/wallets";
import SuccessModal from "../../../components/common/SuccessModal";
import { CLEAR_WALLET_MSG } from "../../../actions/types";
import CircularProgressBar from "../../../components/admin-dashboard/CircularProgressBar";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        backgroundColor: "white",
        paddingLeft: theme.spacing(4),
        paddingTop: theme.spacing(3),
        justifyContent: "center",
    },

    paymentContent: {
        display: "grid",
        gridTemplateColumns: "150px max-content",
        gap: 20,

        marginTop: theme.spacing(5),
    },
}));

const PaymentAuth = () => {
    const classes = useStyles();
    const location = useLocation();
    const dispatch = useDispatch();
    const { msg } = useSelector((state) => state.wallets);

    const [reqParams, setReqParams] = useState({});
    const [loading, setLoading] = useState(false);

    const successModal = useRef();

    useEffect(() => {
        let urlParams = {};
        const params = new URLSearchParams(location.search);
        for (let param of params.entries()) {
            urlParams[param[0]] = param[1];
        }
        console.log("url", urlParams);
        console.log("url", location);
        setReqParams(urlParams);
        return () => {
            urlParams = {};
        };
    }, [location]);

    const makePayment = () => {
        setLoading(true);
        dispatch(makeWithdrawalPayment(reqParams));
    };

    const dismissSuccessModal = () => {
        dispatch({
            type: CLEAR_WALLET_MSG,
            payload: null,
        });
        window.close();
    };

    useEffect(() => {
        if (msg) {
            setLoading(false);
            successModal.current.openModal();
            successModal.current.setModalText(msg);
        }
    }, [dispatch, msg]);

    return (
        <>
            <SuccessModal
                ref={successModal}
                dismissAction={dismissSuccessModal}
            />
            <Box
                component="div"
                className={clsx(
                    classes.root,
                    "animate__animated animate__zoomIn"
                )}
            >
                <Typography variant="h6">Payment authorization</Typography>

                <Box component="div" className={classes.paymentContent}>
                    <Typography component="span">Consent token: </Typography>
                    <TextField
                        variant="outlined"
                        value={reqParams.consent ?? ""}
                        multiline
                        minRows={9}
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{ width: "430px" }}
                    />

                    <Typography component="span">Request ID: </Typography>
                    <Typography component="span">
                        {reqParams && reqParams.request}
                    </Typography>

                    <Typography component="span">Type</Typography>
                    <Typography component="span">
                        {reqParams && reqParams.type}
                    </Typography>

                    <Box
                        component="span"
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, max-content)",
                            gap: 20,
                            marginTop: 25,
                        }}
                    >
                        <GenericButton
                            buttonName={
                                loading ? (
                                    <CircularProgressBar
                                        newWidth="15px"
                                        newHeight="15px"
                                        iconColor="white"
                                    />
                                ) : (
                                    "Create payment"
                                )
                            }
                            fontColor="white"
                            fontsize="15px"
                            bxShadw="none"
                            bgColor="#1E6262"
                            clickAction={() => makePayment()}
                        />

                        {/* <GenericButton
                        buttonName="Cancel"
                        fontColor="#1E6262"
                        fontsize="15px"
                        bxShadw="none"
                        bdaColor="#1E6262"
                    /> */}
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default PaymentAuth;
