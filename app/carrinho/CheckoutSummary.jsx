// components/CheckoutSummary.js
import React, { useState } from 'react';
import styles from './CheckoutSummary.module.css';

const CheckoutSummary = ({ totalProdutos, totalValor }) => {
    const [deliveryOption, setDeliveryOption] = useState('entrega');

    const deliveryFee = totalValor >= 200 ? 0 : 20;
    const finalTotal = deliveryOption === 'entrega' ? totalValor + deliveryFee : totalValor;

    const amountToFreeShipping = 200 - totalValor;
    const showFreeShippingWarning = deliveryOption === 'entrega' && totalValor < 200;

    return (
        <div className={styles.summary}>
            <h2>Resumo da compra</h2>
            <div>
                <span>Total de Itens:</span>
                <span>{totalProdutos}</span>
            </div>
            <div>
                <span>Subtotal:</span>
                <span>R$ {totalValor.toFixed(2)}</span>
            </div>

            {showFreeShippingWarning && (
                <div className={styles.freeShippingWarning}>
                    Faltam R$ {amountToFreeShipping.toFixed(2)} para alcançar entrega grátis
                </div>
            )}

            <hr className={styles.separator} />

            <div className={styles.deliveryOptionContainer}>
                <label>
                    <input
                        type="radio"
                        value="entrega"
                        checked={deliveryOption === 'entrega'}
                        onChange={() => setDeliveryOption('entrega')}
                    />
                    ⠀Entrega
                </label >
                <label>
                    <input
                        type="radio"
                        value="retirada"
                        checked={deliveryOption === 'retirada'}
                        onChange={() => setDeliveryOption('retirada')}
                    />
                   ⠀Retirada no local
                </label>
            </div>

            <hr className={styles.separator} />

            {deliveryOption === 'entrega' && (
                <div>
                    <span>Taxa de Entrega:</span>
                    <span>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}</span>
                </div>
            )}
            <div className={styles.total}>
                <span>Total a Pagar:</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
            </div>
            <button className={styles.finalizeButton}>Finalizar Compra</button>
        </div>
    );
};

export default CheckoutSummary;
