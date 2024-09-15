import React from 'react';
import styles from './CartStatus.module.css';
import Link from 'next/link';
import { BsCart2 } from "react-icons/bs";

const CartStatus = ({ loading, error, isEmpty, isLoggedIn }) => {
    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }

    if (!isLoggedIn) {
        return (
            <div className={styles.emptyCart}>
                <div className={styles.emptyCartIcon}><BsCart2 /></div>
                <h2>Você precisa estar logado para ver o carrinho</h2>
                <Link href="/loginCliente" className={styles.exploreButton} passHref>Faça login para acessar seus itens</Link>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className={styles.emptyCart}>
                <div className={styles.emptyCartIcon}><BsCart2 /></div>
                <h2>Seu carrinho está vazio</h2>
                <p>Que tal explorar nossos produtos em destaque?</p>
                <Link href="/produtos" className={styles.exploreButton} passHref>Explorar produtos</Link>
            </div>
        );
    }

    return null;
};

export default CartStatus;
