// Serverless Veriff JS SDK and Incontext SDK integration example using React.JS

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Veriff } from "@veriff/js-sdk";
import { createVeriffFrame } from "@veriff/incontext-sdk";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { VERIFF_HOST, CALLBACK } from "../../../utils/constants";
import VeriffLogo from '../../../assets/img/veriff-logo.jpg'

// In this example both Web SDKs are covered. You can use either of implementations

const implementationType = "JS_SDK";
// const implementationType = 'INCONTEXT_SDK';

const useStyles = makeStyles((theme) => ({
    app: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        position: "relative",

        [theme.breakpoints.down("sm")]: {
            justifyContent: "center",
        },
    },

    text: {
        fontWeight: 300,
        marginBottom: theme.spacing(2),
        textAlign: 'center'
    },
}));

const VERIFF_API = `${process.env.REACT_APP_VERIFF_API}`;

const popupBlockerChecker = {
    check: function (popup_window) {
        const scope = this;
        if (popup_window) {
            if (/chrome/.test(navigator.userAgent.toLowerCase())) {
                setTimeout(function () {
                    scope.is_popup_blocked(scope, popup_window);
                }, 200);
            } else {
                popup_window.onload = function () {
                    scope.is_popup_blocked(scope, popup_window);
                };
            }
        } else {
            scope.displayError();
        }
    },
    is_popup_blocked: function (scope, popup_window) {
        if ((popup_window.innerHeight > 0) === false) {
            scope.displayError();
        }
    },
    displayError: function () {
        alert(
            "Popup Blocker is enabled! Please add this site to your exception list or disable your popup block."
        );
    },
};

function VeriffVerify({ handleSetTitle }) {
    const classes = useStyles();
    const { customerId } = useSelector((state) => state.customer);

    useEffect(() => {
        handleSetTitle('Verify ID');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // here we generate a verification session needless of a server;
        const veriff = Veriff({
            host: VERIFF_HOST,
            apiKey: VERIFF_API,
            parentId: "veriff-root",
            onSession: function (err, response) {
                //Here the end user flow is triggered.
                switch (implementationType) {
                    case "JS_SDK":
                        // console.log('response',response)
                        // debugger
                        // JS SDK implementation--> redirects user to the verification url
                        // window.location.replace(response.verification.url);
                        const url = window.open(response.verification.url, "_blank");
                        popupBlockerChecker.check(url)
                        break;
                    case "INCONTEXT_SDK":
                        // Incontext SDK implementation-->  user stays in the webpage
                        createVeriffFrame({ url: response.verification.url });
                        break;
                    default:
                        console.log("Nothing yet");
                }
            },
        });

        veriff.setParams({
            // person: {
            //   givenName: 'egg',
            //   lastName: 'eg '
            // },
            vendorData: customerId,
            callback: CALLBACK,
        });

        veriff.mount({
            formLabel: {
                givenName: "First name",
                lastName: "Last name",
            },
            submitBtnText: "Get verified",
            loadingText: "Please wait...",
        });
    }, [customerId]);

    return (
        <div className={classes.app}>
            <Box component="div" sx={{
                position: "absolute",
                top: '15%'
            }}>
                <img src={VeriffLogo} alt="Veriff Logo" width="120px" />
            </Box>
            <Box component="div">
                <Typography
                    variant="body2"
                    component="p"
                    className={classes.text}
                >
                    Kindly provide your name below to begin the verification
                    process.
                </Typography>
                <div id="veriff-root" style={{ margin: "0 auto" }} />
            </Box>
        </div>
    );
}

export default VeriffVerify;
