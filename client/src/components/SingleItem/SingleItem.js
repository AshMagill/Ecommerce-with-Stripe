import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../StripeContext";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//local css for Single Item module
import styles from "./SingleItem.module.css";

const SingleItem = () => {
  // Extract data from the context using destructuring
  const { productData, cart, setCart } = useContext(ProductContext);

  // State for adding quantity
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  // Destructuring the id parameter from the useParams() hook
  const { id } = useParams();

  // Creating a navigate function using the useNavigate() hook
  const navigate = useNavigate();

  // Find the product with the matching id
  const product = productData.find((product) => product.id === id);

  // Check if the product exists
  if (!product) {
    return <div>Product not found.</div>;
  }

  // Check if the product is already added to the cart
  const addedToCart = cart.some((item) => item.id === id);

  // Function to handle adding the product to the cart
  const handleAddTocart = async (product) => {
    if (!addedToCart) {
      // If the product is not already in the cart, add it with the selected quantity
      setCart([...cart, { ...product, qty: quantityToAdd }]);
    } else {
      // If the product is already in the cart, update its quantity
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: quantityToAdd } : item
        )
      );
    }
  };

  // Function to navigate to the cart page
  const goToCart = () => {
    navigate("/cart");
  };

  return (
    <div className={styles.productGrid}>
      {/* Display the product image */}
      <img
        src={product.images}
        alt={product.name}
        className={styles.itemImage}
      />
      {/* Display the product title */}
      <p className={styles.itemTitle}>{product.name}</p>
      {/* Display the product price */}
      <p className={styles.itemPrice}>
        ${Number(product.price / 100).toFixed(2) + " each"}
      </p>
      {/* Add to Cart buttons */}
      <div className={styles.cartBtnsContainer}>
        {/* Quantity buttons */}
        <div className={styles.quantityContainer}>
          {/* Decrease quantity button */}
          <FontAwesomeIcon
            className="plusMinusIcons"
            icon={faMinusSquare}
            onClick={() => setQuantityToAdd(quantityToAdd - 1)}
          />
          {/* Display the selected quantity */}
          <p className={styles.itemQuantity}>{quantityToAdd}</p>
          {/* Increase quantity button */}
          <FontAwesomeIcon
            className="plusMinusIcons"
            icon={faPlusSquare}
            onClick={() => setQuantityToAdd(quantityToAdd + 1)}
          />
        </div>
        {/* Add to Cart button */}
        <button
          className={styles.addToCartBtn}
          onClick={() => {
            handleAddTocart(product);
          }}
        >
          ADD TO CART
        </button>
        {/* Display "Go to Cart" button if the product is already in the cart */}
        {addedToCart ? (
          <button className={styles.goToCartBtn} onClick={goToCart}>
            GO TO CART
          </button>
        ) : (
          <p></p>
        )}
      </div>
      {/* Display the product description */}
      <p className={styles.itemDescription}>{product.description}</p>
      {/* Display store details */}
      {product.metadata.dropship && (
        <p className={styles.warning}>
          This item is dropshipped from
          {product.metadata.dropship === "NZ"
            ? " within New Zealand "
            : " outiside of New Zealand "}
          and may take up to
          {product.metadata.dropship === "NZ"
            ? " an extra week to arrive."
            : " an extra few weeks to arrive."}
        </p>
      )}
      {product.metadata.pickup && (
        <p className={styles.warning}>
          This item is unable to be delivered and must be collected from our
          location in Pine Hill Road, Dalmore.
        </p>
      )}
      {product.metadata.delivery && (
        <p className={styles.delivery}>
          This item is eligible for nationwide delivery at a flat rate of $
          {product.metadata.delivery}. Select this option during the checkout
          process.
        </p>
      )}
    </div>
  );
};
export default SingleItem;
