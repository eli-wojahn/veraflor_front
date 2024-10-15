import React, { useState } from 'react';
import styles from './SummaryCheckout.module.css';
import Link from 'next/link';

const SummaryCheckout = ({ totalProdutos, totalValor }) => {
    const [deliveryOption, setDeliveryOption] = useState('entrega');

    const deliveryFee = totalValor >= 200 ? 0 : 20;
    const finalTotal = deliveryOption === 'entrega' ? totalValor + deliveryFee : totalValor;

    const amountToFreeShipping = 200 - totalValor;
    const showFreeShippingWarning = deliveryOption === 'entrega' && totalValor < 200;

    return (
        <div className={styles.summary}>
            <h2>Resumo da compra</h2>
            <div>
                <span><strong>Total de Itens:</strong></span>
                <span>{totalProdutos}</span>
            </div>
            <div>
                <span><strong>Subtotal:</strong></span>
                <span>R$ {totalValor.toFixed(2)}</span>
            </div>

            {showFreeShippingWarning && (
                <div className={styles.freeShippingWarning}>
                    Faltam R$ {amountToFreeShipping.toFixed(2)} para alcançar entrega grátis
                </div>
            )}
            <div className={styles.deliveryOptionContainer}>
                <h3>Opção de Entrega:</h3>
                <label>
                    <input
                        type="radio"
                        value="entrega"
                        checked={deliveryOption === 'entrega'}
                        onChange={() => setDeliveryOption('entrega')}
                    />
                    Entrega
                </label>
                <label>
                    <input
                        type="radio"
                        value="retirada"
                        checked={deliveryOption === 'retirada'}
                        onChange={() => setDeliveryOption('retirada')}
                    />
                    Retirada
                </label>
            </div>
            <div className={styles.total}>
                <span>Total a Pagar:</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default SummaryCheckout;
