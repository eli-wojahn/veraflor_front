import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './CartModal.module.css';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';

const CartModalContent = ({ product, clienteId, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  // Function to fetch or create an active cart
  const buscarCarrinhoAtivo = async (clienteId) => {
    const response = await fetch(`https://veraflor.onrender.com/carrinho/listaAtivos/${clienteId}`);
    const carrinho = await response.json();
    if (carrinho.length > 0) {
      return carrinho[0];
    } else {
      return criarCarrinho(clienteId);
    }
  };

  // Function to create a new cart
  const criarCarrinho = async (clienteId) => {
    const response = await fetch(`https://veraflor.onrender.com/carrinho`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ativo', cliente_id: clienteId }),
    });
    return await response.json();
  };

  const adicionarItemAoCarrinho = async (produto, quantidade, carrinhoId) => {
    try {
      const response = await fetch(`https://veraflor.onrender.com/itens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantidade,
          carrinho_id: carrinhoId,
          produto_id: produto.id,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao adicionar item ao carrinho');
      }
  
      await Swal.fire({
        icon: 'success',
        title: 'Produto adicionado ao carrinho!',
        showConfirmButton: true,
        // Remove timer to allow the user to close the modal manually
      });
  
      return await response.json();
    } catch (error) {
      await Swal.fire({
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
      await Swal.fire({
        icon: 'warning',
        title: 'Você precisa estar logado para adicionar itens ao carrinho',
      });
      return;
    }
  
    const carrinhoAtivo = await buscarCarrinhoAtivo(clienteId);
    if (carrinhoAtivo) {
      await adicionarItemAoCarrinho(product, quantity, carrinhoAtivo.id);
      onClose(); // Close the modal after the success message is closed
    }
  };

  return (
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
        <button className={styles.addButton} onClick={handleAddToCart}>
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default CartModalContent;
