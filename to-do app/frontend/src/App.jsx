import { Route, Routes, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Tasks from './pages/Tasks'

function PrivateRoute({ children }) {
    const token = localStorage.getItem('access')
    return token ? children : <Navigate to={"/login"} replace />
}
  
  export default function App() {
  return (
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={ <PrivateRoute><Tasks /></PrivateRoute> } />
        <Route path='*' element={<div>Not found. <Link to="/">Go Home</Link></div>} />
      </Routes>
  )
}
