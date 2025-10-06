import React, { useState, useEffect } from "react";
import { useProfile } from "../../../../hooks/useProfile";
import { useRole } from "../../../../hooks/useRole";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useUpdateProfile } from "../services/profileServices";
import { User, Edit3, Save, X, Mail, Shield, Sparkles, Crown } from "lucide-react";

export default function ProfilePage() {
  const { profile, isLoading, refetch } = useProfile();
  const { roleId } = useAuthStore();
  const { role } = useRole(roleId);
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  // Sync form with loaded profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSuccessVisible(false);

    try {
      const updated = await updateProfile({
        name: formData.name,
        email: formData.email,
      });
      
      // Refetch the profile data to get the latest information
      await refetch();
      
      setSuccess("Profile updated successfully!");
      setIsSuccessVisible(true);
      setIsEditing(false);
      
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setIsSuccessVisible(false);
        setTimeout(() => {
          setSuccess("");
        }, 300); // Wait for fade animation to complete
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  };

  const getRoleDisplay = () => {
    if (role?.role) return role.role;
    if (profile?.role) return profile.role;
    return "User";
  };

  const getRoleIcon = () => {
    const roleDisplay = getRoleDisplay().toLowerCase();
    if (roleDisplay === "admin") return <Crown className="w-4 h-4" />;
    if (roleDisplay === "customer") return <User className="w-4 h-4" />;
    return <Shield className="w-4 h-4" />;
  };

  const getRoleBadgeStyle = () => {
    const roleDisplay = getRoleDisplay().toLowerCase();
    if (roleDisplay === "admin") return "badge-error";
    if (roleDisplay === "customer") return "badge-primary";
    return "badge-secondary";
  };

  if (isLoading && !profile) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex justify-center items-center min-h-[50vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="ml-4 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="alert alert-error">
            <span>Profile not found!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-8">
      {/* Premium Gradient Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 p-8 shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Sparkle Effects */}
        <div className="absolute inset-0">
          <Sparkles className="absolute top-6 right-8 w-6 h-6 text-white/60 animate-pulse" />
          <Sparkles className="absolute top-16 left-12 w-4 h-4 text-white/40 animate-pulse animation-delay-1000" />
          <Sparkles className="absolute bottom-8 right-16 w-5 h-5 text-white/50 animate-pulse animation-delay-3000" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Welcome back, {profile.name}
              </h1>
              <p className="text-lg text-white/80 mt-2">Manage your railway journey profile</p>
              <div className="flex items-center gap-2 mt-3">
                <div className={`badge ${getRoleBadgeStyle()} badge-lg gap-2 text-white border-white/30`}>
                  {getRoleIcon()}
                  {getRoleDisplay()}
                </div>
              </div>
            </div>
          </div>
          
          {!isEditing && (
            <button
            onClick={() => {
              setIsEditing(true);
              setError("");
              setSuccess("");
              setIsSuccessVisible(false);
            }}
              className="btn btn-ghost bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-300 gap-2"
            >
              <Edit3 size={18} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={`alert alert-success shadow-lg transition-all duration-300 ease-in-out ${
          isSuccessVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
        }`}>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-error shadow-lg transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Profile Content */}
      {!isEditing ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-xl flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h2>
              
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm uppercase tracking-wide">Full Name</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={profile.name} 
                      className="input input-bordered w-full bg-base-200 cursor-not-allowed pl-10" 
                      readOnly 
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm uppercase tracking-wide">Email Address</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={profile.email} 
                      className="input input-bordered w-full bg-base-200 cursor-not-allowed pl-10" 
                      readOnly 
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-xl flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                Account Details
              </h2>
              
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm uppercase tracking-wide">Account Role</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className={`badge ${getRoleBadgeStyle()} badge-lg gap-2`}>
                      {getRoleIcon()}
                      {getRoleDisplay()}
                    </div>
                    <span className="text-sm text-base-content/60">
                      {getRoleDisplay().toLowerCase() === "admin" ? "Full system access" : "Passenger booking access"}
                    </span>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-sm uppercase tracking-wide">Account Status</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-success badge-lg gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Active
                    </div>
                    <span className="text-sm text-base-content/60">Your account is active and verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl border border-base-200 max-w-2xl mx-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl flex items-center gap-2 mb-6">
              <Edit3 className="w-6 h-6 text-primary" />
              Edit Profile Information
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 focus:input-primary"
                    placeholder="Enter your full name"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 focus:input-primary"
                    placeholder="Enter your email address"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                </div>
              </div>

              <div className="card-actions justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                    setSuccess("");
                    setIsSuccessVisible(false);
                    setFormData({
                      name: profile.name,
                      email: profile.email,
                    });
                  }}
                  className="btn btn-ghost gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary gap-2 min-w-32"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
