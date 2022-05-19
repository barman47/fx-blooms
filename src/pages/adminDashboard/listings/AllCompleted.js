import { useMemo } from 'react';
// import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import GenericTableBody from '../../../components/admin-dashboard/GenericTableBody'
import { LISTING_COLUMNS } from '../../../utils/constants';


const gridColumns = '.2fr 1fr 1fr .8fr .5fr .8fr .5fr 1fr .3fr';

const AllCompleted = ({ handleClick }) => {
  // const verifiedCustomers = useSelector(state => state.customers?.confirmed?.items);

  const CompletedListings = useMemo(() => (
    <>
        <GenericTableBody gridColumns={gridColumns} addColumn={true}  handleClick={handleClick} columnList={LISTING_COLUMNS} />
    </>
  ), [handleClick])

  return CompletedListings
}

AllCompleted.propTypes = {
  // handleClick: PropTypes.func.isRequired,
}

export default AllCompleted