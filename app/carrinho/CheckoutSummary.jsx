import React, { useState } from 'react';
import styles from './CheckoutSummary.module.css';
import Link from 'next/link';

const CheckoutSummary = ({ totalProdutos, totalValor }) => {
    const [deliveryOption, setDeliveryOption] = useState('entrega');

    const deliveryFee = totalValor >= 200 ? 0 : 20;
    const finalTotal = deliveryOption === 'entrega' ? totalValor + deliveryFee : totalValor;
    const finalSemFrete = finalTotal - 20

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
            <div className={styles.total}>
                <span>Valor com retirada:</span>
                <span>R$ {finalSemFrete.toFixed(2)}</span>
            </div>

            <div className={styles.total}>
                <span>Valor com frete:</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout" passHref>
            <button className={styles.finalizeButton}>Avançar para pagamento</button>
            </Link>
        </div>
    );
};

export default CheckoutSummary;
