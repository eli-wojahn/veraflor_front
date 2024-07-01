'use client'
import React, { useState, useEffect } from 'react';
import styles from './destaques.module.css';

const DestaquesPage = () => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3004/produtos/destaque');
                if (!response.ok) {
                    throw new Error('Erro ao obter produtos');
                }
                const data = await response.json();
                setProductList(data || []);
            } catch (error) {
                setError(error.message);
                setProductList([]); // Garantir que productList seja um array no caso de erro
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Destaques do mês</div>
            </div>
            <div className={styles.cardContainer}>
                {Array.isArray(productList) && productList.length > 0 ? (
                    productList.map((product, index) => (
                        <div key={index} className={styles.card}>
                            <img src={`http://localhost:3004/public/upload/${product.imagem}`} alt={product.descricao} className={styles.image} />
                            <h2 className={styles.name}>{product.descricao}</h2>
                            <div className={styles.buttons}>
                                <button className={styles.button}>R$ {product.preco}</button>
                                <button className={styles.button}>@</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum produto em destaque encontrado</p>
                )}
            </div>
        </div>
    );
};

export default DestaquesPage;
