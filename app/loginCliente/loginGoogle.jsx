'use client'
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';  
import { FcGoogle } from 'react-icons/fc'; 
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
            <FcGoogle size={24} style={{ marginRight: '10px' }} /> 
            Login com Google
        </button>
    );
}
