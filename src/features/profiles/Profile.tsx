import React, { useEffect, useState, ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { UserProfile } from '../../types';
import ProfileEventCard from './ProfileEventCard';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, loading, setUser } = useAuth();
  const { id } = useParams<{ id: string }>();

  const profileId = id || user?.uid;
  const isOwnProfile = user?.uid === profileId;

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [bio, setBio] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data from Firestore
  useEffect(() => {
    if (!profileId) return;
    let mounted = true;

    const fetchProfile = async (): Promise<void> => {
      setError(null);
      try {
        const profileSnap = await getDoc(doc(db, 'profiles', profileId));
        if (!mounted) return;

        if (profileSnap.exists()) {
          const data: UserProfile = {
            uid: profileId,
            ...(profileSnap.data() as Omit<UserProfile, 'uid'>),
          };
          setProfileData(data);
          setBio(data.bio ?? '');
        } else {
          setProfileData(null);
        }
      } catch (err: any) {
        if (!mounted) return;
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
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
  };

  // Save profile changes
  const handleSave = async (): Promise<void> => {
    if (!isOwnProfile || !profileId) return;
    setUpdating(true);

    try {
      let avatarUrl = profileData.avatar ?? '';

      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        formData.append('upload_preset', 'profile_preset');

        const res = await fetch(
          'https://api.cloudinary.com/v1_1/df602ad8b/image/upload',
          { method: 'POST', body: formData }
        );
        const data = await res.json();
        avatarUrl = data.secure_url as string;
      }

      await updateDoc(doc(db, 'profiles', profileId), {
        avatar: avatarUrl,
        bio,
      });

      setUser((prev) => (prev ? { ...prev, avatar: avatarUrl, bio } : prev));
      setProfileData((prev) =>
        prev ? { ...prev, avatar: avatarUrl, bio } : prev
      );
      setEditing(false);
      setAvatarFile(null);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const avatarSrc = avatarFile
    ? URL.createObjectURL(avatarFile)
    : (profileData.avatar ?? `https://i.pravatar.cc/150?u=${profileData.uid}`);

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={avatarSrc}
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
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setBio(e.target.value)
              }
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
          <span className="stat-number">{profileData.eventsAttended ?? 0}</span>
          <span className="stat-label">Events Attended</span>
        </div>
        <div className="profile-stat">
          <span className="stat-number">{profileData.points ?? 0}</span>
          <span className="stat-label">Points</span>
        </div>
        <div className="profile-stat">
          <span className="stat-number">
            {profileData.joined
              ? new Date(profileData.joined).toLocaleDateString()
              : 'N/A'}
          </span>
          <span className="stat-label">Joined</span>
        </div>
      </div>

      {/* Joined Events */}
      <h4 className="mt-4">Joined Events</h4>

      {profileData.joinedEvents && profileData.joinedEvents.length > 0 ? (
        <div
          className="joined-events-grid mt-3"
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          {profileData.joinedEvents.map((eventId: string) => (
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
};

export default Profile;
