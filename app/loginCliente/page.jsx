'use client'
import styles from './loginCliente.module.css';
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

import { ClienteContext } from '@/contexts/client';

export default function Login() {
    const { register, handleSubmit } = useForm()
    const { mudaIdCliente, mudaNomeCliente } = useContext(ClienteContext)
    const router = useRouter()

    async function verificaLogin(data) {

        const response = await fetch('https://veraflor.onrender.com/clienteLogin',
            {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ email: data.email, senha: data.senha })
            },
        )

        if (response.status === 400 || response.status === 404) {
            Swal.fire('', 'E-mail ou senha inválidos', 'warning');
        } else if (response.status === 200) {
            const cliente = await response.json()
            mudaIdCliente(cliente.id);
            mudaNomeCliente(cliente.nome);
            localStorage.setItem("cliente_logado", JSON.stringify({ id: cliente.id, nome: cliente.nome }));
            router.push("/");
        } else {
            Swal.fire('Erro', 'Algo deu errado, tente novamente mais tarde', 'error');
        }
    }

    return (
        <main>
            <div className={styles.page}>
                <form className={styles.formLogin} onSubmit={handleSubmit(verificaLogin)}>
                    <h1>Login</h1>
                    <p>Digite os seus dados de acesso no campo abaixo.</p>
                    <label htmlFor="email">E-mail de Acesso:</label>
                    <input type="email" autoFocus id="email" placeholder="Email de acesso" required {...register("email")} className={styles.inputContainer} />
                    <label htmlFor="senha">Senha de Acesso:</label>
                    <input type="password" id="senha" placeholder="Senha" required {...register("senha")} className={styles.inputContainer} />
                    <input type="submit" value="Entrar" className={styles.btn} />
                    <br></br>

                    <p>Não tem cadastro?</p>
                    <Link href="/credenciamento" passHref>
                        <button className={styles.buttonSecondary}>Cadastre-se</button>
                    </Link>
                </form>
            </div>
        </main>
    )
}