'use client'
import styles from './login.module.css';
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AdministradorContext } from '@/contexts/administrator';

export default function Login() {
    const { register, handleSubmit } = useForm()
    const { mudaId, mudaNome } = useContext(AdministradorContext)
    const router = useRouter()

    async function verificaLogin(data) {

        const response = await fetch('https://veraflor.onrender.com/login',
            {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email: data.email, senha: data.senha })
            },
        )

        if (response.status === 400 || response.status === 404) {
            Swal.fire('Ops...', 'E-mail ou senha inválidos', 'error');
        } else if (response.status === 200) {
            const administrador = await response.json()
            mudaId(administrador.id);
            mudaNome(administrador.nome);
            localStorage.setItem("admin_logado", JSON.stringify({ id: administrador.id, nome: administrador.nome }));
            router.push("/listagem");
        } else {
            Swal.fire('Erro', 'Algo deu errado, tente novamente mais tarde', 'error');
        }
    }

    return (
        <main>
            <div className={styles.page}>
                <form className={styles.formLogin} onSubmit={handleSubmit(verificaLogin)}>
                    <h1>Login Admin</h1>
                    <p>Digite os seus dados de acesso no campo abaixo.</p>
                    <label htmlFor="email">E-mail de Acesso:</label>
                    <input type="email" autoFocus id="email" placeholder="Email de acesso" required {...register("email")} className={styles.inputContainer} />
                    <label htmlFor="senha">Senha de Acesso:</label>
                    <input type="password" id="senha" placeholder="Senha" required {...register("senha")} className={styles.inputContainer} />
                    <input type="submit" value="Entrar" className={styles.btn} />
                </form>
            </div>
        </main>
    )
}