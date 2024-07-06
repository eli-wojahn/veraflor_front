'use client'
import Cookies from 'js-cookie';
import { createContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export const AdministradorContext = createContext();

function AdministradorProvider({ children }) {
    const [adminId, setAdminId] = useState(null);
    const [adminNome, setAdminNome] = useState("");
    const router = useRouter();

    useEffect(() => {
        const administradorCookie = Cookies.get('admin_logado');
        if (administradorCookie) {
            const administrador = JSON.parse(administradorCookie);
            setAdminId(administrador.id);
            setAdminNome(administrador.nome);
        }
    }, []);

    function mudaId(id) {
        setAdminId(id);
        Cookies.set('admin_logado', JSON.stringify({ id, nome: adminNome }), { expires: 7 });
    }

    function mudaNome(nome) {
        setAdminNome(nome);
        const administradorCookie = Cookies.get('admin_logado');
        if (administradorCookie) {
            const administrador = JSON.parse(administradorCookie);
            Cookies.set('admin_logado', JSON.stringify({ ...administrador, nome }));
        }
    }

    function logout() {
        setAdminId(null);
        setAdminNome('');
        Cookies.remove('admin_logado');
        router.push('/');
    }

    return (
        <AdministradorContext.Provider value={{ adminId, adminNome, mudaId, mudaNome, logout }}>
            {children}
        </AdministradorContext.Provider>
    );
}

export default AdministradorProvider;
