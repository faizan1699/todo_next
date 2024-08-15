
"use client";

import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Loader from '../assets/loader/loader.gif';

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faMultiply } from '@fortawesome/free-solid-svg-icons';
import { AddUserContext } from '../components/rootcomponent/page';

const Signup = ({ formtitle, btntitle }) => {

  const { setisAddUser ,  setFetchUser } = useContext(AddUserContext);

  const router = useRouter();
  const uploadImg = useRef(null);
  const isSignup = window.location.pathname;
  const labelClasses = "block text-sm font-medium leading-6 text-gray-900";
  const formInput = "px-1 block w-full rounded-md border-0 py-2 text-red-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6";

  const [loading, setLoading] = useState(false);
  const [passtype, setPassType] = useState('password');
  const [profileimg, setProfileImg] = useState(null);
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value
    });
  };

  function hideAddUser() {
    setisAddUser(false); // from adduser admin page for add register new user
  }

  const handleShowpassword = () => {
    setPassType(passtype === 'text' ? 'password' : 'text');
  };

  const uploadImgRef = () => {
    uploadImg.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setProfileImg(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password } = input;
    let validform = true;

    if (!username || !email || !password) {
      toast.error("Please provide required data");
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

        if (isSignup === "/signup") {
          router.push("/login");
        }
        setFetchUser(true);
        hideAddUser();  
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
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {isSignup === "/signup" ? "Sign up to your account" : (<div className='d-flex flex justify-between text-black items-center'> <span>{formtitle}</span> <FontAwesomeIcon className='text-red-600 font-extrabold' onClick={hideAddUser} icon={faMultiply} /></div>)}
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          {profileimg && (
            <div className="flex justify-center ">
              <Image
                className='rounded-lg border-4 border-red-200 rounded-full'
                src={URL.createObjectURL(profileimg)}
                width={150}
                height={150}
                style={{ maxHeight: 120, maxWidth: 120 }}
                alt="Selected file preview"
              />
              <p>{profileimg.name}</p>
             {isSignup !== "/signup"  && <FontAwesomeIcon onClick={() => setProfileImg(null)} className='ml-2 text-red-700' icon={faMultiply} />}
            </div>
          )}
          <form method="POST" onSubmit={handleRegister} className="space-y-3">
            {!profileimg && (
              <div className='flex justify-center items-cetner flex-col'>
                <input name="profileimg" type="file" ref={uploadImg} onChange={handleFileChange} className={`hidden ${formInput}`} />
                <button type="button" className='text-red-500 text-black' onClick={uploadImgRef}>Upload Profile Img</button>
              </div>
            )}
            <div>
              <label htmlFor="email" className={labelClasses}>User name</label>
              <div className="mt-1">
                <input name="username" type="text" value={input.username} onChange={handleInputChange} autoComplete="new-username" className={formInput} placeholder='username' />
              </div>
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>Email address</label>
              <div className="mt-1">
                <input name="email" type="email" value={input.email} onChange={handleInputChange} autoComplete="new-email" className={formInput} placeholder='email' />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className={labelClasses}>Password</label>
              </div>
              <div className="mt-1 flex border border-gray-300 rounded-md bg-white">
                <input name="password" type={passtype} value={input.password} onChange={handleInputChange} autoComplete="current-password" className={`${formInput}`} placeholder='password' />
                <div className="flex items-center justify-center" onClick={handleShowpassword}>
                  <FontAwesomeIcon className='px-1' icon={passtype === "password" ? faEye : faEyeSlash} />
                </div>
              </div>
            </div>
            <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                {loading ? (
                  <Image
                    src={Loader}
                    width={25}
                    priority
                    alt="loading"
                  />
                ) : isSignup === "/signup" ? "Sign up" : btntitle}
              </button>
            </div>
          </form>
          {isSignup === "/signup" && <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">login</Link>
          </p>}
        </div>
      </div>
    </>
  );
};

export default Signup;
