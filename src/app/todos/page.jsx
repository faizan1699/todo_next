"use client"
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Image from 'next/image';
import loader from '../assets/loader/loader.gif';

import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faXmark } from '@fortawesome/free-solid-svg-icons';


const Todo = ({ refreshTodos, setEdit }) => {

  const maxLength = 1050;
  const labelClasses = "block text-sm font-medium leading-6 text-white ";
  const readmoreclass = "text-red-500 hover:underline focus:outline-none ml-2";
  const readlessclass = "text-blue-500 hover:underline focus:outline-none ml-2";

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formloading, setFormLoading] = useState(false);
  const [expandedtitle, setExpandedTitle] = useState(-1);
  const [isedit, setIsEdit] = useState(false);
  const [truncdesc, setTruncDesc] = useState(-1);
  const [todovalue, setTodoValue] = useState({});
  const [charCount, setCharCount] = useState(0);

  const [input, setInput] = useState({
    title: "",
    description: "",
    iscompleted: ""
  });


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
      toast.success(response?.data?.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }

  };
  useEffect(() => {
    setInput({
      title: todovalue.title || "",
      description: todovalue.description || ""
    });
  }, [todovalue]);

  const updateTodo = (index, id, title, description) => {
    setIsEdit(true);
    setEdit(false);
    toast.info("now you can edit user");
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
      toast.success(response?.data?.message);
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
      toast.error(error?.response?.data?.message);
    }

  }

  const toggleTruncateTitle = (index) => {
    setExpandedTitle(expandedtitle === index ? 1 : index);
  };

  const toggleTruncateDescription = (index) => {
    setTruncDesc(truncdesc === index ? 2 : index);
  }
  const HideTodoform = () => {
    setIsEdit(false);
    setEdit(true);
  }

  function formatDate(date) {
    const formattedDate = new Date(date);
    const shortYear = formattedDate.getFullYear().toString().slice(-2);
    const formattedDateString = `${formattedDate.getDate()}-${formattedDate.getMonth() + 1}-${shortYear} ${formattedDate.getHours()}:${formattedDate.getMinutes()}`;
    return formattedDateString;
  }

  return (

    <>

      {isedit && <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-12 bg-gray-800 my-3 rounded-lg">
        <div className="flex justify-between items-center">
          <div className='updatetodoDivempty'></div>
          <h3 className='text-center text-4xl text-nowrap text-extrabold text-gray-400 mx-auto'>Update Todo</h3>
          <div className='text-red-800 pr-10 ml-2'>
            <FontAwesomeIcon className='border bg-white rounded-full' style={{ padding: "5 6" }} onClick={HideTodoform} icon={faXmark} />
          </div>
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

      <div className="mt-10 sm:mx-auto md:w-12/12 py-10 w-full bg-gray-800 rounded-lg px-2 flex justify-center">

        <div>

          <h3 className="text-center text-5xl text-white font-extrabold mb-5">TODOS</h3>
          <h3 className="text-center subpixel-antialiased underline text-white text-1xl font-extrabold mb-5 cursor-pointer" onClick={handleGetTodo}>
            Reload
          </h3>

          <div className="flex my-3 justify-center">{loading ? <Image width={50} src={loader} alt="loader" /> : null}</div>

          {todos?.length > 0 ? (

            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-center">

              {todos.map((todo, index) => (

                <div key={index} className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg">
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 cursor-pointer">

                      {expandedtitle === index ? (
                        <div className='text-justify'>
                          {todo.title}
                          <div style={{ fontSize: 12 }} className={readlessclass} onClick={() => toggleTruncateTitle(-1)}>
                            Showless
                          </div>
                        </div>
                      ) : (
                        <div className='text-justify'>
                          {todo.title.slice(0, 35)}
                          {todo.title.length > 35 && (
                            <div style={{ fontSize: 12 }} className={readmoreclass} onClick={() => toggleTruncateTitle(index)}>
                              Readmore....
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className=" mb-2 cursor-pointer">

                      {truncdesc === index ? (
                        <div className='text-justify'>
                          {todo.description}
                          <div style={{ fontSize: 12 }} className={readlessclass} onClick={() => toggleTruncateDescription(-1)}>
                            Showless
                          </div>
                        </div>
                      ) : (
                        <div className='text-justify'>
                          {todo.description.slice(0, 77)}
                          {todo.description.length > 77 && (
                            <div style={{ fontSize: 12 }} className={readmoreclass} onClick={() => toggleTruncateDescription(index)}>
                              Readmore....
                            </div>
                          )}
                        </div>
                      )}
                    </div>

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
      </div>
    </>
  );
};

export default Todo;
