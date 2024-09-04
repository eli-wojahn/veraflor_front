'use client';
import React, { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.css';
import Image from 'next/image';
import { useContext } from 'react';
import { AdministradorContext } from '@/contexts/administrator';
import { ClienteContext } from '@/contexts/client';
import { CiSearch } from 'react-icons/ci';
import { IoExitOutline, IoCartOutline } from 'react-icons/io5';
import { FaBars, FaRegUser } from 'react-icons/fa';
import HeaderSmall from './HeaderSmall';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from 'js-cookie';

const MySwal = withReactContent(Swal);

const Header = () => {
    const pathname = usePathname();
    const { adminId, adminNome, mudaId, mudaNome } = useContext(AdministradorContext);
    const { clienteId, clienteNome, logout: clienteLogout } = useContext(ClienteContext); // Usando contexto do cliente
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false); // Gerenciando a tooltip
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const dropdownRef = useRef(null);

    function logoutAdmin() {
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

    const toggleTooltip = () => {
        setTooltipOpen(!tooltipOpen);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest(`.${styles.userContainer}`)) {
            setTooltipOpen(false); // Fecha a tooltip se clicar fora
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
                            <div className={styles.dropdownTitle} onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                <div className={styles.userContainer}>
                    {clienteId ? (
                        <div onClick={toggleTooltip} className={styles.userIconWrapper}>
                            <FaRegUser className={styles.userIcon} />
                            <p className={styles.userText}>Olá, {clienteNome}</p>
                            {tooltipOpen && (
                                <div className={styles.tooltip}>
                                    <div>Meus dados</div>
                                    <div className={styles.logoutLink} onClick={clienteLogout}>Sair</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/loginCliente" passHref>
                            <FaRegUser className={styles.userIcon} />
                            <p className={styles.userText}>Faça seu login</p>
                        </Link>
                    )}
                </div>
                <div className={styles.cartContainer}>
                    <Link href="/carrinho" passHref>
                        <IoCartOutline className={styles.cartIcon} />
                    </Link>
                </div>
                <div className={styles.logoutContainer}>
                    {adminNome && (
                        <div className={styles.logout}>
                            <span>{adminNome}{' '}</span>
                            <IoExitOutline onClick={logoutAdmin} className={styles.logoutIcon} />
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
