import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { getCustomer } from "../../../actions/customer";
// import { getListingByStatus } from '../../../actions/adminListings';
import clsx from "clsx";
import {
    Box,
    Typography,
    Grid,
    // Checkbox,
    // FormControlLabel,
    Slider,
    Menu,
    MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import { COLORS, LISTING_DETAILS, CUSTOMER_CATEGORY } from '../../../utils/constants';
import { COLORS, LISTING_DETAILS, BID_STATUS } from "../../../utils/constants";
import AllListings from "./AllListings";
import ActiveListings from "./ActiveListings";
import InProgressListings from "./InProgressListings";
import RemovedListings from "./RemovedListings";
import CompletedListings from "./CompletedListings";
import GenericTableHeader from "../../../components/admin-dashboard/GenericTableHeader";
import GenericButton from "../../../components/admin-dashboard/GenericButton";
import {
    ArrowTopRight,
    Filter,
    CloseCircleOutline,
    TrashCanOutline,
    DotsHorizontal,
    // SwapHorizontal,
} from "mdi-material-ui";
import { exportAllUserRecords } from "../../../actions/admin";
import { creditListing, getOneWallet } from "../../../actions/wallets";
import {
    getAllListings,
    getActiveListings,
    getListingsInProgress,
    getFinalisedListings,
    getDeletedListings,
} from "../../../actions/adminListings";
import {
    CREDIT_LISTING,
    CLEAR_ERROR_MSG,
    CLEAR_CUSTOMER,
    CLEAR_WALLET,
} from "../../../actions/types";
import { exportRecords } from "../../../utils/exportRecords";
import isEmpty from "../../../utils/isEmpty";
import AmlBoard from "../../../components/admin-dashboard/AmlBoard";
// import Status from '../../../components/admin-dashboard/Status';
import formatId from "../../../utils/formatId";
import handleStatusStyle from "../../../utils/statusDisplay";
import Toast from "../../../components/common/Toast";
// import GenericPopUp from "../../../components/admin-dashboard/GenericPopUp";
// import GenericTextField from "../../../components/admin-dashboard/GenericTextField";

const useStyles = makeStyles((theme) => ({
    root: {
        // padding: theme.spacing(0, 3),
        backgroundColor: "white",
        paddingRight: theme.spacing(8),
        paddingLeft: theme.spacing(5),
        paddingTop: theme.spacing(9),
        paddingBottom: theme.spacing(12),

        position: "relative",
    },

    exportBox: {
        position: "absolute",
        top: 47,
        right: 1,
        borderRadius: 5,
        boxShadow: "1px 1px 1px 1.5px #c7c7c7",
        display: "flex",
        flexDirection: "column",

        "& span": {
            fontSize: ".9vw",
            backgroundColor: "white",
            padding: "10px 20px",
            width: "6vw",

            "&:hover": {
                backgroundColor: "#1E6262",
                color: "white",
            },
        },
    },

    reverseMenu: {
        position: "absolute",
        top: 47,
        left: 1,
        borderRadius: 5,
        boxShadow: "1px 1px 1px 1.5px #c7c7c7",
        display: "flex",
        flexDirection: "column",
        width: "41%",
        textAlign: "left",

        "& span": {
            fontSize: ".9vw",
            backgroundColor: "white",
            padding: "10px 20px",
            // width: "6vw",

            "&:hover": {
                backgroundColor: "#1E6262",
                color: "white",
            },
        },
    },

    filterBoxContainer: {
        position: "absolute",
        top: 50,
        right: 150,
        zIndex: 1000,
        width: "100%",
        height: "100%",
    },

    filterBoxContent: {
        width: 400,
        // height: 200,
        backgroundColor: "white",
        borderRadius: 10,
        boxShadow: "1px 1px 1px 1.3px #c7c7c7",
    },

    filterBoxHeader: {
        display: "grid",
        gridTemplateColumns: "1fr 0px",
        padding: ".7rem 1.5rem",
        borderBottom: "1px solid #CBCBCB",
        alignItems: "center",

        "& span": {
            fontSize: "1rem",
            cursor: "pointer",
        },
    },

    filterBoxMain: {
        // padding: '1rem 1.5rem',
    },

    filterContentDate: {
        marginTop: ".6rem",
        // marginBottom: '1.5rem',
        padding: "1rem 1.5rem",

        "& label": {
            display: "flex",
            flexDirection: "column",
            gap: 10,

            fontSize: "1rem",

            "& input": {
                height: 30,
                borderRadius: 5,
                outline: "none",
                border: "1px solid #C4C4C4",
                padding: 5,
            },
        },
    },

    filterTransactionType: {
        display: "grid",
        gridTemplateColumns: "1fr",
        padding: "1rem 1.5rem",
        gap: ".5rem",

        // marginBottom: '1.5rem'
    },

    filterAmount: {
        padding: "1rem 1.5rem",
        borderBottom: "1px solid #C4C4C4",
    },

    amountRange: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
    },

    filterButton: {
        display: "flex",
        gap: 15,
        justifyContent: "flex-end",
        marginRight: 10,
        padding: "1.5rem 1.5rem",
    },

    title: {
        fontWeight: 600,
        fontSize: theme.spacing(3),
    },

    link: {
        color: theme.palette.primary.main,
        cursor: "pointer",
    },

    filterContainer: {
        display: "flex",
        gap: theme.spacing(2),
        // gridTemplateColumns: '.13fr .13fr .13fr .13fr .15fr',
        // gap: theme.spacing(4),
        marginTop: theme.spacing(3),
        borderBottom: "1px solid #E3E8EE",
        width: "90%",
    },

    filter: {
        // backgroundColor: COLORS.lightTeal,
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        // padding: theme.spacing(1),
        width: "max-content",
        // gap: theme.spacing(1),
        color: "#697386",
        padding: "5px",
        gap: "10px",

        "& span": {
            fontWeight: "600",
        },

        "& span:nth-child(2)": {
            color: "#1E625E",
            backgroundColor: "#AEC7C0",
            padding: "0px 5px",
            textAlign: "center",
            lineHeight: "1 !important",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: theme.spacing(1),
        },

        "&:not(:first-child) span": {},
    },

    active: {
        borderBottom: "2px solid #1E6262",
    },

    table: {
        marginTop: theme.spacing(3),
    },

    tableHeader: {
        display: "grid",
        gridTemplateColumns: "0.2fr 1.5fr 1.5fr 2fr 1fr 0.5fr 0.8fr 0.5fr",
    },

    content: {
        display: "grid",
        gridTemplateColumns: "1fr",
    },

    customerLink: {
        color: `${theme.palette.primary.main}`,
        cursor: "pointer",
    },

    pagination: {
        backgroundColor: COLORS.lightTeal,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        borderLeft: `1px solid ${theme.palette.primary.main}`,
        borderRight: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius,
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
    },

    selected: {
        borderBottom: "2px solid #1E6262",
        fontWeight: 600,
        fontSize: "1.4vw",
    },

    pageList: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
    },

    viewMoreContainer: {
        position: "fixed",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,0,0.3)",
        top: 0,
        right: 0,
        zIndex: 1000,
        width: "100%",
        height: "100%",
        overflowY: "hidden",
        // transform: "translate(0, 84px)",
    },

    viewMoreContent: {
        backgroundColor: "white",
        width: "65%",
        height: "75vh",
        margin: "2rem 15vw 0 auto",
        borderRadius: "3px",
        // paddingTop: '3rem',
        // paddingLeft: '1.5rem',
        padding: "1rem",
        // overflowY: 'scroll',

        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
    },

    viewMoreTitle: {
        fontSize: "1.4rem",
        fontWeight: "bold",
        borderBottom: "1px solid #808080",
        padding: ".5rem .5rem .5rem 2rem",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    viewMoreData: {
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",

        padding: "2rem .5rem .5rem 2rem",
    },

    amlTable: {
        display: "grid",
        gridTemplateColumns: "1fr 15vw",
        marginBottom: theme.spacing(2),
        // justifyContent: 'space-between',
        // width: '10vw',
        // gap: '7rem'
    },

    amlTitle: {
        fontSize: "1vw",
        fontWeight: "400 !important",
        width: "max-content",
    },

    amlNumber: {
        fontWeight: "600 !important",
        justifySelf: "self-start",
        fontSize: "1vw",
        padding: ".1rem .5rem",
        borderRadius: 6,
        width: "max-content",

        "& p:first-child": {
            fontWeight: "600 !important",
        },
    },

    viewMoreBidsContainer: {
        overflowY: "scroll",
        height: "42%",
        width: "80%",
        overflowX: "scroll",
        position: "relative",
        // display: 'flex',
        // flexDirection: 'column-reverse',
    },

    hideCredBtn: {
        display: "none",
    },

    creditOptions: {
        position: "absolute",
    },

    viewMoreBids: {
        display: "grid",
        gridTemplateColumns: "repeat(4, max-content)",
        padding: ".5rem .5rem .5rem 2rem",
        marginTop: "2rem",
        columnGap: "1rem",
        rowGap: "1.7rem",
        alignItems: "center",
    },

    circleDesign: {
        position: "relative",
    },

    circle: {
        width: "20px",
        height: "20px",
        backgroundColor: "green",
        borderRadius: "50%",
        border: "1px solid #000000",
    },

    line: {
        position: "absolute",
        top: 23,
        left: 11,
        height: 55,
        width: 1,

        backgroundColor: "black",
    },

    dateTimeContainer: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
    },

    dateTime: {
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(2, max-content)",

        "& p": {
            fontSize: ".9vw",
        },
    },

    statusContainer: {
        position: "relative",
        marginRight: 50,
    },

    userStatusTitle: {
        // backgroundColor: '#DDF2E5',
        color: "#1E6262",
        width: "max-content",
        borderRadius: "5px",
        fontSize: ".9vw",
        textAlign: "center",
        padding: ".1rem .5rem",
    },

    subStatus: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        top: 30,

        "& span": {
            fontSize: ".7vw",
            fontWeight: "400",
        },
    },

    subDateTime: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        top: 26,
        width: "max-content",

        "& span": {
            fontSize: ".7vw",
            fontWeight: "400",
        },
    },

    status: {
        color: "white",
        fontWeight: "500 !important",
        textAlign: "center",
        backgroundColor: "#C4C4C4",
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

    menu: {
        backgroundColor: "white",
        border: `none`,
        borderRadius: theme.spacing(1.9),
        marginRight: "10px",
        cursor: "pointer",
        // top: 474,
        // riht: 248,
        // left: '1695px !important',

        "& ul": {
            padding: "0",
        },

        "& li": {
            padding: theme.spacing(2),
            paddingLeft: theme.spacing(2.5),
        },
    },

    reverseModalContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // height: "70%",?
        gap: 50,
        marginTop: "20%",
    },

    reverseModalForm: {
        display: "grid",
        gridTemplateColumns: "300px 30px 300px",
        justifyContent: "center",
        alignItems: "center",
        // height: "100%",
        gap: 10,
    },

    txOption: {
        position: "absolute",
        right: 0,
        top: 39,
    },
}));

function valuetext(value) {
    return `${value}°C`;
}

const columns = [
    { id: "id", label: "" },
    {
        id: "listing ID",
        label: "Listing ID",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "owner",
        label: "Owner",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "amount",
        label: "Amount",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "rate",
        label: "Rate",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "status",
        label: "Status",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "timeStamp",
        label: "Timestamp",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "action",
        label: "Action",
        format: (value) => value.toLocaleString("en-US"),
    },
];

const gridColumns = ".3fr .8fr 1fr .8fr .5fr .7fr 1fr .5fr";

const pages = [15, 25, 50, 100];

const Listings = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { admin } = useSelector((state) => state);
    const { customer, buyer } = useSelector((state) => state.customers);

    const { IN_PROGRESS, CANCELED, COMPLETED } = BID_STATUS;
    const {
        ALL_LISTINGS,
        ALL_DELETED,
        ALL_NEGOTIATIONS,
        ALL_COMPLETED,
        ALL_OPEN,
    } = LISTING_DETAILS;
    const [tab, setTab] = useState(ALL_LISTINGS);
    const [loading, setLoading] = useState(true);
    const [pageNumberList, setPageNumberList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [lastPage, setLastPage] = useState(pageNumberList?.length);
    const [rowsPerPage, setRowsPerPage] = useState(pages[0]);

    const [workFlow, setWorkFlow] = useState("");
    const [sellerName, setSellerName] = useState("");

    const [viewMoreData, setViewMoreData] = useState({});
    const [openViewMore, setOpenViewMore] = useState(false);
    const [openFilterBx, setOpenFilterBx] = useState(false);
    const [openXport, closeXport] = useState(false);

    //PC is PageCount
    const [totalActivePC, setTotalActivePC] = useState(0);
    const [totalFinalisedPC, setTotalFinalisedPC] = useState(0);
    const [totalRemovedPC, setTotalRemovedPC] = useState(0);
    const [totalInProgressPC, setTotalInProgressPC] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    // const [openReverseMenu, closeReverseMenu] = useState(false);
    const [buyerName, setBuyerName] = useState("");
    const ref = useRef();

    //   const [page, setPage] = useState(0);
    // const [anchorEl, setAnchorEl] = useState(null);
    const {
        totalListings,
        totalOpenListings,
        totalRemovedListings,
        totalListingsInProgress,
        totalFinalisedListings,
    } = useSelector((state) => state.stats);
    const {
        totalPageCount,
        listings,
        activeListings,
        finalisedListings,
        inProgressListings,
        deletedListings,
        credit,
    } = useSelector((state) => state.listings);
    const { msg } = useSelector((state) => state.errors);
    const { wallet } = useSelector((state) => state.wallets);

    const [value, setValue] = useState([1, 70]);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handlePageNUmberList = useCallback(() => {
        const pageNumArr = [];
        if (pageCount >= 1) {
            for (let i = 1; i <= pageCount; i++) {
                pageNumArr.push(i);
            }
        }
        setPageNumberList(pageNumArr);
        setLastPage(pageCount);
    }, [pageCount]);

    const onNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const onPrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    useEffect(() => {
        if (tab) {
            setCurrentPage(1);
        }
    }, [tab]);

    // useEffect(() => {
    //     dispatch({
    //         type: SET_PAGE_SIZE,
    //         payload: rowsPerPage
    //     });
    // }, [dispatch, rowsPerPage]);

    // useEffect(() => {
    //     dispatch({
    //         type: SET_PAGE_NUMBER,
    //         payload: currentPage
    //     });
    // }, [dispatch, currentPage]);

    useEffect(() => {
        switch (tab) {
            case ALL_LISTINGS:
                if (!!listings) {
                    setLoading(false);
                }
                break;

            case ALL_OPEN:
                if (!!activeListings.items) {
                    setTotalActivePC(activeListings.totalPageCount);
                    setLoading(false);
                }
                break;

            case ALL_COMPLETED:
                if (!!finalisedListings) {
                    setTotalFinalisedPC(finalisedListings.totalPageCount);
                    setLoading(false);
                }
                break;

            case ALL_NEGOTIATIONS:
                if (!!inProgressListings) {
                    setTotalInProgressPC(inProgressListings.totalPageCount);
                    setLoading(false);
                }
                break;

            case ALL_DELETED:
                if (!!deletedListings) {
                    setTotalRemovedPC(deletedListings.totalPageCount);
                    setLoading(false);
                }
                break;

            default:
                break;
        }
    }, [
        tab,
        ALL_LISTINGS,
        ALL_OPEN,
        ALL_COMPLETED,
        ALL_NEGOTIATIONS,
        ALL_DELETED,
        activeListings,
        inProgressListings,
        finalisedListings,
        deletedListings,
        listings,
    ]);

    useEffect(() => {
        setLoading(true);
        switch (tab) {
            case ALL_LISTINGS:
                dispatch(
                    getAllListings({
                        pageSize: rowsPerPage,
                        pageNumber: currentPage,
                    })
                );
                setPageCount(totalPageCount || 0);
                break;

            case ALL_OPEN:
                dispatch(
                    getActiveListings({
                        pageSize: rowsPerPage,
                        pageNumber: currentPage,
                    })
                );
                setPageCount(totalActivePC || 0);
                break;

            case ALL_COMPLETED:
                dispatch(
                    getFinalisedListings({
                        pageSize: rowsPerPage,
                        pageNumber: currentPage,
                    })
                );
                setPageCount(totalFinalisedPC || 0);
                break;

            case ALL_NEGOTIATIONS:
                dispatch(
                    getListingsInProgress({
                        pageSize: rowsPerPage,
                        pageNumber: currentPage,
                    })
                );
                setPageCount(totalInProgressPC || 0);
                break;

            case ALL_DELETED:
                dispatch(
                    getDeletedListings({
                        pageSize: rowsPerPage,
                        pageNumber: currentPage,
                    })
                );
                setPageCount(totalRemovedPC || 0);
                break;

            default:
                break;
        }
        handlePageNUmberList();
    }, [
        ALL_LISTINGS,
        ALL_OPEN,
        ALL_COMPLETED,
        ALL_NEGOTIATIONS,
        ALL_DELETED,
        tab,
        handlePageNUmberList,
        currentPage,
        rowsPerPage,
        dispatch,
        totalPageCount,
        totalInProgressPC,
        totalActivePC,
        totalRemovedPC,
        totalFinalisedPC,
    ]);

    const downloadRecords = () => {
        let data = [];
        switch (tab) {
            case ALL_LISTINGS:
                data = [...listings];
                break;

            case ALL_OPEN:
                data = [...activeListings];
                break;

            case ALL_COMPLETED:
                data = [...finalisedListings];
                break;

            case ALL_NEGOTIATIONS:
                data = [...inProgressListings];
                break;

            case ALL_DELETED:
                data = [...deletedListings];
                break;

            default:
                break;
        }

        if (exportRecords(data, admin, tab)?.errors) {
            return;
        }
    };

    const downloadAll = async () => {
        await exportAllUserRecords(admin);
    };

    // useEffect(() => {
    //     if (currentPage > 0) {
    //         fetchData();
    //     }
    // }, [fetchData, currentPage]);

    // useEffect(() => {
    //     if (rowsPerPage > 0) {
    //         fetchData();
    //     }
    // }, [fetchData, rowsPerPage]);

    const handleSetTab = (tab) => {
        setTab(tab);
        setRowsPerPage(pages[0]);
    };

    const viewTableRow = (listing) => {
        // console.log(listing.bids[0]?.customerId);
        batch(() => {
            dispatch(getCustomer(listing.customerId));
            dispatch(getOneWallet(listing.walletId));
        });
        setViewMoreData(listing);
        setOpenViewMore(true);
    };

    useEffect(() => {
        if (!isEmpty(viewMoreData)) {
            switch (viewMoreData?.amountNeeded?.currencyType) {
                case "EUR":
                    setWorkFlow(
                        "BUY " + viewMoreData?.amountNeeded?.currencyType
                    );
                    break;
                case "NGN":
                    setWorkFlow(
                        "BUY " + viewMoreData?.amountNeeded?.currencyType
                    );
                    break;
                default:
                    return;
            }
        }
    }, [viewMoreData]);

    useEffect(() => {
        if (!isEmpty(customer?.username)) {
            // console.log("cus", customer);
            setSellerName(customer?.username);
        }
    }, [customer]);

    useEffect(() => {
        if (!isEmpty(viewMoreData?.bids)) {
            dispatch(getCustomer(viewMoreData.bids[0]?.customerId, "BUYER"));
        }
    }, [viewMoreData, dispatch]);

    useEffect(() => {
        // console.log("buyer", buyer);
        if (!isEmpty(buyer)) {
            setBuyerName(buyer?.username);
        }
    }, [buyer]);

    const currentAmount = (amount) => {
        // console.log("amount", amount);
        return {
            currencyType: amount.currencyType + " ",
            amount: amount.amount,
        };
    };

    const bidsStatusBlueprint = useCallback(
        (bids) => {
            // console.log(sellerName);
            const confirmed =
                sellerName +
                " confirms " +
                currentAmount(bids.bidAmount)?.currencyType +
                currentAmount(bids.bidAmount).amount +
                ", " +
                currentAmount(bids.bidAmount).currencyType +
                currentAmount(bids.bidAmount).amount +
                ` moved to ${buyerName}'s wallet`;

            const cancelled =
                sellerName +
                " cancels " +
                currentAmount(bids.bidAmount).currencyType +
                currentAmount(bids.bidAmount).amount +
                " listing.";

            const inProgress =
                buyerName +
                " has bid for " +
                currentAmount(bids.bidAmount).currencyType +
                currentAmount(bids.bidAmount).amount +
                ` listing.`;

            return {
                confirmed,
                cancelled,
                inProgress,
            };
        },
        [sellerName, buyerName]
    );

    const bidsStatusDetails = useCallback(
        (bids) => {
            switch (bids.status) {
                case COMPLETED:
                    return bidsStatusBlueprint(bids).confirmed;
                case IN_PROGRESS:
                    return bidsStatusBlueprint(bids).inProgress;
                case CANCELED:
                    return bidsStatusBlueprint(bids).cancelled;
                default:
                    return;
            }
        },
        [COMPLETED, CANCELED, IN_PROGRESS, bidsStatusBlueprint]
    );

    const handleDate = (dateTime) => {
        const time = new Date(dateTime);
        return {
            time: time.toLocaleTimeString(),
            space: " ",
            date: time.toDateString(),
        };
    };

    const handleStatus = useCallback(
        (status) => {
            if (ALL_LISTINGS) {
                return handleStatusStyle(status, classes);
            } else if (ALL_OPEN) {
                return handleStatusStyle(status, classes);
            } else {
                return "";
            }
        },
        [ALL_LISTINGS, ALL_OPEN, classes]
    );

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCredOption = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCredit = (listing) => {
        dispatch(
            creditListing(listing.walletId, {
                amount: listing.amountNeeded.amount,
                remark: "test",
            })
        );
    };

    useEffect(() => {
        if (!!credit) {
            setToastMsg(credit);
            setToastType("success");
            ref.current?.handleClick();
            handleClose();
        }
    }, [credit]);

    useEffect(() => {
        if (!!msg) {
            setToastType("error");
            setToastMsg(msg);
            ref.current?.handleClick();
            handleClose();
        }
    }, [msg]);

    const closeViewMoreModal = () => {
        setViewMoreData({});
        setOpenViewMore(false);
        setWorkFlow("");
        setSellerName("");
        batch(() => {
            dispatch({
                type: CREDIT_LISTING,
                payload: null,
            });

            dispatch({
                type: CLEAR_ERROR_MSG,
            });
            dispatch({
                type: CLEAR_CUSTOMER,
            });
            dispatch({
                type: CLEAR_WALLET,
            });
        });
    };

    return (
        <>
            <Toast
                ref={ref}
                type={toastType}
                msg={toastMsg}
                title="Listing Error"
            />
            <section
                className={clsx(
                    classes.root,
                    "animate__animated animate__fadeInLeft"
                )}
            >
                <Grid container direction="row" justifyContent="space-between">
                    <Grid item>
                        {tab === ALL_LISTINGS && (
                            <Typography
                                variant="body1"
                                className={classes.title}
                            >
                                All Listings
                            </Typography>
                        )}
                        {tab === ALL_OPEN && (
                            <Typography
                                variant="body1"
                                className={classes.title}
                            >
                                Open
                            </Typography>
                        )}
                        {tab === ALL_NEGOTIATIONS && (
                            <Typography
                                variant="body1"
                                className={classes.title}
                            >
                                In progess
                            </Typography>
                        )}
                        {tab === ALL_DELETED && (
                            <Typography
                                variant="body1"
                                className={classes.title}
                            >
                                Removed
                            </Typography>
                        )}
                        {tab === ALL_COMPLETED && (
                            <Typography
                                variant="body1"
                                className={classes.title}
                            >
                                Finalized
                            </Typography>
                        )}
                    </Grid>
                    <Grid item>
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                position: "relative",
                                flexDirection: "row",
                                gap: "10px",
                            }}
                        >
                            {/* <GenericButton
                                clickAction={() =>
                                    closeReverseMenu(() => {
                                        setOpenFilterBx(false);
                                        closeXport(false);
                                        return !openReverseMenu;
                                    })
                                }
                                buttonName="Reverse Fund"
                            > */}
                            {/* <SwapHorizontal />
                                {openReverseMenu ? (
                                    <Box
                                        className={classes.reverseMenu}
                                        component="span"
                                    >
                                        <Typography
                                            // onClick={() => }
                                            component="span"
                                        >
                                            Lien
                                        </Typography>
                                        <Typography
                                            // onClick={downloadRecords}
                                            component="span"
                                        >
                                            Available
                                        </Typography>
                                    </Box>
                                ) : (
                                    ""
                                )}
                            </GenericButton> */}
                            <GenericButton
                                clickAction={() =>
                                    setOpenFilterBx(() => {
                                        closeXport(false);
                                        // closeReverseMenu(false);
                                        return !openFilterBx;
                                    })
                                }
                                buttonName="Filter"
                            >
                                <Filter />
                            </GenericButton>
                            <GenericButton
                                clickAction={() =>
                                    closeXport(() => {
                                        setOpenFilterBx(false);
                                        // closeReverseMenu(false);
                                        return !openXport;
                                    })
                                }
                                buttonName="Export"
                            >
                                <ArrowTopRight />
                                {openXport ? (
                                    <Box
                                        className={classes.exportBox}
                                        component="span"
                                    >
                                        <Typography
                                            onClick={downloadAll}
                                            component="span"
                                        >
                                            Export All
                                        </Typography>
                                        <Typography
                                            onClick={downloadRecords}
                                            component="span"
                                        >
                                            Export Page
                                        </Typography>
                                    </Box>
                                ) : (
                                    ""
                                )}
                            </GenericButton>

                            {openFilterBx ? (
                                <Box
                                    component="div"
                                    className={classes.filterBoxContainer}
                                >
                                    <Box
                                        component="div"
                                        className={clsx(
                                            classes.filterBoxContent,
                                            "animate__animated animate__fadeIn"
                                        )}
                                    >
                                        <Box
                                            component="div"
                                            className={classes.filterBoxHeader}
                                        >
                                            <Typography
                                                component="h6"
                                                variant="h6"
                                            >
                                                Filter
                                            </Typography>
                                            <Typography
                                                component="span"
                                                onClick={() =>
                                                    setOpenFilterBx(false)
                                                }
                                            >
                                                x
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="div"
                                            className={classes.filterBoxMain}
                                        >
                                            <Box
                                                component="div"
                                                className={
                                                    classes.filterContentDate
                                                }
                                            >
                                                <label>
                                                    Start Date
                                                    <input type="date" />
                                                </label>

                                                <label>
                                                    End Date
                                                    <input type="date" />
                                                </label>
                                            </Box>

                                            <Box
                                                component="div"
                                                className={classes.filterAmount}
                                            >
                                                <Typography variant="body1">
                                                    Amount
                                                </Typography>
                                                <Box
                                                    component="span"
                                                    className={
                                                        classes.amountRange
                                                    }
                                                >
                                                    <Typography>$1</Typography>
                                                    <Typography>-</Typography>
                                                    <Typography>$1</Typography>
                                                    <Typography>-</Typography>
                                                    <Typography>$1</Typography>
                                                    <Typography>-</Typography>
                                                    <Typography>$1</Typography>
                                                </Box>
                                                <Slider
                                                    getAriaLabel={() =>
                                                        "Temperature range"
                                                    }
                                                    value={value}
                                                    onChange={handleChange}
                                                    valueLabelDisplay="auto"
                                                    getAriaValueText={valuetext}
                                                />
                                            </Box>

                                            <Box
                                                component="div"
                                                className={classes.filterButton}
                                            >
                                                <GenericButton
                                                    clickAction={() =>
                                                        setOpenFilterBx(false)
                                                    }
                                                    bdaColor="#1E6262"
                                                    bxShadw="none"
                                                    fontColor="#1E6262"
                                                    buttonName="Cancel"
                                                />
                                                <GenericButton
                                                    bdaColor="#1E6262"
                                                    bxShadw="none"
                                                    fontColor="white"
                                                    bgColor="#1E6262"
                                                    buttonName="Apply filter"
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                ""
                            )}
                            {/* <Menu
                            id="customer-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            classes={{ paper: classes.menu }}
                            disableScrollLock={ true }
                        >
                            <MenuItem onClick={viewDetails}>Filter by staus</MenuItem>
                        </Menu> */}
                        </Box>
                    </Grid>
                </Grid>
                <Box component="section" className={classes.filterContainer}>
                    <div
                        className={clsx(
                            classes.filter,
                            tab === ALL_LISTINGS && classes.active
                        )}
                        onClick={() => handleSetTab(ALL_LISTINGS)}
                    >
                        <Typography variant="subtitle2" component="span">
                            All Listings
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalListings}
                        </Typography>
                    </div>

                    <div
                        className={clsx(
                            classes.filter,
                            tab === ALL_COMPLETED && classes.active
                        )}
                        onClick={() => handleSetTab(ALL_COMPLETED)}
                    >
                        <Typography variant="subtitle2" component="span">
                            Finalized
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalFinalisedListings}
                        </Typography>
                    </div>

                    <div
                        className={clsx(
                            classes.filter,
                            tab === ALL_OPEN && classes.active
                        )}
                        onClick={() => handleSetTab(ALL_OPEN)}
                    >
                        <Typography variant="subtitle2" component="span">
                            Open
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalOpenListings}
                        </Typography>
                    </div>

                    <div
                        className={clsx(
                            classes.filter,
                            tab === ALL_NEGOTIATIONS && classes.active
                        )}
                        onClick={() => handleSetTab(ALL_NEGOTIATIONS)}
                    >
                        <Typography variant="subtitle2" component="span">
                            In progress
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalListingsInProgress}
                        </Typography>
                    </div>

                    <div
                        className={clsx(
                            classes.filter,
                            tab === ALL_DELETED && classes.active
                        )}
                        onClick={() => handleSetTab(ALL_DELETED)}
                    >
                        <Typography variant="subtitle2" component="span">
                            Removed
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalRemovedListings}
                        </Typography>
                    </div>
                </Box>
                <Box component="div" className={classes.table}>
                    <GenericTableHeader
                        columns={columns}
                        gridColumns={gridColumns}
                    />
                    {tab === ALL_LISTINGS && (
                        <AllListings
                            viewRow={viewTableRow}
                            loadingListings={loading}
                        />
                    )}
                    {tab === ALL_OPEN && (
                        <ActiveListings
                            viewRow={viewTableRow}
                            loadingListings={loading}
                        />
                    )}
                    {tab === ALL_NEGOTIATIONS && (
                        <InProgressListings
                            viewRow={viewTableRow}
                            loadingListings={loading}
                        />
                    )}
                    {tab === ALL_DELETED && (
                        <RemovedListings
                            viewRow={viewTableRow}
                            loadingListings={loading}
                        />
                    )}
                    {tab === ALL_COMPLETED && (
                        <CompletedListings
                            viewRow={viewTableRow}
                            loadingListings={loading}
                        />
                    )}
                </Box>

                {loading ? (
                    ""
                ) : (
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "60px",
                            width: "100%",
                        }}
                    >
                        <Box component="div" sx={{ alignSelf: "flex-start" }}>
                            {/* <Typography component="span">{'20'} results</Typography> */}
                        </Box>

                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                            }}
                        >
                            <Box
                                component="div"
                                sx={{ display: "flex", gap: "15px" }}
                            >
                                <GenericButton
                                    clickAction={onPrevPage}
                                    isDisabled={currentPage === 1}
                                    buttonName="Previous"
                                />
                                <GenericButton
                                    clickAction={onNextPage}
                                    isDisabled={currentPage === lastPage}
                                    buttonName="Next"
                                />
                            </Box>
                            <Box
                                component="span"
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "10px",
                                }}
                            >
                                {pageNumberList &&
                                    pageNumberList.map((pageNUmber, i) => (
                                        <Typography
                                            className={clsx(
                                                classes.pageList,
                                                pageNUmber === currentPage &&
                                                    classes.selected
                                            )}
                                            onClick={() =>
                                                setCurrentPage(pageNUmber)
                                            }
                                            variant="subtitle2"
                                            key={i}
                                        >
                                            {pageNUmber}
                                        </Typography>
                                    ))}
                            </Box>
                        </Box>
                    </Box>
                )}

                {!!openViewMore ? (
                    <Box component="div" className={classes.viewMoreContainer}>
                        <Box
                            component="div"
                            className={clsx(
                                classes.viewMoreContent,
                                "animate__animated animate__zoomIn"
                            )}
                        >
                            <Typography
                                variant="h6"
                                className={clsx(classes.viewMoreTitle)}
                            >
                                Listing Details
                                <CloseCircleOutline
                                    style={{ cursor: "pointer" }}
                                    onClick={() => closeViewMoreModal()}
                                />
                            </Typography>
                            <Box
                                component="div"
                                className={classes.viewMoreData}
                            >
                                <Box component="div">
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Listing ID:"}
                                        amlNumber={formatId(viewMoreData.id)}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Seller:"}
                                        amlNumber={sellerName}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Buyer:"}
                                        amlNumber={buyerName}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Current Amount:"}
                                        amlNumber={
                                            currentAmount(
                                                viewMoreData.amountNeeded
                                            ).currencyType +
                                            currentAmount(
                                                viewMoreData.amountNeeded
                                            ).amount
                                        }
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Lien Balance:"}
                                        amlNumber={
                                            wallet && wallet?.balance?.lien
                                        }
                                    />
                                </Box>
                                <Box component="div">
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Current Status"}
                                        otherStyles={handleStatusStyle(
                                            viewMoreData.status,
                                            classes
                                        )}
                                        amlNumber={viewMoreData.status}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Listed Time"}
                                        amlNumber={
                                            handleDate(viewMoreData.dateCreated)
                                                .time +
                                            handleDate(viewMoreData.dateCreated)
                                                .space +
                                            handleDate(viewMoreData.dateCreated)
                                                .date
                                        }
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Work Flow"}
                                        amlNumber={workFlow}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Current Rate"}
                                        amlNumber={viewMoreData.exchangeRate}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Available Balance"}
                                        amlNumber={
                                            wallet && wallet?.balance?.available
                                        }
                                    />
                                </Box>
                                <Box
                                    component="span"
                                    className={
                                        "animate__animated animate__bounce"
                                    }
                                    sx={{
                                        position: "absolute",
                                        top: 9,
                                        right: 9,
                                        color: "red",
                                    }}
                                >
                                    <TrashCanOutline
                                        style={{
                                            fontSize: 20,
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box
                                component="div"
                                className={classes.viewMoreBidsContainer}
                            >
                                {viewMoreData &&
                                    viewMoreData.bids.map((listing, index) => {
                                        return (
                                            <Box
                                                key={index}
                                                component="div"
                                                className={classes.viewMoreBids}
                                            >
                                                <Box
                                                    component="div"
                                                    className={
                                                        classes.circleDesign
                                                    }
                                                >
                                                    <Box
                                                        component="div"
                                                        className={clsx(
                                                            classes.circle,
                                                            classes.status,
                                                            handleStatus(
                                                                listing.status
                                                            )
                                                        )}
                                                    ></Box>
                                                    <Box
                                                        component="div"
                                                        className={classes.line}
                                                    ></Box>
                                                </Box>
                                                <Box
                                                    component="div"
                                                    className={
                                                        classes.statusContainer
                                                    }
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        className={clsx(
                                                            classes.userStatusTitle,
                                                            classes.status,
                                                            handleStatus(
                                                                listing.status
                                                            )
                                                        )}
                                                    >
                                                        {listing.status}
                                                    </Typography>
                                                    <Box
                                                        component="span"
                                                        className={
                                                            classes.subStatus
                                                        }
                                                    >
                                                        <Typography component="span">
                                                            Test:{" "}
                                                        </Typography>
                                                        <Typography component="span">
                                                            Another test:{" "}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box
                                                    component="div"
                                                    className={
                                                        classes.dateTimeContainer
                                                    }
                                                >
                                                    <Box
                                                        component="div"
                                                        className={
                                                            classes.dateTime
                                                        }
                                                    >
                                                        <Typography variant="body1">
                                                            {
                                                                handleDate(
                                                                    listing.datePlaced
                                                                ).time
                                                            }
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {
                                                                handleDate(
                                                                    listing.datePlaced
                                                                ).date
                                                            }
                                                        </Typography>
                                                    </Box>
                                                    <Box
                                                        component="span"
                                                        className={
                                                            classes.subDateTime
                                                        }
                                                    >
                                                        <Typography component="span">
                                                            {bidsStatusDetails(
                                                                listing
                                                            )}
                                                        </Typography>
                                                        {/* <Typography component='span'>Another test: </Typography> */}
                                                    </Box>
                                                </Box>
                                                <Box
                                                    component="div"
                                                    id="basic-button"
                                                    aria-controls={
                                                        Boolean(anchorEl)
                                                            ? "basic-menu"
                                                            : undefined
                                                    }
                                                    // className={clsx(
                                                    //     listing.status !==
                                                    //         "OPEN" &&
                                                    //         classes.hideCredBtn
                                                    // )}
                                                >
                                                    <Menu
                                                        className={
                                                            classes.creditOptions
                                                        }
                                                        id="basic-menu"
                                                        anchorEl={anchorEl}
                                                        keepMounted
                                                        open={Boolean(anchorEl)}
                                                        onClose={handleClose}
                                                        // classes={{
                                                        //     paper: classes.menu,
                                                        // }}
                                                        aria-haspopup="true"
                                                        aria-expanded={
                                                            Boolean(anchorEl)
                                                                ? "true"
                                                                : undefined
                                                        }
                                                        MenuListProps={{
                                                            "aria-labelledby":
                                                                "basic-button",
                                                        }}
                                                        disableScrollLock={true}
                                                    >
                                                        <MenuItem
                                                            onClick={() =>
                                                                handleCredit(
                                                                    listing
                                                                )
                                                            }
                                                        >
                                                            Transfer
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={
                                                                handleClose
                                                            }
                                                        >
                                                            TEst
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={
                                                                handleClose
                                                            }
                                                        >
                                                            Delete
                                                        </MenuItem>
                                                    </Menu>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                {isEmpty(viewMoreData.bids) ||
                                viewMoreData?.bids[0]?.status === CANCELED ? (
                                    ""
                                ) : (
                                    <Box
                                        component="div"
                                        className={classes.txOption}
                                    >
                                        <DotsHorizontal
                                            onClick={(e) => handleCredOption(e)}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    ""
                )}
                {/* {openReverseMenu ? (
                    <GenericPopUp
                        component="div"
                        containerWidth="69%"
                        containerHeight="70vh"
                        containerMargin="2rem 14vw 0 auto"
                        onClick={() => closeReverseMenu()}
                    >
                        <Box
                            component="div"
                            className={classes.reverseModalContent}
                        >
                            <GenericButton />
                            <Box
                                component="div"
                                className={classes.reverseModalForm}
                            >
                                <GenericTextField
                                    textTitle="Receiver Wallet"
                                    inputValue={remarks}
                                    handleOnChange={setRemarks}
                                    errors={errors}
                                    errorValue={remarks}
                                    label="Receiver Wallet ID"
                                    placeHolder="Receiver"

                                    isReadOnly={!editable}
                                />
                                <SwapHorizontal />
                                <GenericTextField
                                    textTitle="Destination Wallet"
                                    inputValue={remarks}
                                    handleOnChange={setRemarks}
                                    errors={errors}
                                    errorValue={remarks}
                                    label="Destination Wallet ID"
                                    placeHolder="Destination"

                                    isReadOnly={!editable}
                                />
                            </Box>
                            <GenericButton
                                clickAction={() =>

                                }
                                buttonName="Reverse"
                                fontColor="white"
                                fontsize="15px"
                                bxShadw="none"
                                bgColor="#1E6262"
                            />
                        </Box>
                    </GenericPopUp>
                ) : (
                    ""
                )} */}
            </section>
        </>
    );
};

export default Listings;
