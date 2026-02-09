"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

const NavBar = () => {
    const { data: session } = useSession()

    return (
        <nav>
            <>WikiMusic</>
            <ul>
                
                {session?.user.id && <li>
                    <Link href={'/user/setting'}
                    >{session.user.name}</Link>
                    
                </li>}
                {session?.user.id && <li>
                    <button onClick={() => signOut({ callbackUrl: "/auth/login" })}>LogOut</button>
                </li>}
            </ul>
        </nav>
    )
}

export default NavBar