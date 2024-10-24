// app/lista-pedidos/ListaPedidos.jsx

'use client';

import React, { useEffect, useState } from 'react';
import styles from './listaPedidos.module.css';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/util/auth';
import Pagination from '@mui/material/Pagination';

const ListaPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clientesMap, setClientesMap] = useState({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch('https://veraflor.onrender.com/pedidos/listar');
                if (!response.ok) {
                    throw new Error('Erro ao buscar pedidos');
                }
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
            }
        };

        const fetchClientes = async () => {
            try {
                const response = await fetch('https://veraflor.onrender.com/clientes');
                if (!response.ok) {
                    throw new Error('Erro ao buscar clientes');
                }
                const data = await response.json();
                setClientes(data);
                const map = {};
                data.forEach(cliente => {
                    map[cliente.id] = cliente.nome;
                });
                setClientesMap(map);
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchPedidos(), fetchClientes()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const currentPageItems = pedidos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Lista de Pedidos</div>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>N° Pedido</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Forma de Pagamento</th>
                            <th>Entregue</th>
                            <th>Forma de Entrega</th>
                            <th>Data de Criação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageItems.map((pedido) => (
                            <tr
                                key={pedido.id}
                                onClick={() => router.push(`/pedido/${pedido.id}`)}
                                className={styles.tableRow}
                            >
                                <td>{pedido.id}</td>
                                <td>{clientesMap[pedido.cliente_id] || 'N/A'}</td>
                                <td>
                                    {new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }).format(pedido.total)}
                                </td>
                                <td>{pedido.forma_pagamento}</td>
                                <td>{pedido.entregue ? 'Sim' : 'Não'}</td>
                                <td>{pedido.forma_entrega}</td>
                                <td>{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.paginationContainer}>
                <Pagination
                    count={Math.ceil(pedidos.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                />
            </div>
        </div>
    );
};

export default withAuth(ListaPedidos);
