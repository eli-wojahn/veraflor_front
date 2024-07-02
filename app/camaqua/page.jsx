'use client';
import React, { useEffect, useState } from 'react';
import styles from './camaqua.module.css';
import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const CamaquaPage = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Camaquã</h1>
            <div className={styles.videoContainer}>
                {isClient && (
                    <iframe
                        width="854"
                        height="480"
                        src="https://www.youtube.com/embed/Lg7CBeYfzF0?autoplay=1"
                        title="Veraflor Camaquã"
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen>
                    </iframe>
                )}
            </div>
            <div className={styles.mapSection}>
                <div className={styles.mapInfo}>
                    <FaMapMarkerAlt className={styles.mapIcon} />
                    <h2 className={styles.mapTitle}>Como chegar</h2>
                    <p className={styles.mapAddress}>Av. Cônego Luíz Walter Hanquet, 517 - São José</p>
                </div>
                <div className={styles.mapContainer}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6301.628861123421!2d-51.81552685345469!3d-30.86499054458498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951a77f0c9af5eb1%3A0x90c59172cbdb976a!2sVeraflor%20Floricultura%20e%20Garden%20Center%20Camaqu%C3%A3!5e0!3m2!1spt-PT!2sbr!4v1718238063359!5m2!1spt-PT!2sbr"
                        width="950"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
            <div className={styles.contactSection}>
                <div className={styles.contactInfo}>
                    <FaPhone className={styles.contactIcon} />
                    <h2 className={styles.contactTitle}>Contato</h2>
                    <p className={styles.contactDetail}><FaWhatsapp className={styles.contactDetailIcon} /> Telefone 51 999 27 28 22</p>
                    <p className={styles.contactDetail}><FaInstagram className={styles.contactDetailIcon} /> @veraflorcamaqua</p>
                </div>
                <div className={styles.deliveryInfo}>
                    <img src="/images/deliver.png" alt="Delivery de Flores e Plantas" className={styles.deliveryImage} />
                </div>
            </div>
            <div className={styles.hoursSection}>
                <div className={styles.hoursContent}>
                    <img src="/images/hora1.png" alt="Horário de Funcionamento" className={styles.hoursImage} />
                </div>
            </div>
        </div>
    );
};

export default CamaquaPage;
