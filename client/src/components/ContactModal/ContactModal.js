import React, { useState } from "react";
import styles from "./ContactModal.module.css";

import { send } from "emailjs-com";

const ContactModal = ({ closeButton }) => {
  // these creds are obtained from emailjs account and are recruitment
  const SERVICE_ID = process.env.REACT_APP_SERVICE_ID;
  const TEMPLATE_ID = process.env.REACT_APP_TEMPLATE_ID;
  const USER_ID = process.env.REACT_APP_USER_ID;

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if email is in the right format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      window.alert("Please enter a valid email address.");
      return;
    }
    // Check if name and message are filled out
    if (!name || !message) {
      // if not then send error alert
      window.alert("Please fill out all the required fields.");
      return;
    }
    const toSend = { from_name: name, reply_to: email, message: message };
    send(SERVICE_ID, TEMPLATE_ID, toSend, USER_ID)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        // if success then send success alert
        window.alert(
          "Message Sent! We will get back to you shortly - ABSOLAR."
        );
        closeButton();
      })
      .catch((err) => {
        console.log("FAILED...", err);
      });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div
      className={styles.formContainer}
      // stops the container onclick from being inherited
      onClick={(e) => e.stopPropagation()}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <button className={styles.exit} onClick={closeButton}>
          <p>Close</p>
        </button>
        <h1>Contact Us </h1>
        <label>Name</label>
        <input
          placeholder=""
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          placeholder=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Message</label>
        <textarea
          placeholder=""
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button className={styles.submit} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactModal;
