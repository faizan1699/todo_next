"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import loader from "@/app/assets/loader/loader.gif";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Contacts from "../components/getcontacts/contacts";

const SendMessage = () => {
  const router = useRouter();
  const labelClasses = "block text-sm font-medium leading-6 text-white";
  const inputclass = "px-2 w-full rounded-t-md border-0 py-3 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6";
  const textareaclass =  "resize-y px-2 w-full rounded-t-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6";

  const [showmsg, setShowMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getmsg, setGetMsg] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    contact: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const { message, name, contact, email } = input;
    const inputdata = {
      name: name,
      email: email,
      contact: contact,
      message: message
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/contact", inputdata);
      toast.success(response?.data?.message);
      setLoading(false);
      setInput({
        name: "",
        email: "",
        contact: "",
        message: ""
      });

      setShowMsg(true);
      setGetMsg(true);
    } catch (error) {
      if (error.status === 422) {
        toast.error(error?.response?.data?.message);
      }
      else if (error?.response?.status === 403) {
        toast.info(error?.response?.data?.message);
       }
      else if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message);
      }
      else {
        toast.info(error?.response?.data?.message);
      }
      setLoading(false);

    }

  };

  const showMessages = () => {
    setShowMsg(true);
  };

  return (
    <div className="grid grid-cols-12 py-6">
      <div className={`col-span-12 ${!showmsg && "lg:w-3/6"} ${!showmsg && "md:w-3/6"} md:col-span-${showmsg === true ? 6 : 12} w-full lg:col-span-${showmsg === true ? 6 : 12} flex mx-auto flex-col px-1 lg:px-5 sm:mb-8`}>
        <div className={`bg-gray-800 rounded-t-lg py-10 px-2 `}>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <p className="mt-1 text-gray-700 text-extrabold text-3xl text-center font-bold">Contact Us</p>
          </div>
          <div className="mt-5 rounded-lg sm:mx-auto md:w-9/12 w-full">
            <form method="POST" onSubmit={sendMessage} className="space-y-3">
              <div>
                <label htmlFor="name" className={labelClasses}>
                  Enter Your Name:
                </label>
                <div className="mt-2">
                  <input
                    name="name"
                    type="text"
                    value={input.name}
                    onChange={handleInputChange}
                    className={inputclass}
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact" className={labelClasses}>
                  Enter Your Contact (<span style={{ fontSize: 12 }}>optional</span>)
                </label>
                <div className="mt-2">
                  <input
                    name="contact"
                    type="number"
                    min={10}
                    id="numberInput"
                    value={input.contact}
                    onChange={handleInputChange}
                    className={inputclass}
                    placeholder="Enter contact here"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>
                  Enter Email
                </label>
                <div className="mt-2">
                  <input
                    name="email"
                    type="email"
                    value={input.email}
                    onChange={handleInputChange}
                    className={inputclass}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className={labelClasses}>
                  Enter Your Message:
                </label>
                <div className="mt-2">
                  <textarea
                    name="message"
                    rows={5}
                    value={input.message}
                    onChange={handleInputChange}
                    className={textareaclass}
                    placeholder="Enter your message here"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loading ? (
                    <Image src={loader} width={25} priority alt="loading" />
                  ) : (
                    "Send your message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <button onClick={showMessages} className="flex w-full justify-center rounded-b-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          See your messages
        </button>
      </div>

      <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:mt-0 md:mt-0 mt-1 px-1">
        <Contacts showmsg={showmsg} getmsg={getmsg} setGetMsg={setGetMsg} />
      </div>
    </div>
  );
};

export default SendMessage;
