'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';
import Image from 'next/image';
import { useContext, useState, useEffect, useRef } from 'react';
import { AdministradorContext } from '@/contexts/administrator';
import { CiSearch } from 'react-icons/ci';
import { IoExitOutline } from 'react-icons/io5';
import { FaBars } from 'react-icons/fa';
import HeaderSmall from './HeaderSmall';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Header = () => {
    const pathname = usePathname();
    const { adminId, adminNome, logout } = useContext(AdministradorContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const dropdownRef = useRef(null);

    function handleLogout() {
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
                logout();
            }
        });
    }

    const handleSearch = (event) => {
        if (event.key === 'Enter') {
            router.push(`/busca?keyword=${searchTerm}`);
        }
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isSmallScreen) {
        return <HeaderSmall />;
    }

    return (
        <header>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <Link href="/" passHref>
                        <Image
                            src="/images/logoCOR6.png"
                            alt="Logo"
                            width={170}
                            height={54}
                            layout="responsive"
                        />
                    </Link>
                </div>
                <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
                    <FaBars />
                </div>
                <div className={`${styles.menu} ${menuOpen ? styles.active : ''}`}>
                    <ul>
                        <li className={pathname === '/produtos' ? styles.active : ''}>
                            <Link href="/produtos" passHref>
                                <div>Produtos</div>
                            </Link>
                        </li>
                        <li className={styles.dropdown} ref={dropdownRef}>
                            <div className={styles.dropdownTitle} onClick={handleDropdownToggle}>
                                Lojas
                            </div>
                            {dropdownOpen && (
                                <ul className={styles.dropdownMenu}>
                                    <li className={pathname === '/pelotas' ? styles.active : ''}>
                                        <Link href="/pelotas" passHref>
                                            <div>Pelotas</div>
                                        </Link>
                                    </li>
                                    <li className={pathname === '/camaqua' ? styles.active : ''}>
                                        <Link href="/camaqua" passHref>
                                            <div>Camaquã</div>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className={pathname === '/destaques' ? styles.active : ''}>
                            <Link href="/destaques" passHref>
                                <div>Destaques</div>
                            </Link>
                        </li>
                        {adminId && (
                            <li className={pathname === '/cadastro' ? styles.active : ''}>
                                <Link href="/cadastro" passHref>
                                    <div>Cadastro</div>
                                </Link>
                            </li>
                        )}
                        {adminId && (
                            <li className={pathname === '/listagem' ? styles.active : ''}>
                                <Link href="/listagem" passHref>
                                    <div>Gerenciamento</div>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
                <div className={styles.searchBar}>
                    <div className={styles.searchIcon}>
                        <CiSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar"
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <div className={styles.logoutContainer}>
                    {adminNome !== '' && (
                        <div className={styles.logout}>
                            <span>{adminNome}{' '}</span>
                            <IoExitOutline onClick={handleLogout} className={styles.logoutIcon} />
                            <span className={styles.logoutTooltip}>Sair</span>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

const SearchPage = () => {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <Header />
        </Suspense>
    );
};

export default SearchPage;
