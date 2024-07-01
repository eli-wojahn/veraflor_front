'use client'
import React from 'react';
import styles from './Content.module.css';
import CustomCarousel from './CustomCarousel';
import Link from 'next/link';

import image1 from '/home/elias/Área de Trabalho/Projeto Desenvolvimento I/veraflor-app/public/images/image2.jpg';
import image2 from '/home/elias/Área de Trabalho/Projeto Desenvolvimento I/veraflor-app/public/images/image3.jpg';
import image3 from '/home/elias/Área de Trabalho/Projeto Desenvolvimento I/veraflor-app/public/images/image5.png';

const Content = () => {
  const images = [image1, image2, image3];

  return (
    <div className={styles.content}>
      <CustomCarousel images={images} />
      <h2 className={styles.title}>Conheça nossas lojas</h2>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <img src="https://lh3.googleusercontent.com/p/AF1QipO0GuA4zzznVfwrdB8cyx1apo2fJnLbPbYX-vig=s680-w680-h510" alt="pelotas" />
          <button className={styles.button}>Pelotas</button>
        </div>
        <div className={styles.card}>
          <img src="https://lh3.googleusercontent.com/p/AF1QipPjFeRuetmh0e3PPAHdjlXc2NB2H-MsrtzsZAw8=s680-w680-h510" alt="camaqua" />
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
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSskUbeT_qGxTFI9ccoYGGNPjmrDI2s_LVl2b1TH7O8qA&s" alt="Placeholder" />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARxjxcJvK6C7-5DURR6Z0cXJgP00TqADuwLMKdqa3vyb2j-R1Xt8D5z8NkUi9TsJbbiI&usqp=CAU" alt="Placeholder" />
          <img src="https://s2.glbimg.com/j69gl5VP3u2B6jDFfWhdjgYEB6I=/e.glbimg.com/og/ed/f/original/2021/10/06/ficus.jpg" alt="Placeholder" />
        </div>
      </div>
    </div>
  );
};

export default Content;
