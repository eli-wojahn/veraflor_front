'use client'
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Importar a biblioteca de cookies
import styles from './destaques.module.css';
import ProductCard from '../produtos/ProdutoCard';
import InfoModal from '../produtos/InfoModal';
import ProductModal from '../produtos/ProductModal';

const DestaquesPage = () => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://veraflor.onrender.com/produtos/destaque');
                if (!response.ok) {
                    throw new Error('Erro ao obter produtos');
                }
                const data = await response.json();
                
                // Obter a loja selecionada do cookie
                const selectedStore = Cookies.get('selected_store');
                
                // Filtrar produtos pela loja selecionada
                const filteredProducts = data.filter(product => product.loja === selectedStore);
                setProductList(filteredProducts || []);
            } catch (error) {
                setError(error.message);
                setProductList([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const openInfoModal = (product) => {
        setSelectedProduct(product);
        setShowInfoModal(true);
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    // Obter a loja selecionada do cookie para o título
    const selectedStore = Cookies.get('selected_store') || 'Loja';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Destaques do mês - {selectedStore}</div>
            </div>
            <div className={styles.cardContainer}>
                {Array.isArray(productList) && productList.length > 0 ? (
                    productList.map((product, index) => (
                        <ProductCard
                            key={index}
                            product={product}
                            openPriceModal={openProductModal}
                            openInfoModal={openInfoModal}
                        />
                    ))
                ) : (
                    <p>Nenhum produto em destaque encontrado</p>
                )}
            </div>
            {showInfoModal && selectedProduct && (
                <InfoModal product={selectedProduct} onClose={() => setShowInfoModal(false)} />
            )}
            {showProductModal && selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setShowProductModal(false)} />
            )}
        </div>
    );
};

export default DestaquesPage;
