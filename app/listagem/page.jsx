'use client';
import React, { useState, useEffect } from 'react';
import styles from './listagem.module.css';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { TiPencil } from 'react-icons/ti';
import { BsTrash3 } from 'react-icons/bs';
import { PiPlantFill, PiPlantThin } from 'react-icons/pi';
import { IoBulbOutline } from "react-icons/io5";

const ProductListPage = () => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://veraflor.onrender.com/produtos');
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
    }, []);

    async function destaque(id, status_atual) {
        try {
            const response = await fetch(`https://veraflor.onrender.com/produtos/destaque/${id}`, {
                method: 'PATCH',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ destaque: !status_atual })
            });

            if (response.ok) {
                setProductList(prevList =>
                    prevList.map(product =>
                        product.id === id ? { ...product, destaque: !status_atual } : product
                    )
                );
            } else {
                Swal.fire('Erro!', `Erro ao atualizar destaque do produto. Status: ${response.status}`, 'error');
            }
        } catch (error) {
            Swal.fire('Erro!', `Erro ao fazer requisição: ${error}`, 'error');
        }
    }

    const handleDelete = (productId) => {
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
                fetch(`https://veraflor.onrender.com/produtos/${productId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (response.ok) {
                            setProductList(prevList => prevList.filter(product => product.id !== productId));
                            Swal.fire(
                                'Removido!',
                                'O produto foi removido com sucesso.',
                                'success'
                            );
                        } else {
                            Swal.fire(
                                'Erro!',
                                `Erro ao remover produto. Status: ${response.status}`,
                                'error'
                            );
                        }
                    })
                    .catch(error => {
                        Swal.fire(
                            'Erro!',
                            `Erro ao fazer requisição: ${error}`,
                            'error'
                        );
                    });
            }
        });
    };

    const handleEditDica = async (productId) => {
        try {
            const response = await fetch(`https://veraflor.onrender.com/dicas/produto/${productId}`);
            if (!response.ok) {
                throw new Error('Erro ao verificar dicas');
            }
            const data = await response.json();
            if (data.length > 0) {
                window.location.href = `/edit-dica/${productId}`;
            } else {
                Swal.fire({
                    title: 'Aviso!',
                    text: 'Esse produto não tem dicas.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao verificar dicas.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Manutenção de Produtos</div>
                <Link href="/cadastro" passHref>
                    <button className={styles.newProductButton}>Nova Planta</button>
                </Link>
            </div>
            <div className={styles.productListContainer}>
                <ul className={styles.productList}>
                    {productList.map((product, index) => (
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
        </div>
    );
};

export default ProductListPage;
