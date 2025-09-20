import React, { useState, useEffect } from "react";
import { useGetProfile, useUpdateProfile } from "../services/profileServices";
import Badge from "../../../badge/component/Badge";

export default function ProfilePage() {
  const { data: profile, isLoading, isFallback } = useGetProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClasses =
    "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition";

  // Sync form with loaded profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        password: "",
        confirmPassword: "",
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

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const updated = await updateProfile({
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined,
      });
      setFormData({
        name: updated.name,
        email: updated.email,
        password: "",
        confirmPassword: "",
      });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="text-gray-500 text-lg ml-2">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg font-semibold">Profile not found!</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold text-center mb-8 flex-1">👤 My Profile</h1>
        {isFallback && (
          <span className="badge bg-yellow-200 text-black self-start">Demo Data</span>
        )}
      </div>

      {!isEditing ? (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-3">
          <p>
            <span className="font-semibold">Name:</span> {profile.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {profile.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {isFallback ? "DEMO DATA" : profile.role}
          </p>
          <p>
            <span className="font-semibold">Password:</span> ********
          </p>

          <button
            onClick={() => {
              setIsEditing(true);
              setError("");
              setSuccess("");
            }}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-blue-50 shadow-md rounded-xl p-6 space-y-4">
          {error && <p className="text-red-500 font-medium">{error}</p>}
          {success && <p className="text-green-600 font-medium">{success}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className={inputClasses}
            />
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError("");
                setSuccess("");
                setFormData({
                  name: profile.name,
                  email: profile.email,
                  password: "",
                  confirmPassword: "",
                });
              }}
              className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
