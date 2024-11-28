'use client'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';  
import styles from './loginGoogle.module.css';

export default function GoogleLogin() {
    const router = useRouter();  

    const googleLogin = async () => {
        const result = await signIn('google', { redirect: false });
        if (result?.ok) {
            router.push('/');  
        } else {
            console.log('Erro no login com Google');
        }
    };

    return (
        <button
            className={styles.googleLoginBtn} 
            type="button"
            onClick={googleLogin} 
        >
            <i className="bi bi-google"></i>{"  "}Login com Google
        </button>
    );
}
