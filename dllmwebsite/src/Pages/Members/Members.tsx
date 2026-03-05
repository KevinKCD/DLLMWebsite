import React, { useEffect, useState } from 'react';
import MemberCard from '../../Components/Members/MemberCard';
import './Members.css';
import { db } from '../../Firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { UserProfile } from '../../types';

const Members: React.FC = () => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="members-page container py-4">
      <h2 className="mb-3">Members</h2>

      {loading ? (
        <div>Loading members...</div>
      ) : members.length === 0 ? (
        <div>No members found.</div>
      ) : (
        <div className="members-grid">
          {members.map((m) => (
            <MemberCard key={m.uid} member={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;
