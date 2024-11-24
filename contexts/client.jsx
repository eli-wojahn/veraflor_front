// contexts/client.js

'use client';
import Cookies from 'js-cookie';
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const ClienteContext = createContext();

function ClienteProvider({ children }) {
    const { data: session, status } = useSession();
    const [clienteId, setClienteId] = useState(null);
    const [clienteNome, setClienteNome] = useState('');
    const [cartItemCount, setCartItemCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const clienteCookie = Cookies.get('cliente_logado');
        if (clienteCookie) {
            const cliente = JSON.parse(clienteCookie);
            setClienteId(cliente.id);
            setClienteNome(cliente.nome);
        }
    }, []);

    useEffect(() => {
        const authenticateBackend = async () => {
            if (status === 'authenticated' && session.user.email && !clienteId) {
                try {
                    const response = await fetch('https://veraflor.onrender.com/clienteLogin', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: session.user.email, senha: 'oauth' })
                    });

                    if (response.ok) {
                        const clienteData = await response.json();
                        mudaIdCliente(clienteData.id);
                        mudaNomeCliente(clienteData.nome);
                        Cookies.set('cliente_logado', JSON.stringify({ id: clienteData.id, nome: clienteData.nome }), { expires: 7 });
                    } else {
                        console.error('Erro ao autenticar no backend');
                    }
                } catch (error) {
                    console.error('Erro ao autenticar no backend:', error);
                }
            }
        };

        authenticateBackend();
    }, [status, session, clienteId]);

    function atualizarCartItemCount(count) {
        setCartItemCount(count);
    }

    function mudaIdCliente(id) {
        setClienteId(id);
        const clienteCookie = Cookies.get('cliente_logado');
        let clienteData = {};
        if (clienteCookie) {
            clienteData = JSON.parse(clienteCookie);
        }
        clienteData.id = id;
        Cookies.set('cliente_logado', JSON.stringify(clienteData), { expires: 7 });
    }

    function mudaNomeCliente(nome) {
        setClienteNome(nome);
        const clienteCookie = Cookies.get('cliente_logado');
        let clienteData = {};
        if (clienteCookie) {
            clienteData = JSON.parse(clienteCookie);
        }
        clienteData.nome = nome;
        Cookies.set('cliente_logado', JSON.stringify(clienteData), { expires: 7 });
    }

    function logout() {
        setClienteId(null);
        setClienteNome('');
        setCartItemCount(0);
        Cookies.remove('cliente_logado');
        router.push('/');
    }

    return (
        <ClienteContext.Provider value={{ clienteId, clienteNome, cartItemCount, mudaIdCliente, mudaNomeCliente, logout, atualizarCartItemCount }}>
            {children}
        </ClienteContext.Provider>
    );
}

export default ClienteProvider;
