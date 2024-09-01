'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './HeaderSmall.module.css';
import Image from 'next/image';
import { useContext, useState, useEffect } from 'react';
import { AdministradorContext } from '@/contexts/administrator';
import { CiSearch } from 'react-icons/ci';
import { IoCartOutline } from 'react-icons/io5';
import { FaBars, FaRegUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from 'js-cookie';

const MySwal = withReactContent(Swal);

const HeaderSmall = () => {
    const pathname = usePathname();
    const { adminId, adminNome, mudaId, mudaNome } = useContext(AdministradorContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter(); 

    function logout() {
        MySwal.fire({
            title: 'Confirma saída do sistema?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: styles.confirmButton,
            },
        }).then((result) => {
            if (result.isConfirmed) {
                mudaId(null);
                mudaNome('');
                Cookies.remove('admin_logado');
                router.push('/');
            }
        });
    }

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            router.push(`/busca?keyword=${searchTerm}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(`.${styles.menu}`) && !event.target.closest(`.${styles.menuIcon}`)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <header>
                <nav className={styles.navbar}>
                    <div className={styles.topBar}>
                        <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
                            <FaBars />
                        </div>
                        <div className={styles.logo}>
                            <Link href="/" passHref>
                                <Image
                                    src="/images/logoCOR6.png"
                                    alt="Logo"
                                    width={100}
                                    height={46}
                                />
                            </Link>
                        </div>
                        <div className={styles.icons}>
                            <FaRegUser className={styles.icon} onClick={() => router.push('/login')} />
                            <IoCartOutline className={styles.icon} onClick={() => router.push('/carrinho')} />
                        </div>
                    </div>
                    <div className={styles.searchBarExpanded}>
                        <input
                            type="text"
                            placeholder="Buscar"
                            className={styles.searchInputExpanded}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <CiSearch className={styles.searchIcon} />
                    </div>
                </nav>
                <div className={`${styles.menu} ${menuOpen ? styles.active : ''}`}>
                    <ul>
                        <li className={pathname === '/produtos' ? styles.active : ''}>
                            <Link href="/produtos" passHref>
                                <div>Produtos</div>
                            </Link>
                        </li>
                        <li className={`${styles.dropdown} ${pathname === '/lojas' ? styles.active : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
                            <div>Lojas</div>
                        </li>
                        <li className={pathname === '/destaques' ? styles.active : ''}>
                            <Link href="/destaques" passHref>
                                <div>Destaques</div>
                            </Link>
                        </li>
                        {adminId && (
                            <li className={pathname === '/listagem' ? styles.active : ''}>
                                <Link href="/listagem" passHref>
                                    <div>Gerenciamento</div>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </header>
        </Suspense>
    );
};

export default HeaderSmall;
