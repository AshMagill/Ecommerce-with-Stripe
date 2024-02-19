import React, { createContext, useState, useEffect, useContext } from "react";
export const ProductContext = createContext();

export function useProductContext() {
  return useContext(ProductContext);
}

export const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/products`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        setProductData(data);
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchData();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        productData,
        setProductData,
        cart,
        setCart,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
