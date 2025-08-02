import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Globe } from "lucide-react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-indigo-100 to-indigo-200 text-gray-800 py-4 mt-10 shadow-inner">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2 text-sm sm:text-base"
      >
        <p>
          &copy; {year} <span className="font-semibold">Self Expense Tracker</span>. All rights reserved.
        </p>

        <p>
          Crafted with <span className="text-red-500">❤️</span> & <span className="text-yellow-600">☕</span> by{" "}
          <span className="font-bold text-indigo-600">Aditya Pachouri</span>
        </p>

        <div className="flex justify-center items-center gap-4 pt-1 text-gray-700">
          <a
            href="https://github.com/adityapachouri"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-600 transition"
          >
            <Github className="w-5 h-5" />
            <span className="underline text-sm">GitHub</span>
          </a>

          <a
            href="https://linkedin.com/in/adityapachouri"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-600 transition"
          >
            <Linkedin className="w-5 h-5" />
            <span className="underline text-sm">LinkedIn</span>
          </a>

          <a
            href="https://adityapachouri.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-indigo-600 transition"
          >
            <Globe className="w-5 h-5" />
            <span className="underline text-sm">Portfolio</span>
          </a>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
