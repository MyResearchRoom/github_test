import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({element,allowedRoles,role}) => {
    if(!allowedRoles.includes(role)){
        return <Navigate to='*' replace />
    }
    return element
}

export default ProtectedRoute
