'use client';
import React from 'react';
import styles from './Content.module.css';
import CustomCarousel from './CustomCarousel';
import Link from 'next/link';

import image1 from '/public/images/image2.jpg';
import image2 from '/public/images/image3.jpg';
import image3 from '/public/images/image5.png';

const Content = () => {
  const images = [image1, image2, image3];

  return (
    <div className={styles.content}>
      <CustomCarousel images={images} />
      <h2 className={styles.title}>Conheça nossas lojas</h2>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <img src="/images/pelotas.png" alt="pelotas" />
          <button className={styles.button}>Pelotas</button>
        </div>
        <div className={styles.card}>
          <img src="/images/camaqua.jpg" alt="camaqua" />
          <button className={styles.button}>Camaquã</button>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.text}>
          <h1>Itens em destaque</h1>
          <p>Ficou em dúvida? Confira os produtos preferidos dos nossos clientes!</p>
          <Link href="/destaques" passHref>
            <button className={styles.buttonSecondary}>Ver tudo</button>
          </Link>
        </div>
        <div className={styles.photos}>
          <img src="/images/image2.jpg" alt="Placeholder" />
          <img src="/images/image3.jpg" alt="Placeholder" />
          <img src="/images/image5.png" alt="Placeholder" />
        </div>
      </div>
    </div>
  );
};

export default Content;
