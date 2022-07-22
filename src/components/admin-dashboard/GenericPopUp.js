import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(1px)",
        width: "100%",
        height: "100%",
        top: 0,
        right: 0,
        zIndex: 1000,
        // transform: 'translate(0, 84px)'
    },

    container: {
        backgroundColor: "white",

        borderRadius: 10,
        paddingTop: 30,
    },
}));

const GenericPopUp = ({
    children,
    containerHeight = "75vh",
    containerWidth = "50%",
    containerMargin,
}) => {
    const classes = useStyles();

    return (
        <Box component="div" className={clsx(classes.root)}>
            <Box
                component="div"
                className={clsx(
                    classes.container,
                    "animate__animated animate__zoomIn"
                )}
                sx={{
                    height: containerHeight,
                    width: containerWidth,
                    margin: containerMargin ?? "2rem 22vw 0 auto",
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default GenericPopUp;
