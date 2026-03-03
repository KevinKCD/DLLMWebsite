import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../Firebase/Firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profileRef = doc(db, 'profiles', firebaseUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        setUser({ uid: firebaseUser.uid, ...profileSnap.data() });
      } else {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          admin: false,
        });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 📝 Signup
  const signup = async (name, email, password, isAdmin = false) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const profileData = {
      name,
      email,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      bio: '',
      joined: new Date().toISOString(),
      eventsAttended: 0,
      points: 0,
      joinedEvents: [],
      role: isAdmin ? 'admin' : 'member',
      admin: isAdmin,
    };

    await setDoc(doc(db, 'profiles', uid), profileData);

    const newUser = { uid, ...profileData };
    setUser(newUser);

    return newUser;
  };

  // 🔑 Login
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const profileSnap = await getDoc(doc(db, 'profiles', uid));

    if (profileSnap.exists()) {
      const profileData = { uid, ...profileSnap.data() };
      setUser(profileData);
      return profileData;
    }

    const fallbackUser = {
      uid,
      name: cred.user.displayName || 'User',
      admin: false,
    };

    setUser(fallbackUser);
    return fallbackUser;
  };

  // 🚪 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ➕ Join Event
  const joinEvent = async (eventId, points = 10) => {
    if (!user) return;

    const profileRef = doc(db, 'profiles', user.uid);
    const eventRef = doc(db, 'events', eventId);

    const person = {
      uid: user.uid,
      name: user.name || 'User',
      avatar: user.avatar || '',
    };

    await Promise.all([
      updateDoc(eventRef, { people: arrayUnion(person) }),
      updateDoc(profileRef, {
        eventsAttended: (user.eventsAttended || 0) + 1,
        points: (user.points || 0) + points,
        joinedEvents: arrayUnion(eventId),
      }),
    ]);

    setUser((prev) => ({
      ...prev,
      eventsAttended: (prev.eventsAttended || 0) + 1,
      points: (prev.points || 0) + points,
      joinedEvents: [...(prev.joinedEvents || []), eventId],
    }));
  };

  // ➖ Leave Event
  const leaveEvent = async (eventId, points = 10) => {
    if (!user || !eventId) return;

    const profileRef = doc(db, 'profiles', user.uid);
    const eventRef = doc(db, 'events', eventId);

    const person = {
      uid: user.uid,
      name: user.name || 'User',
      avatar: user.avatar || '',
    };

    await Promise.all([
      updateDoc(eventRef, { people: arrayRemove(person) }),
      updateDoc(profileRef, {
        eventsAttended: Math.max((user.eventsAttended || 1) - 1, 0),
        points: Math.max((user.points || points) - points, 0),
        joinedEvents: arrayRemove(eventId),
      }),
    ]);

    setUser((prev) => ({
      ...prev,
      eventsAttended: Math.max((prev.eventsAttended || 1) - 1, 0),
      points: Math.max((prev.points || points) - points, 0),
      joinedEvents: (prev.joinedEvents || []).filter((id) => id !== eventId),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        logout,
        joinEvent,
        leaveEvent,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
