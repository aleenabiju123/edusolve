import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";

import StudentSignIn from "./pages/StudentSignIn";
import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDashboard from "./pages/StudentDashboard";
import ComplaintForm from "./pages/ComplaintForm";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Protected Route component
function ProtectedRoute({ children, requiredUserType }) {
  // Use separate keys for separate user types to allow simultaneous sessions
  const storageKey = requiredUserType === 'Admin' ? 'adminAuthData' : 'studentAuthData';

  // If no specific user type is required, check both (e.g., for general routes like /complaint)
  let authData = JSON.parse(localStorage.getItem(storageKey) || '{}');

  // Fallback for general routes: check student first, then admin
  if (!requiredUserType && !authData.isAuthenticated) {
    authData = JSON.parse(localStorage.getItem('adminAuthData') || '{}');
  }

  const isAuthenticated = authData.isAuthenticated;
  const userType = authData.userType;

  if (!isAuthenticated) {
    // If not authenticated, redirect to the appropriate sign-in page
    return <Navigate to="/student-signin" replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type if trying to access wrong one
    return <Navigate to={userType === 'Admin' ? '/admin' : '/student'} replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/student-signin" element={<StudentSignIn />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/student-register" element={<StudentRegister />} />
      <Route path="/student" element={
        <ProtectedRoute requiredUserType="Student">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/complaint" element={
        <ProtectedRoute>
          <ComplaintForm />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requiredUserType="Admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
export default App;