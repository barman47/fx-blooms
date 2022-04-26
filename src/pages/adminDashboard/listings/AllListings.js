import { useEffect, useState, useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { LISTING_COLUMNS } from '../../../utils/constants';
import { getAllListings } from '../../../actions/adminListings'
import { getCustomers } from '../../../actions/customer'
import GenericTableBody from '../../../components/admin-dashboard/GenericTableBody'
import { getCustomersWithoutProfile } from '../../../actions/customer';
import PropTypes from 'prop-types';


const gridColumns = '.3fr .8fr 1fr .8fr .5fr .8fr 1fr .3fr';

const AllListings = ({ getCustomersWithoutProfile, handleClick }) => {
  const dispatch = useDispatch()

//   const pages = [10, 25, 100]

  const { listings } = useSelector(state => state.listings)
  const [loadingListings, setLoadingListings] = useState(false)

//   const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
//   const [page, setPage] = useState(0);

//   console.log('ITEMS', items)
//   console.log('listings', listings)
  
  // useEffect(() => {
  //   // dispatch(getAllListings())
    
  //   dispatch(getCustomersWithoutProfile())
    
  // }, [dispatch])

  // useEffect(() => {
  //   dispatch(getCustomers({
  //       pageNumber: 1,
  //       pageSize: 15
  //   }))

  //   // console.log('listings', items)
  // }, [dispatch]);
  
  useEffect(() => {
    setLoadingListings(true)
    dispatch(getAllListings())

  }, [dispatch])


  useEffect(() => {
    dispatch(getCustomers({
        pageNumber: 1,
        pageSize: 15
    }))
  }, [dispatch]);

  useEffect(() => {
    if (listings && listings.length > 0) {
      setLoadingListings(false)
    }
  }, [listings])

  const viewListing = useCallback((listing) => {
    console.log('helo');
  }, [])

  return (
    <>
        <GenericTableBody viewCustomerProfile={viewListing} loading={loadingListings} gridColumns={gridColumns} addColumn={true} data={listings} handleClick={handleClick} columnList={LISTING_COLUMNS} />
    </>
  )
}

AllListings.propTypes = {
  getCustomersWithoutProfile: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  // viewCustomerProfile: PropTypes.func.isRequired
};

export default connect(undefined, { getCustomersWithoutProfile })(AllListings)


