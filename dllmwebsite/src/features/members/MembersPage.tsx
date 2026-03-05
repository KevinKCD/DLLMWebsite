import React, { useEffect, useState } from 'react';
import MemberCard from './components/MemberCard';
import './MembersPage.css';
import { db } from '../../lib/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { UserProfile } from '../../types';
import { SearchIcon, UsersIcon } from '../../components/icons';

const Members: React.FC = () => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    let mounted = true;

    async function loadMembers(): Promise<void> {
      try {
        const snap = await getDocs(collection(db, 'profiles'));
        const list: UserProfile[] = snap.docs.map((d) => ({
          uid: d.id,
          ...(d.data() as Omit<UserProfile, 'uid'>),
        }));
        if (mounted) setMembers(list);
      } catch (err) {
        console.error('Failed to load members', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMembers();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) || m.bio?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="members-page container pt-4">
      {/* Header */}
      <div className="members-header">
        <div>
          <h2 className="members-title">Members</h2>
          <p className="members-subtitle">Meet the people in our community</p>
        </div>

        {/* Member count card */}
        <div className="members-count-card">
          <div className="members-count-icon">
            <UsersIcon size={22} stroke="#93c5fd" />
          </div>
          <div>
            <p className="members-count-number">{members.length}</p>
            <p className="members-count-label">Active Members</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="members-search-wrap">
        <span className="members-search-icon">
          <SearchIcon size={18} stroke="#94a3b8" />
        </span>
        <input
          className="members-search-input"
          type="text"
          placeholder="Search by name or bio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="members-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="members-skeleton" />
          ))}
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="members-grid">
          {filteredMembers.map((m) => (
            <MemberCard key={m.uid} member={m} />
          ))}
        </div>
      ) : (
        <div className="members-empty">
          <UsersIcon size={40} stroke="#cbd5e1" />
          <h3 className="members-empty__title">No members found</h3>
          <p className="members-empty__sub">
            {searchQuery ? 'Try a different search term' : 'No members yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Members;
