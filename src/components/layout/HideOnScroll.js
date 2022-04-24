import { Slide, useScrollTrigger } from '@material-ui/core';

import PropTypes from 'prop-types';

const HideOnScroll = (props) => {
    const { children, direction } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction={direction} in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.defaultProps = {
    direction: 'down'
};

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    direction: PropTypes.string

};

export default HideOnScroll;