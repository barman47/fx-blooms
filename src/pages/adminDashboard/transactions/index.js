import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import { getCustomer } from "../../../actions/customer";
import {
    getTransactions,
    exportAllTransactionRecords,
} from "../../../actions/admin";
import { getAListing } from "../../../actions/adminListings";
import clsx from "clsx";
import { Box, Typography, Grid, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    COLORS,
    TRANSACTION_DETAILS,
    BID_STATUS,
} from "../../../utils/constants";
import AllTransactions from "./AllTransactions";
import Pagination from "@material-ui/lab/Pagination";
import GenericTableHeader from "../../../components/admin-dashboard/GenericTableHeader";
import GenericButton from "../../../components/admin-dashboard/GenericButton";
import {
    ArrowTopRight,
    Filter,
    CloseCircleOutline,
    DotsHorizontal,
    TrashCanOutline,
} from "mdi-material-ui";
import { creditListing, getOneWallet } from "../../../actions/wallets";
import { exportRecords } from "../../../utils/exportRecords";
import isEmpty from "../../../utils/isEmpty";
import AmlBoard from "../../../components/admin-dashboard/AmlBoard";
import formatId from "../../../utils/formatId";
import ExportAllLoader from "../../../components/admin-dashboard/ExportAllLoader";
import {
    CLEAR_ERROR_MSG,
    CLEAR_BUYER,
    CLEAR_WALLET,
    CLEAR_CUSTOMER,
    CREDIT_LISTING,
} from "../../../actions/types";
import handleStatusStyle from "../../../utils/statusDisplay";

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
        top: 116,
        right: 65,
        borderRadius: 5,
        boxShadow: "1px 1px 1px 1.3px #c7c7c7",
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
        width: "70%",
    },

    filter: {
        // backgroundColor: COLORS.lightTeal,
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        // padding: theme.spacing(1),
        width: "fit-content",
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
        height: "100vh",
        transform: "translate(0, 84px)",
    },

    viewMoreContent: {
        backgroundColor: "white",
        width: "65%",
        height: "75vh",
        margin: "2rem 8vw 0 auto",
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
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",

        padding: "2rem .5rem .5rem 2rem",
    },

    amlTable: {
        display: "grid",
        gridTemplateColumns: ".8fr 15vw",
        marginBottom: theme.spacing(2),
        // justifyContent: 'space-between',
        // width: '10vw',
        // gap: '7rem'
    },

    amlTitle: {
        fontSize: "1vw",
        fontWeight: "400 !important",
    },

    amlNumber: {
        fontWeight: "600 !important",
        justifySelf: "self-start",
        fontSize: "1vw",

        "& p:first-child": {
            fontWeight: "600 !important",
        },
    },

    viewMoreBidsContainer: {
        overflowY: "scroll",
        height: "42%",
        width: "70%",
        overflowX: "hidden",
    },

    viewMoreBids: {
        display: "grid",
        gridTemplateColumns: "repeat(3, max-content)",
        padding: ".5rem .5rem .5rem 2rem",
        marginTop: "1.5rem",
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
        width: "fit-content",
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
}));

const columns = [
    // { id: 'id', label: ''},
    {
        id: "",
        label: "",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "transaction ID",
        label: "Transaction ID",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "payer",
        label: "Payer",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "amount",
        label: "Amount",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "receiver",
        label: "Receiver",
        format: (value) => value.toLocaleString("en-US"),
    },

    {
        id: "status",
        label: "Status",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "timestamp",
        label: "Timestamp",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "action",
        label: "Action",
        format: (value) => value.toLocaleString("en-US"),
    },
];

const gridColumns = ".3fr 1fr 1fr 1fr 1fr .8fr 1fr .6fr";

const pages = [15, 25, 50, 100];

const Transactions = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { admin } = useSelector((state) => state);
    const { customer, buyer } = useSelector((state) => state.customers);

    const { ALL_TRANSACTIONS } = TRANSACTION_DETAILS;
    const [tab, setTab] = useState(ALL_TRANSACTIONS);
    const [loading, setLoading] = useState(true);
    // const [pageNumberList, setPageNumberList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    // const [lastPage, setLastPage] = useState(pageNumberList?.length);
    const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
    const [openXport, closeXport] = useState(false);

    const [openViewMore, setOpenViewMore] = useState(false);
    const [exportAllLoader, setExportAllLoader] = useState(false);

    //   const [page, setPage] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const { totalTransactions } = useSelector((state) => state.stats);
    const { transactions } = useSelector((state) => state.transactions);
    const { listing } = useSelector((state) => state.listings);
    const { wallet } = useSelector((state) => state.wallets);

    const { IN_PROGRESS, CANCELED, COMPLETED } = BID_STATUS;

    const handleCredOption = (e) => {
        setAnchorEl(e.currentTarget);
    };

    useEffect(() => {
        return () => {
            dispatch({
                type: CLEAR_ERROR_MSG,
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tab) {
            setCurrentPage(1);
        }
    }, [tab]);

    useEffect(() => {
        if (!!transactions) {
            setLoading(false);
        }
    }, [transactions]);

    useEffect(() => {
        setLoading(true);
        switch (tab) {
            case ALL_TRANSACTIONS:
                dispatch(
                    getTransactions({
                        pageSize: rowsPerPage,
                        pageNumber: currentPage,
                    })
                );
                // console.log(totalPageCount);
                setPageCount(transactions?.totalPageCount || 0);
                break;
            default:
                break;
        }
    }, [
        ALL_TRANSACTIONS,
        tab,
        currentPage,
        rowsPerPage,
        dispatch,
        transactions.totalPageCount,
    ]);

    const downloadRecords = () => {
        let data = [];
        switch (tab) {
            case ALL_TRANSACTIONS:
                data = [...transactions];
                break;

            // case ALL_OPEN:
            //     data = [...transactions];
            //     break;

            default:
                break;
        }

        if (exportRecords(data, admin, tab)?.errors) {
            return;
        }
    };

    const downloadAll = async () => {
        setExportAllLoader(true);
        await exportAllTransactionRecords(admin);
        setExportAllLoader(false);
    };

    const handleSetTab = (tab) => {
        setTab(tab);
        setRowsPerPage(pages[0]);
    };

    const viewTableRow = (transaction) => {
        batch(() => {
            dispatch(getAListing(transaction.listingId));
            dispatch(getCustomer(transaction.buyer.customerId), "BUYER");
            dispatch(getCustomer(transaction.seller.customerId));
            dispatch(getOneWallet(transaction.walletId));
        });

        setOpenViewMore(true);
    };

    const currentAmount = (amount) => {
        return {
            currencyType: amount.currencyType + " ",
            amount: amount.amount,
        };
    };

    const handleDate = (dateTime) => {
        const time = new Date(dateTime);
        return {
            time: time.toLocaleTimeString(),
            space: " ",
            date: time.toDateString(),
        };
    };

    const navigateToCustomerDetails = () => {};

    const handleStatus = useCallback(
        (status) => {
            if (ALL_TRANSACTIONS) {
                switch (status) {
                    case COMPLETED:
                        return classes.verified;
                    case CANCELED:
                        return classes.rejected;
                    default:
                        return;
                }
            }
            // else if (ALL_OPEN) {
            //     return
            // }
            else {
                return "";
            }
        },
        [
            ALL_TRANSACTIONS,
            CANCELED,
            COMPLETED,
            classes.rejected,
            classes.verified,
        ]
    );

    const closeViewMoreModal = () => {
        setOpenViewMore(false);
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
            dispatch({
                type: CLEAR_BUYER,
            });
        });
    };

    const bidsStatusBlueprint = useCallback(
        (bids) => {
            // console.log(sellerName);
            const confirmed =
                (customer?.username ?? customer?.userName) +
                " confirms " +
                currentAmount(listing?.amountNeeded)?.currencyType +
                currentAmount(listing?.amountNeeded).amount +
                ", " +
                currentAmount(bids.bidAmount).currencyType +
                currentAmount(bids.bidAmount).amount +
                ` moved to ${buyer?.username ?? buyer?.userName}'s wallet`;

            const cancelled =
                (customer?.username ?? customer?.userName) +
                " cancels " +
                currentAmount(bids?.bidAmount).currencyType +
                currentAmount(bids?.bidAmount).amount +
                " listing.";

            const inProgress =
                (buyer?.username ?? buyer?.userName) +
                " has bid for " +
                currentAmount(bids?.bidAmount).currencyType +
                currentAmount(bids?.bidAmount).amount +
                ` listing.`;

            return {
                confirmed,
                cancelled,
                inProgress,
            };
        },
        [customer, buyer, listing]
    );
    const handleClose = () => {
        setAnchorEl(null);
    };

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
        [bidsStatusBlueprint, CANCELED, IN_PROGRESS, COMPLETED]
    );

    const handleCredit = (listing) => {
        // console.log("hell", listing);
        dispatch(
            creditListing(listing.walletId, {
                amount: listing.amountNeeded.amount,
                remark: "test",
            })
        );
    };

    return (
        <>
            <section
                className={clsx(
                    classes.root,
                    "animate__animated animate__fadeInLeft"
                )}
            >
                <Grid container direction="row" justifyContent="space-between">
                    <Grid item>
                        {tab === ALL_TRANSACTIONS && (
                            <Typography
                                variant="body1"
                                className={classes.title}
                            >
                                All Transactions
                            </Typography>
                        )}
                        {/* {tab === ALL_OPEN && <Typography variant="body1" className={classes.title}>All Open</Typography>}
                    {tab === ALL_NEGOTIATIONS && <Typography variant="body1" className={classes.title}>All Negotiations</Typography>}
                    {tab === ALL_DELETED && <Typography variant="body1" className={classes.title}>All Removed</Typography>} */}
                    </Grid>
                    <Grid item>
                        <Box
                            component="div"
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "10px",
                            }}
                        >
                            <GenericButton buttonName="Filter">
                                <Filter />
                            </GenericButton>
                            <GenericButton
                                clickAction={() => closeXport(!openXport)}
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
                            tab === ALL_TRANSACTIONS && classes.active
                        )}
                        onClick={() => handleSetTab(ALL_TRANSACTIONS)}
                    >
                        <Typography variant="subtitle2" component="span">
                            All Transactions
                        </Typography>
                        <Typography variant="subtitle2" component="span">
                            {totalTransactions}
                        </Typography>
                    </div>
                    {/* <div className={clsx(classes.filter, tab === ALL_OPEN && classes.active)} onClick={() => handleSetTab(ALL_OPEN)}>
                    <Typography variant="subtitle2" component="span">All Open</Typography>
                    <Typography variant="subtitle2" component="span">{totalTransactions}</Typography>
                </div>

                <div className={clsx(classes.filter, tab === ALL_NEGOTIATIONS && classes.active)} onClick={() => handleSetTab(ALL_NEGOTIATIONS)}>
                    <Typography variant="subtitle2" component="span">All Negotiations</Typography>
                    <Typography variant="subtitle2" component="span">{totalTransactions}</Typography>
                </div>

                <div className={clsx(classes.filter, tab === ALL_DELETED && classes.active)} onClick={() => handleSetTab(ALL_DELETED)}>
                    <Typography variant="subtitle2" component="span">All Removed</Typography>
                    <Typography variant="subtitle2" component="span">{totalTransactions}</Typography>
                </div> */}
                </Box>
                <Box component="div" className={classes.table}>
                    <GenericTableHeader
                        columns={columns}
                        gridColumns={gridColumns}
                    />
                    {tab === ALL_TRANSACTIONS && (
                        <AllTransactions
                            viewRow={viewTableRow}
                            navigateToProfile={navigateToCustomerDetails}
                            loadingTransactions={loading}
                        />
                    )}
                    {/* {tab === ALL_OPEN && <AllOpen />} */}
                    {/* {tab === ALL_NEGOTIATIONS && <AllNegotiations />} */}
                    {/* {tab === ALL_DELETED && <AllRemoved />} */}
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
                            {/* <Box component="div" sx={{ display: 'flex', gap: '15px' }}>
                                <GenericButton clickAction={onPrevPage} isDisabled={currentPage === 1} buttonName="Previous" />
                                <GenericButton clickAction={onNextPage} isDisabled={currentPage === lastPage} buttonName="Next" />
                            </Box> 
                            <Box component="span"  sx={{ display: 'flex', justifyContent:'center', gap: '10px' }}>
                                {
                                    pageNumberList && pageNumberList.map((pageNUmber, i) => (
                                        <Typography className={clsx(classes.pageList, pageNUmber === currentPage && classes.selected)} onClick={() => setCurrentPage(pageNUmber)} variant="subtitle2" key={i}>{pageNUmber}</Typography>
                                    ))
                                }
                            </Box> */}

                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                onChange={(event, value) =>
                                    setCurrentPage(value)
                                }
                            />
                        </Box>
                    </Box>
                )}

                {!!openViewMore ? (
                    <Box
                        component="div"
                        className={classes.viewMoreContainer}
                        onClick={() => closeViewMoreModal()}
                    >
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
                                        amlNumber={formatId(listing.id)}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Seller:"}
                                        amlNumber={
                                            customer?.username ??
                                            customer?.userName
                                        }
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Work Flow"}
                                        amlNumber={listing.workFlow}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Amount (Available):"}
                                        amlNumber={
                                            currentAmount(
                                                listing.amountAvailable
                                            ).currencyType +
                                            currentAmount(
                                                listing.amountAvailable
                                            ).amount
                                        }
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Available Balance:"}
                                        amlNumber={
                                            wallet && wallet?.balance?.available
                                        }
                                    />
                                </Box>
                                <Box component="div">
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Current Status"}
                                        otherStyles={handleStatusStyle(
                                            listing.status,
                                            classes
                                        )}
                                        amlNumber={listing.status}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Buyer"}
                                        amlNumber={
                                            buyer?.username ?? buyer?.userName
                                        }
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Rate:"}
                                        amlNumber={listing.exchangeRate}
                                    />
                                    <AmlBoard
                                        classes={classes}
                                        amlTitle={"Amount (Needed):"}
                                        amlNumber={
                                            currentAmount(listing.amountNeeded)
                                                .currencyType +
                                            currentAmount(listing.amountNeeded)
                                                .amount
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
                                {listing &&
                                    listing.bids.map((bid, index) => {
                                        return (
                                            <>
                                                <Box
                                                    key={index}
                                                    component="div"
                                                    className={
                                                        classes.viewMoreBids
                                                    }
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
                                                                    bid.status
                                                                )
                                                            )}
                                                        ></Box>
                                                        <Box
                                                            component="div"
                                                            className={
                                                                classes.line
                                                            }
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
                                                                    bid.status
                                                                )
                                                            )}
                                                        >
                                                            {bid.status}
                                                        </Typography>
                                                        <Box
                                                            component="span"
                                                            className={
                                                                classes.subStatus
                                                            }
                                                        >
                                                            <Typography component="span">
                                                                Activity:
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
                                                                        bid.datePlaced
                                                                    ).time
                                                                }
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                {
                                                                    handleDate(
                                                                        bid.datePlaced
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
                                                                    bid
                                                                )}
                                                            </Typography>
                                                            {/* <Typography component='span'>Another test: </Typography> */}
                                                        </Box>
                                                    </Box>
                                                    {listing &&
                                                    !listing.bids.length ? (
                                                        <Box
                                                            component="div"
                                                            id="basic-button"
                                                            aria-controls={
                                                                Boolean(
                                                                    anchorEl
                                                                )
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
                                                                anchorEl={
                                                                    anchorEl
                                                                }
                                                                keepMounted
                                                                open={Boolean(
                                                                    anchorEl
                                                                )}
                                                                onClose={
                                                                    handleClose
                                                                }
                                                                // classes={{
                                                                //     paper: classes.menu,
                                                                // }}
                                                                aria-haspopup="true"
                                                                aria-expanded={
                                                                    Boolean(
                                                                        anchorEl
                                                                    )
                                                                        ? "true"
                                                                        : undefined
                                                                }
                                                                MenuListProps={{
                                                                    "aria-labelledby":
                                                                        "basic-button",
                                                                }}
                                                                disableScrollLock={
                                                                    true
                                                                }
                                                            >
                                                                <MenuItem
                                                                    onClick={() =>
                                                                        handleCredit(
                                                                            bid
                                                                        )
                                                                    }
                                                                >
                                                                    Release
                                                                </MenuItem>
                                                                <MenuItem
                                                                    onClick={
                                                                        handleClose
                                                                    }
                                                                >
                                                                    Reverse
                                                                    Release
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
                                                    ) : (
                                                        ""
                                                    )}
                                                </Box>
                                            </>
                                        );
                                    })}
                                <Box
                                    // key={bid.id}
                                    component="div"
                                    className={classes.viewMoreBids}
                                >
                                    <Box
                                        component="div"
                                        className={classes.circleDesign}
                                    >
                                        <Box
                                            component="div"
                                            className={clsx(
                                                classes.circle,
                                                classes.status,
                                                handleStatus(listing.status)
                                            )}
                                        ></Box>

                                        <Box
                                            component="div"
                                            // style={
                                            //     listing && !!listing.bids.length
                                            //         ? { display: "none" }
                                            //         : {}
                                            // }
                                            className={classes.line}
                                        ></Box>
                                    </Box>
                                    <Box
                                        component="div"
                                        className={classes.statusContainer}
                                    >
                                        <Typography
                                            variant="h6"
                                            className={clsx(
                                                classes.userStatusTitle,
                                                classes.status,
                                                handleStatus(listing.status)
                                            )}
                                        >
                                            {listing.status}
                                        </Typography>
                                        <Box
                                            component="span"
                                            className={classes.subStatus}
                                        >
                                            <Typography component="span">
                                                Activity:
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box
                                        component="div"
                                        className={classes.dateTimeContainer}
                                    >
                                        <Box
                                            component="div"
                                            className={classes.dateTime}
                                        >
                                            <Typography variant="body1">
                                                {
                                                    handleDate(
                                                        listing.dateCreated
                                                    ).time
                                                }
                                            </Typography>
                                            <Typography variant="body1">
                                                {
                                                    handleDate(
                                                        listing.dateCreated
                                                    ).date
                                                }
                                            </Typography>
                                        </Box>
                                        <Box
                                            component="span"
                                            className={classes.subDateTime}
                                        >
                                            <Typography component="span">
                                                {bidsStatusDetails(listing)}
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
                                            className={classes.creditOptions}
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
                                                    handleCredit(listing)
                                                }
                                            >
                                                Release
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                Reverse Release
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                </Box>
                                {isEmpty(listing) ||
                                listing[0]?.status === CANCELED ? (
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

                {exportAllLoader ? (
                    <ExportAllLoader loader={exportAllLoader} />
                ) : (
                    ""
                )}
            </section>
        </>
    );
};

export default Transactions;
