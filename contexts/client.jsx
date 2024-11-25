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
    const [profileComplete, setProfileComplete] = useState(null); // Novo estado
    const router = useRouter();

    useEffect(() => {
        const clienteCookie = Cookies.get('cliente_logado');
        if (clienteCookie) {
            const cliente = JSON.parse(clienteCookie);
            setClienteId(cliente.id);
            setClienteNome(cliente.nome);
            setProfileComplete(cliente.profileComplete); // Recupera profileComplete do cookie
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

                        // Verifica se o perfil está completo
                        const isProfileComplete = clienteData.cpf && clienteData.dataNasc && clienteData.area && clienteData.celular;
                        setProfileComplete(isProfileComplete);

                        // Atualiza o cookie
                        Cookies.set('cliente_logado', JSON.stringify({ id: clienteData.id, nome: clienteData.nome, profileComplete: isProfileComplete }), { expires: 7 });
                    } else {
                        console.error('Erro ao autenticar no backend');
                        setProfileComplete(false); // Define como falso se a autenticação falhar
                    }
                } catch (error) {
                    console.error('Erro ao autenticar no backend:', error);
                    setProfileComplete(false); // Define como falso em caso de erro
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
        setProfileComplete(null); // Limpa o estado de profileComplete
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