import React from 'react';
import styles from './SummaryCheckout.module.css';

const SummaryCheckout = ({ totalProdutos, totalValor, deliveryOption, setDeliveryOption }) => {
    const deliveryFee = totalValor >= 200 ? 0 : 20;
    const finalTotal = deliveryOption === 'Entrega' ? totalValor + deliveryFee : totalValor;

    const amountToFreeShipping = 200 - totalValor;
    const showFreeShippingWarning = deliveryOption === 'Entrega' && totalValor < 200;

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
                        value="Entrega"
                        checked={deliveryOption === 'Entrega'}
                        onChange={() => setDeliveryOption('Entrega')}
                    />
                    Entrega
                </label>
                <label>
                    <input
                        type="radio"
                        value="Retirada"
                        checked={deliveryOption === 'Retirada'}
                        onChange={() => setDeliveryOption('Retirada')}
                    />
                    Retirada
                </label>
            </div>
            {deliveryOption === 'Entrega' && (
                <div>
                    <span><strong>Frete:</strong></span>
                    <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
            )}
            <div className={styles.total}>
                <span>Total a Pagar:</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default SummaryCheckout;
