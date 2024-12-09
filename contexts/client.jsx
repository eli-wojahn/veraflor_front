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
    const [profileComplete, setProfileComplete] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const clienteCookie = Cookies.get('cliente_logado');
        if (clienteCookie) {
            const cliente = JSON.parse(clienteCookie);
            setClienteId(cliente.id);
            setClienteNome(cliente.nome);
            setProfileComplete(cliente.profileComplete);
        }
    }, []);

    useEffect(() => {
        const authenticateBackend = async () => {
            // Verifica se é login do google pela primeira vez
            // Caso status = 'authenticated' mas não tenha clienteId (ou seja, ainda não autenticou com backend)
            // Tentamos autenticar. Se der 400, significa que o cliente não existe no backend.
            if (status === 'authenticated' && session?.user?.email && !clienteId) {
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

                        const isProfileComplete = !!(clienteData.cpf && clienteData.dataNasc && clienteData.area && clienteData.celular);
                        setProfileComplete(isProfileComplete);
                        Cookies.set('cliente_logado', JSON.stringify({ id: clienteData.id, nome: clienteData.nome, profileComplete: isProfileComplete }), { expires: 7 });
                    } else if (response.status === 400) {
                        // Usuário não encontrado no backend
                        console.error('Usuário não encontrado no backend, redirecionando para /credenciamento-social');
                        setProfileComplete(false);
                        // Redireciona imediatamente para /credenciamento-social
                        router.push('/credenciamento-social');
                    } else {
                        console.error('Erro ao autenticar no backend');
                        setProfileComplete(false);
                        // Como houve erro, presumimos que não está completo, e redirecionamos para /credenciamento-social
                        router.push('/credenciamento-social');
                    }
                } catch (error) {
                    console.error('Erro ao autenticar no backend:', error);
                    setProfileComplete(false);
                    router.push('/credenciamento-social');
                }
            }
        };

        authenticateBackend();
    }, [status, session, clienteId, router]);

    function atualizarCartItemCount(count) {
        setCartItemCount(count);
    }

    function mudaIdCliente(id) {
        setClienteId(id);
        const clienteCookie = Cookies.get('cliente_logado');
        let clienteData = clienteCookie ? JSON.parse(clienteCookie) : {};
        clienteData.id = id;
        Cookies.set('cliente_logado', JSON.stringify(clienteData), { expires: 7 });
    }

    function mudaNomeCliente(nome) {
        setClienteNome(nome);
        const clienteCookie = Cookies.get('cliente_logado');
        let clienteData = clienteCookie ? JSON.parse(clienteCookie) : {};
        clienteData.nome = nome;
        Cookies.set('cliente_logado', JSON.stringify(clienteData), { expires: 7 });
    }

    function logout() {
        setClienteId(null);
        setClienteNome('');
        setCartItemCount(0);
        setProfileComplete(null);
        Cookies.remove('cliente_logado');
        router.push('/');
    }

    return (
        <ClienteContext.Provider value={{ clienteId, clienteNome, cartItemCount, mudaIdCliente, mudaNomeCliente, logout, atualizarCartItemCount, profileComplete, setProfileComplete }}>
            {children}
        </ClienteContext.Provider>
    );
}

export default ClienteProvider;
