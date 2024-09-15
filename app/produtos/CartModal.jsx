'use client'
import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ClienteContext } from '@/contexts/client'; // Importando o contexto do cliente
import styles from './CartModal.module.css';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';

const MySwal = withReactContent(Swal);

const CartModal = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { clienteId } = useContext(ClienteContext); // Pegando o cliente logado do contexto

    // Função para buscar o carrinho ativo ou criar um novo
    const buscarCarrinhoAtivo = async (clienteId) => {
        const response = await fetch(`https://veraflor.onrender.com/carrinho/listaAtivos/${clienteId}`);
        const carrinho = await response.json();
        if (carrinho.length > 0) {
            return carrinho[0]; // Se o carrinho já existir, retornamos o carrinho ativo
        } else {
            return criarCarrinho(clienteId); // Caso contrário, criamos um novo carrinho
        }
    };

    // Função para criar um novo carrinho
    const criarCarrinho = async (clienteId) => {
        const response = await fetch(`https://veraflor.onrender.com/carrinho`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'ativo', cliente_id: clienteId }),
        });
        return await response.json();
    };

    // Função para adicionar item ao carrinho
    const adicionarItemAoCarrinho = async (produto, quantidade, carrinhoId) => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/itens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quantidade,
                    carrinho_id: carrinhoId,
                    produto_id: produto.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar item ao carrinho');
            }

            Swal.fire({
                icon: 'success',
                title: 'Produto adicionado ao carrinho!',
                showConfirmButton: true,
                timer: 1500,
            });

            return await response.json();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao adicionar ao carrinho',
                text: error.message,
            });
        }
    };

    const handleIncrease = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const handleDecrease = () => {
        setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const handleAddToCart = async () => {
        if (!clienteId) {
            Swal.fire({
                icon: 'warning',
                title: 'Você precisa estar logado para adicionar itens ao carrinho',
            });
            return;
        }

        const carrinhoAtivo = await buscarCarrinhoAtivo(clienteId);
        if (carrinhoAtivo) {
            await adicionarItemAoCarrinho(product, quantity, carrinhoAtivo.id);
        }
        onClose();
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
                closeButton: styles.customSwalCloseButton,
            },
        }).then(() => {
            onClose();
        });
    }, [quantity]);

    return null;
};

export default CartModal;
