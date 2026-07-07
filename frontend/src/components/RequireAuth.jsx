import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
    const token = localStorage.getItem('dusasistan_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RequireAuth;
