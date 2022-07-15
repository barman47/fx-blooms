// import { useDispatch } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextClamp from "react-string-clamp";
// import { SET_CUSTOMER } from "../../actions/types";
import handleStatusStyle from "../../utils/statusDisplay";
import formatId from "../../utils/formatId";
import CircularProgressBar from "./CircularProgressBar";
import clsx from "clsx";
import buyEUR from "../../assets/img/eur-logo.svg";
import buyNGN from "../../assets/img/ngn-logo.svg";
import formatDate from "../../utils/formatDate";

const useStyles = makeStyles((theme) => ({
    tableBodyRow: {
        display: "grid",
        // gridTemplateColumns: '0.2fr 1fr 1fr 1.5fr 1.2fr .8fr 1fr 0.5fr',
        borderBottom: "2px solid #E3E8EE",
        alignItems: "center",
        cursor: "pointer",
        // justifyContent: 'flex-start',
        // gap: 10,

        "& span": {
            fontWeight: "300",
            padding: "10px 0",
            fontSize: ".8vw",
            fontStretch: "50%",
            // borderLeft: `1px solid red`
        },

        "& span label": {
            marginRight: "0",
        },

        "& span label span:nth-child(2)": {
            display: "none",
        },
    },

    tableCell: {
        "&:first-child": {
            display: "flex",
            // justifyContent: 'center',
            alignItems: "center",
            gap: "5px",
        },
    },

    status: {
        color: "white",
        fontSize: "11px !important",
        borderRadius: "3.4px",
        backgroundColor: "#C4C4C4",
        padding: "2px 3px !important",
        width: "87px",
        fontWeight: "500 !important",
        textAlign: "center",
    },

    verified: {
        backgroundColor: "#DDF2E5",
        color: "#1E6262",
    },

    pending: {
        backgroundColor: "#FFF5CE",
        color: "#FBBC05",
    },

    rejected: {
        backgroundColor: "#FFCECE",
        color: "#FF0000",
    },

    suspended: {
        backgroundColor: "#f5f7be",
        color: "#d1c70c",
    },

    viewBtn: {
        fontSize: theme.spacing(1.7),
        outline: "none",
        border: "none",
        position: "relative",
        backgroundColor: "#4CAF50",
        cursor: "pointer",
        borderRadius: "5px",
        color: "white",
        padding: 6,
        transitionDuration: "0.4s",
        textDecoration: "none",
        overflow: "hidden",

        "&:after": {
            content: "",
            background: "#f1f1f1",
            display: "block",
            position: "absolute",
            paddingTop: "300%",
            paddingLeft: "350%",
            marginLeft: "-20px !important",
            marginTop: "-120%",
            opacity: 0,
            transition: "all 0.8s",
        },

        "&:active:after": {
            padding: 0,
            margin: 0,
            opacity: 1,
            transition: "0s",
        },

        "&:hover": {
            backgroundColor: "#1e6262e6",
        },
    },
}));

const TransactionTable = ({
    data,
    handleClick,
    viewData,
    gridColumns,
    columnList,
    loading,
    viewMore,
    profileNavigate,
}) => {
    const classes = useStyles();

    // const dispatch = useDispatch();

    // const handleButtonClick = (customer, e) => {
    //     if (!viewMore) {
    //         e.preventDefault();
    //         e.stopPropagation();

    //         dispatch({
    //             type: SET_CUSTOMER,
    //             payload: customer,
    //         });
    //         handleClick(e);
    //     }
    // };

    const handleDisplayStatus = (status) => {
        switch (status) {
            case true:
                return "CONFIRMED";
            default:
                return "AWAITING";
        }
    };

    return (
        <>
            {loading ? (
                <CircularProgressBar
                    newWidth="40px"
                    newHeight="40px"
                    topMargin="50px"
                />
            ) : (
                data &&
                data.map((customer, i) => (
                    <Box
                        component="div"
                        sx={{
                            gridTemplateColumns: gridColumns,
                            padding: "1px 0px",
                        }}
                        className={clsx(
                            classes.tableBodyRow,
                            !loading &&
                                "animate__animated animate__lightSpeedInRight"
                        )}
                        key={i}
                        onClick={() => viewData(customer)}
                    >
                        <Typography
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            <img
                                src={
                                    customer.seller.currency === "NGN"
                                        ? buyNGN
                                        : buyEUR
                                }
                                alt="Workflow"
                            />
                        </Typography>

                        <Typography
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {formatId(customer[columnList[2]], "TID", 10)}
                        </Typography>

                        <Typography
                            style={{ textTransform: "capitalize" }}
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                            onClick={(e) => {
                                if (viewMore) {
                                    profileNavigate(e, customer.customerId);
                                }
                                return;
                            }}
                        >
                            <TextClamp
                                text={
                                    customer.seller.currency === "NGN"
                                        ? customer[columnList[1]].accountName
                                        : customer[columnList[0]].accountName
                                }
                                lines={1}
                            />
                        </Typography>

                        <Typography
                            style={{ textTransform: "capitalize" }}
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            <TextClamp
                                text={
                                    customer.seller.currency === "NGN"
                                        ? customer[columnList[1]].currency +
                                          customer[
                                              columnList[1]
                                          ].amountTransfered.toLocaleString()
                                        : customer[columnList[0]].currency +
                                          customer[
                                              columnList[0]
                                          ].amountTransfered.toLocaleString()
                                }
                                lines={1}
                            />
                        </Typography>

                        <Typography
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {customer.seller.currency === "NGN"
                                ? customer[columnList[0]].accountName
                                : customer[columnList[1]].accountName}
                        </Typography>

                        <Typography
                            component="span"
                            className={clsx(
                                classes.tableCell,
                                classes.status,
                                handleStatusStyle(
                                    customer[columnList[3]],
                                    classes
                                )
                            )}
                            variant="subtitle1"
                        >
                            {handleDisplayStatus(customer[columnList[3]])}
                        </Typography>

                        <Typography
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {formatDate(customer[columnList[4]])}
                        </Typography>

                        <Typography
                            style={{ textAlign: "left" }}
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            <button
                                onClick={() => viewData(customer)}
                                className={classes.viewBtn}
                            >
                                view more
                            </button>
                        </Typography>
                    </Box>
                ))
            )}
        </>
    );
};

export default TransactionTable;
