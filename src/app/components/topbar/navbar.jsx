"use client";

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import logo from '../../assets/logo/logo.png';
import Image from 'next/image';
import axios from 'axios';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const authnav = [
    { name: 'Login', href: '/login' },
    { name: 'Signup', href: '/signup' },
];

const usernav = [
    { name: 'Todos', href: '/todos' },
    { name: 'CreateTodo', href: '/createtodo' },
    { name: 'profile', href: '/profile' },
];

const adminnav = [
    ...usernav,
    { name: 'Users', href: '/users' },
];
const Navbar = () => {

    const router = useRouter();
    
    const [userinfo, setUserInfo] = useState({});
    const [activelink, setActiveLink] = useState("");
    const [navmap, setNavmap] = useState(authnav);
    const [isadmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const fetchUserData = () => {
            const userdata = localStorage.getItem("userToken");
            if (userdata) {
                const data = JSON.parse(userdata);
                setUserInfo(data);
            }
        };
        fetchUserData();
    }, [])


    useEffect(() => {

        if (userinfo.email) {
            getUsertype(userinfo.email);
        }
    }, [userinfo]);

    const getUsertype = async () => {

        const email = userinfo.email;
        try {
            const response = await axios.post("/api/profile/usertype", { email });
            setIsAdmin(response?.data?.isAdmin);
        } catch (error) { console.log('Error fetching user type:', error) }
    };

    useEffect(() => {
        if (isadmin === true) {
            setNavmap(adminnav);
        } else if (isadmin === false) {
            setNavmap(usernav);
        }
        else {
            setNavmap(authnav);
        }
    }, [isadmin]);

    const handleActiveLink = (href) => {
        setActiveLink(href);
    }

    const handleLogout = async () => {
        try {
            const response = await axios.get("/api/users/auth/logout");
            localStorage.removeItem("userToken");
            alert(response?.data?.message);
            setUserInfo({});
            setIsAdmin(null);
            setNavmap(authnav);
            router.push("/login");
        }
        catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                <div className="mx-auto  px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* Mobile menu button*/}
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                            </DisclosureButton>
                        </div>

                        <div className="flex items-center w-full nav_logo">
                            <Link href={isadmin ? "/" : ""}>
                                <Image
                                    alt="TODO APP"
                                    src={logo}
                                    width={120}
                                    priority
                                    onClick={getUsertype}
                                />
                            </Link>
                        </div>

                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">

                            <div className="hidden sm:ml-6 sm:block w-full ">
                                <div className="flex space-x-4 justify-end">
                                    {navmap.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            aria-current={item.current ? 'page' : undefined}
                                            onClick={() => handleActiveLink(item.href)}
                                            className={`${activelink === item.href
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                } rounded-md px-3 py-2 text-sm font-medium`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {isadmin && <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-3">
                                <div className='flex items-center justify-between'>
                                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <Image
                                            src={logo}
                                            className="border-2 h-8 w-8 rounded-full"
                                            style={{ minWidth: 35, minHeight: 35 }}
                                            alt="logo"
                                        />
                                    </MenuButton>
                                    {userinfo &&
                                        <div className="flex text-white flex-col items-center justify-center pl-2">
                                            <div className="text-start">{userinfo.username}</div>
                                            {isadmin && <div className="text-start" style={{ fontSize: 12 }}>{isadmin === true ? "Admin" : "User"}</div>}
                                        </div>}
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <MenuItem>
                                        <Link href="/" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                            Your Profile
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link href="/" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                                            Settings
                                        </Link>
                                    </MenuItem>
                                    <MenuItem >
                                        <div className='flex justify-center'>
                                            <button onClick={handleLogout} type="submit" className="w-3/4 rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500">LOGOUT</button>
                                        </div>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>}
                    </div>
                </div>

                <DisclosurePanel className="sm:hidden">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        {navmap.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                </DisclosurePanel>
            </Disclosure>

        </>
    );
};

export default Navbar;
