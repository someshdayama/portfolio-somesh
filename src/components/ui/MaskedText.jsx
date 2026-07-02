import React from 'react';
import { motion } from 'framer-motion';

/**
 * MaskedText — slides text up from behind a clipping mask.
 *
 * The KEY fix for above-the-fold (Hero) content:
 * - The inner span gets its STARTING transform set as a CSS `style` prop,
 *   not just as a Framer Motion `initial` state.
 * - This means the element is hidden from the very first browser paint,
 *   before React/Framer hydrates — eliminating the flash.
 *
 * Props:
 *  - delay     : animation delay in seconds (default 0)
 *  - useAnimate: use initial/animate instead of whileInView (for above-fold)
 *  - className, style: forwarded to the inner motion element
 */
const MaskedText = ({ children, style, className, delay = 0, useAnimate = false }) => {
  if (useAnimate) {
    return (
      <span
        style={{
          overflow: 'hidden',
          display: 'inline-block',
          verticalAlign: 'bottom',
          paddingBottom: '0.18em',
          marginBottom: '-0.18em',
        }}
      >
        <motion.span
          // Setting transform in `style` ensures it's hidden on the very first
          // paint, before Framer Motion applies the `initial` state via JS.
          style={{
            ...style,
            display: 'inline-block',
            transformOrigin: 'left bottom',
            transform: 'translateY(108%) skewY(5deg)',
          }}
          animate={{ y: 0, skewY: 0 }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
          className={className}
        >
          {children}
        </motion.span>
      </span>
    );
  }

  // whileInView version — for below-fold content (About, Projects headings etc.)
  return (
    <span
      style={{
        overflow: 'hidden',
        display: 'inline-block',
        verticalAlign: 'bottom',
        paddingBottom: '0.18em',
        marginBottom: '-0.18em',
      }}
    >
      <motion.span
        initial={{ y: '108%', skewY: 5 }}
        whileInView={{ y: 0, skewY: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ ...style, display: 'inline-block', transformOrigin: 'left bottom' }}
        className={className}
      >
        {children}
      </motion.span>
    </span>
  );
};

export default MaskedText;
