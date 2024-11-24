'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Content from "../components/Content.jsx";

const Home = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            const profileComplete = localStorage.getItem('profileComplete');
            if (!profileComplete) {
                router.push('/credenciamento-social');
            }
        }
    }, [status]);

    return (
        <div>
            <Content />
        </div>
    );
};

export default Home;
