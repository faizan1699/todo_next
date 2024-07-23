"use client";

import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faEdit, faLock, faLockOpen, faRedo, faRemove, faTrashRestoreAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

import axios from "axios";
import loader from '../../assets/loader/loader.gif';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sendusertype } from "@/app/components/rootcomponent/page";
import { setUserTypeContext } from "@/app/components/rootcomponent/page";

const Users = () => {

    const router = useRouter();

    const usertype = useContext(sendusertype);
    const usertypeFunction = useContext(setUserTypeContext);

    const isAdminclass = "text-red-600 border border-green-400 font-black";
    const labelClasses = "block text-sm font-medium leading-6 text-zinc-500";
    const thclass = "p-6 text-center border text-sm leading-6 font-extrabold tracking-wide text-zinc-200 capitalize";
    const fieldClass = "p-5 whitespace-nowrap text-sm font-medium text-gray-700";
    const inputclasses = "px-1 block w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6";

    const [userdata, setUserData] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateloading, setUpdateLoading] = useState(false);
    const [isedit, setIsEdit] = useState(false);
    const [uservalue, setUserValue] = useState({});
    const [searchinput, setSearchInput] = useState("");
    const [isauthenticated, setIsAuthenticated] = useState(false);
    const [updateuser, setUpdateUser] = useState({
        email: "",
        username: "",
        isemailverified: "",
        isAdmin: "",
        updatedby: "",
        id: "",
        isSuperAdmin: ""
    });

    const changeSerchInput = (e) => {
        const { value } = e.target;
        const lowerCaseValue = value.trim().toLowerCase();
        setSearchInput(lowerCaseValue);
        if (lowerCaseValue === '') {
            setFilteredUsers(userdata);
        } else {
            const filtered = userdata.filter(user =>
                user.email.toLowerCase().includes(lowerCaseValue) ||
                user._id.toLowerCase().includes(lowerCaseValue) ||
                user.username.toLowerCase().includes(lowerCaseValue) ||
                (user.isemailverified && lowerCaseValue === 'verified')
            );
            setFilteredUsers(filtered);
        }
    };

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

    useEffect(() => {
        if (usertype === "user") {
            setIsAuthenticated(true);
            usertypeFunction("user");
            router.push("/");
        }
    }, [usertype]);

    const fetchAllUsers = async () => {
        if (token) {
            const x = JSON.parse(token);
            const email = x.email;
            setLoading(true);
            try {
                const response = await axios.post("/api/users/userdata/allusersprofiles", { email });
                setUserData(response?.data?.usersdata);
                setLoading(false);

                if (searchinput) {
                    const filtered = response?.data?.usersdata.filter(user =>
                        user.email.toLowerCase().includes(searchinput.toLowerCase()) ||
                        user._id.toLowerCase().includes(searchinput.toLowerCase()) ||
                        (user.isemailverified ? "Verified" : "Not Verified").includes(searchinput.toLowerCase())
                    );
                    setFilteredUsers(filtered);
                } else {
                    setFilteredUsers(response?.data?.usersdata);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message);
                setLoading(false);
            }
            if (usertype === "user") {
                setIsAuthenticated(true);
                usertypeFunction("user");
                router.push("/");
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
            id: uservalue.id || "",
            isSuperAdmin: uservalue.isSuperAdmin || false
        });
    }, [uservalue]);

    const hideFormUpdate = () => {
        setIsEdit(false);
        setUpdateUser({
            email: "",
            username: "",
            isemailverified: "",
            isAdmin: "",
            updatedby: "",
            id: "",
            isSuperAdmin: ""
        })
    }

    const handelUserEdit = (id, email, username, isAdmin, isemailverified, isSuperAdmin) => {
        setUserValue({ id, username, email, isAdmin, isemailverified, isSuperAdmin });
        setIsEdit(true);
        toast.info("you can edit user in user form");
    };

    const handleDeleteUser = async (id) => {
        // console.log("dlete user");
        try {
            const response = await axios.delete('/api/users/userdata/allusersprofiles', { data: { id } });
            toast.success(response?.data?.message);
            fetchAllUsers();
        }
        catch (error) {
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
                    id: updateuser.id,
                    isSuperAdmin: updateuser.isSuperAdmin,

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
                    id: "",
                    isSuperAdmin: ""
                });
                setIsEdit(false);
            } catch (error) {
                toast.error(error.response.data.message);
                setUpdateLoading(false);
            }
        }
    }

    const blockUserFunction = async ({ id, setup }) => {
        try {
            const response = await axios.put(`/api/users/userdata/allusersprofiles/${setup}`, { id });
            // console.log(response);
            if (response?.data?.status === 200) {
                toast.success(response?.data?.message);
                router.push(-1);
            } else {
                toast.info(response?.data?.message);
            }

            fetchAllUsers();
        }
        catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    const handlelUnBlockUser = async (id, setup) => {
        blockUserFunction({ id, setup: "unblockuser" });
    }

    const handlelBlockUser = async (id, setup) => {
        blockUserFunction({ id, setup: "blockuser" });
    }

    return (
        <>
            {!isauthenticated ?
                (<div div className="mb-6 pt-8">
                    <h3 className="text-center text-gray-400 font-extrabold text-5xl mt-3xl underline">Todo App Users</h3>

                    {isedit && (
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-slate-300 rounded-lg my-10 px-4 py-10">
                            <div className="flex justify-between items-center">
                                <div></div>
                                <p className="text-center text-2xl font-extrabold text-zinc-500">Update User</p>
                                <div className="flex items-center text-red-500 border rounded-full border-red-500 px-1"><FontAwesomeIcon onClick={hideFormUpdate} icon={faRemove} /></div>
                            </div>
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

                                {usertype === "superadmin" &&
                                    <div className="mt-2">
                                        <label htmlFor="superadmin" className={labelClasses}>Super Admin</label>
                                        <select
                                            name="isSuperAdmin"
                                            value={updateuser.isSuperAdmin}
                                            onChange={handleInputChange}
                                            className={inputclasses}
                                        >
                                            <option disabled>super admin status</option>
                                            <option value={true}>Super Admin</option>
                                            <option value={false}>Not Super Admin</option>
                                        </select>
                                    </div>
                                }

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
                                <input type="text" name="search" value={searchinput} onChange={changeSerchInput} className="block w-64 h-11 px-4 py-3.5 text-base text-gray-900 bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none" placeholder="Search user by any first 3 fields" />
                                <button onClick={ReloadUsers} className="flex ml-2 items-center bg-gray-800 hover:bg-zinc-700 text-sm text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline">
                                    <FontAwesomeIcon icon={faRedo} className="mr-1" /> RELOAD USERS
                                </button>
                            </div>
                        </div>
                        {loading ? (
                            <div className="flex justify-center align-ceter mt-16">
                                <Image
                                    src={loader}
                                    width={70}
                                    alt="loading"
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto mt-3xl py-5 ">
                                <div className="min-w-full inline-block align-middle">
                                    <div className="overflow-hidden px-3">

                                        <table className="min-w-full rounded-xl">
                                            <thead>
                                                <tr className="bg-gray-800">
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
                                                {(filteredUsers?.length > 0 ? filteredUsers : userdata ?? []).map((user, index) => {
                                                    // Highlight logic
                                                    const highlight = (text, search) => {
                                                        if (!search.trim()) return text;
                                                        const parts = text.split(new RegExp(`(${search})`, 'gi'));
                                                        return parts.map((part, i) => (
                                                            part.toLowerCase() === search.toLowerCase()
                                                                ? <span key={i} className="font-black text-blue-500">{part}</span>
                                                                : part
                                                        ));
                                                    };

                                                    return (
                                                        <tr className={`${user.isuserblock && "bg-red-400"} text-start border mb-5 ${!user.isuserblock && "hover:bg-yellow-100"}`} key={index}>
                                                            <td className={fieldClass}>{highlight(user._id, searchinput)}</td>
                                                            <td className={fieldClass}>{highlight(user.username, searchinput)}</td>
                                                            <td className={fieldClass}>{highlight(user.email, searchinput)}</td>
                                                            <td className={`${fieldClass} ${user.isSuperAdmin ? `font-bold ${isAdminclass}` : user.isAdmin && isAdminclass}`}>
                                                                {user.isSuperAdmin ? "Super Admin" : user.isAdmin ? "Admin" : "User"}
                                                            </td>
                                                            <td className={`${fieldClass} ${user.isemailverified ? "border border-green-500 text-center text-yellow-400" : "bg-red-400 text-white"}`}>{user.isemailverified ? "Verified" : "Not Verified"}</td>
                                                            <td className={fieldClass}>{user.userUpdatedby ? user.userUpdatedby : " - - - - - - - - - - -"}</td>
                                                            <td className={fieldClass}>
                                                                {user.isSuperAdmin === true ? (
                                                                    <div className="flex jutify-between ">
                                                                        {usertype === "superadmin" ?
                                                                            (
                                                                                <div className="flex justify-between">
                                                                                    <button onClick={() => handelUserEdit(user._id, user.email, user.username, user.isAdmin, user.isemailverified, user.isSuperAdmin)} className="text-green-600">
                                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                                    </button>
                                                                                    <div className="flex justify-between gap-4 ml-3">
                                                                                        {
                                                                                            [1, 2].map((i) => (
                                                                                                <button disabled key={i} className="text-gray-600">
                                                                                                    <FontAwesomeIcon icon={faBan} />
                                                                                                </button>
                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                </div>

                                                                            ) : (
                                                                                <div className="flex justify-between gap-3">
                                                                                    {
                                                                                        [1, 2, 3].map((i) => (
                                                                                            <button disabled key={i} className="text-gray-600">
                                                                                                <FontAwesomeIcon icon={faBan} />
                                                                                            </button>
                                                                                        ))
                                                                                    }
                                                                                </div>

                                                                            )
                                                                        }
                                                                    </div>


                                                                ) : (<div className="flex justify-between">
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
                                                                        <button className={user.isuserblock ? "text-red-600 relative" : "text-green-600 relative"}>
                                                                            {
                                                                                user.isuserblock ? (
                                                                                    <FontAwesomeIcon
                                                                                        onClick={() => handlelUnBlockUser(user._id)}
                                                                                        icon={faLock}
                                                                                    />
                                                                                ) : (
                                                                                    <FontAwesomeIcon
                                                                                        onClick={() => handlelBlockUser(user._id)}
                                                                                        icon={faLockOpen}
                                                                                    />
                                                                                )
                                                                            }

                                                                        </button>
                                                                    </div>

                                                                </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>


                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div >
                ) : (
                    <div className="flex h-full justify-center items-center">
                        <p>you are not authenticated for this page</p>
                    </div>
                )
            }

        </>
    );
};

export default Users;
