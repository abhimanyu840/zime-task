import React from 'react'

const Navbar = (): React.JSX.Element => {
    return (
        <nav className='flex justify-center items-center h-18 z-10 top-0 backdrop-blur w-screen shadow-lg fixed'>
            <div className='p-2'>
                <span className='font-rubik text-6xl text-black font-extrabold '>Zime</span>
            </div>
        </nav>
    )
}

export default Navbar
