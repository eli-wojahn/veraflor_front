'use client'
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from './CartModal.module.css';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';

const MySwal = withReactContent(Swal);

const CartModal = ({ product, carrinhoId, onClose }) => {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleAddToCart = async () => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/itens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantidade: quantity,
                    carrinho_id: carrinhoId, // ID correto do carrinho
                    produto_id: product.id,  // ID do produto
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar ao carrinho');
            }

            Swal.fire({
                icon: 'success',
                title: 'Produto adicionado ao carrinho!',
                showConfirmButton: true,
                timer: 1500,
            });

            onClose(); // Fechar o modal
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao adicionar ao carrinho',
                text: error.message,
            });
        }
    };

    useEffect(() => {
        MySwal.fire({
            html: (
                <div className={styles.modalContent}>
                    <img
                        src={`https://veraflor.onrender.com/public/upload/${product.imagem}`}
                        alt={product.descricao}
                        className={styles.modalImage}
                    />
                    <div className={styles.modalDetails}>
                        <h2 className={styles.modalProductName}>{product.descricao}</h2>
                        <div className={styles.quantitySelector}>
                            <CiCircleMinus className={styles.quantityButton} onClick={handleDecrease} />
                            <span>{quantity}</span>
                            <CiCirclePlus className={styles.quantityButton} onClick={handleIncrease} />
                        </div>
                        <button className={styles.addButton} onClick={handleAddToCart}>Adicionar ao Carrinho</button>
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
    }, [quantity]);

    return null;
};

export default CartModal;
