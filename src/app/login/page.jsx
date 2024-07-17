
"use client";

import React, { useContext, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Loader from '../assets/loader/loader.gif';
import Image from 'next/image';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { NavbarHitFunction } from '../components/rootcomponent/page';
import { useEffect } from 'react';


const Login = () => {

    const router = useRouter();
    const setNavFunc = useContext(NavbarHitFunction);

    const [pageload, setPageLoad] = useState(null);
    const labelClasses = "block text-sm font-medium leading-6 text-gray-900";
    const [loading, setLoading] = useState(false);
    const [passtype, setPassType] = useState('password');
    const [input, setInput] = useState({
        email: '',
        password: '',
    });

    const [err, setErr] = useState({
        email: false,
        password: false
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        });
        setErr({ ...err, [name]: false })
    };

    const handleShowpassword = () => {
        setPassType(passtype === 'text' ? 'password' : 'text');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const { email, password } = input;

        let validform = true;

        if (!email || !password) {
            toast.error("email or password missing");
            validform = false;
        }
        if (validform) {
            setLoading(true);

            try {
                const response = await axios.post('/api/users/auth/login', input);
                toast.success(response?.data?.message);
                const userobject = response?.data?.userdata;
                const data = JSON.stringify(userobject)
                localStorage.setItem("userToken", data);
                setLoading(false);
                setNavFunc(true);
                router.push('/');
            } catch (error) {
                setLoading(false);
                toast.error(error?.response?.data?.message);
            }
        }
    };

    useEffect(() => {
        CheckuserLoginStatus()
    }, []);

    const CheckuserLoginStatus = async () => {
        const x = localStorage.getItem("userToken");
        if (x) {
            setPageLoad(true);
            const data = JSON.parse(x);
            const email = data.email;
            try {
                const response = await axios.post("/api/users/auth/login/islogin", { email })
                if (response.status === 200) {
                    toast.success(response?.data?.message);
                    router.push("/");
                    setPageLoad(false);
                } else {
                    router.push("/login");
                    setPageLoad(false);
                }
            }
            catch (error) {
                toast.error(error?.response?.data?.message);
                setPageLoad(false);
            }
        }
    }

    return (
        <>

            {pageload ?
                (<div className='flex justify-center items-center h-screen'>
                    <Image
                        src={Loader}
                        width={50}
                        alt="loader" />
                </div>)
                :
                (<div className="flex min-h-full flex-1 flex-col justify-center w-full px-6 py-12 lg:px-8">

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log in to your account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form method="POST" onSubmit={handleLogin} className="space-y-3">

                            <div>
                                <label htmlFor="email" className={labelClasses}> Email address  </label>
                                <div className="mt-2">
                                    <input
                                        name="email"
                                        type="email"
                                        value={input.email}
                                        onChange={handleInputChange}
                                        className="px-1 block w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                                        placeholder='email'
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className={labelClasses}>Password</label>
                                    <div className="text-sm">
                                        <Link href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-2 flex border border-gray-300 rounded-md bg-white">
                                    <input
                                        name="password"
                                        type={passtype}
                                        value={input.password}
                                        onChange={handleInputChange}
                                        className="px-1 block w-full rounded-md py-2 text-red-900 shadow-sm placeholder:text-gray-300  sm:text-sm sm:leading-6"
                                        placeholder='password'
                                        autoComplete='curret-password'
                                    />
                                    <div className="flex items-center justify-center" onClick={handleShowpassword}>
                                        <FontAwesomeIcon className='px-1' icon={passtype === "password" ? faEye : faEyeSlash} />
                                    </div>
                                </div>

                            </div>

                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    {loading ? <Image
                                        src={Loader}
                                        width={25}
                                        priority
                                        alt="loading"
                                    /> : "log in"}
                                </button>
                            </div>
                        </form>

                        <p className="mt-5 text-center text-sm text-gray-500">
                            not have account yet?{' '}
                            <Link href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign Up</Link>
                        </p>
                    </div>
                </div>)
            }
        </>
    );
};

export default Login;
