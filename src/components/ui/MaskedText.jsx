import React from 'react';
import { motion } from 'framer-motion';

const MaskedText = ({ children, style, className, delay = 0 }) => {
  return (
    <span style={{ overflow: 'hidden', display: 'inline-flex', alignItems: 'center', verticalAlign: 'bottom', paddingBottom: '0.2em', marginBottom: '-0.2em' }}>
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.65, delay, ease: [0.33, 1, 0.68, 1] }}
        style={{ ...style, display: 'inline-block', transformOrigin: 'bottom' }}
        className={className}
      >
        {children}
      </motion.div>
    </span>
  );
};

export default MaskedText;
