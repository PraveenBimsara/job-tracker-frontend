import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react';
import { getInitials } from '../utils/helpers';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/update-profile', {
        name: formData.name,
        email: formData.email,
      });

      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...storedUser, name: data.name, email: data.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh page to update navbar
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          {!isEditing && (
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 size={16} />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Avatar & Name Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {getInitials(formData.name)}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600 mt-1">{user?.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User className="text-gray-600" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Full Name</p>
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{user?.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-gray-600" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Email Address</p>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{user?.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-gray-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-8 pt-8 border-t">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="flex-1 gap-2"
              >
                <X size={16} />
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                loading={loading}
                className="flex-1 gap-2"
              >
                <Save size={16} />
                Save Changes
              </Button>
            </div>
          )}

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Logout from your account</p>
                  <p className="text-sm text-gray-600 mt-1">
                    You will need to login again to access your data
                  </p>
                </div>
                <Button variant="danger" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;