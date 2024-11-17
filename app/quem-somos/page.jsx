'use client';
import React from 'react';
import Image from 'next/image';
import styles from './quemSomos.module.css';

const QuemSomos = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quem Somos</h1>
      <p className={styles.text}>
        A Veraflor é uma Floricultura e Garden Center que conta com um ambiente amplo e diferenciado, o que permite a fácil circulação dos clientes no interior da loja.
        Oferecemos diversos produtos para o cuidado das suas plantinhas.
      </p>
      <div className={styles.fotos}>
        <Image src="/images/fachada1.jpg" alt="Foto da loja" width={600} height={400} />
        <Image src="/images/personal1.jpg" alt="Plantas" width={600} height={400} />
      </div>
    </div>
  );
};

export default QuemSomos;
