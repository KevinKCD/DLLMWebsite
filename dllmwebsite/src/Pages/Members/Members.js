import React, { useEffect, useState } from 'react';
import MemberCard from '../../Components/Members/MemberCard';
import './Members.css';
import { db } from '../../Firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadMembers() {
      try {
        const snap = await getDocs(collection(db, 'profiles'));
        const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
        if (mounted) setMembers(list);
      } catch (err) {
        console.error('Failed to load members', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMembers();
    return () => (mounted = false);
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
}

export default Members;
