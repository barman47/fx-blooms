import { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { LISTING_COLUMNS } from '../../../utils/constants';
import { getAllListings } from '../../../actions/adminListings'
import { getCustomers } from '../../../actions/customer'
import GenericTableBody from '../../../components/admin-dashboard/GenericTableBody'
import { getCustomersWithoutProfile } from '../../../actions/customer';
import PropTypes from 'prop-types';


const gridColumns = '.2fr 1fr 1fr .8fr .5fr .8fr .5fr 1fr .3fr';

const AllListings = ({ getCustomersWithoutProfile, handleClick }) => {
  const dispatch = useDispatch()

//   const pages = [10, 25, 100]

//   const { listings: { listings } } = useSelector(state => state)
  const noProfileCustomers = useSelector(state => state.customers?.noProfile?.items);

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
    dispatch(getAllListings())

  }, [dispatch])


  useEffect(() => {
    dispatch(getCustomers({
        pageNumber: 1,
        pageSize: 15
    }))
  }, [dispatch]);

  return (
    <>
        <GenericTableBody gridColumns={gridColumns} addColumn={true} data={noProfileCustomers} handleClick={handleClick} columnList={LISTING_COLUMNS} />
    </>
  )
}

AllListings.propTypes = {
  getCustomersWithoutProfile: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  // viewCustomerProfile: PropTypes.func.isRequired
};

export default connect(undefined, { getCustomersWithoutProfile })(AllListings)


