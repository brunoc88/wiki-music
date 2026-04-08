"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import styles from "./navbar.module.css"
import { useRouter } from "next/navigation"

const NavBar = () => {
    const { data: session } = useSession()
    const router = useRouter()

    return (
        <nav className={styles.navbar}>
            {session?.user.id && <p className={styles.logo}>WikiMusic</p>}
            <div className={styles["user-logout"]}>
                <ul>
                    {session?.user.id ? (
                        <div>
                            <li>
                                <Link href="/user/setting">
                                    {session.user.name}
                                </Link>
                            </li>
                            <li>
                                <button onClick={() => signOut({ callbackUrl: "/auth/login" })}>
                                    LogOut
                                </button>
                            </li>
                        </div>
                    ) : 
                    (
                        <div>
                            <button onClick={()=>{router.push('/auth/login')}}>LogIn</button>
                        </div>
                    )
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar