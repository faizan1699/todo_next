"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import loader from "@/app/assets/loader/loader.gif"
import Todo from "../todos/page";
import Image from "next/image";

import { EditTodoContext } from "../components/rootcomponent/page";

const CreateTodo = () => {

  const maxLength = 1050;
  const labelClasses = "block text-sm font-medium leading-6 text-white";

  const { editTodo } = useContext(EditTodoContext);
  const [loading, setLoading] = useState(false);
  const [todosUpdated, setTodosUpdated] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: ""
  });
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      if (value.length <= maxLength) {
        setInput({ ...input, [name]: value });
        setCharCount(value.length);
      }
    } else {
      setInput({ ...input, [name]: value });
    }

  };

  const handleSavetodo = async (e) => {
    e.preventDefault()

    const x = localStorage.getItem("userToken");
    if (x) {
      setLoading(true);
      const y = JSON.parse(x);
      const email = y.email;
      try {
        const response = await axios.post("/api/users/userdata/createtodo", { ...input, email: email });
        toast.success(response?.data?.message);
        setLoading(false);
        setInput({
          title: "",
          description: ""
        })
        setTodosUpdated(true);
      }
      catch (error) {
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }
    }

  };

  return (

    <div className="flex min-h-full flex-1 justify-center flex-col md:px-6 px-1 py-12 lg:px-8">
      {editTodo && <div className="bg-gray-800 lg:w-3/4 mx-auto md:w-3/4 rounded-lg mb-3 py-10  px-2">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="text-gray-400 text-extrabold text-3xl text-center font-bold">CREATE TODO</p>
        </div>

        <div className="mt-5  rounded-lg sm:mx-auto md:w-9/12 w-full">
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
                  className="px-2 w-full rounded-md border-0 py-3 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
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
                  className="resize-y px-2  w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
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
      </div>}

      <Todo refreshTodos={todosUpdated} setTodosUpdated={setTodosUpdated} />

    </div>

  );
};

export default CreateTodo;
