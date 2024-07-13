"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faEdit } from "@fortawesome/free-solid-svg-icons";

import loader from "../assets/loader/loader.gif";
import Image from "next/image";

const Todo = () => {

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [delmsg, setDelMsg] = useState(null);

  useEffect(() => {
    handleGetTodo();
  }, []);

  const handleGetTodo = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users/userdata/gettodos");
      setTodos(response.data.todos)
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteTodo = async (index, id) => {
    setLoading(true);
    try {
      const response = await axios.delete("/api/users/userdata/gettodos", { data: { id } });
      setTodos(response.data.todos)
      setDelMsg(response.data.message);
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      setLoading(false);
      setDelMsg(error.response.data.message);
    }
    setTimeout(() => {
      setDelMsg(null)
    }, 3000);
  }

  function formatDate(date) {
    const formattedDate = new Date(date);
    const shortYear = formattedDate.getFullYear().toString().slice(-2);
    const formattedDateString = `${formattedDate.getDate()}-${formattedDate.getMonth() + 1}-${shortYear} ${formattedDate.getHours()}:${formattedDate.getMinutes()}`;
    return formattedDateString;
  }

  return (

    <div className="border-2 p-3  mt-8 md:mx-10 bg-zinc-100 rounded-lg">
      <h3 className="text-center text-5xl text-zinc-300 font-extrabold mb-5">TODOS</h3>
      <h3 className="text-center subpixel-antialiased underline text-zinc-500 text-1xl font-extrabold mb-5 cursor-pointer" onClick={handleGetTodo} >Reload</h3>
      {delmsg && <h3 className="text-center subpixel-antialiased underline text-red-500 text-md font-extrabold mb-5 cursor-pointer" >{delmsg}</h3>}

      <div className="flex my-3 justify-center">
        {loading ? <><Image width={50} src={loader} alt="loader" /></> : null}
      </div>

      {todos.length > 0 ? <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-center">
        {todos && todos.map((todo, index) => (
          <div key={index} className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 cursor-pointer">{todo.title}</div>
              <p className="text-gray-700 text-base cursor-pointer">{todo.description}</p>
            </div>
            <div className="px-6 pt-4 pb-2 flex justify-between items-center text-xs">
              <span className="inline-block cursor-pointer bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 ">Created at: {formatDate(todo.createdat)}</span>
              <div className="bg-gray-200 p-1 px-2 rounded-full ml-1" onClick={() => deleteTodo(index, todo._id)} >
                <FontAwesomeIcon className="cursor-pointer" icon={faTrashCan} />
                <FontAwesomeIcon className="cursor-pointer" icon={faEdit} />
              </div>
            </div>
          </div>
        ))}
      </div>
        :
        <h3 className="text-center text-4xl text-zinc-200 font-extrabold mb-5">NOT HAVE TODO</h3>
      }

    </div>

  );
};

export default Todo;
