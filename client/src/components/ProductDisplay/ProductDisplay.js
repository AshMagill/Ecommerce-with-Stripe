import { Link } from "react-router-dom";
import { ProductContext } from "../StripeContext";
import { useContext } from "react";
import styles from "./ProductDisplay.module.css";

const Favorites = () => {
  const { productData } = useContext(ProductContext);

  // Scroll to top of page when link is clicked
  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <div className={styles.productsContainer}>
        <div className={styles.productContainerScreen} />
        <h1 className={styles.productsHeader}>PRODUCTS</h1>
        <div className={styles.productsBody}>
          {productData.toReversed().map((product) => (
            <Link
              to={"/item/" + product.id}
              className={styles.productItem}
              onClick={scrollTop}
              key={product.id}
            >
              <div className={styles.productImage}>
                <img src={product.images[0]} alt={product.name} />
              </div>
              <div>
                <p className={styles.productName}>{product.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
