import React, { useState, useEffect, useContext } from "react";
import styles from "./Cart.module.css";
import { ProductContext } from "../StripeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import CashModal from "../CashModal/CashModal";

const Cart = () => {
  const navigate = useNavigate();

  const [CashModalOpen, setCashModalOpen] = useState(false);

  // handlers that open and close modal
  // every they are clicked, it toggles the usestate
  const onCashModalButton = () => {
    setCashModalOpen(!CashModalOpen);
  };

  // cart and setCart are destructured from global state
  const { cart, setCart } = useContext(ProductContext);

  // payment status and error states
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");

  // state for payment method and delivery method
  const [deliveryMethod, setDeliveryMethod] = useState("");

  // state for payment details
  const [noDeliver, setNoDeliver] = useState(false);
  const [nzDropShip, setNzDropShip] = useState(false);
  const [outsideNzDropShip, setOutsideNzDropShip] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState(0);

  // handle delivery method
  const handleDeliverySwitchChange = (e) => {
    setDeliveryMethod(e.target.value);
  };

  // Calculate the total sum of the cart items
  const sum = cart.reduce((total, cartItem) => {
    return total + cartItem.price * cartItem.qty;
  }, 0);

  // Calculate the GST
  let total = sum / 100;
  const gst = total * 0.15;
  total = total - gst;
  const orderTotal = total + gst;

  // Handle the "Continue Shopping" button click event
  const handleContinueShopping = () => {
    navigate("/");
  };

  // Handle the "Empty Cart" button click event
  const handleEmptyCart = () => {
    setCart([]);
  };

  //This code will map through cart to check for delivery costs and pickup, dropship information
  useEffect(() => {
    let totalDeliveryCost = 0; // Variable to accumulate the delivery costs
    let hasNoDelivery = false; // Variable to track if any item has no delivery metadata
    cart.forEach((cartItem) => {
      if (cartItem.metadata.dropship && cartItem.metadata.dropship !== "NZ") {
        setOutsideNzDropShip(true);
      }
      if (cartItem.metadata.dropship === "NZ") {
        setNzDropShip(true);
      }
      if (cartItem.metadata.delivery) {
        const itemCost = cartItem.metadata.delivery * cartItem.qty;
        totalDeliveryCost += Number(itemCost); // Accumulate the delivery costs
      }
      if (cartItem.metadata.pickup) {
        setNoDeliver(true);
      }
      if (!cartItem.metadata.delivery) {
        hasNoDelivery = true;
      }
    });
    setNoDeliver(hasNoDelivery); // Update noDeliver state based on whether any item has no delivery metadata
    setDeliveryCost(totalDeliveryCost); // Update the deliveryCost state with the accumulated value
    // when an item is removed from the cart, the following dependencies are update
  }, [setCart, cart, noDeliver, nzDropShip, outsideNzDropShip]);

  // Check the URL parameters to determine the payment status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cancelledParam = urlParams.get("cancelled");
    const successfulParam = urlParams.get("successful");
    const failureParam = urlParams.get("failure");
    if (cancelledParam === "true") {
      const savedCart = localStorage.getItem("stripeCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setPaymentStatus("cancelled");
    } else if (successfulParam === "true") {
      setPaymentStatus("success");
    } else if (failureParam === "true") {
      const savedCart = localStorage.getItem("stripeCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setPaymentStatus("failure");
    }
  }, [setCart]);

  // Handle the checkout process
  const handleCheckout = async () => {
    if (cart.reduce((sum, item) => sum + item.qty, 0) < 1) {
      alert("Your cart is empty");
      return;
    }
    if (deliveryMethod === "") {
      alert("Your delivery method must be selected");
      return; // Return early if deliveryMethod is empty
    }
    // Calculate the delivery fee based on the delivery method
    const deliveryFee = deliveryMethod === "deliver" ? deliveryCost * 100 : 0;
    const url = `${process.env.REACT_APP_API_URL}/products/create-checkout-session`;
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: item.currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.qty,
    }));
    // Add the delivery fee as a separate line item if deliveryMethod is 'deliver'
    if (deliveryMethod === "deliver") {
      lineItems.push({
        price_data: {
          currency: lineItems[0].price_data.currency, // Use the currency from the first item
          product_data: {
            name: "Delivery Fee",
          },
          unit_amount: deliveryFee,
        },
        quantity: 1,
      });
    }

    // if delivery method is 'deliver', stripe modal will ask for address
    const data = {
      line_items: lineItems,
      delivery_method: deliveryMethod,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("stripeCart", JSON.stringify(cart));
      const body = await res.json();
      window.location.href = body.url;
    } catch (error) {
      console.error("Error:", error.message);
      setPaymentErrorMessage(error.message);
      setPaymentStatus("failure");
    }
  };

  // handle cash on pickup (just for Tim)
  const submitHandler = () => {
    setCart([]);
    setPaymentStatus("success");
  };

  // Increase the quantity of a cart item
  const increaseQty = (id) => {
    const cost = cart.find((item) => item.id === id).metadata.delivery;
    setDeliveryCost(deliveryCost + Number(cost));
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // Decrease the quantity of a cart item
  const decreaseQty = (id) => {
    const cost = cart.find((item) => item.id === id).metadata.delivery;
    setDeliveryCost(deliveryCost - cost);
    setCart((prevItems) =>
      prevItems.reduce((acc, item) => {
        if (item.id === id) {
          if (item.qty > 0) {
            acc.push({ ...item, qty: item.qty - 1 });
          } else {
            acc.push(item);
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  // Remove an item from the cart
  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
    // the state underneath is set to false, because once this happens, the useEffect that calculates them is activated, this way when an item is deleted, the state is recalibrated.
    setNoDeliver(false);
    setNzDropShip(false);
    setOutsideNzDropShip(false);
  };

  return (
    <div>
      {/*this container is relative, so that the modals can be absolute*/}
      {CashModalOpen === true && (
        <div className="modalBackground" onClick={onCashModalButton}>
          <CashModal
            cart={cart}
            total={orderTotal}
            closeButton={onCashModalButton}
            submitHandler={submitHandler}
          />
        </div>
      )}
      <section
        className={
          // if there is any type of payment status or the cart is empty, everything is centered, otherwise it looks funny with no empty cart button
          !paymentStatus && cart.length > 0
            ? styles.cartCont
            : styles.centerCont
        }
      >
        {cart && (
          <div
            className={
              // same logic as above, it checks the payment status and cart size to choose the correct styles
              !paymentStatus && cart.length > 0
                ? styles.cartButtonsCont
                : styles.singleButton
            }
          >
            <button
              className={styles.continueShopping}
              onClick={handleContinueShopping}
            >
              CONTINUE SHOPPING
            </button>
            {/*if the cart is empty it will not show the empty button */}
            {cart.length > 0 && (
              <button className={styles.emptyCart} onClick={handleEmptyCart}>
                EMPTY CART
              </button>
            )}
          </div>
        )}
        {/*if there is any type of payment status (determined by the url) this is rendered instead of the cart*/}
        {paymentStatus === "success" ? (
          <div className={styles.stripeStatus}>
            <h2>Thank you for shopping with us</h2>
            <h2>Your Payment was successful!!!</h2>
            {noDeliver ? (
              <p>
                You will be contacted shortly with pickup instructions and our
                location address, we will also email you an invoice.
              </p>
            ) : (
              <h2>We will send you an email with further details.</h2>
            )}
          </div>
        ) : paymentStatus === "cancelled" ? (
          <div className={styles.stripeStatus}>
            <h2>Payment was unsuccessful.</h2>
            <h2>Please check your payment details and try again.</h2>
          </div>
        ) : paymentStatus === "failure" ? (
          <div className={styles.stripeStatus}>
            {!paymentErrorMessage ? (
              <h2>
                Sorry, Problem with Payment server! Please try again later.
              </h2>
            ) : (
              <h2>{paymentErrorMessage}</h2>
            )}
          </div>
        ) : (
          ""
        )}
        <div className={styles.cartHeader}>
          {!paymentStatus && (
            <h2 className={styles.cartTitle}>YOUR SHOPPING CART:</h2>
          )}
        </div>
        {cart.length <= 0 ? (
          <>
            {/*if the cart is empty, the following message will be displayed*/}
            <div className={styles.productRow}>
              {!paymentStatus && (
                <h2 style={{ fontSize: "1rem" }}>Your cart is empty!</h2>
              )}
            </div>
          </>
        ) : (
          <>
            {/*this will map through all the products*/}
            {cart.map((cartItem) => {
              return (
                <figure key={cartItem.id} className={styles.productContainer}>
                  <div className={styles.productImage}>
                    <img src={cartItem.images[0]} alt={cartItem.name} />
                  </div>
                  <div className={styles.productPrice}>
                    <div className={styles.unitPrice}>Price: </div>
                    <div>${Number(cartItem.price / 100).toFixed(2)}</div>
                  </div>
                  <a
                    className={styles.removeBtn}
                    href="#remove"
                    onClick={() => removeFromCart(cartItem.id)}
                  >
                    Remove
                  </a>
                  <p className={styles.itemName}>{cartItem.name}</p>
                  <div className={styles.productQuantity}>
                    <FontAwesomeIcon
                      className="plusMinusIcons"
                      icon={faMinusSquare}
                      onClick={() =>
                        cartItem.qty > 0 && decreaseQty(cartItem.id)
                      }
                    />
                    <p className={styles.itemQuantity}>{cartItem.qty}</p>
                    <FontAwesomeIcon
                      className="plusMinusIcons"
                      icon={faPlusSquare}
                      onClick={() => increaseQty(cartItem.id)}
                    />
                  </div>
                  <div className={styles.productTotalPrice}>
                    ${Number((cartItem.price * cartItem.qty) / 100).toFixed(2)}
                  </div>
                </figure>
              );
            })}
            {/*the following code is only rendered if the cart has something in it*/}
            <div className={styles.orderSummaryCont}>
              {cart.length > 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {outsideNzDropShip && (
                      <p>
                        This purchase contains drop shipped items from outside
                        of New Zealand and may take upto an extra few weeks to
                        arrive.
                      </p>
                    )}
                    {nzDropShip && !outsideNzDropShip && (
                      <p>
                        This purchase contains drop shipped items from within
                        New Zealand and may take upto an extra week to arrive.
                      </p>
                    )}
                  </div>
                  {/*if something is in the cart that needs to be picked up, the whole order must be picked up*/}
                  {noDeliver === false ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <label>
                        Delivery accross NZ for ${deliveryCost.toFixed(2)}
                        <input
                          checked={deliveryMethod === "deliver"}
                          onChange={handleDeliverySwitchChange}
                          type="radio"
                          value="deliver"
                          style={{ accentColor: "grey" }}
                        />
                      </label>
                      <label>
                        Pickup
                        <input
                          checked={deliveryMethod === "pickup"}
                          onChange={handleDeliverySwitchChange}
                          type="radio"
                          value="pickup"
                          style={{ accentColor: "grey" }}
                        />
                      </label>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <p>
                          One or more of your items is pickup only, this
                          purchase must be picked up from the Pine Hill depo, a
                          pickup address will be provided upon payment.
                        </p>
                        <label>
                          pickup
                          <input
                            checked={deliveryMethod === "pickup"}
                            onChange={handleDeliverySwitchChange}
                            type="radio"
                            value="pickup"
                            style={{ accentColor: "grey" }}
                          />
                        </label>
                      </div>
                    </>
                  )}
                  <div className={styles.orderSummary}>
                    <div className={`${styles.orderRow} ${styles.total}`}>
                      Total:
                      {deliveryMethod === "deliver" ? (
                        <span>
                          ${Number(orderTotal + deliveryCost).toFixed(2)}
                        </span>
                      ) : (
                        <span>${Number(orderTotal).toFixed(2)}</span>
                      )}
                    </div>
                    <button
                      className={styles.purchaseCart}
                      onClick={handleCheckout}
                    >
                      CHECKOUT
                    </button>
                    <p> or </p>
                    <button
                      className={styles.purchaseCart}
                      onClick={onCashModalButton}
                    >
                      PAYMENT ON PICKUP
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};
export default Cart;
