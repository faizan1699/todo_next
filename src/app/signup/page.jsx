
"use client";
import React, { useState } from 'react';

import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Loader from '../assets/loader/loader.gif';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {

  const router = useRouter();
  const errClass = "text-red-600 text-xs text-end";
  const labelClasses = "block text-sm font-medium leading-6 text-gray-900";

  const [loading, setLoading] = useState(false);
  const [passtype, setPassType] = useState('password');
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [err, setErr] = useState({
    username: false,
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

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = input;
    let validform = true;


    if (!username || !email || !password) {
      toast.error("pls provide required data")
      validform = false;
    }

    if (validform) {

      setLoading(true);

      try {
        const response = await axios.post('/api/users/auth/register', input);
        toast.success(response?.data?.message);
        setLoading(false);
        setInput({
          username: '',
          email: '',
          password: ''
        });
        router.push("/login");

      } catch (error) {
        setLoading(false);
          toast.error(error?.response?.data?.message)
      }
    }
  };

  return (
    <>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign up to your account</h2>
         
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form method="POST" onSubmit={handleRegister} className="space-y-3">

            <div>
              <label htmlFor="email" className={labelClasses}>User name</label>
              <div className="mt-1">
                <input name="username" type="text" value={input.username} onChange={handleInputChange} autoComplete="new-username" className="px-1 block w-full rounded-md border-0 py-2 text-red-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6" placeholder='username' />
                {err.username && <p className={errClass}>username required</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}>Email address</label>
              <div className="mt-1">
                <input name="email" type="email" value={input.email} onChange={handleInputChange} autoComplete="new-email" className="px-1 block w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6" placeholder='email' />
                {err.email && <p className={errClass}>email required</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className={labelClasses}>Password</label>

              </div>
              <div className="mt-1 flex border border-gray-300 rounded-md bg-white">
                <input name="password" type={passtype} value={input.password} onChange={handleInputChange} autoComplete="current-password" className="px-1 block w-full rounded-md py-2 text-red-900 shadow-sm placeholder:text-gray-300  sm:text-sm sm:leading-6" placeholder='password' />
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
                /> : "Sign up"}
              </button>
            </div>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have a account?{' '}
            <Link href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
