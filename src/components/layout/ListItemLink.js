import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';

export default function ListItemLink(props) {
    const { to } = props;
    return <ListItem button component={Link} to={to} {...props} />;
}