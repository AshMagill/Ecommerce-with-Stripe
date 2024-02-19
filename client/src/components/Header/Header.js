import React, { useContext } from "react";
import { Link } from "react-router-dom";

// local styling for header
import styles from "./Header.module.css";

// stripe context to display items in cart
import { ProductContext } from "../StripeContext";

// navbar icons
import Cart from "../../images/black-shopping-cart-10933.svg";
import Logo from "../../images/spiral.svg";

const Header = () => {
  // destructuring used to extract cart from 'ProductContext'
  const { cart } = useContext(ProductContext);

  //calculates the total count of items by adding up the quantities of each item
  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className={styles.navbarContainer}>
      <Link to="/">
        <img src={Logo} alt="cart" className={styles.siteLogo} />
      </Link>
      <Link to="/" className={styles.siteName}>
        AB SOLAR DUNEDIN
      </Link>
      {/*cart is placed in relative div for count absolute position*/}
      <div className={styles.cartContainer}>
        <Link to="/cart" className={styles.cartPic}>
          {cartItemsCount > 0 && (
            <span className={styles.cartItemCount}>{cartItemsCount}</span>
          )}
          <img src={Cart} alt="cart" className={styles.cartIcon} />
        </Link>
      </div>
    </div>
  );
};

export default Header;
