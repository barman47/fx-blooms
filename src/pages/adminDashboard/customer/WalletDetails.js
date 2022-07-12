import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getWallets } from "../../../actions/wallets";
import greenWallet from "../../../assets/img/greenWalletShape.svg";
import blackWallet from "../../../assets/img/blackWalletShape.svg";
import icon from "../../../assets/img/icon.png";

import modifyAmount from "../../../utils/modifyAmount";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        borderRadius: theme.shape.borderRadius,
        padding: [[theme.spacing(2), theme.spacing(3)]],
        boxShadow: "1px 1px 3px #dbdddd",

        [theme.breakpoints.down("md")]: {
            paddingBottom: theme.spacing(4),
        },
    },

    content: {
        display: "grid",
        gridAutoColumns: "1fr",
        gridAutoFlow: "column dense",
    },

    detail: {
        marginBottom: theme.spacing(2),
        // width: '325.61px'
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridAutoColumns: "1fr",
        gridAutoFlow: "column dense",
        gap: 15,
    },

    subDetailTitle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing(2),

        "& h6": {
            paddingRight: theme.spacing(5),
        },
        "& div": {
            marginBottom: theme.spacing(0.5),
        },
    },

    detailTitle: {
        marginBottom: theme.spacing(5),
    },

    paperWalletCard: {
        height: "18vh",
        // maxWidth: '26rem',
        borderRadius: "10px",
        position: "relative",

        // width: '50%',
        alignSelf: "flex-start",
        paddingTop: "20px",
        paddingLeft: "20px",

        "& h6:not(:last-child)": {
            marginBottom: "20px",
        },

        "&:nth-child(2) img.walletDesign": {
            backgroundColor: "black",
        },
    },

    walletDesign: {
        height: "20.2vh",
        position: "absolute",
        top: 1,
        right: 1,
    },

    walletIcon: {
        width: "1.2vw",
    },

    walletCurrency: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1.25),
        color: "black",
        fontSize: ".6vw",
    },

    walletAmount: {
        // paddingLeft: 21,
        fontSize: "1vw",
        fontWeight: "bold",
    },

    walletLien: {
        fontSize: ".6vw",
        color: "#939393",
        fontWeight: 500,
    },
}));

const WalletDetails = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { customer } = useSelector((state) => state.customers);
    const { wallets } = useSelector((state) => state.wallets);

    useEffect(() => {
        if (!!customer?.id) {
            dispatch(getWallets(customer.id, "ADMIN"));
        }
    }, [dispatch, customer?.id]);

    return (
        <>
            <Box component="section" className={classes.root}>
                <Typography
                    className={classes.detailTitle}
                    variant="h6"
                    color="primary"
                >
                    Wallet Details
                </Typography>
                <Box component="section" className={classes.content}>
                    <Box component="div" className={classes.detail}>
                        <Paper
                            className={classes.paperWalletCard}
                            elevation={3}
                            variant="outlined"
                            rectangle="true"
                        >
                            <Typography
                                className={classes.walletCurrency}
                                variant="subtitle2"
                            >
                                <img
                                    className={classes.walletIcon}
                                    alt="icon"
                                    src={icon}
                                />
                                {wallets[1]?.currency?.value ?? "EUR"} WALLET
                            </Typography>

                            <Typography
                                className={classes.walletAmount}
                                variant="h6"
                            >
                                {wallets[1]?.currency?.value !== undefined
                                    ? wallets[1]?.currency?.value +
                                      " " +
                                      modifyAmount(
                                          +wallets[1]?.balance?.available
                                      )
                                    : "EUR 0"}
                                <Typography className={classes.walletLien}>
                                    Lien Bal{" "}
                                    {wallets[1]?.currency?.value !== undefined
                                        ? wallets[1]?.currency?.value +
                                          modifyAmount(
                                              +wallets[1]?.balance?.lien
                                          )
                                        : "EUR0"}
                                </Typography>
                            </Typography>
                            <Box component="div">
                                <img
                                    className={classes.walletDesign}
                                    src={
                                        wallets[1]?.currency?.value === "EUR"
                                            ? blackWallet
                                            : greenWallet
                                    }
                                    alt="wallet design"
                                />
                            </Box>
                        </Paper>
                        {/* <Paper
                            className={classes.paperWalletCard}
                            elevation={3}
                            variant="outlined"
                            rectangle="true"
                        >
                            <Typography
                                className={classes.walletCurrency}
                                variant="subtitle2"
                            >
                                <img
                                    className={classes.walletIcon}
                                    alt="icon"
                                    src={icon}
                                />
                                {wallets[0]?.currency?.value ?? "NGN"} WALLET
                            </Typography>

                            <Typography
                                className={classes.walletAmount}
                                variant="h6"
                            >
                                {wallets[0]?.currency?.value !== undefined
                                    ? wallets[0]?.currency?.value +
                                      " " +
                                      modifyAmount(
                                          +wallets[0]?.balance?.available
                                      )
                                    : "NGN 0"}

                                <Typography className={classes.walletLien}>
                                    Lien Bal{" "}
                                    {wallets[0]?.currency?.value !== undefined
                                        ? wallets[0]?.currency?.value +
                                          modifyAmount(
                                              +wallets[0]?.balance?.lien
                                          )
                                        : "NGN0"}
                                </Typography>
                            </Typography>
                            <Box component="div">
                                <img
                                    className={classes.walletDesign}
                                    src={
                                        wallets[0]?.currency?.value === "EUR"
                                            ? blackWallet
                                            : greenWallet
                                    }
                                    alt="wallet design"
                                />
                            </Box>
                        </Paper> */}
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default WalletDetails;
