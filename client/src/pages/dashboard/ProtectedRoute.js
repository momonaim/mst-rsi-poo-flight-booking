import { Navigate } from 'react-router-dom';
import { useValue } from '../../context/ContextProvider';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children }) => {
    const {
        state: { currentUser },
    } = useValue();

    // Vérifie si l'utilisateur est connecté et est ADMIN
    if (!currentUser || currentUser.role !== 'ADMIN') {
        Swal.fire({
            icon: 'error',
            title: 'Accès refusé',
            text: 'Vous n\'avez pas l\'autorisation d\'accéder à cette page.',
            confirmButtonText: 'OK',
        });

        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
