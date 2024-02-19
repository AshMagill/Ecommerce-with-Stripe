import React from "react";
import styles from "./TermsModal.module.css";
import Disclaimer from "./Disclaimer";
// Plugins

const TermsModal = ({ closeButton }) => {
  return (
    <div
      className={styles.termsContainer}
      // stops the container onclick from being inherited
      onClick={(e) => e.stopPropagation()}
    >
      <button className={styles.exit} onClick={closeButton}>
        <p>Close</p>
      </button>
      <div className={styles.disclaimerContainer}>
        <Disclaimer />
      </div>
    </div>
  );
};
export default TermsModal;
