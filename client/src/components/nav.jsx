import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Info, 
  HelpCircle, 
  Phone, 
  Shield, 
  ChevronDown,
  Home,
  Search,
  Calendar,
  Train,
  MapPin,
  Bookmark,
  Settings
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Branding from "./branding.jsx";
import { useRole } from "../hooks/useRole.js";
import { useProfile } from "../hooks/useProfile.js";

const NAV_ITEMS = {
  public: [
    { name: "Home", to: "/", icon: Home },
    { name: "Search Trains", to: "/trains", icon: Search },
    { name: "PNR Lookup", to: "/pnr-lookup", icon: Calendar },
    { name: "About Us", to: "/about", icon: Info },
    { name: "Help", to: "/help", icon: HelpCircle },
    { name: "Contact Us", to: "/contact", icon: Phone },
  ],
  user: [
    { name: "Home", to: "/", icon: Home },
    { name: "Search Trains", to: "/trains", icon: Search },
    { name: "My Bookings", to: "/bookings", icon: Bookmark },
    { name: "PNR Lookup", to: "/pnr-lookup", icon: Calendar },
  ],
  admin: [
    { name: "Dashboard", to: "/", icon: Home },
    { name: "Trains", to: "/admin/trains", icon: Train },
    { name: "Stations", to: "/admin/stations", icon: MapPin },
    { name: "Schedules", to: "/admin/schedules", icon: Calendar },
  ],
};

const STYLES = {
  nav: "px-6 py-4 flex justify-between items-center bg-base-100/95 backdrop-blur-lg border-b border-base-content/10 shadow-lg sticky top-0 z-30",
  desktopNav: "hidden lg:flex space-x-2 items-center",
  desktopAuth: "hidden lg:flex space-x-4 items-center",
  navLink: "btn btn-ghost btn-md hover:bg-primary/10 hover:text-primary hover:scale-105 transition-all duration-300 font-semibold text-base gap-2 px-6 py-3 rounded-xl",
  mobileToggle: "lg:hidden btn btn-ghost btn-md btn-circle hover:bg-primary/10 hover:scale-110 transition-all duration-200",
  overlay: "fixed inset-0 bg-black/70 backdrop-blur-sm z-40",
  mobileMenu: "fixed top-0 left-0 bottom-0 w-80 bg-base-100 shadow-2xl z-50 border-r border-base-content/10 transform transition-transform duration-300 ease-out",
  mobileHeader: "flex justify-between items-center p-6 border-b border-base-content/10 bg-gradient-to-r from-primary/5 to-secondary/5",
  mobileContent: "flex flex-col h-full overflow-y-auto",
  mobileNavList: "space-y-3 p-6",
  mobileAuth: "p-6 border-t border-base-content/10 bg-base-200/50",
  mobileAuthSignedIn: "space-y-3",
  mobileAuthButtons: "space-y-3",
};

const NavLink = ({ item, className, onClick }) => {
  const Icon = item.icon;
  return (
    <Link className={className} to={item.to} onClick={onClick}>
      {Icon && <Icon size={18} />}
      {item.name}
    </Link>
  );
};

const UserDropdown = ({ profile, onSignOut, role }) => {
  const isAdmin = role?.name === 'admin';
  
  return (
    <div className="dropdown dropdown-end dropdown-hover">
      <label 
        tabIndex={0} 
        className={`btn btn-md gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-fit ${
          isAdmin 
            ? 'btn-warning text-warning-content' 
            : 'btn-primary text-primary-content'
        }`}
      >
        <div className="avatar placeholder">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
            isAdmin 
              ? 'bg-warning-content text-warning' 
              : 'bg-primary-content text-primary'
          }`}>
            {isAdmin ? <Shield size={16} /> : <User size={16} />}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="font-bold text-sm truncate max-w-32">
            {isAdmin ? 'System Administrator' : profile.name}
          </span>
          <span className="text-xs opacity-80 flex items-center gap-1">
            {isAdmin ? 'Admin' : (role?.name || 'User')}
          </span>
        </div>
        <ChevronDown size={16} className="opacity-70" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-3 shadow-2xl bg-base-100 rounded-2xl w-64 border border-base-content/10 backdrop-blur-lg z-50"
      >
        <li>
          <Link to="/profile" className="gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-200 text-base font-medium group">
            <User size={18} className="group-hover:scale-110 transition-transform" />
            <span>Profile</span>
          </Link>
        </li>
        <div className="divider my-1"></div>
        <li>
          <Link to="/about" className="gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-200 text-base font-medium group">
            <Info size={18} className="group-hover:scale-110 transition-transform" />
            <span>About Us</span>
          </Link>
        </li>
        <li>
          <Link to="/help" className="gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-200 text-base font-medium group">
            <HelpCircle size={18} className="group-hover:scale-110 transition-transform" />
            <span>Help</span>
          </Link>
        </li>
        <li>
          <Link to="/contact" className="gap-3 p-3 rounded-xl hover:bg-primary/10 transition-all duration-200 text-base font-medium group">
            <Phone size={18} className="group-hover:scale-110 transition-transform" />
            <span>Contact Us</span>
          </Link>
        </li>
        <div className="divider my-1"></div>
        <li>
          <button 
            onClick={onSignOut} 
            className="gap-3 p-3 rounded-xl hover:bg-error/10 hover:text-error transition-all duration-200 text-base font-medium group w-full text-left"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

const AuthButtons = ({ mobile = false }) => {
  const baseClasses = mobile ? "btn btn-lg w-full" : "btn btn-md";

  return (
    <div className={`flex ${mobile ? 'flex-col' : 'flex-row'} gap-3`}>
      <Link
        to="/signin"
        className={`${baseClasses} btn-outline hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-300 font-semibold text-base border-2`}
      >
        Sign In
      </Link>
      <Link 
        to="/signup" 
        className={`${baseClasses} btn-primary shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold text-base`}
      >
        Sign Up
      </Link>
    </div>
  );
};

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  token,
  profile,
  onSignOut,
  role,
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
      className={`${STYLES.mobileMenu} ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className={STYLES.mobileHeader}>
        <Branding />
        <button
          className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error hover:rotate-90 transition-all duration-200"
          onClick={onClose}
          aria-label="Close mobile menu"
        >
          <X size={22} />
        </button>
      </div>

      <div className={STYLES.mobileContent}>
        {/* User Info (if logged in) */}
        {token && profile && (
          <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-content/10">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                  {role?.name === 'admin' ? <Shield size={24} /> : <User size={24} />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xl truncate">
                  {role?.name === 'admin' ? 'System Administrator' : profile.name}
                </div>
                <div className="text-base text-base-content/70 flex items-center gap-1.5 mt-1">
                  {role?.name === 'admin' && <Shield size={14} className="text-warning" />}
                  <span className="capitalize font-medium">
                    {role?.name === 'admin' ? 'Admin' : (role?.name || 'User')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className={STYLES.mobileNavList}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 hover:translate-x-2 transition-all duration-300 group text-lg font-semibold w-full"
                    onClick={onClose}
                  >
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                      {Icon && <Icon size={20} className="group-hover:text-primary transition-colors" />}
                    </div>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Auth Section */}
        <div className={STYLES.mobileAuth}>
          {token && profile ? (
            <div className={STYLES.mobileAuthSignedIn}>
              <div className="text-sm text-base-content/70 px-4 mb-4">
                Signed in as <strong className="text-primary">{profile.name}</strong>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/10 hover:translate-x-1 transition-all duration-300 w-full text-lg font-semibold group"
                onClick={onClose}
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                  <Settings size={20} />
                </div>
                <span>Profile Settings</span>
              </Link>
              <div className="divider my-3"></div>
              <Link
                to="/about"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/10 hover:translate-x-1 transition-all duration-300 w-full font-medium group"
                onClick={onClose}
              >
                <Info size={18} className="group-hover:scale-110 transition-transform" />
                <span>About Us</span>
              </Link>
              <Link
                to="/help"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/10 hover:translate-x-1 transition-all duration-300 w-full font-medium group"
                onClick={onClose}
              >
                <HelpCircle size={18} className="group-hover:scale-110 transition-transform" />
                <span>Help</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/10 hover:translate-x-1 transition-all duration-300 w-full font-medium group"
                onClick={onClose}
              >
                <Phone size={18} className="group-hover:scale-110 transition-transform" />
                <span>Contact Us</span>
              </Link>
              <div className="divider my-3"></div>
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-error/10 hover:text-error hover:translate-x-1 transition-all duration-300 w-full text-left text-lg font-semibold group"
              >
                <div className="p-2 bg-error/10 rounded-lg group-hover:bg-error/20 group-hover:scale-110 transition-all duration-200">
                  <LogOut size={20} />
                </div>
                <span>Sign Out</span>
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
  const { role } = useRole(roleId);
  const { profile } = useProfile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = useMemo(() => {
    if (!token) return NAV_ITEMS.public;
    if (role?.name === "admin") return NAV_ITEMS.admin;
    else if (role?.name === "customer") return NAV_ITEMS.user;
    return NAV_ITEMS.public;
  }, [token, role]);

  const handleSignOut = useCallback(() => {
    clearAuth();
    navigate({ to: "/" });
  }, [clearAuth, navigate]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Background gradient for nav */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <nav className={STYLES.nav}>
        <Branding />

        {/* Desktop Navigation */}
        <ul className={STYLES.desktopNav}>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink item={item} className={STYLES.navLink} />
            </li>
          ))}
        </ul>

        {/* Desktop Auth Section */}
        <div className={STYLES.desktopAuth}>
          {token && profile ? (
            <UserDropdown profile={profile} onSignOut={handleSignOut} role={role} />
          ) : (
            <AuthButtons />
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={STYLES.mobileToggle}
          onClick={toggleMobileMenu}
          aria-label={
            isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"
          }
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
        role={role}
      />
    </>
  );
}