// components/ProdutoCard.js
'use client'
import React from 'react';
import styles from './ProdutoCard.module.css';
import { IoInformationCircleOutline } from 'react-icons/io5';

const ProductCard = ({ product, openPriceModal, openInfoModal }) => {
    return (
        <div className={styles.card}>
            <img src={`https://veraflor.onrender.com/public/upload/${product.imagem}`} alt={product.descricao} className={styles.image} />
            <h2 className={styles.name}>{product.descricao}</h2>
            <div className={styles.buttons}>
                <button className={styles.button} onClick={() => openPriceModal(product)}>R$ {product.preco}</button>
                <IoInformationCircleOutline className={styles.infoIcon} onClick={() => openInfoModal(product)} />
            </div>
        </div>
    );
};

export default ProductCard;
