"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faEdit, faEllipsisVertical, faRedo, faTrashRestoreAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import loader from '../assets/loader/loader.gif';
import Image from "next/image";
import { toast } from "react-toastify";

const Users = () => {
    
    const labelClasses = "block text-sm font-medium leading-6 text-zinc-500";
    const thclass = "p-5 text-left text-sm leading-6 font-black text-zinc-500 capitalize";
    const fieldClass = "p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-500";
    const inputclasses = "px-1 block w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6";

    const [userdata, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateloading, setUpdateLoading] = useState(false);
    const [isedit, setIsEdit] = useState(false);
    const [uservalue, setUserValue] = useState({});
    const [updateuser, setUpdateUser] = useState({
        email: "",
        username: "",
        isemailverified: "",
        isAdmin: "",
        updatedby: "",
        id: ""
    });

    const token = localStorage.getItem("userToken");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateUser({
            ...updateuser,
            [name]: value
        });
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        if (token) {
            const x = JSON.parse(token);
            const email = x.email;
            setLoading(true);
            try {
                const response = await axios.post("/api/users/userdata/allusersprofiles", { email });
                setUserData(response?.data?.usersdata);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    const ReloadUsers = () => {
        fetchAllUsers();
    };

    useEffect(() => {
        setUpdateUser({
            email: uservalue.email || "",
            isAdmin: uservalue.isAdmin || false,
            username: uservalue.username || "",
            isemailverified: uservalue.isemailverified || false,
            id: uservalue.id || ""
        });
    }, [uservalue]);

    const handelUserEdit = (id, email, username, isAdmin, isemailverified) => {
        setUserValue({ id, username, email, isAdmin, isemailverified });
        setIsEdit(true);
        toast.info("now you can edit user in user form");
    };

    const handleDeleteUser = async (id) => {
        console.log("dlete user");
        try {
            const response = await axios.delete('/api/users/userdata/allusersprofiles', { data: { id } });
            toast.success(response?.data?.message);
            fetchAllUsers();
        }
        catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }

    }

    const saveEditedUser = async (e) => {
        e.preventDefault();
        if (token) {
            const x = JSON.parse(token);
            const email = x.email;
            setUpdateLoading(true);
            try {
                const response = await axios.put("/api/users/userdata/allusersprofiles", {
                    email: updateuser.email,
                    username: updateuser.username,
                    isemailverified: updateuser.isemailverified,
                    isAdmin: updateuser.isAdmin,
                    updatedby: email,
                    id: updateuser.id
                });
                setUserData(response?.data?.usersdata);
                toast.success(response?.data?.message);
                setUpdateLoading(false);
                fetchAllUsers();
                setUpdateUser({
                    email: "",
                    username: "",
                    isemailverified: "",
                    isAdmin: "",
                    updatedby: "",
                    id: ""
                });
                setIsEdit(false);
            } catch (error) {
                toast.error(error.response.data.message);
                setUpdateLoading(false);
            }
           
        }
    }

    return (
        <div className="mb-6 pt-8">
            <h3 className="text-center text-gray-400 font-extrabold text-5xl mt-3xl underline">Todo App Users</h3>
            
            {isedit && (
                <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-slate-300 rounded-lg my-10 px-4 py-10">
                    <p className="text-center text-2xl font-extrabold text-zinc-500">Update User</p>
                    <form method="POST" onSubmit={saveEditedUser}>
                        <div className="mt-2">
                            <label htmlFor="user id" className={labelClasses}>User Id</label>
                            <input
                                name="id"
                                type="text"
                                value={updateuser.id}
                                onChange={handleInputChange}
                                className={inputclasses}
                                placeholder="user id"
                                autoComplete="new-id"
                                readOnly
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="username" className={labelClasses}>Username</label>
                            <input
                                name="username"
                                type="text"
                                value={updateuser.username}
                                onChange={handleInputChange}
                                className={inputclasses}
                                placeholder="username"
                                autoComplete="new-username"
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email" className={labelClasses}>Email address</label>
                            <input
                                name="email"
                                type="email"
                                value={updateuser.email}
                                onChange={handleInputChange}
                                className={inputclasses}
                                placeholder="email"
                                autoComplete="new-email"
                            />
                        </div>
                        <div className="mt-2">
                            <label htmlFor="for admin" className={labelClasses}>Set Admin Status</label>
                            <select
                                name="isAdmin"
                                value={updateuser.isAdmin}
                                onChange={handleInputChange}
                                className={inputclasses}
                            >
                                <option disabled>Choose User status</option>
                                <option value={true}>Set Admin</option>
                                <option value={false}>Set User</option>
                            </select>
                        </div>
                        <div className="mt-2">
                            <label htmlFor="email verify" className={labelClasses}>Verify email</label>
                            <select
                                name="isemailverified"
                                value={updateuser.isemailverified}
                                onChange={handleInputChange}
                                className={inputclasses}
                            >
                                <option disabled>Choose email status</option>
                                <option value={true}>Verified</option>
                                <option value={false}>Not verified</option>
                            </select>
                        </div>
                        <div className="mt-5">
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                {updateloading ? (
                                    <Image
                                        src={loader}
                                        width={25}
                                        priority
                                        alt="loading"
                                    />
                                ) : (
                                    "Update User"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="flex flex-col mt-10">
                <div className="flex justify-end align-middle mb-3 mr-3">
                    <div className="flex align-center">
                        <input type="text" className="block w-64 h-11 px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none" placeholder="Search user" />
                        <button onClick={ReloadUsers} className="flex ml-2 items-center bg-gray-800 hover:bg-zinc-700 text-sm text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline">
                            <FontAwesomeIcon icon={faRedo} className="mr-1" /> RELOAD USERS
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto mt-3xl">
                    <div className="min-w-full inline-block align-middle">
                        <div className="overflow-hidden px-3">
                            <table className="min-w-full rounded-xl">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th scope="col" className={thclass}>User ID</th>
                                        <th scope="col" className={thclass}>Username</th>
                                        <th scope="col" className={thclass}>Email</th>
                                        <th scope="col" className={thclass}>IsAdmin</th>
                                        <th scope="col" className={thclass}>IsEmailVerified</th>
                                        <th scope="col" className={thclass}>Updated By</th>
                                        <th scope="col" className={thclass}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {loading ? (
                                        <tr>
                                            <td className="text-center" colSpan="col-start-1 col-end-7">
                                                <Image
                                                    src={loader}
                                                    width={25}
                                                    priority
                                                    alt="loading"
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        userdata && userdata.map((user, index) => (
                                            <tr key={index}>
                                                <td className={fieldClass}>{user._id}</td>
                                                <td className={fieldClass}>{user.username}</td>
                                                <td className={fieldClass}>{user.email}</td>
                                                <td className={fieldClass}>{user.isAdmin ? "Admin" : "User"}</td>
                                                <td className={fieldClass}>{user.isemailverified ? "Verified" : "Not Verified"}</td>
                                                <td className={fieldClass}>{user.userUpdatedby ? user.userUpdatedby : "profile not update yet"}</td>
                                                <td className={fieldClass}>
                                                    <div className="flex justify-between">

                                                        <div className="">
                                                            <button onClick={() => handelUserEdit(user._id, user.email, user.username, user.isAdmin, user.isemailverified)} className="text-green-600">
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                        </div>
                                                        <div className="">
                                                            <button onClick={() => handleDeleteUser(user._id)} className="text-red-600">
                                                                <FontAwesomeIcon icon={faTrashRestoreAlt} />
                                                            </button>
                                                        </div>

                                                        <div className="">
                                                            <button className="text-yellow-600">
                                                                <FontAwesomeIcon icon={faEllipsisVertical} />
                                                            </button>
                                                        </div>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
