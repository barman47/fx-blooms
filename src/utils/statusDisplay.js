import { CUSTOMER_CATEGORY, LISTING_CATEGORY, PAYMENT_TYPE, PAYMENT_STATUS } from './constants';

const { CONFIRMED, PENDING, REJECTED, SUSPENDED } = CUSTOMER_CATEGORY;
const { OPEN, CANCELED, REMOVED } = LISTING_CATEGORY

const { WITHDRAWAL, FUND } = PAYMENT_TYPE
const { IN_PROGRESS, FAILED, COMPLETED } = PAYMENT_STATUS

const handleStatusStyle = (status, classes) => {
  switch (status) {
    case CONFIRMED:
      return classes.verified
    case PENDING:
      return classes.pending
    case OPEN:
      return classes.verified
    case REJECTED:
      return classes.rejected
    case REMOVED:
      return classes.rejected
    case SUSPENDED:
      return classes.suspended
    case CANCELED:
      return classes.rejected
    case true:
      return classes.verified
    case false:
      return classes.suspended
    case FUND:
      return classes.verified
    case FAILED:
      return classes.rejected
    case COMPLETED:
      return classes.verified
    case IN_PROGRESS:
      return classes.suspended
    case WITHDRAWAL:
      return classes.rejected
    case 'Completed':
      return classes.verified
    default:
      return
  }
}

export default handleStatusStyle