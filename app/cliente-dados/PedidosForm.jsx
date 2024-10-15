import React from 'react';
import styles from './PedidosForm.module.css';

const PedidosForm = ({ pedidos }) => {
    return (
        <div className={styles.content}>
            <h1>Meus Pedidos</h1>
            {pedidos.length === 0 ? (
                <p>Você ainda não tem pedidos.</p>
            ) : (
                <div className={styles.pedidosList}>
                    {pedidos.map(pedido => (
                        <div key={pedido.id} className={styles.pedidoItem}>
                            <p><strong>Nº do Pedido:</strong> {pedido.id}</p>
                            <p><strong>Data:</strong> {new Date(pedido.createdAt).toLocaleDateString()}</p>
                            <p><strong>Forma de Pagamento:</strong> {pedido.forma_pagamento}</p>
                            <p className={pedido.status.toLowerCase() === 'pago' ? styles.statusPago : styles.statusCancelado}>
                                <strong>Status:</strong> {pedido.status}</p>
                            <p><strong>Total:</strong> R$ {pedido.total}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PedidosForm;
