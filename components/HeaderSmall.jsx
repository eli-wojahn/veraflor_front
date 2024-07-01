'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './HeaderSmall.module.css';
import Image from 'next/image';
import { useContext, useState, useEffect } from 'react';
import { AdministradorContext } from '@/contexts/administrator';
import { CiSearch } from 'react-icons/ci';
import { IoExitOutline } from 'react-icons/io5';
import { FaBars } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const HeaderSmall = () => {
    const pathname = usePathname();
    const { adminId, adminNome, mudaId, mudaNome } = useContext(AdministradorContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
            if (!event.target.closest(`.${styles.searchBarExpanded}`) && !event.target.closest(`.${styles.searchIcon}`)) {
                setSearchOpen(false);
            }
            if (!event.target.closest(`.${styles.dropdownContent}`) && !event.target.closest(`.${styles.dropdown}`)) {
                setDropdownOpen(false);
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
                    <div className={styles.logo}>
                        <Link href="/" passHref>
                            <Image
                                src="/images/logoCOR6.png"
                                alt="Logo"
                                width={165}
                                height={52}
                                layout="responsive"
                            />
                        </Link>
                    </div>
                    <div className={styles.topBar}>
                        <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
                            <FaBars />
                        </div>
                        <div className={styles.searchIcon} onClick={() => setSearchOpen(!searchOpen)}>
                            <CiSearch />
                        </div>
                        <div className={styles.logoutContainer}>
                            {adminNome !== '' && (
                                <div className={styles.logout}>
                                    <span>{adminNome}{' '}</span>
                                    <IoExitOutline onClick={logout} className={styles.logoutIcon} />
                                    <span className={styles.logoutTooltip}>Sair</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`${styles.menu} ${menuOpen ? styles.active : ''}`}>
                        <ul>
                            <li className={pathname === '/produtos' ? styles.active : ''}>
                                <Link href="/produtos" passHref>
                                    <div>Produtos</div>
                                </Link>
                            </li>
                            <li className={`${styles.dropdown} ${pathname === '/lojas' ? styles.active : ''}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <div>Lojas</div>
                                {dropdownOpen && (
                                    <div className={styles.dropdownContent}>
                                        <Link href="/pelotas" passHref>
                                            <div>Pelotas</div>
                                        </Link>
                                        <Link href="/camaqua" passHref>
                                            <div>Camaquã</div>
                                        </Link>
                                    </div>
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
                                        <div>Listagem</div>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    {searchOpen && (
                        <div className={styles.searchBarExpanded}>
                            <input
                                type="text"
                                placeholder="Buscar"
                                className={styles.searchInputExpanded}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    )}
                </nav>
            </header>
        </Suspense>
    );
};

export default HeaderSmall;