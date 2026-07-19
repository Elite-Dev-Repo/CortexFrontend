import { Navigate, Outlet } from "react-router-dom"
import { ACCESS } from "@/lib/constants"

const ProtectedRoutes = () => {
  const token = localStorage.getItem(ACCESS)
  return token ? <Outlet /> : <Navigate to="/auth" replace />
}

export default ProtectedRoutes
