import { LISTING_STATUS } from './constants';

const getLastFinalizedListing = (listings) => {
    let finalizedTime = new Date().getTime(listings[0].dateFinalized);
    let currentFinalized = 0;
    let recommendedListing = listings[0];
    for (let i = 1; i < listings.length; i++) {
        currentFinalized = new Date().getTime(listings[i].dateFinalized);
        if (currentFinalized > finalizedTime) {
            finalizedTime = currentFinalized;
            recommendedListing = listings[i];
        }
    }
    return recommendedListing.exchangeRate - 2;
};

const getRecommendedRate = (listings) => {
    if (listings) {
        for (let listing of listings) {
            if (listing.status === LISTING_STATUS.open) {
                return listing.exchangeRate - 2;
            }
        }
        return getLastFinalizedListing(listings);
    }
    return null;
};

export default getRecommendedRate;