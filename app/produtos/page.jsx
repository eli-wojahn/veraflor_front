'use client'
import React, { useState, useEffect } from 'react';
import styles from './produtos.module.css';
import { BsSliders } from 'react-icons/bs';
import ProductCard from './ProdutoCard';
import FilterMenu from './FilterMenu';
import InfoModal from './InfoModal';
import ProductModal from './ProductModal';
import CartModal from './CartModal';
import Pagination from '@mui/material/Pagination';

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
        maxPreco: 600
    });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false); // Estado para controlar o modal de carrinho
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const itemsPerPage = 15;

    useEffect(() => {
        const fetchAndFilterProducts = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ...filters,
                    page,
                    limit: itemsPerPage,
                });
                const url = `https://veraflor.onrender.com/produtos/filtro?${query.toString()}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Erro ao obter produtos');
                }
                const data = await response.json();
                const totalItems = parseInt(response.headers.get('X-Total-Count'), 10);
                const pages = Math.ceil(totalItems / itemsPerPage);
                setTotalPages(pages);
                setProductList(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilterProducts();
    }, [filters, page]);

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
        setShowCartModal(true); // Abrir o modal do carrinho
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
            maxPreco: 600
        });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

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
                        openCartModal={openCartModal} // Função para abrir o modal de carrinho
                    />
                ))}
            </div>
            {showInfoModal && selectedProduct && (
                <InfoModal product={selectedProduct} onClose={() => setShowInfoModal(false)} />
            )}
            {showProductModal && selectedProduct && (
                <ProductModal product={selectedProduct} onClose={() => setShowProductModal(false)} />
            )}
            {showCartModal && selectedProduct && (
                <CartModal product={selectedProduct} onClose={() => setShowCartModal(false)} /> // Modal de carrinho
            )}
            <div className={styles.paginationContainer}>
                {totalPages > 1 && (
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange} 
                    />
                )}
            </div>
        </div>
    );
};

export default ProductPage;
