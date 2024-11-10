"use client";
import React, { useState, useEffect } from 'react';
import styles from './CheckoutPix.module.css';
import Swal from 'sweetalert2'; 
import 'sweetalert2/dist/sweetalert2.min.css';
import { IoCopyOutline } from "react-icons/io5";

const CheckoutPixPage = () => {
    const [pixData, setPixData] = useState(null);

    useEffect(() => {
        const storedPixData = localStorage.getItem('pixData');
        if (storedPixData) {
            setPixData(JSON.parse(storedPixData));
            // Remover os dados do localStorage após carregar
            localStorage.removeItem('pixData');
        } else {
            console.error('Dados do Pix não encontrados no localStorage.');
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixData.qr_code_text)
            .then(() => {
                Swal.fire('Copiado!', 'O código Pix foi copiado para a área de transferência.', 'success');
            })
            .catch(err => {
                console.error('Erro ao copiar para a área de transferência', err);
            });
    };

    const handleFinishPurchase = () => {
        window.location.href = '/checkout-statusPix';
    };

    if (!pixData) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    return (
        <div className={styles.checkoutPixContainer}>
            <h2>Pagamento via Pix</h2>
            <div className={styles.qrCodeContainer}>
                <p>Escaneie o QR Code abaixo para realizar o pagamento:</p>
                <img src={pixData.qr_code_image_url} alt="QR Code Pix" className={styles.qrCodeImage} />
                <p>Ou copie e cole o código Pix:</p>
                <div className={styles.copyContainer}>
                    <textarea readOnly value={pixData.qr_code_text} className={styles.pixCode}></textarea>
                    <button onClick={copyToClipboard} className={styles.copyButton}>
                        <IoCopyOutline size={24} />
                    </button>
                </div>
                <button onClick={handleFinishPurchase} className={styles.finishButton}>
                    Finalizar compra
                </button>
            </div>
        </div>
    );
};

export default CheckoutPixPage;
