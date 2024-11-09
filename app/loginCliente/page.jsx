'use client'
import styles from './loginCliente.module.css';
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';

import { ClienteContext } from '@/contexts/client';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';  
export default function Login() {
    const { register, handleSubmit } = useForm()
    const { mudaIdCliente, mudaNomeCliente } = useContext(ClienteContext)
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState)
    }

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
                    <div className={styles.passwordWrapper}>
                        <input 
                            type={showPassword ? 'text' : 'password'} // Alterna entre mostrar e esconder
                            id="senha" 
                            placeholder="Senha" 
                            required 
                            {...register("senha")} 
                            className={styles.inputContainer} 
                        />
                        <span 
                            className={styles.eyeIcon} 
                            onClick={togglePasswordVisibility} // Alterna a visibilidade ao clicar
                        >
                            {showPassword ? <VscEyeClosed /> : <VscEye />}
                        </span>
                    </div>
                    <input type="submit" value="Entrar" className={styles.btn} />
                    <br />
                    <p>Não tem cadastro?</p>
                    <Link href="/credenciamento" passHref>
                        <button className={styles.buttonSecondary}>Cadastre-se</button>
                    </Link>
                </form>
            </div>
        </main>
    )
}
