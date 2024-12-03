'use client';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './Content.module.css';
import CustomCarousel from './CustomCarousel';
import Link from 'next/link';

import image1 from '/public/images/capa12.png';
import image2 from '/public/images/capa2.png';
import image3 from '/public/images/capa4.png';
import image4 from '/public/images/capa52.png';

const images = [image1, image2, image3, image4];

const Content = () => {
  const [destaques, setDestaques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(false); 
  useEffect(() => {
    fetch('https://veraflor.onrender.com/produtos/destaque')
      .then(response => response.json())
      .then(data => {
        setDestaques(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar destaques:', error);
        setIsLoading(false);
      });
  }, []);

  const getRandomDestaques = (items, num) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const selectedDestaques =
    destaques.length >= 3 ? getRandomDestaques(destaques, 3) : destaques;

  useEffect(() => {
    const alertaJaExibido = localStorage.getItem('alertaJaExibido');

    if (!alertaJaExibido) {
      Swal.fire({
        title: 'Atenção',
        html: `
          Essa é uma página em construção, não realize compras nessa plataforma.<br><br>
          Para entrar em contato com a Veraflor acesse as redes sociais:<br><br>
          <a href="https://www.instagram.com/veraflor_garden/" target="_blank">Instagram</a> |
          <a href="https://www.facebook.com/veraflorgarden" target="_blank">Facebook</a>
        `,
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#FF9F00',
      }).then(() => {
        localStorage.setItem('alertaJaExibido', 'true');
      });
    }
  }, []);

  const handleCookieConsent = () => {
    setCookieConsent(true);
    localStorage.setItem('cookieConsent', 'true');
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setCookieConsent(true);
    }
  }, []);

  return (
    <div className={styles.content}>
      <CustomCarousel images={images} />
      <h2 className={styles.title}>Conheça nossas lojas</h2>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <img src="/images/pelotas.png" alt="pelotas" />
          <Link href="/pelotas" passHref>
            <button className={styles.button}>Pelotas</button>
          </Link>
        </div>
        <div className={styles.card}>
          <img src="/images/camaqua.jpg" alt="camaqua" />
          <Link href="/camaqua" passHref>
            <button className={styles.button}>Camaquã</button>
          </Link>
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
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            selectedDestaques.map((item, index) => (
              <img
                key={index}
                src={`https://veraflor.onrender.com/public/upload/${item.imagem}`}
                alt={item.descricao}
              />
            ))
          )}
        </div>
      </div>

      {!cookieConsent && (
        <div className={styles.cookieBanner}>
          <p>
            Nós utilizamos cookies para personalizar anúncios e melhorar a sua experiência no site.
            Ao continuar navegando, você concorda com a nossa{' '}
            <Link href="/politica-privacidade" className={styles.cookieLink}>Política de Privacidade</Link>.
          </p>
          <button className={styles.cookieButton} onClick={handleCookieConsent}>
            Concordar e Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default Content;
