"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
import loader from "@/app/assets/loader/loader.gif"
import Todo from "../todos/page";
import Image from "next/image";

import { EditTodoContext } from "../components/rootcomponent/page";

const CreateTodo = () => {

  const maxLength = 15000;
  const labelClasses = "block text-sm font-medium leading-6 text-white";

  const { editTodo } = useContext(EditTodoContext);
  const [loading, setLoading] = useState(false);
  const [todosUpdated, setTodosUpdated] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: ""
  });
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const countWords = (text) => {
    const words = text.split(/\s+/);  // Split the text by spaces (and handle multiple spaces)
    const numWords = words.filter(word => word.length > 0).length;  // Filter out any empty strings
    return numWords;
  };

  useEffect(() => {
    const textarea = document.getElementById('titletext');
    const dtextarea = document.getElementById('desctext');
    dtextarea.style.height = "auto";
    textarea.style.height = 'auto';
    dtextarea.style.height = `${dtextarea.scrollHeight}px`;
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [input.title, input.description]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      if (value.length <= maxLength) {
        setInput({ ...input, [name]: value });
        setCharCount(value.length);
        setWordCount(countWords(value));
      }
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const handleSavetodo = async (e) => {
    e.preventDefault();

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
        });
        setCharCount(0);
        setWordCount(0);
        setTodosUpdated(true);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 justify-center flex-col md:px-6 px-1 py-12 lg:px-8">
      {editTodo && (
        <div className="bg-gray-800 lg:w-3/4 mx-auto md:w-3/4 w-full rounded-lg mb-3 py-10 px-2">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <p className="text-gray-400 text-extrabold text-3xl text-center font-bold">CREATE TODO</p>
          </div>

          <div className="mt-5 rounded-lg sm:mx-auto md:w-9/12 w-full">
            <form method="POST" onSubmit={handleSavetodo} className="space-y-3">
              <div>
                <label htmlFor="title" className={labelClasses}>
                  Todo title:
                </label>
                <div className="mt-2">
                  <textarea
                    name="title"
                    rows={1}
                    spellCheck="true"
                    id="titletext"
                    value={input.title}
                    onChange={handleInputChange}
                    className="resize-none block px-2 w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
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
                    rows={2}
                    spellCheck="true"
                    id="desctext"
                    maxLength={maxLength}
                    value={input.description}
                    onChange={handleInputChange}
                    className="resize-none block px-2 w-full rounded-md border-0 py-2 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                    placeholder="Enter description here"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 text-right" style={{ fontSize: 12 }}>
                  Words: {wordCount}, Characters: {charCount}/{maxLength}
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
        </div>
      )}

      <Todo refreshTodos={todosUpdated} setTodosUpdated={setTodosUpdated} />
    </div>
  );
};

export default CreateTodo;
