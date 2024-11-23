'use client';
import React, { useState, useEffect } from 'react';
import styles from './produtos.module.css';
import { BsSliders } from 'react-icons/bs';
import { GoArrowSwitch } from "react-icons/go";
import ProductCard from './ProdutoCard';
import FilterMenu from './FilterMenu';
import InfoModal from './InfoModal';
import ProductModal from './ProductModal';
import CartModal from './CartModal';
import Pagination from '@mui/material/Pagination';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

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
    const [activeModal, setActiveModal] = useState(null); 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 15;
    const [selectedStore, setSelectedStore] = useState('Pelotas');

    useEffect(() => {
        const storedStore = Cookies.get('selected_store');
        if (storedStore) {
            setSelectedStore(storedStore);
        } else {
            openStoreSelectionModal();
        }
    }, []);

    useEffect(() => {
        const fetchAndFilterProducts = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    ...filters,
                    page,
                    limit: itemsPerPage,
                });
                const url = `https://veraflor.onrender.com/produtos/${selectedStore}/filtro?${query.toString()}`;
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
    }, [filters, page, selectedStore]);

    const openStoreSelectionModal = () => {
        Swal.fire({
            title: 'Selecione uma loja',
            html: `
                <div class="${styles.cardsContainer}">
                    <div class="${styles.cardCidade}">
                        <img src="/images/pelotas.png" alt="Pelotas" />
                        <button class="${styles.button}" id="pelotas">Pelotas</button>
                    </div>
                    <div class="${styles.cardCidade}">
                        <img src="/images/camaqua.jpg" alt="Camaquã" />
                        <button class="${styles.button}" id="camaqua">Camaquã</button>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: {
                popup: styles.customSwalPopup,
                container: styles.customSwalContainer,
            },
            didOpen: () => {
                const pelotasButton = document.getElementById('pelotas');
                const camaquaButton = document.getElementById('camaqua');

                pelotasButton.onclick = () => {
                    setSelectedStore('Pelotas');
                    Cookies.set('selected_store', 'Pelotas', { expires: 7 });
                    Swal.close();
                };

                camaquaButton.onclick = () => {
                    setSelectedStore('Camaquã');
                    Cookies.set('selected_store', 'Camaquã', { expires: 7 });
                    Swal.close();
                };
            }
        });
    };

    const toggleStore = () => {
        const newStore = selectedStore === 'Pelotas' ? 'Camaquã' : 'Pelotas';
        setSelectedStore(newStore);
        Cookies.set('selected_store', newStore, { expires: 7 });
    };

    const openInfoModal = (product) => {
        setSelectedProduct(product);
        setActiveModal('info');
    };

    const openCartModal = (product) => {
        setSelectedProduct(product);
        setActiveModal('cart');
    };

    const openPriceModal = (product) => {
        setSelectedProduct(product);
        setActiveModal('price');
    };

    const closeModal = () => {
        setActiveModal(null);
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
                <div className={styles.title}>
                    Você está acessando produtos da loja {selectedStore}
                    <button className={styles.filterButtonRosa} onClick={toggleStore}>
                        <GoArrowSwitch />
                    </button>
                </div>
                <button className={styles.filterButton} onClick={toggleFilters}>
                    Filtrar <BsSliders />
                </button>
            </div>
            {showFilters && (
                <FilterMenu filters={filters} handleFilterChange={handleFilterChange} clearFilters={clearFilters} />
            )}
            <div className={styles.cardContainer}>
                {productList.map((product, index) => (
                    <ProductCard
                        key={index}
                        product={product}
                        openPriceModal={openPriceModal}
                        openInfoModal={openInfoModal}
                        openCartModal={openCartModal}
                    />
                ))}
            </div>
            {activeModal === 'info' && selectedProduct && (
                <InfoModal product={selectedProduct} onClose={closeModal} />
            )}
            {activeModal === 'cart' && selectedProduct && (
                <CartModal product={selectedProduct} onClose={closeModal} />
            )}
            {activeModal === 'price' && selectedProduct && (
                <ProductModal product={selectedProduct} onClose={closeModal} />
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
