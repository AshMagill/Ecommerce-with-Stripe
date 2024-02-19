//local footer css
import styles from "./Footer.module.css";

//props are functions to toggle model open and close
const Footer = ({ onContactButton, onLegalButton }) => {
  return (
    <div className={styles.footer}>
      <div className={styles.modalButtonContainer}>
        <button className={styles.button} onClick={onLegalButton}>
          Terms and Conditions
        </button>
        <button className={styles.button} onClick={onContactButton}>
          Contact AB Solar Dunedin
        </button>
      </div>
      <div className={styles.creditContainer}>
        <div>
          <button
            className={styles.button}
            onClick={() =>
              (window.location = "mailto: creakydoordev@gmail.com")
            }
          >
            This website was created by Creaky Door Development
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
