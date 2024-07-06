// components/ProductModal.js
'use client'
import React, { useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from './ProductModal.module.css';

const MySwal = withReactContent(Swal);

const ProductModal = ({ product, onClose }) => {
    useEffect(() => {
        if (!product) {
            return;
        }

        const handleWhatsAppClick = (location) => {
            const phoneNumbers = {
                Pelotas: '5553999561558',
                Camaqua: '5553999272822',
            };
            const message = `Olá, estou interessado no produto ${product.descricao}, gostaria de mais informações de como adquirir.`;
            const url = `https://wa.me/${phoneNumbers[location]}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        };

        MySwal.fire({
            title: '<span style="font-size: 18px;">Com qual loja você quer falar?</span>',
            html: (
                <div className={styles.modalContent}>
                    <img src={`https://veraflor.onrender.com/public/upload/${product.imagem}`} alt={product.descricao} className={styles.modalImage} />
                    <h2 className={styles.modalProductName}>{product.descricao}</h2>
                    <div className={styles.modalItems}>
                        <div className={styles.modalItem} onClick={() => handleWhatsAppClick('Pelotas')}>
                            <FaWhatsapp className={styles.modalIcon} />
                            <span>Pelotas</span>
                        </div>
                        <div className={styles.modalItem} onClick={() => handleWhatsAppClick('Camaqua')}>
                            <FaWhatsapp className={styles.modalIcon} />
                            <span>Camaquã</span>
                        </div>
                    </div>
                </div>
            ),
            showConfirmButton: false,
            showCloseButton: true,
            closeButtonHtml: '<span class="close-button">&times;</span>',
            customClass: {
                container: styles.customSwalContainer,
                popup: styles.customSwalPopup,
                closeButton: styles.customSwalCloseButton
            }
        }).then(() => {
            onClose();
        });
    }, [product]);

    return null;
};

export default ProductModal;
