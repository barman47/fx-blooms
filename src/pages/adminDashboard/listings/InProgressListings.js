import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import GenericTableBody from '../../../components/admin-dashboard/GenericTableBody'
import { LISTING_COLUMNS } from '../../../utils/constants';


const gridColumns = '.3fr .8fr 1fr .8fr .5fr .7fr 1fr .5fr';

const InProgressListings = ({ viewRow, loadingListings }) => {
  const listings = useSelector(state => state.listings?.inProgressListings?.items);

  const listingNegotiations = useMemo(() => (
    <>
        <GenericTableBody viewCustomerProfile={viewRow} loading={loadingListings} gridColumns={gridColumns} addColumn={true} data={listings} viewMore={true} columnList={LISTING_COLUMNS} />
    </>
  ), [viewRow, loadingListings, listings])

  return listingNegotiations
}

InProgressListings.propTypes = {
  viewRow: PropTypes.func.isRequired,
  loadingListings: PropTypes.bool.isRequired,
}

export default InProgressListings