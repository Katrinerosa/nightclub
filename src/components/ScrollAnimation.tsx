"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type ScrollAnimationProps = {
  children: ReactNode;
};

export default function ScrollAnimation({
  children,
}: ScrollAnimationProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: reduceMotion ? 0 : -150 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: reduceMotion ? 0 : 0.8 }}
    >
      {children}
    </motion.div>
  );
}