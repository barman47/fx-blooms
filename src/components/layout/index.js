import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import PublicHeader from './PublicHeader';
import Footer from './Footer';

const index = ({ children, title, description }) => (
    <>
        <Helmet>
            <title>{`${title} | FXBLOOMS.com`}</title>
            {description && <meta name="description" content={description} />}
        </Helmet>
        <PublicHeader />
        {children} 
        <Footer />
    </>
);

index.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string
};

export default index;