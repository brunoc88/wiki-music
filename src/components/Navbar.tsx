"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"


const NavBar = () => {
    const { data: session } = useSession()

    return (
        <nav className="container">
            <p className="logo">WikiMusic</p>
            <div className="user-logout">
                <ul>

                    {session?.user.id && <li>
                        <Link href={'/user/setting'}
                        >{session.user.name}</Link>

                    </li>}
                    {session?.user.id && <li>
                        <button onClick={() => signOut({ callbackUrl: "/auth/login" })}>LogOut</button>
                    </li>}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar