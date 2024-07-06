// utils/auth.js
import Cookies from 'js-cookie';

export function isAuthenticated() {
    const adminCookie = Cookies.get('admin_logado');
    return adminCookie ? true : false;
}

export function withAuth(Component) {
    return (props) => {
        if (typeof window !== 'undefined') {
            const isAuth = isAuthenticated();

            if (!isAuth) {
                window.location.href = '/login';
                return null;
            }

            return <Component {...props} />;
        }

        return <Component {...props} />;
    };
}
