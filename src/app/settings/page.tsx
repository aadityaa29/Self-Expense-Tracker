'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Header from '@/component/Header';
import Footer from '@/component/Footer';
import { LogOut, Trash2, Save, User } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [updating, setUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    try {
      setUpdating(true);
      await updateProfile(auth.currentUser, { displayName });
      toast.success('Display name updated!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteData = async () => {
    if (!user) return;
    try {
      const expensesQ = query(collection(db, 'expenses'), where('uid', '==', user.uid));
      const expensesSnap = await getDocs(expensesQ);

      const budgetQ = query(collection(db, 'budgets'));
      const budgetSnap = await getDocs(budgetQ);

      for (const docSnap of expensesSnap.docs) {
        await deleteDoc(doc(db, 'expenses', docSnap.id));
      }

      for (const docSnap of budgetSnap.docs) {
        const data = docSnap.data();
        if (data?.uid === user.uid) {
          await deleteDoc(doc(db, 'budgets', docSnap.id));
        }
      }

      toast.success('All your data was deleted!');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Error deleting data.');
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-black">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-6">Settings</h1>

        <section className="bg-white shadow-md p-6 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-lg font-medium">
            <User className="w-5 h-5 text-blue-600" />
            Profile
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={updating}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Save size={16} />
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </section>

        <section className="bg-white shadow-md p-6 rounded-lg space-y-4 border border-red-400">
          <div className="flex items-center gap-2 text-lg font-bold text-red-600">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </div>
          <p className="text-sm text-gray-600">
            This will permanently delete all your expenses and budget data.
          </p>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            <Trash2 size={16} />
            Delete All My Data
          </button>
        </section>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 justify-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Are you absolutely sure?</h2>
            <p className="text-sm text-gray-600 mb-6">
              This action will permanently remove all your data and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteData}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
