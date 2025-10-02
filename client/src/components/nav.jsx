import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Branding from "./branding.jsx";
import { useRole } from "../hooks/useRole.js";
import { useProfile } from "../hooks/useProfile.js";

const NAV_ITEMS = {
  public: [
    { name: "Home", to: "/" },
    { name: "Search Trains", to: "/trains" },
    { name: "Contact Us", to: "/contact" },
  ],
  user: [
    { name: "Home", to: "/" },
    { name: "Search Trains", to: "/trains" },
    { name: "My Bookings", to: "/bookings" },
    { name: "Contact Us", to: "/contact" },
  ],
  admin: [
    { name: "Trains", to: "/admin/trains" },
    { name: "Stations", to: "/admin/stations" },
    { name: "Revenue", to: "/admin/revenue" },
    { name: "Logs", to: "/admin/logs" },
  ]
};

const STYLES = {
  nav: "px-4 py-2 flex justify-between items-center bg-base-300 shadow-md relative",
  desktopNav: "hidden md:flex space-x-4 items-center",
  desktopAuth: "hidden md:flex space-x-4 items-center",
  navLink: "btn btn-ghost hover:border hover:border-primary transition-all duration-200",
  mobileToggle: "md:hidden btn btn-ghost btn-sm",
  overlay: "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden",
  mobileMenu: "fixed top-0 left-0 right-0 bg-base-300 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden",
  mobileHeader: "px-4 py-2 flex justify-between items-center border-b border-base-200",
  mobileContent: "px-4 py-4",
  mobileNavList: "space-y-2 mb-6",
  mobileAuth: "border-t border-base-200 pt-4",
  mobileAuthSignedIn: "space-y-2",
  mobileAuthButtons: "space-y-2"
};

const NavLink = ({ item, className, onClick }) => (
  <Link
    className={className}
    to={item.to}
    onClick={onClick}
  >
    {item.name}
  </Link>
);

const UserDropdown = ({ profile, onSignOut }) => (
  <div className="dropdown dropdown-end dropdown-hover">
    <label tabIndex={0} className="btn btn-sm btn-primary gap-2 m-1">
      <User size={16} />
      {profile.name}
    </label>
    <ul
      tabIndex={0}
      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li>
        <Link to="/profile" className="gap-2">
          <User size={16} />
          Profile
        </Link>
      </li>
      <li>
        <button onClick={onSignOut} className="gap-2">
          <LogOut size={16} />
          Sign Out
        </button>
      </li>
    </ul>
  </div>
);

const AuthButtons = ({ mobile = false }) => {
  const baseClasses = mobile
    ? "btn w-full"
    : "btn btn-sm";

  return (
    <>
      <Link
        to="/signin"
        className={`${baseClasses} btn-outline ${mobile ? '' : 'mr-2'}`}
      >
        Sign In
      </Link>
      <Link
        to="/signup"
        className={`${baseClasses} btn-primary`}
      >
        Sign Up
      </Link>
    </>
  );
};

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  token,
  profile,
  onSignOut
}) => (
  <>
    {isOpen && (
      <div
        className={STYLES.overlay}
        onClick={onClose}
        aria-label="Close menu overlay"
      />
    )}

    <div
      className={`${STYLES.mobileMenu} ${isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className={STYLES.mobileHeader}>
        <Branding />
        <button
          className="btn btn-ghost btn-sm"
          onClick={onClose}
          aria-label="Close mobile menu"
        >
          <X size={24} />
        </button>
      </div>

      <div className={STYLES.mobileContent}>
        <nav>
          <ul className={STYLES.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  item={item}
                  className="btn btn-ghost w-full justify-start hover:border hover:border-primary"
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className={STYLES.mobileAuth}>
          {token && profile ? (
            <div className={STYLES.mobileAuthSignedIn}>
              <div className="text-sm text-base-content/70 px-4">
                Signed in as <strong>{profile.name}</strong>
              </div>
              <Link
                to="/profile"
                className="btn btn-ghost w-full justify-start gap-2"
                onClick={onClose}
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="btn btn-ghost w-full justify-start gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className={STYLES.mobileAuthButtons}>
              <AuthButtons mobile />
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);
export default function Navigation() {
  const { token, roleId, clearAuth } = useAuthStore();
  const role = useRole(roleId);
  const { profile } = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = useMemo(() => {
    if (!token) return NAV_ITEMS.public;
    if (role === "admin") return NAV_ITEMS.admin;
    return NAV_ITEMS.user;
  }, [token, role]);

  const handleSignOut = useCallback(() => {
    clearAuth();
    navigate({ to: "/" });
  }, [clearAuth, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={STYLES.nav}>
        <Branding />

        {/* Desktop Navigation */}
        <ul className={STYLES.desktopNav}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                item={item}
                className={STYLES.navLink}
              />
            </li>
          ))}
        </ul>

        {/* Desktop Auth Section */}
        <div className={STYLES.desktopAuth}>
          {token && profile ? (
            <UserDropdown profile={profile} onSignOut={handleSignOut} />
          ) : (
            <AuthButtons />
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={STYLES.mobileToggle}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        navItems={navItems}
        token={token}
        profile={profile}
        onSignOut={handleSignOut}
      />
    </>
  );
}
