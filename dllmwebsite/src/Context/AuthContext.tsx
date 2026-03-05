import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { auth, db } from '../lib/Firebase';
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

/* =========================
   TYPES
========================= */

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  joined?: string;
  eventsAttended?: number;
  points?: number;
  joinedEvents?: string[];
  role?: 'admin' | 'member';
  admin?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  login: (email: string, password: string) => Promise<UserProfile>;
  signup: (
    name: string,
    email: string,
    password: string,
    isAdmin?: boolean
  ) => Promise<UserProfile>;
  logout: () => Promise<void>;
  joinEvent: (eventId: string, points?: number) => Promise<void>;
  leaveEvent: (eventId: string, points?: number) => Promise<void>;
  loading: boolean;
}

/* =========================
   CONTEXT
========================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =========================
   PROVIDER
========================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        setUser({
          uid: firebaseUser.uid,
          ...(profileSnap.data() as Omit<UserProfile, 'uid'>),
        });
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

  /* =========================
     AUTH FUNCTIONS
  ========================= */

  const signup = async (
    name: string,
    email: string,
    password: string,
    isAdmin: boolean = false
  ): Promise<UserProfile> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const profileData: Omit<UserProfile, 'uid'> = {
      name,
      email,
      avatar: `https://i.pravatar.cc/150?img=${
        Math.floor(Math.random() * 70) + 1
      }`,
      bio: '',
      joined: new Date().toISOString(),
      eventsAttended: 0,
      points: 0,
      joinedEvents: [],
      role: isAdmin ? 'admin' : 'member',
      admin: isAdmin,
    };

    await setDoc(doc(db, 'profiles', uid), profileData);

    const newUser: UserProfile = { uid, ...profileData };
    setUser(newUser);

    return newUser;
  };

  const login = async (
    email: string,
    password: string
  ): Promise<UserProfile> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;

    const profileSnap = await getDoc(doc(db, 'profiles', uid));

    if (profileSnap.exists()) {
      const profileData = {
        uid,
        ...(profileSnap.data() as Omit<UserProfile, 'uid'>),
      };

      setUser(profileData);
      return profileData;
    }

    const fallbackUser: UserProfile = {
      uid,
      name: cred.user.displayName || 'User',
      admin: false,
    };

    setUser(fallbackUser);
    return fallbackUser;
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  /* =========================
     EVENTS
  ========================= */

  const joinEvent = async (
    eventId: string,
    points: number = 10
  ): Promise<void> => {
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

    setUser((prev) =>
      prev
        ? {
            ...prev,
            eventsAttended: (prev.eventsAttended || 0) + 1,
            points: (prev.points || 0) + points,
            joinedEvents: [...(prev.joinedEvents || []), eventId],
          }
        : prev
    );
  };

  const leaveEvent = async (
    eventId: string,
    points: number = 10
  ): Promise<void> => {
    if (!user) return;

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

    setUser((prev) =>
      prev
        ? {
            ...prev,
            eventsAttended: Math.max((prev.eventsAttended || 1) - 1, 0),
            points: Math.max((prev.points || points) - points, 0),
            joinedEvents: (prev.joinedEvents || []).filter(
              (id) => id !== eventId
            ),
          }
        : prev
    );
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

/* =========================
   HOOK
========================= */

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
