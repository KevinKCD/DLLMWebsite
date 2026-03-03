import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../Firebase/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import ProfileEventCard from './ProfileEventCard'; // separate card for profile events
import './Profile.css';

function Profile() {
  const { user, loading, setUser } = useAuth();
  const { id } = useParams();

  const profileId = id || user?.uid;
  const isOwnProfile = user?.uid === profileId;

  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile data from Firestore
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      setError(null);
      try {
        const profileRef = doc(db, 'profiles', profileId);
        const profileSnap = await getDoc(profileRef);
        if (!mounted) return;
        if (profileSnap.exists()) {
          const data = { uid: profileId, ...profileSnap.data() };
          setProfileData(data);
          setBio(data.bio || '');
        } else {
          setProfileData(null);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError(
          err?.code === 'permission-denied'
            ? "You don't have permission to view this profile."
            : 'Failed to load profile. Please try again later.'
        );
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [profileId]);

  if (loading) return <div className="container py-5">Loading profile...</div>;
  if (error) return <div className="container py-5">{error}</div>;
  if (!profileData)
    return <div className="container py-5">Profile not found.</div>;

  // Handle avatar selection
  const handleAvatarChange = (e) => {
    if (e.target.files[0]) setAvatarFile(e.target.files[0]);
  };

  // Save profile changes
  const handleSave = async () => {
    if (!isOwnProfile) return;
    setUpdating(true);

    try {
      let avatarUrl = profileData.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('upload_preset', 'profile_preset');

        const res = await fetch(
          'https://api.cloudinary.com/v1_1/df602ad8b/image/upload',
          { method: 'POST', body: formData }
        );
        const data = await res.json();
        avatarUrl = data.secure_url;
      }

      const profileRef = doc(db, 'profiles', profileId);
      await profileRef.update({ avatar: avatarUrl, bio });

      setUser((prev) => ({ ...prev, avatar: avatarUrl, bio }));
      setProfileData((prev) => ({ ...prev, avatar: avatarUrl, bio }));
      setEditing(false);
      setAvatarFile(null);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={
              avatarFile ? URL.createObjectURL(avatarFile) : profileData.avatar
            }
            alt={profileData.name}
            className="profile-avatar-large"
          />

          {isOwnProfile && (
            <label className="avatar-upload-label">
              <input type="file" hidden onChange={handleAvatarChange} />✎
            </label>
          )}
        </div>

        <div className="profile-header-info">
          <h2>{profileData.name}</h2>

          {isOwnProfile && editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              style={{ inlineSize: '100%', padding: '8px', resize: 'none' }}
            />
          ) : (
            <p className="profile-bio">{profileData.bio || 'No bio yet.'}</p>
          )}

          {isOwnProfile && (
            <div style={{ insetBlockStart: '10px' }}>
              {editing ? (
                <button
                  className="btn btn-dark me-2"
                  onClick={handleSave}
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
              ) : (
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats-row">
        <div className="profile-stat">
          <span className="stat-number">{profileData.eventsAttended}</span>
          <span className="stat-label">Events Attended</span>
        </div>
        <div className="profile-stat">
          <span className="stat-number">{profileData.points}</span>
          <span className="stat-label">Points</span>
        </div>
        <div className="profile-stat">
          <span className="stat-number">
            {new Date(profileData.joined).toLocaleDateString()}
          </span>
          <span className="stat-label">Joined</span>
        </div>
      </div>

      {/* Joined Events */}
      <h4 className="mt-4">Joined Events</h4>

      {profileData.joinedEvents?.length > 0 ? (
        <div
          className="joined-events-grid mt-3"
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          {profileData.joinedEvents.map((eventId) => (
            <ProfileEventCard
              key={eventId}
              eventId={eventId}
              canLeave={isOwnProfile && !!user}
            />
          ))}
        </div>
      ) : (
        <p className="mt-3">No events joined yet.</p>
      )}
    </div>
  );
}

export default Profile;
