
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Loader from '../assets/loader/loader.gif';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Login = () => {

    const router = useRouter();
    const errClass = "text-red-600 text-xs text-end";
    const labelClasses = "block text-sm font-medium leading-6 text-gray-900";

    const [msg, setMsg] = useState(null);
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
        const newErrors = {
            email: !email,
            password: !password
        }
        if (!email || !password) {
            setErr(newErrors)
            validform = false;
        }
        if (validform) {
            setLoading(true);

            try {
                const response = await axios.post('/api/users/auth/login', input);
                
                setMsg(response?.data?.message);
                console.log(response)
                const userobject = response?.data?.userdata;
                const data = JSON.stringify(userobject)
         
                localStorage.setItem("userToken", data);
                
                setLoading(false);
                setTimeout(() => {
                    router.push('/');
                }, 2000);

            } catch (error) {
                setLoading(false);
                setMsg(error.response.data.message)
                console.log("eror", error)
            }
        }
    };

    return (
        <>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log in to your account</h2>
                    {msg && <p className="mt-1 text-center font-bold text-red-500">{msg}</p>}
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
                                {err.email && <p className={errClass}>email required</p>}
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
                                />
                                <div className="flex items-center justify-center" onClick={handleShowpassword}>
                                    <FontAwesomeIcon className='px-1' icon={passtype === "password" ? faEye : faEyeSlash} />
                                </div>
                            </div>
                            {err.password && <p className={errClass}>password required</p>}
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
            </div>
        </>
    );
};

export default Login;
