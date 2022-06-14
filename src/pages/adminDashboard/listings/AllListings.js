// import { useEffect, useState, useCallback } from 'react';
import { useSelector } from "react-redux";
import { LISTING_COLUMNS } from "../../../utils/constants";
// import { getAllListings } from '../../../actions/adminListings'
// import { getCustomers } from '../../../actions/customer'
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";
import PropTypes from "prop-types";

const gridColumns = ".3fr .8fr 1fr .8fr .5fr .7fr 1fr .5fr";

const AllListings = ({ loadingListings, viewRow }) => {
    const { listings } = useSelector((state) => state.listings);

    return (
        <>
            <GenericTableBody
                viewCustomerProfile={viewRow}
                loading={loadingListings}
                gridColumns={gridColumns}
                addColumn={true}
                data={listings}
                viewMore={true}
                columnList={LISTING_COLUMNS}
            />
        </>
    );
};

AllListings.propTypes = {
    viewRow: PropTypes.func.isRequired,
    loadingListings: PropTypes.bool.isRequired,
};

export default AllListings;
