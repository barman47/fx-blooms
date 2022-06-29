import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgressBar from "./CircularProgressBar";
import { ChevronDown } from "mdi-material-ui";
import formatId from "../../utils/formatId";

const useStyles = makeStyles((theme) => ({
    accordion: {
        boxShadow: "none",
    },

    accordionSummary: {
        backgroundColor: "#F7F7F9",

        "&.Mui-expanded": {
            minHeight: "48px",
            // maxHeight: '55px'
            // backgroundColor: '#a5a5a5',
        },
    },
}));

const AccordionSearch = ({
    viewCustomerProfile,
    searchText,
    data,
    loading,
    accordionHeader,
}) => {
    const classes = useStyles();

    return (
        <Accordion
            className={classes.accordion}
            expanded={searchText && searchText?.length > 0 ? true : false}
        >
            <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className={classes.accordionSummary}
            >
                <Typography>
                    <Typography style={{ fontWeight: "bold" }} component="span">
                        {accordionHeader}
                    </Typography>{" "}
                    ({data?.length ?? 0})
                </Typography>
            </AccordionSummary>
            {loading ? (
                <CircularProgressBar topMargin="10px" />
            ) : (
                data &&
                data.map((custmer, i) => (
                    <AccordionDetails
                        key={i}
                        onClick={() => viewCustomerProfile(custmer)}
                    >
                        <Typography style={{ cursor: "pointer" }}>
                            {accordionHeader === "Customers"
                                ? custmer.firstName
                                    ? custmer.firstName
                                    : custmer.email
                                : formatId(custmer.id)}
                        </Typography>
                    </AccordionDetails>
                ))
            )}
        </Accordion>
    );
};

export default AccordionSearch;
