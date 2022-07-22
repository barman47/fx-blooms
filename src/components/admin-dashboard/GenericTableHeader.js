import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    tableHeaderRow: {
        display: "grid",

        color: "#3C3C3C",
        borderBottom: "2px solid #E3E8EE",
        alignItems: "center",
        gap: 10,

        "& span": {
            fontWeight: "600",
            // paddingTop: theme.spacing(1),
            // paddingBottom: theme.spacing(1),
            fontSize: "1.1vw",
            fontStretch: "50%",
            // borderLeft: `1px solid red`
        },
    },
}));

const GenericTableHeader = ({ columns, gridColumns, headerPadding }) => {
    const classes = useStyles();

    return (
        <>
            <Box
                component="section"
                sx={{
                    gridTemplateColumns: gridColumns,
                    padding: `${headerPadding ? headerPadding : "11.2px 0"}`,
                }}
                className={classes.tableHeaderRow}
            >
                {columns &&
                    columns.map((column, i) => (
                        <Typography
                            component="span"
                            key={i}
                            className={classes.tableCell}
                            variant="subtitle1"
                        >
                            {column.label}
                        </Typography>
                    ))}
            </Box>
        </>
    );
};

export default GenericTableHeader;
