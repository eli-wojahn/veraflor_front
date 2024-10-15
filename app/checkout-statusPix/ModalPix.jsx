import React from 'react';
import styles from './ModalPix.module.css';

const ModalPix = ({ children }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        {children}
      </div>
    </div>
  );
};

export default ModalPix;
