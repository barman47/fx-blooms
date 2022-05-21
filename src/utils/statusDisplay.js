import { CUSTOMER_CATEGORY } from './constants';

const { CONFIRMED, PENDING, REJECTED, SUSPENDED } = CUSTOMER_CATEGORY;

const handleStatusStyle = (status, classes) => {
  switch (status) {
    case CONFIRMED:
      return classes.verified
    case PENDING:
      return classes.pending
    case "OPEN":
      return classes.verified
    case REJECTED:
      return classes.rejected
    case "REMOVED":
      return classes.rejected
    case SUSPENDED:
      return classes.suspended
    case true:
      return classes.verified
    case false:
      return classes.suspended
    default:
      return
  }
}

export default handleStatusStyle