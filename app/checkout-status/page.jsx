"use client";
import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { ClienteContext } from '@/contexts/client';
import styles from './CheckoutStatus.module.css';
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import emailjs from 'emailjs-com';

const CheckoutStatus = () => {
  const { clienteId, clienteNome, clienteEmail } = useContext(ClienteContext);
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [statusAtualizado, setStatusAtualizado] = useState(false); 
  const [mensagemStatus, setMensagemStatus] = useState('');
  const [clienteEmailState, setClienteEmailState] = useState(clienteEmail); 

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

    const buscarEmailCliente = async () => {
      if (!clienteEmailState && clienteId) { 
        try {
          const response = await fetch('https://veraflor.onrender.com/clientes');
          if (!response.ok) {
            throw new Error('Erro ao buscar os clientes');
          }
          const data = await response.json();
          const clienteEncontrado = data.find(cliente => cliente.id === clienteId);
          if (clienteEncontrado) {
            setClienteEmailState(clienteEncontrado.email); 
          } else {
            console.error('Cliente não encontrado');
          }
        } catch (error) {
          console.error('Erro ao buscar o email do cliente:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao carregar email do cliente.',
          });
        }
      }
    };

    buscarPedidos();
    buscarEmailCliente(); 
  }, [clienteId, clienteEmailState]); 

  const enviarEmailConfirmacao = (statusPedido, mensagem, templateId) => {
    const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  
    if (!isEmailValid(clienteEmailState)) { 
      console.error('Email inválido:', clienteEmailState);
      return;
    }
  
    const templateParams = {
      nome: clienteNome,
      email: clienteEmailState, 
      numero_pedido: pedido.id,
      status_pedido: statusPedido,
      total_pedido: parseFloat(pedido.total).toFixed(2),
      mensagem: mensagem,
    };
  
    emailjs.send('service_70wxah2', templateId, templateParams, 'fV6_rIi2IBsbpVQt2')
      .then((response) => {
        console.log('E-mail enviado com sucesso!', response.status, response.text);
      })
      .catch((err) => {
        console.error('Erro ao enviar e-mail:', err);
      });
  };

  const handleAtualizarStatus = async () => {
    if (pedido && pedido.pagseguro_order_id) {
      try {
        const response = await fetch(
          `https://veraflor.onrender.com/atualizaStatus/${pedido.pagseguro_order_id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.ok) {
          const updatedData = await response.json();
          const novoStatus = updatedData.statusPedido;

          const updatedPedido = { ...pedido, status: novoStatus };
          setPedido(updatedPedido);
          setStatusAtualizado(true); 
          setMostrarDetalhes(true); 

          let mensagem = '';
          let templateId = '';

          if (novoStatus === 'Pago') {
            mensagem = 'Seu pedido foi concluído, entre em contato com a loja para agendar a entrega ou a retirada.';
            templateId = 'template_ueeh8dp'; 
          } else if (novoStatus === 'Recusado' || novoStatus === 'Cancelado' || novoStatus === 'Não Pago') {
            mensagem = 'Seu pedido não foi concluído por um problema no pagamento, por favor, verifique os dados do cartão informado, ou entre em contato com a loja para mais informações.';
            templateId = 'template_26haopq'; 
          } else {
            mensagem = `Status do pedido: ${novoStatus}`;
            templateId = 'template_ueeh8dp'; 
          }

          enviarEmailConfirmacao(novoStatus, mensagem, templateId);

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
        <Modal>
          <h2>Pedido Concluído!</h2>
          <p>Obrigado por sua compra.</p>
          <button className={styles.statusButton} onClick={handleAtualizarStatus}>
            Acompanhar Pedido
          </button>
        </Modal>
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

export default CheckoutStatus;
