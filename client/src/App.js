import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// global css
import "./App.css";

// Components for each route
import { ProductProvider } from "./components/StripeContext"; // wrapper for global state
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import SingleItem from "./components/SingleItem/SingleItem";
import ContactModal from "./components/ContactModal/ContactModal";
import TermsModal from "./components/TermsModal/TermsModal";

function App() {
  // state for modals open/close
  const [contactOpen, setContactOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);

  // handlers that open and close modals
  // every they are clicked, it toggles the usestate
  const onContactButton = () => {
    setContactOpen(!contactOpen);
  };

  const onLegalButton = () => {
    setLegalOpen(!legalOpen);
  };

  return (
    <ProductProvider>
      {/*this container is relative, so that the modals can be absolute*/}
      <div style={{ position: "relative" }}>
        {/*if state is set to open, it displays the modals*/}
        {contactOpen === true && (
          <div className="modalBackground" onClick={onContactButton}>
            <ContactModal closeButton={onContactButton} />
          </div>
        )}
        {legalOpen === true && (
          <div className="modalBackground" onClick={onLegalButton}>
            <TermsModal closeButton={onLegalButton} />
          </div>
        )}
        <div className="mainContainer">
          <div className="app">
            <Header />
            <Routes>
              {/*route paths*/}
              <Route path="/" element={<Home />} />
              <Route path="/item/:id" element={<SingleItem />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
          {/*function for toggling modal state is passed through to footer buttons*/}
          <Footer
            onLegalButton={onLegalButton}
            onContactButton={onContactButton}
          />
        </div>
      </div>
    </ProductProvider>
  );
}

export default App;
