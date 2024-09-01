'use client'
import Cookies from 'js-cookie';
import { createContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export const ClienteContext = createContext();

function ClienteProvider({ children }) {
    const [clienteId, setClienteId] = useState(null);
    const [clienteNome, setClienteNome] = useState("");
    const router = useRouter();

    useEffect(() => {
        const clienteCookie = Cookies.get('cliente_logado');
        if (clienteCookie) {
            const cliente = JSON.parse(clienteCookie);
            setClienteId(cliente.id);
            setClienteNome(cliente.nome);
        }
    }, []);

    function mudaIdCliente(id) {
        setClienteId(id);
        Cookies.set('cliente_logado', JSON.stringify({ id, nome: clienteNome }), { expires: 7 });
    }

    function mudaNomeCliente(nome) {
        setClienteNome(nome);
        const clienteCookie = Cookies.get('cliente_logado');
        if (clienteCookie) {
            const cliente = JSON.parse(clienteCookie);
            Cookies.set('cliente_logado', JSON.stringify({ ...cliente, nome }));
        }
    }

    function logout() {
        setClienteId(null);
        setClienteNome('');
        Cookies.remove('cliente_logado');
        router.push('/');
    }

    return (
        <ClienteContext.Provider value={{ clienteId, clienteNome, mudaIdCliente, mudaNomeCliente, logout }}>
            {children}
        </ClienteContext.Provider>
    );
}

export default ClienteProvider;