'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './busca.module.css';

const BuscaContent = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Keyword:', keyword);
        if (!keyword) {
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            try {
                const response = await fetch(`https://veraflor.onrender.com/produtos/busca?search=${keyword}`);
                if (!response.ok) {
                    throw new Error('Erro ao obter produtos');
                }
                const data = await response.json();
                console.log('Data:', data);
                setProductList(data);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Resultados da busca para "{keyword}"</div>
            </div>
            <div className={styles.cardContainer}>
                {Array.isArray(productList) && productList.length > 0 ? (
                    productList.map((product, index) => (
                        <div key={index} className={styles.card}>
                            <img
                                src={`https://veraflor.onrender.com/public/upload/${product.imagem}`}
                                alt={product.descricao}
                                className={styles.image}
                            />
                            <h2 className={styles.name}>{product.descricao}</h2>
                            <div className={styles.buttons}>
                                <button className={styles.button}>R$ {product.preco}</button>
                                <button className={styles.button}>@</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.noResults}>
                        <p>NENHUM RESULTADO FOI ENCONTRADO PARA "{keyword}".</p>
                        <br></br>
                        <p>Por favor refaça a pesquisa.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const BuscaPage = () => {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <BuscaContent />
        </Suspense>
    );
};

export default BuscaPage;
