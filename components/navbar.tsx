"use client";
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';



interface NavbarProps {

}

const Navbar: React.FC<NavbarProps> = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Tracks login state // CHANGE TO FALSE LATER

    return (
        <nav className="p-4 flex justify-between items-center dark:bg-dark dark:text-white bg-gradient-to-r from-green-800 to-green-500">
            
            <div className="flex items-center space-x-2"> 
                <Link legacyBehavior href="/">
                    <a>
                        <Image src="/road2.png" alt="Road Icon" width={30} height={30} className="navbar-logo" />
                    </a>
                </Link>
                <Link legacyBehavior href="/">
                    <a className="text-white font-bold text-xl">
                        FuelPath
                    </a>
                </Link>
            </div>

            
            <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                    <>
                        <Link legacyBehavior href="/profile">
                            <a className="text-white hover:text-gray-300">Profile</a>
                        </Link>
                        <Link legacyBehavior href="/quote">
                            <a className="text-white hover:text-gray-300">Fuel Quote</a>
                        </Link>
                        <Link legacyBehavior href="/quotehistory">
                            <a className="text-white hover:text-gray-300">Quote History</a>
                        </Link>
                        <button
                            className="text-white hover:text-gray-300 font-bold"
                            onClick={() => setIsLoggedIn(false)}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link legacyBehavior href="/login">
                            <a className="text-white hover:text-gray-300">Login</a>
                        </Link>
                        <Link legacyBehavior href="/registration">
                            <a className="text-white hover:text-gray-300">Sign up</a>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
