"use client";
import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { ClienteContext } from '@/contexts/client';
import styles from './CheckoutStatusPix.module.css';
import { useRouter } from 'next/navigation';
import ModalPix from './ModalPix';
import emailjs from 'emailjs-com';

const CheckoutStatusPix = () => {
  const { clienteId, clienteNome, clienteEmail } = useContext(ClienteContext);
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [statusAtualizado, setStatusAtualizado] = useState(false); 
  const [mensagemStatus, setMensagemStatus] = useState('');

  useEffect(() => {
    const buscarPedidos = async () => {
      if (clienteId) {
        try {
          // Buscar pedidos do cliente
          const responsePedidos = await fetch(`https://veraflor.onrender.com/pedidos/${clienteId}`);
          if (!responsePedidos.ok) {
            throw new Error('Erro ao buscar pedidos');
          }
          const dataPedidos = await responsePedidos.json();
          if (dataPedidos.length > 0) {
            const pedidosOrdenados = dataPedidos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  const enviarEmailConfirmacao = (statusPedido, mensagem) => {
    const templateParams = {
      nome: clienteNome,
      email: clienteEmail,
      numero_pedido: pedido.id,
      status_pedido: statusPedido,
      total_pedido: parseFloat(pedido.total).toFixed(2),
      mensagem: mensagem,
    };

    emailjs.send('service_70wxah2', 'template_ueeh8dp', templateParams, 'fV6_rIi2IBsbpVQt2')
      .then((response) => {
        console.log('E-mail enviado com sucesso!', response.status, response.text);
      }, (err) => {
        console.error('Erro ao enviar e-mail:', err);
      });
  };

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
          const novoStatus = updatedData.statusPedido;

          // Atualizar o pedido com o novo status
          const updatedPedido = { ...pedido, status: novoStatus };
          setPedido(updatedPedido);
          setStatusAtualizado(true); 
          setMostrarDetalhes(true); 

          // Definir a mensagem de status como variável local
          let mensagem = '';
          if (novoStatus === 'Pago') {
            mensagem = 'Seu pedido foi concluído, entre em contato com a loja para agendar a entrega ou a retirada.';
          } else if (novoStatus === 'Pendente' || novoStatus === 'Aguardando Pagamento') {
            mensagem = 'Seu pagamento ainda não foi confirmado. Por favor, aguarde a confirmação ou entre em contato com a loja para mais informações.';
          } else if (novoStatus === 'Cancelado') {
            mensagem = 'Seu pedido foi cancelado. Por favor, entre em contato com a loja para mais informações.';
          } else {
            mensagem = `Status do pedido: ${novoStatus}`;
          }

          // Enviar e-mail de confirmação com o status e a mensagem atualizados
          enviarEmailConfirmacao(novoStatus, mensagem);

          // Atualizar o estado da mensagem, se necessário
          setMensagemStatus(mensagem);

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
            <p>{mensagemStatus}</p>
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
