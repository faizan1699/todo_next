"use client";

import axios from "axios";
import { useState } from "react";

import loader from "@/app/assets/loader/loader.gif"
import Todo from "../todos/page";
import Image from "next/image";

const CreateTodo = () => {

  const maxLength = 1050;
  const labelClasses = "block text-sm font-medium leading-6 text-gray-900";
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: ""
  });
  const [charCount, setCharCount] = useState(0); // State for character count

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      // Calculate character count and enforce max length

      if (value.length <= maxLength) {
        setInput({
          ...input,
          [name]: value
        });
        setCharCount(value.length);
      }
    } else {
      setInput({
        ...input,
        [name]: value
      });
    }
    setMsg(null);
  };



  const handleSavetodo = async (e) => {
    e.preventDefault()

    const x = window.localStorage.getItem("userToken")
    if (x) {
      setLoading(true);
      const y = JSON.parse(x);
      const email = y.email;
      try {
        const response = await axios.post("/api/users/userdata/createtodo", { ...input, email: email });
        setMsg(response?.data?.message);
        setLoading(false);
        setInput({
          title: "",
          description: ""
        })
      }
      catch (error) {
           setMsg(error?.response?.data?.message);
        setLoading(false);
      }
    }

  };

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {msg && <p className="mt-1 text-center font-bold text-red-500">{msg}</p>}
        </div>

        <div className="mt-10 sm:mx-auto w-full sm:max-w-sm lg:w-3/4">
          <form method="POST" onSubmit={handleSavetodo} className="space-y-3">
            <div>
              <label htmlFor="title" className={labelClasses}>
                Todo title:
              </label>
              <div className="mt-2">
                <input
                  name="title"
                  type="text"
                  value={input.title}
                  onChange={handleInputChange}
                  className="px-1 block w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                  placeholder="Enter title here"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className={labelClasses}>
                Todo description:
              </label>
              <div className="mt-2">
                <textarea
                  name="description"
                  rows={5}
                  maxLength={maxLength}
                  value={input.description}
                  onChange={handleInputChange}
                  className="resize-y px-1 block w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                  placeholder="Enter description here"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 text-right" style={{ fontSize: 12 }}>
                {charCount}/{maxLength} characters
              </p>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? (
                  <Image src={loader} width={25} priority alt="loading" />
                ) : (
                  "Save Todo"
                )}
              </button>
            </div>
          </form>
        </div>

        <Todo />

      </div>
    </div>
  );
};

export default CreateTodo;
