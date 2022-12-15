import { PlusIcon } from '@heroicons/react/24/solid';
import { useScroll } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MobileNavDrawer from './MobileNavDrawer';

export type LinkType = {
    name: string;
    url: string;
}
const links: LinkType[] = [
    {
        name: 'Home',
        url: '/',
    },
    {
        name: 'Blog',
        url: '/blog',
    },
]
type CustomNavProps = {
    initColor?: string;
    textColor?: string;
}
const CustomNav = ({ textColor, initColor }: CustomNavProps) => {
    const { status } = useSession()
    const router = useRouter()
    const logobutton = <Link href="/" className="btn btn-ghost text-xl tracking-tighter uppercase font-extrabold -ml-4 whitespace-nowrap">AMOR MY DECOR</Link>
    const [scrollPosition, setScrollPosition] = useState<number>(0)

    useEffect(() => {
        const listenToScroll = () => {
            const winScroll =
                document.body.scrollTop || document.documentElement.scrollTop

            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight

            const scrolled = winScroll / height

            setScrollPosition(scrolled)
        }
        window.addEventListener('scroll', listenToScroll)
    }, [])
    const { scrollYProgress } = useScroll({
        offset: ["end end", "start start"]
    });
    return (
        <>
            <div className={`navbar fixed z-[100] px-10 duration-150 ${scrollPosition > 0.05 ? `backdrop-blur-md bg-base-100/20 border-neutral-content/30 h-[63.5px] bg-gray-800/50 text-white ${textColor}` : `border-transparent py-5 ${initColor}`}`}>
                {scrollPosition > 0.05 && (
                    <>
                        <div
                            className={`w-full absolute -bottom-0 left-0 h-[1.5px] bg-neutral-content/30`}
                        ></div>
                        <div
                            style={{ width: (100 - scrollYProgress.get() * 100) + "%" }}
                            className={`absolute -bottom-0 left-0 h-[1.5px] bg-primary`}
                        ></div>
                    </>
                )}
                <div className="navbar-start block lg:hidden">
                    <MobileNavDrawer links={links} />
                </div>
                <div className="navbar-end block lg:hidden text-right">
                    {logobutton}
                </div>
                <div className='navbar-start hidden lg:block'>
                    {logobutton}
                </div>
                <div className="navbar-end hidden lg:flex gap-2">
                    {router.pathname !== '/createpost' && status === 'authenticated' && (
                        <Link href="/createpost" className={`btn btn-primary`}>
                            <PlusIcon className='w-6 h-6' />
                            Create Post
                        </Link>
                    )}
                    {links.map(({ name, url }) => (
                        <Link key={name} href={url} className={`btn ${router.pathname === url ? 'btn-primary' : 'btn-ghost'}`}>
                            {name}
                        </Link>
                    ))}
                </div>
                <div className="drawer drawer-end fixed pointer-events-none">
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                    <div className="fixed top-0 left-0 w-full h-full drawer-content pointer-events-none">
                        {/* <!-- Page content here --> */}
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
                        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                            {/* <!-- Sidebar content here --> */}
                            <li><a>Sidebar Item 1</a></li>
                            <li><a>Sidebar Item 2</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomNav