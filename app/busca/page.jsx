'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './busca.module.css';
import ProductCard from '../produtos/ProdutoCard';
import InfoModal from '../produtos/InfoModal';
import ProductModal from '../produtos/ProductModal';
import CartModal from '../produtos/CartModal'; // Importe o CartModal

const BuscaContent = () => {
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);  // Estado para o carrinho

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

    const openInfoModal = (product) => {
        setSelectedProduct(product);
        setShowInfoModal(true);
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const openCartModal = (product) => {
        setSelectedProduct(product);
        setShowCartModal(true);  // Lógica para abrir o modal do carrinho
    };

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
                        <ProductCard
                            key={index}
                            product={product}
                            openPriceModal={openProductModal}
                            openInfoModal={openInfoModal}
                            openCartModal={openCartModal}  // Passe a função aqui
                        />
                    ))
                ) : (
                    <div className={styles.noResults}>
                        <p>NENHUM RESULTADO FOI ENCONTRADO PARA "{keyword}".</p>
                        <br />
                        <p>Por favor refaça a pesquisa.</p>
                    </div>
                )}
            </div>
            {showInfoModal && selectedProduct && (
                <InfoModal product={selectedProduct} onClose={() => setShowInfoModal(false)} />
            )}
            {showProductModal && selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setShowProductModal(false)} />
            )}
            {showCartModal && selectedProduct && (
                <CartModal product={selectedProduct} onClose={() => setShowCartModal(false)} />  // Modal de carrinho
            )}
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
