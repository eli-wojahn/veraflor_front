"use client";
import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { ClienteContext } from '@/contexts/client';
import styles from './CheckoutStatusPix.module.css';
import { useRouter } from 'next/navigation';
import ModalPix from './ModalPix';

const CheckoutStatusPix = () => {
  const { clienteId } = useContext(ClienteContext);
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [statusAtualizado, setStatusAtualizado] = useState(false); 

  useEffect(() => {
    const buscarPedidos = async () => {
      if (clienteId) {
        try {
          const response = await fetch(`https://veraflor.onrender.com/pedidos/${clienteId}`);
          if (!response.ok) {
            throw new Error('Erro ao buscar pedidos');
          }
          const data = await response.json();
          if (data.length > 0) {
            const pedidosOrdenados = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const ultimoPedido = pedidosOrdenados[0];
            setPedido(ultimoPedido);
          } else {
            setPedido(null);
          }
        } catch (error) {
          console.error('Erro ao carregar pedidos:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao carregar pedidos.',
          });
        } finally {
          setCarregando(false);
        }
      }
    };

    buscarPedidos();
  }, [clienteId]);

  const handleAtualizarStatus = async () => {
    if (pedido && pedido.pagseguro_order_id) {
      try {
        const response = await fetch(
          `https://veraflor.onrender.com/atualizaPix/${pedido.pagseguro_order_id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.ok) {
          const updatedData = await response.json();
          setPedido((prev) => ({ ...prev, status: updatedData.statusPedido }));
          setStatusAtualizado(true); 
          setMostrarDetalhes(true); 
        } else {
          const errorData = await response.json();
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar o status',
            text: errorData.message || 'Ocorreu um erro ao atualizar o status.',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error('Erro ao atualizar o status:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao atualizar o status',
          text: 'Ocorreu um erro ao atualizar o status.',
          confirmButtonText: 'OK',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Pedido não encontrado',
        text: 'Não foi possível encontrar o pedido para atualizar o status.',
        confirmButtonText: 'OK',
      });
    }
  };

  if (carregando) {
    return <p className={styles.loading}>Carregando...</p>;
  }

  if (!pedido) {
    return <p className={styles.errorMessage}>Pedido não encontrado.</p>;
  }

  return (
    <div className={styles.container}>
      {!statusAtualizado && (
        <ModalPix>
          <h2>Pedido Concluído!</h2>
          <button className={styles.statusButton} onClick={handleAtualizarStatus}>
            Acompanhar Pedido
          </button>
        </ModalPix>
      )}
      {mostrarDetalhes && (
        <div className={styles.statusContainer}>
          <div className={styles.statusHeader}>
            <h2>Detalhes do Pedido</h2>
          </div>
          <div className={styles.orderDetails}>
            <p><strong>Nº do Pedido:</strong> {pedido.id}</p>
            <p><strong>Status:</strong> {pedido.status}</p>
            <p><strong>Total:</strong> R$ {parseFloat(pedido.total).toFixed(2)}</p>
          </div>
          <button className={styles.statusButton} onClick={() => router.push('/produtos')}>
            Encontrar mais produtos
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutStatusPix;