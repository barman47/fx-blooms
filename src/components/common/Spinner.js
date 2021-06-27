import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
}));

const Spinner = ({ text }) => {
    const classes = useStyles();

    return (
        <div>
            <Backdrop className={classes.backdrop} open={true}>
                <CircularProgress color="inherit" />
                <Typography variant="h5" className={classes.text}>
                    {text}
                </Typography>
            </Backdrop>
        </div>
    );
};
// const Spinner = forwardRef((props, ref) => {
//     const classes = useStyles();
//     const [open, setOpen] = useState(false);

//     useEffect(() => {
//         if (open) {
//             console.log('is open ', open)
//         }
//     }, [open]);

//     useImperativeHandle(ref, () => ({
//         open: () => {
//             setOpen(true);
//         },

//         close: () => {
//             setOpen(false);
//         },

//         toggle: () => {
//             setOpen(!open);
//         }
//     }));

//     return (
//         <div>
//             <Backdrop className={classes.backdrop} open={open}>
//                 <CircularProgress color="inherit" />
//                 <Typography variant="h5" className={classes.text}>
//                     {props.text}
//                 </Typography>
//             </Backdrop>
//         </div>
//     );
// });

export default Spinner;