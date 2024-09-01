// components/CheckoutSummary.js
import React from 'react';
import styles from './CheckoutSummary.module.css';

const CheckoutSummary = ({ subtotal, shipping, discount, total }) => {
    return (
        <div className={styles.summary}>
            <h2>Resumo da compra</h2>
            <div>
                <span>Subtotal:</span>
                <span>R$ {subtotal}</span>
            </div>
            <div>
                <span>Frete:</span>
                <span>R$ {shipping}</span>
            </div>
            <div>
                <span>Cupom de desconto:</span>
                <span>{discount ? `- R$ ${discount}` : "Nenhum"}</span>
            </div>
            <div className={styles.total}>
                <span>Total:</span>
                <span>R$ {total}</span>
            </div>
            <button className={styles.finalizeButton}>Finalizar Compra</button>
        </div>
    );
};

export default CheckoutSummary;
