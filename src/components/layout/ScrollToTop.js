import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = ({ children }) => {
    const location = useLocation();
    const [pathname, setPathname] = useState('');

    useEffect(() => {
        if (location.pathname !== pathname) {
            setPathname(location.pathname);
            window.scrollTo(0, 0);
        }
    }, [location.pathname, pathname]);

    return <Fragment>{children}</Fragment>;
}

export default ScrollToTop;