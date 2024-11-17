'use client'
import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaClock } from 'react-icons/fa';
import { IoLocationSharp } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.infoSection}>
        <div className={styles.logoSection}>
          <Link href="/" passHref>
            <Image
              src="/images/logoBRANCO.png"
              alt="Logo"
              width={120}
              height={45}
              className={styles.logo}
            />
          </Link>
          <div className={styles.paymentSection}>
            <h4>PAGUE COM</h4>
            <div className={styles.paymentIcons}>
              <img src="/images/visa.png" alt="Visa" />
              <img src="/images/master.png" alt="Mastercard" />
              <img src="/images/elo.png" alt="Elo" />
              <img src="/images/pix.png" alt="Pix" />
            </div>
          </div>
        </div>
        <div className={styles.contact}>
          <h4>PELOTAS</h4>
          <p><a href="https://www.facebook.com/veraflorgarden"><FaFacebook /> Facebook</a></p>
          <p><a href="https://www.instagram.com/veraflor_garden/"><FaInstagram /> Instagram</a></p>
          <p><FaWhatsapp /> (53) 99956-1458</p>
          <p><IoLocationSharp/> Av. Dr. Felix Antônio Caputo, 251 (Rua em frente ao Treichel)</p>
        </div>
        <div className={styles.institutional}>
          <h4>CAMAQUÃ </h4>
          <p><a href="https://www.facebook.com/veraflorgarden"><FaFacebook /> Facebook</a></p>
          <p><a href="https://www.instagram.com/veraflorcamaqua"><FaInstagram /> Instagram</a></p>
          <p><FaWhatsapp /> (51) 99927-2822</p>
          <p><IoLocationSharp/> Av. Cônego Luíz Walter Hanquet, 517(Quase ao lado do Krolow)</p>
        </div>
        <div className={styles.virtualStore}>
          <h4>OUTRAS INFORMAÇÕES</h4>
          <p><FaClock /> De Segunda à Sábado das 09h às 18h e Domingos das 9h ás 12h e das 14h às 18h</p>
          <p><FaEnvelope /> veraflorgarden@hotmail.com</p>
          <p><Link href="/quem-somos">Quem somos</Link></p>
          <p><Link href="/politica-privacidade">Política de Privacidade</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
