"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

import loader from '../assets/loader/loader.gif';
import Image from 'next/image';


const Todo = ({ refreshTodos , setEdit }) => {

  const maxLength = 1050;
  const labelClasses = "block text-sm font-medium leading-6 text-white ";

  const [msg, setMsg] = useState(null);

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [delmsg, setDelMsg] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [isedit, setIsEdit] = useState(false);
  const [todovalue, setTodoValue] = useState({});

  const [input, setInput] = useState({
    title: "",
    description: "",
    iscompleted: ""
  });

  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
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


  useEffect(() => {
    handleGetTodo();
  }, [refreshTodos]);

  const handleGetTodo = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users/userdata/gettodos');
      setTodos(response?.data?.todos);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete('/api/users/userdata/gettodos', { data: { id } });
      setTodos(response?.data?.todos);
      setDelMsg(response?.data?.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setDelMsg(error?.response?.data?.message);
    }
    setTimeout(() => {
      setDelMsg(null);
    }, 3000);
  };
  useEffect(() => {
    // Update input state whenever todovalue changes
    setInput({
      title: todovalue.title || "",
      description: todovalue.description || ""
    });
  }, [todovalue]);

  const updateTodo = (index, id, title, description) => {
    setIsEdit(true);
    setEdit(false);
    setTodoValue({
      id, title, description
    })

  };
  const handleUpdatetodo = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const response = await axios.put(`/api/users/userdata/createtodo`, {
        id: todovalue.id,
        title: input.title,
        description: input.description,
        iscompleted: input.iscompleted,
      });
      setTodos(response?.data?.todos);
      setMsg(response?.data?.message);
      setFormLoading(false);
      handleGetTodo();
      setInput({
        title: "",
        description: ""
      });
      setIsEdit(false);
      setEdit(true);
    } catch (error) {
      console.log(error);
      setFormLoading(false);
      setMsg(error?.response?.data?.message);
    }

    setTimeout(() => {
      setMsg(null);
    }, 5000);
  }

  const toggleTruncate = (index) => {
    setExpandedIndex(expandedIndex === index ? 1 : index);
  };

  function formatDate(date) {
    const formattedDate = new Date(date);
    const shortYear = formattedDate.getFullYear().toString().slice(-2);
    const formattedDateString = `${formattedDate.getDate()}-${formattedDate.getMonth() + 1}-${shortYear} ${formattedDate.getHours()}:${formattedDate.getMinutes()}`;
    return formattedDateString;
  }

  return (

    <>

      {isedit && <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-800 my-3 rounded-lg">
        <h3 className='text-center text-4xl text-extrabold text-gray-400'>Update Todo</h3>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {msg && <p className="mt-1 text-center font-bold text-red-500">{msg}</p>}
        </div>

        <div className="mt-10 sm:mx-auto md:w-9/12 w-full">
          <form method="POST" onSubmit={handleUpdatetodo} className="space-y-3">
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
                  className="px-2  w-full rounded-md border-0 py-3 text-red-900 ring-1 ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
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
                {formloading ? (
                  <Image src={loader} width={25} priority alt="loading" />
                ) : (
                  "Update Todo"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>}
      <div className="border-2 p-3 mt-8 md:mx-10 bg-zinc-100 rounded-lg">
        <h3 className="text-center text-5xl text-zinc-300 font-extrabold mb-5">TODOS</h3>
        <h3 className="text-center subpixel-antialiased underline text-zinc-500 text-1xl font-extrabold mb-5 cursor-pointer" onClick={handleGetTodo}>
          Reload
        </h3>
        {msg && <p className="mt-1 text-center font-bold text-red-500">{msg}</p>}
        {delmsg && (
          <h3 className="text-center subpixel-antialiased underline text-red-500 text-md font-extrabold mb-5 cursor-pointer">{delmsg}</h3>
        )}

        <div className="flex my-3 justify-center">{loading ? <Image width={50} src={loader} alt="loader" /> : null}</div>

        {todos?.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-center">
            {todos.map((todo, index) => (
              <div key={index} className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 cursor-pointer">
                    {/* Conditional rendering of truncated or full title */}
                    {expandedIndex === index ? (
                      <div>
                        {todo.title}
                        <div style={{ fontSize: 12 }} className="text-blue-500 hover:underline focus:outline-none ml-2" onClick={() => toggleTruncate(-1)}>
                          Showless
                        </div>
                      </div>
                    ) : (
                      <div>
                        {todo.title.slice(0, 35)}
                        {todo.title.length > 35 && (
                          <div style={{ fontSize: 12 }} className="text-red-500 hover:underline focus:outline-none ml-2" onClick={() => toggleTruncate(index)}>
                            Readmore....
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-base cursor-pointer">{todo.description}</p>
                </div>
                <div className="px-6 pt-4 pb-2 flex justify-between items-center text-xs">
                  <span className="inline-block cursor-pointer bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700">
                    Created at: {formatDate(todo.updatedat)}
                  </span>
                  <div className="flex">
                    <div className="bg-gray-200 p-1 px-2 rounded-full ml-1" onClick={() => deleteTodo(todo._id)}>
                      <FontAwesomeIcon className="cursor-pointer" icon={faTrashAlt} />
                    </div>
                    <div className="bg-gray-200 p-1 px-2 rounded-full ml-1" onClick={() => updateTodo(index, todo._id, todo.title, todo.description)}>
                      <FontAwesomeIcon className="cursor-pointer" icon={faEdit} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="text-center text-4xl text-zinc-200 font-extrabold mb-5">NO TODOS AVAILABLE</h3>
        )}
      </div>
    </>
  );
};

export default Todo;
