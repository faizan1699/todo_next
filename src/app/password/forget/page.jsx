"use client";

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faEye, faEyeSlash, faMultiply } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import axios from 'axios';
import loader from "../../assets/loader/loader.gif";
import Image from 'next/image';

const ForgetPassword = () => {

    const router = useRouter();

    const btnClass = "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

    const [email, setEmail] = useState('');
    const [mailsent, sentMail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passtype, setPassType] = useState("password");
    const [emailloading, setEmailLoading] = useState(false);
    const [input, setInput] = useState({
        otp: "",
        password: "",
        email: email || ""
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        })
    }

    useEffect(() => {
        sentMail(true);
    }, [])

    const handleTogleModel = () => {
        router.push("/login");
    }
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleShowpassword = () => {
        setPassType(passtype === 'text' ? 'password' : 'text');
    }

    const handleGetOtp = async (e) => {
        e.preventDefault();
        setEmailLoading(true);
        try {
            const response = await axios.post("/api/users/auth/password/reset", { email });
            toast.success(response?.data?.message);
            setEmailLoading(false);
            sentMail(false);
        }
        catch (error) {
            setEmailLoading(false);
            toast.error(error?.response?.data?.message);
        }
    };
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        const { password, otp } = input;

        setLoading(true);

        try {
            const response = await axios.put("/api/users/auth/password/reset", {
                otp: otp,
                password: password,
                email: email
            });
            toast.success(response?.data?.message);
            setEmailLoading(false);
            sentMail(false);
            setLoading(false);
            setEmail("");
            setInput({
                otp: "",
                password: ""
            })
            router.push("/login");
        }
        catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message);
        }
    };

    const resendOtpEmail = () => {
        sentMail(true);
    }

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
                <div className="relative bg-white w-full max-w-md p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Forget Password</h2>
                        <div className='text-red-500'>
                            <FontAwesomeIcon onClick={handleTogleModel} icon={faMultiply} />
                        </div>
                    </div>
                    {mailsent ?
                        (<form onSubmit={handleGetOtp}>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-bold mb-2"
                                >
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full border border-gray-300 p-2 rounded"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    autoComplete='new-email'
                                />
                            </div>

                            <div className="text-right">
                                <button type="submit" className={btnClass}>
                                    {emailloading ? (
                                        <Image
                                            src={loader}
                                            width={30}
                                            height={30}
                                            priority
                                            alt='loading'
                                        />
                                    ) : ("GET OTP")}
                                </button>
                            </div>
                        </form>
                        ) : (

                            <div>
                                <form onSubmit={handleUpdatePassword}>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-bold mb-2"
                                        >
                                            OTP (<span className='text-red-400' style={{ fontSize: 12 }}> six characters valid </span>)
                                        </label>
                                        <input
                                            name="otp"
                                            type="number"
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="Enter 6 digit OTP"
                                            value={input.otp}
                                            onChange={handleInputChange}
                                            autoComplete='new-otp'
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="block text-sm font-bold mb-2">Email Address : </label>
                                        <input
                                            name="email"
                                            type="email"
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            readOnly={email ? true : false}
                                            required
                                            autoComplete='new-email'
                                        />
                                    </div>
                                    <div className='mb-4'>
                                        <label htmlFor="email" className="block text-sm font-bold mb-2" >New Password :</label>
                                        <div className="mt-2 flex border border-gray-300 rounded-md bg-white">
                                            <input
                                                name="password"
                                                type={passtype}
                                                value={input.password}
                                                onChange={handleInputChange}
                                                className="px-1 block w-full rounded-md py-2 text-red-900 shadow-sm placeholder:text-gray-300  sm:text-sm sm:leading-6"
                                                placeholder='Enter New Password'
                                                autoComplete='new-password'

                                            />
                                            <div className="flex items-center justify-center" onClick={handleShowpassword}>
                                                <FontAwesomeIcon className='px-1' icon={passtype === "password" ? faEye : faEyeSlash} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mb-2">
                                        <button className='text-red-400 text-end' type='button' onClick={resendOtpEmail}>OTP email not recieved resend email </button>
                                    </div>

                                    <div className="text-right">
                                        <button type="submit" className={btnClass}>
                                            {loading ? (
                                                <Image
                                                    src={loader}
                                                    width={30}
                                                    height={30}
                                                    priority
                                                    alt='loading'
                                                />
                                            ) : ("UPDATE PASSWORD")}
                                        </button>
                                    </div>
                                </form>

                            </div>

                        )
                    }
                </div>
            </div>
        </>
    );
};

export default ForgetPassword;
