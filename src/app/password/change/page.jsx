"use client";

import React, { useState } from 'react';

import axios from 'axios';
import Image from 'next/image';
import Loader from "../../assets/loader/loader.gif";

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ChangePassword = () => {
    const router = useRouter();

    const labelClasses = "block text-sm font-medium leading-6 text-gray-900";

    const [loading, setLoading] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
    const [input, setInput] = useState({
        newpassword: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        });
    };

    const handleShowNewPassword = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const handleShowCurrentPassword = () => {
        setCurrentPasswordVisible(!currentPasswordVisible);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const { newpassword, password } = input;

        if (!password) {
            toast.error("Old password ");
            return;
        }
        if (!newpassword) {
            toast.error("new password missing");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.put('/api/users/auth/password/change', input);
            toast.success(response?.data?.message);
            setLoading(false);
            router.back();
            console.log(response);
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="max-w-md w-full">
                <form onSubmit={handleChangePassword} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className={labelClasses} htmlFor="password">
                            Enter Old Password
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={!currentPasswordVisible ? 'text' : 'password'}
                                value={input.password}
                                onChange={handleInputChange}
                                className="px-3 py-2 placeholder-gray-400 text-gray-900 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                placeholder="Old Password"
                                autoComplete="current-password"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                <FontAwesomeIcon
                                    icon={currentPasswordVisible ? faEye : faEyeSlash}
                                    onClick={handleShowCurrentPassword}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className={labelClasses} htmlFor="newpassword">
                            Enter New Password
                        </label>
                        <div className="relative">
                            <input
                                name="newpassword"
                                type={!newPasswordVisible ? 'text' : 'password'}
                                value={input.newpassword}
                                onChange={handleInputChange}
                                className="px-3 py-2 placeholder-gray-400 text-gray-900 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
                                placeholder="New Password"
                                autoComplete="new-password"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                <FontAwesomeIcon
                                    icon={newPasswordVisible ? faEye : faEyeSlash}
                                    onClick={handleShowNewPassword}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 w-full rounded focus:outline-none focus:shadow-outline"
                            disabled={loading}
                        >
                            {loading ? (
                                <Image
                                    src={Loader}
                                    className="animate-spin mx-auto"
                                    width={20}
                                    height={20}
                                    alt="Loading..."
                                />
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
