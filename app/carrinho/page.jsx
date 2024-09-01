'use client';
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import CheckoutSummary from './CheckoutSummary';
import ShippingCalculator from './ShippingCalculator';
import styles from './carrinho.module.css';

const CartPage = () => {
    const [products, setProducts] = useState([/* produtos mockados */]);
    const [subtotal, setSubtotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

    const updateQuantity = (id, quantity) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity } : product
        ));
        // Atualize os valores de subtotal e total conforme a mudança de quantidade.
    };

    const removeProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
        // Atualize os valores de subtotal e total após a remoção.
    };

    const calculateShipping = (cep) => {
        // Mock do cálculo do frete
        const shippingCost = 15.00;
        setShipping(shippingCost);
        setTotal(subtotal + shippingCost - discount);
    };

    return (
        <div className={styles.container}>
            <div className={styles.cartSection}>
                <div>
                    <ProductCard />
                </div>
                <ShippingCalculator calculateShipping={calculateShipping} />
            </div>
            <CheckoutSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
            />
        </div>
    );
};

export default CartPage;
