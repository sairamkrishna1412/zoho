import React from 'react';
// import ContentLoader from 'react-content-loader';

import styles from './Loader.module.css';

const Loader = (props) => (
  <div className={styles.loaderContainer}>
    <div>
      <div className={styles.loaderBox}>
        <span>Loading</span>
      </div>
      <div className={styles.loadLine}></div>
    </div>
  </div>
);

export default Loader;
