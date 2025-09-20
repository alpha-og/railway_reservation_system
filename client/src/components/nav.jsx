import React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/useAuthStore";
import Branding from "./branding.jsx";

const publicNavItems = [
  { name: "Home", to: "/" },
  { name: "Search Trains", to: "/trains" },
  { name: "Contact Us", to: "/contact" },
];

const userNavItems = [
  { name: "Home", to: "/" },
  { name: "Search Trains", to: "/trains" },
  { name: "My Bookings", to: "/bookings" },
  { name: "Contact Us", to: "/contact" },
];

const adminNavItems = [
  { name: "Trains", to: "/admin/trains" },
  { name: "Stations", to: "/admin/stations" },
  { name: "Revenue", to: "/admin/revenue" },
  { name: "Logs", to: "/admin/logs" },
];

export default function Navigation() {
  const { token, user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  let navItems;
  if (!token) navItems = publicNavItems;
  else if (user?.roleId === 1) navItems = adminNavItems;
  else navItems = userNavItems;

  const handleSignOut = () => {
    clearAuth();
    navigate({ to: "/" });
  };

  return (
    <nav className="px-4 py-2 flex justify-between items-center bg-base-300 shadow-md">
      <Branding />
      <ul className="flex space-x-4 items-center">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link className="btn btn-ghost hover:border hover:border-primary" to={item.to}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="flex space-x-4 items-center">
        <li className="ml-auto">
          {token && user ? (
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-sm btn-primary m-1">
                {user.name}
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={handleSignOut}>Sign Out</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/signin" className="btn btn-sm btn-outline mr-2">Sign In</Link>
              <Link to="/signup" className="btn btn-sm btn-primary">Sign Up</Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
