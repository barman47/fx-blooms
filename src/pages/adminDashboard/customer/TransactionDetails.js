import { useEffect } from "react";
import { useDispatch, useSelector, batch } from "react-redux";
import {
    Typography,
    Box,
    // Select,
    // MenuItem,
    // InputLabel,
    // FormControl,
    Paper,
    // Divider,
} from "@material-ui/core";
import { COLORS } from "../../../utils/constants";
import { makeStyles } from "@material-ui/core/styles";
import {
    getCustomerListingCounts,
    getCustomerVolumeCounts,
} from "../../../actions/customer";
// import { getAllListings } from '../../../actions/adminListings'
// import GenericSelect from '../../../components/admin-dashboard/GenericSelect'
import isEmpty from "../../../utils/isEmpty";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "white",
        borderRadius: theme.shape.borderRadius,
        padding: [[theme.spacing(2), theme.spacing(5)]],
        boxShadow: "1px 1px 3px #dbdddd",

        [theme.breakpoints.down("md")]: {
            paddingBottom: theme.spacing(4),
        },
    },

    content: {
        display: "grid",
        // gridTemplateColumns: '1fr 1fr',
        gridAutoColumns: "1fr",
        // gridAutoFlow: 'column dense',
        // display: 'flex',
        // flexWrap: 'wrap',
    },

    detail: {
        marginBottom: theme.spacing(2),
        // width: '325.61px'
    },

    select: {
        "&:before": {
            borderColor: COLORS.lightTeal,
        },
        "&:after": {
            borderColor: COLORS.lightTeal,
        },
    },

    selectRoot: {
        fill: COLORS.lightTeal + "!important",
    },

    icon: {
        top: "calc(50% - 17px) !important",
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

    selectForm: {
        border: "1px solid",
        borderColor: COLORS.lightTeal,
        "& label": {
            fontSize: "12px !important",
        },
    },

    divider: {
        backgroundColor: theme.palette.primary.main,
        width: theme.spacing(0.5),
    },

    detailTitle: {
        marginBottom: theme.spacing(5),
    },

    label: {
        fontSize: theme.spacing(2),
    },

    paperBx: {
        // marginRight: theme.spacing(5),
        // padding: [[theme.spacing(1), theme.spacing(2)]],
        border: `1px solid #E8E9EA`,
        outline: "none",
        // width: '443.39px',

        "&:not(:last-child)": {
            marginBottom: theme.spacing(5),
        },

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        "& subtitle2": {
            fontWeight: "600",
        },

        "& > div": {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
    },

    transactionHeader: {
        padding: "10px",
        borderBottom: "1px solid #E8E9EA",
        textTransform: "uppercase",

        "& h6": {
            margin: 0,
            color: "#3C3C3C",
            fontWeight: "500",
        },
    },

    detailsRow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 13px",
        gap: "7px",

        "& h6": {
            fontSize: "14px",
            fontWeight: "normal",
            color: "#3C3C3C",
        },

        "& h6:last-child": {
            color: "#3C3C3C",
            fontWeight: "bold",
        },
    },

    paperWalletCard: {
        height: "200px",
        maxWidth: "26rem",
        borderRadius: "10px",
        position: "relative",

        "&:nth-child(2) img.walletDesign": {
            backgroundColor: "black",
        },

        "&:not(:last-child)": {
            marginBottom: theme.spacing(5),
        },
    },

    cardRightContent: {
        background: COLORS.primary,
        borderRadius: "10px",
        width: "100%",
        height: "100%",
        // clipPath: 'polygon(67% 0, 83% 0, 100% 0, 100% 79%, 100% 100%, 85% 100%, 79% 62%, 50% 31%, 47% 0)',
    },

    cardRightContent2: {
        background: COLORS.darkTeal,
        borderRadius: "10px",
        width: "100%",
        height: "100%",
        // clipPath: 'polygon(28% 0, 45% 53%, 72% 100%, 0% 100%, 0 57%, 0% 0%)',
    },

    cardLeftContent: {
        width: "50%",
        alignSelf: "flex-start",
        paddingTop: "20px",
        paddingLeft: "15px",

        "& h6:not(:last-child)": {
            marginBottom: "20px",
        },
    },

    walletDesign: {
        height: "198px",
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
        gap: theme.spacing(1.2),
        color: "black",
        fontSize: ".6vw",
    },

    walletAmount: {
        paddingLeft: 30,
        fontSize: "1vw",
        fontWeight: "bold",
    },
}));

const TransactionDetails = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const { customer } = useSelector((state) => state.customers);
    const {
        inProgressListingCount,
        activeListingCount,
        totalListingCount,
        completedListingCount,
        deletedListingCount,
    } = useSelector((state) => state.customer.customerListingCounts);
    const { buyAvgCount, sellAvgCount, sellCount, buyCount } = useSelector(
        (state) => state.customer.customerVolumeCounts
    );

    useEffect(() => {
        if (!isEmpty(customer)) {
            batch(() => {
                dispatch(getCustomerListingCounts(customer.id));
                dispatch(getCustomerVolumeCounts(customer.id));
            });
        }
    }, [dispatch, customer]);

    // useEffect(() => {
    //   dispatch(getCustomer(customer.id))
    // }, [dispatch, customer])

    return (
        <>
            <Box component="section" className={classes.root}>
                <Typography
                    className={classes.detailTitle}
                    variant="h6"
                    color="primary"
                >
                    Transaction Details
                </Typography>
                <Box component="section" className={classes.content}>
                    <Box component="div" className={classes.detail}>
                        {/* <div className={classes.subDetailTitle}>
            <Typography color="primary" variant="h6">Transactions</Typography>
            <Box component="div" sx={{ minWidth: 70 }}>
              <FormControl fullWidth className={classes.selectForm}>
                <InputLabel id="week">WEEK</InputLabel>
                <Select
                  labelId="week"
                  id="demo-simple-select"
                  label="Week"
                  inputProps={{
                    classes: {
                        icon: classes.icon,
                    },
                  }}
                >
                  <MenuItem>Ten</MenuItem>
                  <MenuItem>Twenty</MenuItem>
                  <MenuItem>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div> */}
                        <Paper
                            className={classes.paperBx}
                            elevation={2}
                            variant="outlined"
                            rectangle="true"
                        >
                            <Box
                                component="div"
                                className={classes.transactionHeader}
                            >
                                <Typography component="h6">LISTINGS</Typography>
                                {/* <GenericSelect selectFilterName={filterName} FILTERS={ADMIN_FILTERS} selectValue={filterType} setOnChange={handleOnChange} loading={loading} /> */}
                            </Box>
                            <div className={classes.paperBxContent}>
                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        Completed
                                    </Typography>
                                    <Typography variant="h6">
                                        {completedListingCount ?? 0}
                                    </Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        Deleted
                                    </Typography>
                                    <Typography variant="h6">
                                        {+deletedListingCount?.toFixed(2) ?? 0}
                                    </Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">Active</Typography>
                                    <Typography variant="h6">
                                        {+activeListingCount?.toFixed(2) ?? 0}
                                    </Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        In Progress
                                    </Typography>
                                    <Typography variant="h6">
                                        {+inProgressListingCount?.toFixed(2) ??
                                            0}
                                    </Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6">
                                        {+totalListingCount?.toFixed(2) ?? 0}
                                    </Typography>
                                </div>
                            </div>
                        </Paper>
                        <Paper
                            className={classes.paperBx}
                            elevation={2}
                            variant="outlined"
                            rectangle="true"
                        >
                            <Box
                                component="div"
                                className={classes.transactionHeader}
                            >
                                <Typography variant="h6">
                                    Transactions
                                </Typography>
                                {/* <GenericSelect selectFilterName={filterName} FILTERS={ADMIN_FILTERS} selectValue={filterType} setOnChange={handleOnChange} loading={loading} /> */}
                            </Box>
                            <div className={classes.paperBxContent}>
                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">Buys</Typography>
                                    <Typography variant="h6">0</Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">Sells</Typography>
                                    <Typography variant="h6">0</Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        Disputed Buys
                                    </Typography>
                                    <Typography variant="h6">0</Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        Disputed Sells
                                    </Typography>
                                    <Typography variant="h6">0</Typography>
                                </div>
                            </div>
                        </Paper>

                        <Paper
                            className={classes.paperBx}
                            elevation={2}
                            variant="outlined"
                            rectangle="true"
                        >
                            <Box
                                component="div"
                                className={classes.transactionHeader}
                            >
                                <Typography component="h6">Volume</Typography>
                                {/* <GenericSelect selectFilterName={filterName} FILTERS={ADMIN_FILTERS} selectValue={filterType} setOnChange={handleOnChange} loading={loading} /> */}
                            </Box>
                            <div className={classes.paperBxContent}>
                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">Buys</Typography>
                                    <Typography variant="h6">
                                        {+buyCount?.toFixed(2) ?? 0}
                                    </Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">Sells</Typography>
                                    <Typography variant="h6">
                                        {+sellCount?.toFixed(2) ?? 0}
                                    </Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        Average Buys
                                    </Typography>
                                    <Typography variant="h6">
                                        {+buyAvgCount?.toFixed(2) ?? 0}
                                    </Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        Averyage Sells
                                    </Typography>
                                    <Typography variant="h6">
                                        {+sellAvgCount?.toFixed(2) ?? 0}
                                    </Typography>
                                </div>
                            </div>
                        </Paper>

                        <Paper
                            className={classes.paperBx}
                            elevation={2}
                            variant="outlined"
                            rectangle="true"
                        >
                            <Box
                                component="div"
                                className={classes.transactionHeader}
                            >
                                <Typography variant="h6">Fees</Typography>
                                {/* <GenericSelect selectFilterName={filterName} FILTERS={ADMIN_FILTERS} selectValue={filterType} setOnChange={handleOnChange} loading={loading} /> */}
                            </Box>
                            <div className={classes.paperBxContent}>
                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        Buying Fees
                                    </Typography>
                                    <Typography variant="h6">0</Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">
                                        Selling Fees
                                    </Typography>
                                    <Typography variant="h6">0</Typography>
                                </div>

                                <div className={classes.detailsRow}>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6">0</Typography>
                                </div>
                            </div>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default TransactionDetails;
