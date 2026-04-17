"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import styles from "./navbar.module.css"
import { useRouter } from "next/navigation"

const NavBar = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const isAdmin = ["admin", "super"].includes(session?.user?.rol)

    return (
        <nav className={styles.navbar}>
            <div className={styles.leftSection}>
                <Link className={styles.logo} href="/home">
                    WikiMusic
                </Link>

                <ul className={styles.menu}>
                    <li>
                        <Link href="/artists">Artistas</Link>
                    </li>

                    <li>
                        <Link href="/album/index">Albums</Link>
                    </li>

                    {isAdmin && (
                        <li>
                            <Link href="/genres">Géneros</Link>
                        </li>
                    )}
                </ul>
            </div>

            <div className={styles.userLogout}>
                <ul>
                    {session?.user?.id ? (
                        <>
                            <li>
                                <Link href="/user/setting">
                                    {session.user.name}
                                </Link>
                            </li>

                            <li>|</li>

                            <li>
                                <button
                                    onClick={() =>
                                        signOut({
                                            callbackUrl: "/auth/login",
                                        })
                                    }
                                >
                                    salir
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button
                                onClick={() =>
                                    router.push("/auth/login")
                                }
                            >
                                LogIn
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar