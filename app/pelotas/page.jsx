'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './pelotas.module.css';
import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const PelotasPage = () => {
    const videoRef = useRef(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
            videoRef.current.muted = true;
        }
    }, [isClient]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Pelotas</h1>
            <div className={styles.videoContainer}>
                {isClient && (
                    <iframe
                        width="854"
                        height="480"
                        src="https://www.youtube.com/embed/I_8it_FoXjU?autoplay=1"
                        title="Veraflor Pelotas"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen>
                    </iframe>   
                )}
            </div>
            <div className={styles.mapSection}>
                <div className={styles.mapInfo}>
                    <FaMapMarkerAlt className={styles.mapIcon} />
                    <h2 className={styles.mapTitle}>Como chegar</h2>
                    <p className={styles.mapAddress}>Av. Dr. Félix Antônio Caputo, 251 - Tres Vendas</p>
                </div>
                <div className={styles.mapContainer}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13575.757440277472!2d-52.33099971773682!3d-31.7175514216045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95104bae490f5d2b%3A0xd84002d4b7a36d36!2sVeraflor%20Floricultura%20e%20Garden%20Center!5e0!3m2!1spt-PT!2sbr!4v1718570011399!5m2!1spt-PT!2sbr"
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
                    <p className={styles.contactDetail}><FaWhatsapp className={styles.contactDetailIcon} /> Telefone: 53 999 56 15 58</p>
                    <p className={styles.contactDetail}><FaInstagram className={styles.contactDetailIcon} /> @veraflor_garden</p>
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

export default PelotasPage;

