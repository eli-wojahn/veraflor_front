// components/ProductPage.js
'use client'
import React, { useState, useEffect } from 'react';
import styles from './produtos.module.css';
import { BsSliders } from 'react-icons/bs';
import ProductCard from './ProdutoCard';
import FilterMenu from './FilterMenu';
import InfoModal from './InfoModal';
import ProductModal from './ProductModal';

const ProductPage = () => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        ambiente: [],
        tamanho: [],
        tipo: [],
        categoria: [],
        maxPreco: 1000
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {
        const fetchAndFilterProducts = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams();
                Object.keys(filters).forEach(key => {
                    if (filters[key].length > 0 || key === 'maxPreco') {
                        query.append(key, filters[key]);
                    }
                });
                const url = query.toString() ? `http://localhost:3004/produtos/filtro?${query.toString()}` : 'http://localhost:3004/produtos';
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Erro ao obter produtos');
                }
                const data = await response.json();
                setProductList(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilterProducts();
    }, [filters]);

    const openInfoModal = (product) => {
        setSelectedProduct(product);
        setShowInfoModal(true);
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => {
            if (name === 'maxPreco') {
                return { ...prevFilters, maxPreco: value };
            }
            const newValues = prevFilters[name].includes(value)
                ? prevFilters[name].filter(item => item !== value)
                : [...prevFilters[name], value];
            return {
                ...prevFilters,
                [name]: newValues
            };
        });
    };

    const clearFilters = () => {
        setFilters({
            ambiente: [],
            tamanho: [],
            tipo: [],
            categoria: [],
            maxPreco: 1000
        });
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Produtos</div>
                <button className={styles.filterButton} onClick={toggleFilters}>Filtrar <BsSliders /></button>
            </div>
            {showFilters && (
                <FilterMenu filters={filters} handleFilterChange={handleFilterChange} clearFilters={clearFilters} />
            )}
            <div className={styles.cardContainer}>
                {productList.map((product, index) => (
                    <ProductCard
                        key={index}
                        product={product}
                        openPriceModal={openProductModal}
                        openInfoModal={openInfoModal}
                    />
                ))}
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

export default ProductPage;
