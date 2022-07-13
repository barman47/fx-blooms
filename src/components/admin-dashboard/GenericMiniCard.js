import { Box, CircularProgress, Typography, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ADMIN_FILTERS } from "../../utils/constants";
import GenericSelect from "./GenericSelect";

const useStyles = makeStyles((theme) => ({
    content: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: theme.spacing(10),
    },

    statsHeader: {
        fontWeight: 700,
        color: "black",
        // display: 'flex',
        // gridTemplateColumns: '1fr 1fr'
        // marginBottom: theme.spacing(1)
    },

    contentTitle: {
        color: "#A0AEC0",
        fontWeight: "700",
        fontSize: theme.spacing(2.2),
    },

    totalPercent: {
        color: "#48BB78",
        fontSize: "16px",
    },

    contentItem: {
        border: "none",
        borderRadius: theme.spacing(1.9),
        cursor: "pointer",
        padding: theme.spacing(2),
        boxShadow: "2px 2px 2px white",
        height: "113px  ",
        backgroundColor: "#FFFFFF",
    },

    contentIcon: {
        backgroundColor: "#E4EBEB",
        padding: theme.spacing(0.5, 1),
        borderRadius: theme.spacing(1.3),
        width: "8%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    disabled: {
        pointerEvents: "none",
    },

    dropDownContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        marginBottom: theme.spacing(2.5),
    },

    select: {
        fontSize: theme.spacing(1.5),
        minWidth: theme.spacing(7),
        paddingBottom: theme.spacing(0.6),
        paddingTop: theme.spacing(0.6),
        backgroundColor: "white",
        border: ".7px solid #E6E6E6",
    },
}));

const GenericMiniCard = ({
    goToPage,
    toolTip,
    filterName,
    cardName,
    cardIcon,
    filterType,
    handleOnChange,
    loading,
    formatFn,
    useCase,
    filterBtn = true,
}) => {
    const classes = useStyles();

    return (
        <Tooltip title={toolTip ?? ""} placement="bottom" arrow>
            <Box
                component="div"
                className={classes.contentItem}
                onClick={goToPage}
            >
                <Box component="div" className={classes.dropDownContainer}>
                    <Typography
                        className={classes.contentIcon}
                        variant="subtitle2"
                        component="span"
                        color="primary"
                    >
                        {cardIcon}
                    </Typography>
                    {filterBtn ? (
                        <GenericSelect
                            selectFilterName={filterName}
                            FILTERS={ADMIN_FILTERS}
                            selectValue={filterType}
                            setOnChange={handleOnChange}
                            loading={loading}
                        />
                    ) : (
                        ""
                    )}
                </Box>
                <Box component="div">
                    <Typography
                        className={classes.contentTitle}
                        variant="subtitle2"
                        component="span"
                        color="primary"
                    >
                        {cardName}
                    </Typography>
                    <Typography
                        variant="h5"
                        color="primary"
                        className={classes.statsHeader}
                    >
                        {loading ? (
                            <Box
                                component="div"
                                className={classes.filterLoaderContainer}
                            >
                                &nbsp;&nbsp;&nbsp;
                                <CircularProgress
                                    variant="indeterminate"
                                    disableShrink
                                    className={classes.top}
                                    classes={{
                                        circle: classes.circle,
                                    }}
                                    size={40}
                                    thickness={4}
                                />
                            </Box>
                        ) : !!formatFn ? (
                            formatFn(useCase)
                        ) : (
                            "200,00"
                        )}{" "}
                        {loading ? (
                            ""
                        ) : (
                            <Box
                                component="span"
                                className={classes.totalPercent}
                            >
                                &nbsp; +5%
                            </Box>
                        )}
                    </Typography>
                </Box>
            </Box>
        </Tooltip>
    );
};

export default GenericMiniCard;
