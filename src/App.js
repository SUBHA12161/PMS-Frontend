import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import CourseCatalog from "./pages/CourseCatalog";
import CreateCourse from "./pages/CreateCourse";
import PrivateRoute from "./components/PrivateRoute";
import NavigationBar from "./components/NavigationBar";
import AuthForm from "./pages/AuthForm";
import AddEmployee from "./pages/AddEmployee";
import EmployeeList from "./pages/EmployeeList";
import ManagerReview from "./pages/ManagerReview";
import SelfReview from "./pages/SelfReview";
import EmployeeReviews from "./pages/EmployeeReviews";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <NavigationBar />
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route
          path="/"
          element={<Navigate to={user ? "/" : "/auth"} replace />} />

        {/* Authentication Form */}
        <Route path="/auth" element={<AuthForm />} />

        {/* Protected Routes */}
        <Route
          path="/add-employee"
          element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
        <Route
          path="/view-employees"
          element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
        <Route
          path="/manager-review"
          element={<PrivateRoute><ManagerReview /></PrivateRoute>} />
        <Route
          path="/self-review"
          element={<PrivateRoute><SelfReview /></PrivateRoute>} />

        <Route
          path="/view-review"
          element={<PrivateRoute><EmployeeReviews /></PrivateRoute>} />

        {/* Course Management */}
        <Route
          path="/courses"
          element={<PrivateRoute><CourseCatalog /></PrivateRoute>} />
        <Route
          path="/create-course"
          element={<PrivateRoute allowedRoles={["Instructor"]}><CreateCourse /></PrivateRoute>} />
      </Routes>
    </>
  );
};

export default App;