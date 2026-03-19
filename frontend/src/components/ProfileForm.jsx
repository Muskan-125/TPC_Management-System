import React, { useState } from 'react';
import { uploadResume } from '../services/userService';

const ProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    branch: user?.branch || '',
    batch: user?.batch || '',
    skills: user?.skills || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await onUpdate(formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formDataFile = new FormData();
      formDataFile.append('resume', file);
      await uploadResume(formDataFile);
      setSuccess('Resume uploaded successfully!');
      if (user?.role === 'STUDENT') {
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Profile Information</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                disabled
              />
              <small className="text-muted">Email cannot be changed</small>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
            {user?.role === 'STUDENT' && (
              <>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    className="form-control"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </>
            )}
          </div>

          {user?.role === 'STUDENT' && (
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Batch Year</label>
                  <input
                    type="number"
                    name="batch"
                    className="form-control"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="e.g., 2024"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    className="form-control"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., JavaScript, Python, React"
                  />
                </div>
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">
              {user?.role === 'STUDENT' ? 'About Me / Bio' : 'Company Description'}
            </label>
            <textarea
              name="bio"
              className="form-control"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder={user?.role === 'STUDENT' ? 'Tell us about yourself...' : 'Describe your company...'}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {user?.role === 'STUDENT' && (
          <hr className="my-4" />
        )}
      </div>
    </div>
  );
};

export default ProfileForm;

