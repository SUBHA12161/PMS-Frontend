import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Add from "./pages/KPI/Add";
import View from "./pages/KPI/View";
import PrivateRoute from "./components/PrivateRoute";
import NavigationBar from "./components/NavigationBar";
import AuthForm from "./pages/AuthForm";
import AddEmployee from "./pages/AddEmployee";
import EmployeeList from "./pages/EmployeeList";
import ManagerReview from "./pages/ManagerReview";
import SelfReview from "./pages/SelfReview";
import EmployeeReviews from "./pages/EmployeeReviews";
import Dashboard from "./pages/Dashboard";
import AddPerformance from "./pages/Performance/Add";
import ViewPerformance from "./pages/Performance/View";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <NavigationBar />
      <Routes>
        {/* Redirect to login if not authenticated */}
        <Route
          path="/"
          element={<Navigate to={user ? "/home" : "/auth"} replace />} />

        {/* Authentication Form */}
        <Route path="/auth" element={<AuthForm />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={<PrivateRoute><Dashboard /></PrivateRoute>} />
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

        <Route
          path="/add-kpi"
          element={<PrivateRoute><Add /></PrivateRoute>} />
        <Route
          path="/view-kpi"
          element={<PrivateRoute><View /></PrivateRoute>} />

        <Route
          path="/add-performance"
          element={<PrivateRoute><AddPerformance /></PrivateRoute>} />
        <Route
          path="/view-performance"
          element={<PrivateRoute><ViewPerformance /></PrivateRoute>} />

      </Routes>
    </>
  );
};

export default App;