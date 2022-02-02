import SocialLogin from 'react-social-login';
import { GoogleLoginButton } from 'react-social-login-buttons';
import  { Component } from 'react';

class GoogleLogin extends Component {
    render () {
        const { children, triggerLogin, triggerLogout, className,  ...props } = this.props;

        const handleOnclick = (e) => {
            e.preventDefault();
            triggerLogin();
        }

        return (
            <GoogleLoginButton 
                onClick={(e) =>handleOnclick(e)} 
                className={className}
                {...props}
            >
                {children}
            </GoogleLoginButton>
        );
    }
}

export default SocialLogin(GoogleLogin);