'use client'
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from './InfoModal.module.css';

const MySwal = withReactContent(Swal);

const InfoModal = ({ product, onClose }) => {
    const [dicas, setDicas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDicas = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://veraflor.onrender.com/dicas/produto/${product.id}`);
                if (!response.ok) {
                    throw new Error('Erro ao obter dicas');
                }
                const data = await response.json();
                setDicas(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDicas();
    }, [product.id]);

    useEffect(() => {
        if (!loading) {
            MySwal.fire({
                html: (
                    <div className={styles.modalContent}>
                        <img src={`https://veraflor.onrender.com/public/upload/${product.imagem}`} alt={product.descricao} className={styles.modalImage} />
                        <div className={styles.modalDetails}>
                            <h2 className={styles.modalProductName}>{product.descricao}</h2>
                            {dicas.length > 0 ? (
                                <div className={styles.dicasContainer}>
                                    {dicas.map((dica, index) => (
                                        <div key={index} className={styles.dica}>
                                            <p>{dica.descricao}</p>
                                            <p><strong>Número de Rega:</strong> {dica.nr_regas}</p>
                                            <p><strong>Exposição ao Sol:</strong> {dica.exposicao_sol}</p>
                                            <p><strong>Adubagem:</strong> {dica.adubagem}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Sem dicas disponíveis para este produto.</p>
                            )}
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
        }
    }, [loading]);

    return null;
};

export default InfoModal;
