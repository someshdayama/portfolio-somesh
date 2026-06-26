import React from 'react';
import { motion } from 'framer-motion';

const MaskedText = ({ children, style, className, delay = 0 }) => {
  return (
    <span style={{ overflow: 'hidden', display: 'inline-flex', alignItems: 'center', verticalAlign: 'bottom', paddingBottom: '0.2em', marginBottom: '-0.2em' }}>
      <motion.div
        initial={{ y: '100%', skewY: 6 }}
        whileInView={{ y: 0, skewY: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ ...style, display: 'inline-block', transformOrigin: 'left bottom' }}
        className={className}
      >
        {children}
      </motion.div>
    </span>
  );
};

export default MaskedText;
