import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
    Box,
    Typography,
    IconButton,
    FormControlLabel,
    Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextClamp from "react-string-clamp";
import { DotsHorizontal } from "mdi-material-ui";
import { SET_CUSTOMER } from "../../actions/types";
import { CUSTOMER_CATEGORY } from "../../utils/constants";
import handleStatusStyle from "../../utils/statusDisplay";
import formatId from "../../utils/formatId";
import formatDate from "../../utils/formatDate";
import CircularProgressBar from "./CircularProgressBar";
import clsx from "clsx";
import buyEUR from "../../assets/img/eur-logo.svg";
import buyNGN from "../../assets/img/ngn-logo.svg";

const useStyles = makeStyles((theme) => ({
    tableBodyRow: {
        display: "grid",
        // gridTemplateColumns: '0.2fr 1fr 1fr 1.5fr 1.2fr .8fr 1fr 0.5fr',
        borderBottom: "2px solid #E3E8EE",
        alignItems: "center",
        cursor: "pointer",
        gap: 10,
        // justifyContent: 'flex-start',

        "& span": {
            fontWeight: "300",
            padding: "4.6px 0",
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

    status: {
        color: "white",
        fontSize: "11px !important",
        borderRadius: "3.4px",
        backgroundColor: "#C4C4C4",
        padding: "3px",
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

const GenericTableBody = ({
    data,
    handleClick,
    viewCustomerProfile,
    gridColumns,
    addColumn,
    columnList,
    loading,
    profileNavigate,
    viewMore,
    animate,
}) => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const { CONFIRMED } = CUSTOMER_CATEGORY;

    const handleButtonClick = (customer, e) => {
        if (!viewMore) {
            e.preventDefault();
            e.stopPropagation();

            dispatch({
                type: SET_CUSTOMER,
                payload: customer,
            });
            handleClick(e);
        }
    };

    const handleDisplayStatus = useCallback(
        (status) => {
            switch (status) {
                case CONFIRMED:
                    return "VERIFIED";
                default:
                    return status;
            }
        },
        [CONFIRMED]
    );

    const handleCheckBox = (e, customer) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDisplayRow = (value) => {
        if (typeof value === "string") {
            return value.substring(0, 25);
        }
        return value;
    };

    return (
        <>
            {!!loading ? (
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
                            gridTemplateColumns: !viewMore
                                ? "minmax(0, 0.15fr) repeat(2, minmax(0, 1fr)) repeat(2, minmax(0, 1.2fr)) .8fr 1fr 0.3fr"
                                : gridColumns,
                            padding: "1px 0px",
                        }}
                        className={clsx(
                            classes.tableBodyRow,
                            !loading &&
                                "animate__animated animate__lightSpeedInRight"
                        )}
                        key={i}
                        onClick={() => {
                            if (viewMore) {
                                return;
                            }
                            return viewCustomerProfile(customer);
                        }}
                    >
                        <Typography
                            onClick={(e) => handleCheckBox(e)}
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {viewMore ? (
                                customer.amountAvailable.currencyType ===
                                "EUR" ? (
                                    <img src={buyEUR} alt="buy eur" />
                                ) : (
                                    <img src={buyNGN} alt="buy ngn" />
                                )
                            ) : (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="checked"
                                            className={classes.tableCell}
                                            color="primary"
                                            disableFocusRipple
                                            disableTouchRipple
                                            disableRipple
                                        />
                                    }
                                />
                            )}
                        </Typography>
                        <Typography
                            style={{ textTransform: "capitalize" }}
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            <TextClamp
                                text={
                                    customer[columnList[1]]
                                        ? formatId(customer[columnList[1]])
                                        : ""
                                }
                                lines={1}
                            />
                        </Typography>
                        <Typography
                            style={{
                                textTransform: "capitalize",
                                "&:active": {
                                    color: "blue",
                                },
                            }}
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
                                    customer[columnList[2]]
                                        ? customer[columnList[2]]
                                        : ""
                                }
                                lines={1}
                            />
                        </Typography>
                        <Typography
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {viewMore
                                ? `${customer.amountAvailable.currencyType} ${customer.amountAvailable.amount}`
                                : handleDisplayRow(
                                      customer[columnList[3]] ?? ""
                                  )}
                        </Typography>
                        <Typography
                            component="span"
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {handleDisplayRow(
                                customer[columnList[4]]
                                    ? customer[columnList[4]]
                                    : ""
                            )}
                        </Typography>
                        <Typography
                            component="span"
                            className={clsx(
                                classes.tableCell,
                                classes.status,
                                handleStatusStyle(
                                    customer[columnList[5]],
                                    classes
                                )
                            )}
                            variant="subtitle1"
                        >
                            {handleDisplayStatus(customer[columnList[5]])}
                        </Typography>
                        {!!addColumn ? (
                            <Typography
                                component="span"
                                className={classes.tableCell}
                                variant="subtitle1"
                            >
                                {!!customer[columnList[6]].constructor
                                    .toString()
                                    .indexOf("Date") > -1
                                    ? formatDate(customer[columnList[6]])
                                    : customer[columnList[6]]}
                            </Typography>
                        ) : (
                            ""
                        )}
                        {!addColumn ? (
                            <Typography
                                component="span"
                                className={classes.tableCell}
                                variant="subtitle1"
                            >
                                {customer[columnList[7]]}
                            </Typography>
                        ) : (
                            ""
                        )}
                        <Typography
                            style={{ textAlign: viewMore ? "left" : "center" }}
                            component="span"
                            className={`${classes.tableCell} ${classes.viewMore}`}
                            variant="subtitle1"
                        >
                            {viewMore && viewMore ? (
                                <button
                                    onClick={() =>
                                        viewCustomerProfile(customer)
                                    }
                                    className={classes.viewBtn}
                                >
                                    view more
                                </button>
                            ) : (
                                <IconButton
                                    variant="text"
                                    size="small"
                                    className={classes.button}
                                    aria-controls="customer-menu"
                                    aria-haspopup="true"
                                    onClick={(e) =>
                                        handleButtonClick(customer, e)
                                    }
                                    disableRipple
                                >
                                    <DotsHorizontal />
                                </IconButton>
                            )}
                        </Typography>
                    </Box>
                ))
            )}
        </>
    );
};

GenericTableBody.defaultProps = {
    gridColumns: ".3fr 1.1fr 1.2fr .8fr .5fr .7fr .5fr .5fr",
};

export default GenericTableBody;
