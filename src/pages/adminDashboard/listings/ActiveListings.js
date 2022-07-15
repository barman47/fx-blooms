import { useMemo } from "react";
import { useSelector } from "react-redux";
import { LISTING_COLUMNS } from "../../../utils/constants";
import GenericTableBody from "../../../components/admin-dashboard/GenericTableBody";
import PropTypes from "prop-types";

// const gridColumns = ".3fr .8fr 1fr .8fr .5fr .7fr 1fr .5fr";

const ActiveListings = ({ viewRow, loadingListings, navigateToProfile }) => {
    const listings = useSelector(
        (state) => state.listings?.activeListings?.items
    );

    const openListingsMemo = useMemo(
        () => (
            <>
                <GenericTableBody
                    viewCustomerProfile={viewRow}
                    loading={loadingListings}
                    addColumn={true}
                    data={listings}
                    viewMore={true}
                    profileNavigate={navigateToProfile}
                    columnList={LISTING_COLUMNS}
                />
            </>
        ),
        [viewRow, loadingListings, listings, navigateToProfile]
    );

    return openListingsMemo;
};

ActiveListings.propTypes = {
    viewRow: PropTypes.func.isRequired,
    loadingListings: PropTypes.bool.isRequired,
};

export default ActiveListings;
