'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useContext } from 'react';
import Content from "../components/Content.jsx";
import { ClienteContext } from '@/contexts/client';

const Home = () => {
    const router = useRouter();
    const { profileComplete } = useContext(ClienteContext);

    useEffect(() => {
        if (profileComplete === false) {
            router.push('/credenciamento-social');
        }
    }, [profileComplete]);

    return (
        <div>
            <Content />
        </div>
    );
};

export default Home;
