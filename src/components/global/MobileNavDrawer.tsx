import Bars3BottomLeft from '@heroicons/react/24/solid/Bars3Icon.js';
import Link from 'next/link';
import { useState } from 'react';
import { LinkType } from './CustomNav';

type MobileNavDrawerProps = {
    links: LinkType[];
}

const MobileNavDrawer = ({ links }: MobileNavDrawerProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleHiddenCheckBoxChange = () => {
        setOpen(prev => !prev)
    }
    return (
        <>
            <label htmlFor='my-drawer' className='btn btn-ghost px-1'>
                <Bars3BottomLeft className='w-10 h-10' />
            </label>
            <div className={`drawer fixed top-0 left-0 ${!open && 'pointer-events-none'}`}>
                <input id="my-drawer" type="checkbox" className="drawer-toggle" onChange={handleHiddenCheckBoxChange} />
                <div className="drawer-side">
                    <label htmlFor="my-drawer" className="drawer-overlay backdrop-blur-md"></label>
                    <div className='bg-base-100 w-[80vw] p-5 flex flex-col justify-end'>
                        <div className='w-full h-full flex flex-col justify-center relative pl-5'>
                            {/* <div className='absolute left-0 top-0 w-1 h-full bg-white'></div> */}
                            <div className='text-4xl font-extrabold uppercase'>
                                Amor My Decor
                            </div>
                            <div className='text-sm font-extralight'>Where do you want to go? We{"'"}ll get you there.</div>
                        </div>

                        {links.map(({ name, url }) => (
                            <Link key={name} href={url} className='btn btn-primary text-lg font-bold uppercase mt-3'>
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MobileNavDrawer