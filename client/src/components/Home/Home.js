import styles from "./Home.module.css";
import ProductDisplay from "../ProductDisplay/ProductDisplay";

//there are other images that are imported in css, they are used as background-image
//this is because they are fixed and cant be placed relatively
import mobileHeaderPic from "../../images/pexels-kindel-media-9875405.jpg";
import deskTopHeaderPic from "../../images/mountainsun.jpg";

//refer to the comments in the Home.module.css to understand layout

const Home = () => {
  return (
    <>
      <div className={styles.homeContainer}>
        <div className={styles.heroContainer}>
          <div className={styles.blankHeros}>
            <div className={styles.relativeWrapper}>
              <div className={styles.absoluteScreen} />
              <img
                src={mobileHeaderPic}
                alt="mobile pic"
                className={styles.mobileHeaderPic}
              />
            </div>
            <div className={styles.relativeWrapper}>
              <div className={styles.absoluteScreen} />
              <img
                src={deskTopHeaderPic}
                alt="desktop"
                className={styles.deskTopHeaderPic}
              />
            </div>
          </div>
          <div className={styles.relativeWrapper}>
            <div className={styles.absoluteScreen2} />
            <div className={styles.heroScreenWithText}>
              <p className={styles.heroHeader}>
                DIY SECOND HAND <br /> SOLAR PANELS
              </p>
              <p className={[styles.heroText1]}>
                3 month warranty for a little peace of mind
              </p>
              <p className={styles.heroText2}>
                Everything you need to get set up off the grid
              </p>
              <p className={styles.heroText2}>Quick and easy to assemble</p>
              <p className={styles.heroText2}>
                Quality soulutions at low prices
              </p>
            </div>
          </div>
        </div>
        <ProductDisplay />
        <div className={styles.bottomContainer}>
          <div className={styles.bottomOverlay}>
            <h1 className={styles.bottomHeader}>SOLAR PANELS DUNEDIN</h1>
            <p className={styles.bottomDescription}>
              Harvest the power of the Dunner Stunner.
              <br />
              <br />
              All products are available for cash on pick up in PineHill,
              Dunedin. Don't waste money on expensive solar panel installations.
              Buy second hand and do it yourself. With these few components you
              can build your own solar panel system, easy peasy paddington pie.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
