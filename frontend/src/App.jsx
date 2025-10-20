import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/users/Login.jsx';
import Register from './pages/users/Register.jsx';
import Beranda from './pages/users/Beranda.jsx';
import EditCV from './pages/users/EditCV.jsx';
import UbahPassword from './pages/users/UbahPassword.jsx';
import LupaPassword from './pages/auth/LupaPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import VerifikasiEmail from './pages/users/VerifikasiEmail.jsx';
import MergerPdfPage from './pages/users/MergePdfPage.jsx';
import ConvertJpgToPdfPage from './pages/users/ConvertJpgToPdfPage.jsx';
import PreviewCV from './pages/users/PreviewCV.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AdminLogin from './rx78gpo1p6/pages/Login.jsx';
import AdminProtectedRoute from './rx78gpo1p6/routes/AdminRoutes.jsx';
import Dashboard from './rx78gpo1p6/pages/Dashboard.jsx';
import UsersPage from './rx78gpo1p6/components/UserPage.jsx';
import ListCVPage from './rx78gpo1p6/pages/ListCVPage.jsx';
import AdminLogsPage from './rx78gpo1p6/pages/AdminLogsPage.jsx';
import AnnouncementPage from './rx78gpo1p6/pages/AnnouncementPage.jsx';
import AdminPaymentTable from './rx78gpo1p6/pages/AdminPaymentTable.jsx';
import PrivateRoute from './components/users/PrivateRoute.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/lupa-password" element={<LupaPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verifikasi" element={<VerifikasiEmail />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/rx78gpo1p6/login" element={<AdminLogin />} />

        {/* Semua halaman user (pakai DashboardLayout DI DALAM halaman tsb, bukan di sini) */}
        <Route path="/users/:userId/beranda" element={<PrivateRoute><Beranda /></PrivateRoute>} />
        <Route path="/users/:userId/choose-cv" element={<PrivateRoute><PreviewCV /></PrivateRoute>} />
        <Route path="/users/:userId/merger-pdf" element={<PrivateRoute><MergerPdfPage/></PrivateRoute>} />
        <Route path="/users/:userId/jpg-convert-pdf" element={<PrivateRoute><ConvertJpgToPdfPage/></PrivateRoute>} />
        <Route path="/users/:userId/edit-cv" element={<PrivateRoute><EditCV/></PrivateRoute>} />
        <Route path="/users/:userId/ubah-password" element={<PrivateRoute><UbahPassword /></PrivateRoute>} />

        {/* Route admin */}
        <Route path="/rx78gpo1p6/login" element={<AdminLogin />} />        
        <Route
            path="/rx78gpo1p6/dashboard"
            element={
          <AdminProtectedRoute>
           <Dashboard />
      </AdminProtectedRoute>
    }
  />
  <Route
            path="/rx78gpo1p6/users"
            element={
          <AdminProtectedRoute>
           <UsersPage />
      </AdminProtectedRoute>
    }
  />
      <Route
            path="/rx78gpo1p6/cv"
            element={
          <AdminProtectedRoute>
           <ListCVPage />
      </AdminProtectedRoute>
    }
  />
    <Route
            path="/rx78gpo1p6/logs"
            element={
          <AdminProtectedRoute>
           <AdminLogsPage />
      </AdminProtectedRoute>
    }
  />

<Route
            path="/rx78gpo1p6/payment-history"
            element={
          <AdminProtectedRoute>
           <AdminPaymentTable />
      </AdminProtectedRoute>
    }
  />

   <Route
            path="/rx78gpo1p6/announcement"
            element={
          <AdminProtectedRoute>
           <AnnouncementPage />
      </AdminProtectedRoute>
    }
  />

      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
