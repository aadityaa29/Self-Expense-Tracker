"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          joinedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  useEffect(() => {
    const blobCount = 5;
    const container = document.getElementById("blobs");
    if (!container) return;

    for (let i = 0; i < blobCount; i++) {
      const blob = document.createElement("div");
      blob.className = "absolute w-80 h-80 bg-white/10 rounded-full filter blur-3xl animate-blob";
      blob.style.left = `${Math.random() * 100}%`;
      blob.style.top = `${Math.random() * 100}%`;
      blob.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(blob);
    }
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4c2884] via-[#b7259f] to-[#38b6ff] text-black px-4">
      <div id="blobs" className="absolute inset-0 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-xl border border-white/30 p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight"
        >
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">ExpenseMate</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 text-gray-700 text-sm sm:text-base"
        >
          To begin your personal finance journey, please sign in with your Google account.
        </motion.p>

        <motion.button
          onClick={loginWithGoogle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 px-6 py-3 rounded-full font-semibold shadow-md transition duration-300"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-xs text-gray-500"
        >
          We use Google Authentication to protect your data. You can revoke access anytime.
        </motion.p>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(50px, -50px) scale(1.2);
          }
        }
        .animate-blob {
          animation: blob 20s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
