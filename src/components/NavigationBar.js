import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import "../assets/css/NavigationBar.css";

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const [dropdownOpen, setDropdownOpen] = useState({
        employee: false,
        review: false,
    });

    const handleMouseEnter = (key) => {
        setDropdownOpen((prevState) => ({
            ...prevState,
            [key]: true,
        }));
    };

    const handleMouseLeave = (key) => {
        setDropdownOpen((prevState) => ({
            ...prevState,
            [key]: false,
        }));
    };

    const isActive = (path) => location.pathname === path;

    const renderNavLinks = () => {
        if (!user) return null;

        const rolesWithEmployeeManagement = [
            "Admin",
            "Manager",
            "Program Head",
            "Program Manager",
            "Business Manager",
        ];

        const renderDropdown = (title, menuItems, dropdownKey) => (
            <div
                className="dropdown"
                onMouseEnter={() => handleMouseEnter(dropdownKey)}
                onMouseLeave={() => handleMouseLeave(dropdownKey)}
            >
                <span
                    className={`dropdown-title ${menuItems.some((item) => isActive(item.path)) ? "active" : ""
                        }`}
                >
                    {title}
                </span>
                {dropdownOpen[dropdownKey] && (
                    <div className="dropdown-menu">
                        {menuItems.map((item) => (
                            <a
                                key={item.path}
                                href={item.path}
                                className={`dropdown-item ${isActive(item.path) ? "active" : ""}`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );

        switch (user.role) {
            case "Admin":
                return renderDropdown("Employee Management", [
                    { label: "Add Employee", path: "/add-employee" },
                    { label: "View Employees", path: "/view-employees" },
                ], "employee");
            case "Manager":
            case "Program Head":
            case "Program Manager":
            case "Business Manager":
            case "CompositionEvent":
                return (
                    <>
                        {rolesWithEmployeeManagement.includes(user.role) &&
                            renderDropdown("Employee Management", [
                                { label: "Add Employee", path: "/add-employee" },
                                { label: "View Employees", path: "/view-employees" },
                            ], "employee")}
                        {renderDropdown("Review Management", [
                            { label: "Manager Review", path: "/manager-review" },
                            { label: "View Review", path: "/view-review" },
                            { label: "Submit Self-Review", path: "/self-review" },
                        ], "review")}
                    </>
                );
            case "Executives/Associates":
                return renderDropdown("Review Management", [
                    { label: "View Review", path: "/view-review" },
                    { label: "Submit Self-Review", path: "/self-review" },
                ], "review");
            default:
                return null;
        }
    };

    return (
        user ? (
            <div className="custom-navbar">
                <div className="navbar-left">
                    <img src="/logo.png" alt="Logo" className="navbar-logo" />
                    <span className="navbar-welcome">Welcome, {user?.name}</span>
                </div>
                <div className="navbar-right">
                    {renderNavLinks()}
                    <a href="#" className="nav-link" onClick={logout}>
                        Logout
                    </a>
                </div>
            </div>
        ) : null
    );
};

export default NavigationBar;