"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import loader from "@/app/assets/loader/loader.gif";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CreateTodo = () => {

  const router = useRouter();
  const labelClasses = "block text-sm font-medium leading-6 text-white";
  const inputclass = "px-2 w-full rounded-md border-0 py-3 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6";
  const textareaclass = "resize-y px-2 w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6";

  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const numberInput = document.getElementById('numberInput');

    if (numberInput) {
      const handleKeyDown = (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault();
        }
      };

      const handleWheel = (event) => {
        event.preventDefault();
      };

      numberInput.addEventListener('keydown', handleKeyDown);
      numberInput.addEventListener('wheel', handleWheel);

      return () => {
        numberInput.removeEventListener('keydown', handleKeyDown);
        numberInput.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    const inputdata = {
      name: input.name,
      email: input.email,
      contact: input.contact,
      message: input.message
    }
    try {
      const response = await axios.post("/api/contact", inputdata);
      toast.success(response?.data?.message);
      setLoading(false);

      setInput({
        name: "",
        email: "",
        contact: "",
        message: ""
      })
      
    } catch (error) {

      toast.error(error?.response?.data?.message);
      setLoading(false);

      if (error?.response?.status === 403) {
        router.push('/signup');
      }
    }
  };

  return (
    <div className="flex md:w-1/2 w-full min-h-full mx-auto justify-center flex-col md:px-6 px-1 py-12 lg:px-8">
      <div className="bg-gray-800 rounded-lg mb-3 py-10 px-2">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="mt-1 text-gray-400 text-extrabold text-3xl text-center font-bold">Contact Us</p>
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
                  required
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
                  required
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
                  required
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
    </div>
  );
};

export default CreateTodo;
