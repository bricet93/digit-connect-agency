import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Orbite 1 : Bleue DIGIT-CONNECT */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-12 -left-12 w-96 h-96 bg-digitBlue/15 rounded-full blur-3xl"
      />

      {/* Orbite 2 : Rose DIGIT-CONNECT */}
      <motion.div
        animate={{
          x: [0, -70, 50, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.85, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -right-16 w-md h-112 bg-digitPink/15 rounded-full blur-3xl"
      />

      {/* Orbite 3 : Cyan / Sky Accent */}
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, 40, -40, 0],
          scale: [0.9, 1.15, 1, 0.9],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-20 left-1/3 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl"
      />
    </div>
  );
}