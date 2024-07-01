'use client'
import Cookies from 'js-cookie';

import { createContext, useState, useEffect } from "react";

export const AdministradorContext = createContext();

function AdministradorProvider({ children }) {
    const [adminId, setAdminId] = useState(null);
    const [adminNome, setAdminNome] = useState("");

    // Verifica se há um cookie de admin_logado
    useEffect(() => {
        const administradorCookie = Cookies.get('admin_logado');
        if (administradorCookie) {
            const administrador = JSON.parse(administradorCookie);
            setAdminId(administrador.id);
            setAdminNome(administrador.nome);
        }
    }, []); // executa apenas uma vez no início

    function mudaId(id) {
        // Atualiza o estado e cria ou atualiza o cookie
        setAdminId(id);
        Cookies.set('admin_logado', JSON.stringify({ id }), { expires: 7 }); // Cookie expira em 7 dias
    }

    function mudaNome(nome) {
        // Atualiza o estado e atualiza o cookie
        setAdminNome(nome);
        const administradorCookie = Cookies.get('admin_logado');
        if (administradorCookie) {
            const administrador = JSON.parse(administradorCookie);
            Cookies.set('admin_logado', JSON.stringify({ ...administrador, nome }));
        }
    }

    return (
        <AdministradorContext.Provider value={{ adminId, adminNome, mudaId, mudaNome }}>
            {children}
        </AdministradorContext.Provider>
    );
}

export default AdministradorProvider;
