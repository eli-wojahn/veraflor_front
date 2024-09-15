// components/CheckoutSummary.js
import React from 'react';
import styles from './CheckoutSummary.module.css';

const CheckoutSummary = ({ totalProdutos, totalValor }) => {
    return (
        <div className={styles.summary}>
            <h2>Resumo da compra</h2>
            <div>
                <span>Total de Produtos:</span>
                <span>{totalProdutos}</span>
            </div>
            <div className={styles.total}>
                <span>Valor Total:</span>
                <span>R$ {totalValor.toFixed(2)}</span>
            </div>
            <button className={styles.finalizeButton}>Finalizar Compra</button>
        </div>
    );
};

export default CheckoutSummary;
