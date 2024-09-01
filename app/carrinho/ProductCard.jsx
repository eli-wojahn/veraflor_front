import React from 'react';
import styles from './ProductCard.module.css';
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci';
import { BsTrash3 } from 'react-icons/bs';  // Importando o ícone de lixeira

const ProductCard = () => {
    // Mock de dados do produto
    const product = {
        id: 1,
        name: 'Fycus lyrata',
        ref: 'NQQ-4378-326-42',
        size: 'Médio',
        type: 'Planta',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNWrtLo3ZQHF8sLHrfhKET3M_tgwQtue9bw&s',
        quantity: 1,
        price: 59.99
    };

    // Funções mock para manipulação de quantidade e remoção
    const updateQuantity = (id, newQuantity) => {
        console.log(`Atualizar quantidade do produto ${id} para ${newQuantity}`);
    };

    const removeProduct = (id) => {
        console.log(`Remover produto com id ${id}`);
    };

    return (
        <div className={styles.card}>
            <img src={product.image} alt={product.name} className={styles.image} />
            <div className={styles.details}>
                <div className={styles.header}>
                    <h2 className={styles.name}>{product.name}</h2>
                    <BsTrash3 className={styles.trashIcon} onClick={() => removeProduct(product.id)} />
                </div>
                <p>Ref: {product.ref}</p>
                <p>Tamanho: {product.size}</p>
                <p>Tipo: {product.type}</p>
                <div className={styles.quantity}>
                    <CiCircleMinus className={styles.icon} onClick={() => updateQuantity(product.id, product.quantity - 1)} />
                    <input type="text" value={product.quantity} readOnly className={styles.quantityInput} />
                    <CiCirclePlus className={styles.icon} onClick={() => updateQuantity(product.id, product.quantity + 1)} />
                </div>
                <p className={styles.price}>R$ {product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
