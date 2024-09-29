'use client';
import React, { useState, useEffect } from 'react';
import styles from './listagem.module.css';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { withAuth } from '@/util/auth';
import Pagination from '@mui/material/Pagination';
import { TiPencil } from 'react-icons/ti';
import { BsTrash3 } from 'react-icons/bs';
import { PiPlantFill, PiPlantThin } from 'react-icons/pi';
import { IoBulbOutline } from "react-icons/io5";
import { BiPlusMedical } from "react-icons/bi";
import { GoArrowSwitch } from "react-icons/go";
import { useRouter } from 'next/navigation'; 

const ProductListPage = () => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;
    const [selectedStore, setSelectedStore] = useState('Pelotas');
    const router = useRouter(); 

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://veraflor.onrender.com/produtos/${selectedStore}`);
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

        fetchProducts();
    }, [selectedStore]);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const currentPageItems = productList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const toggleStore = () => {
        const newStore = selectedStore === 'Pelotas' ? 'Camaquã' : 'Pelotas';
        setSelectedStore(newStore);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você não poderá desfazer essa ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, remover!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://veraflor.onrender.com/produtos/${id}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        setProductList(prevList => prevList.filter(product => product.id !== id));
                        Swal.fire('Removido!', 'O produto foi removido com sucesso.', 'success');
                    } else {
                        Swal.fire('Erro!', 'Erro ao remover produto.', 'error');
                    }
                })
                .catch(error => {
                    Swal.fire('Erro!', `Erro ao fazer requisição: ${error}`, 'error');
                });
            }
        });
    };

    const destaque = async (id, currentDestaque) => {
        const newDestaque = !currentDestaque;
        try {
            const response = await fetch(`https://veraflor.onrender.com/produtos/destaque/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destaque: newDestaque })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar destaque');
            }

            setProductList(prevList => 
                prevList.map(product =>
                    product.id === id ? { ...product, destaque: newDestaque } : product
                )
            );
            Swal.fire('Sucesso!', 'O destaque foi atualizado.', 'success');
        } catch (error) {
            Swal.fire('Erro!', error.message, 'error');
        }
    };

    // Definição da função handleEditDica
    const handleEditDica = (id) => {
        router.push(`/edit-dica/${id}`);
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    Gerenciamento de Produtos - Loja: {selectedStore}
                    <button className={styles.filterButtonRosa} onClick={toggleStore}>
                        <GoArrowSwitch />
                    </button>
                </div>
                <Link href="/cadastro" passHref>
                    <button className={styles.newProductButton}><BiPlusMedical /> Novo produto </button>
                </Link>
            </div>
            <div className={styles.productListContainer}>
                <ul className={styles.productList}>
                    {currentPageItems.map((product, index) => (
                        <li key={product.id} className={index % 2 === 0 ? styles.even : styles.odd}>
                            <span style={product.destaque ? { fontWeight: 'bold' } : {}}>{product.descricao}</span>
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => destaque(product.id, product.destaque)}
                                >
                                    {product.destaque ? (
                                        <PiPlantFill className={styles.destaqueIconActive} />
                                    ) : (
                                        <PiPlantThin className={styles.destaqueIcon} />
                                    )}
                                    <span className={styles.tooltip}>Destacar</span>
                                </button>
                                <Link href={`/edit/${product.id}`} passHref>
                                    <button className={styles.iconButton}>
                                        <TiPencil className={styles.icon} />
                                        <span className={styles.tooltip}>Editar</span>
                                    </button>
                                </Link>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => handleEditDica(product.id)}
                                >
                                    <IoBulbOutline className={styles.icon} />
                                    <span className={styles.tooltip}>Editar Dica</span>
                                </button>
                                <button className={styles.iconButton} onClick={() => handleDelete(product.id)}>
                                    <BsTrash3 className={styles.icon} />
                                    <span className={styles.tooltip}>Remover</span>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.paginationContainer}>
                <Pagination
                    count={Math.ceil(productList.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                />
            </div>
        </div>
    );
};

export default withAuth(ProductListPage);
