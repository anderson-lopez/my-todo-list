import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai'
import { BiSave } from "react-icons/bi";
import { CgMoreVertical } from "react-icons/cg";
import axios from 'axios';
import ModalReusable from '../Modal/ModalReusable';



const Logs = ({ todo, updateTodos }) => {
  const [stateModal, setStateModal] = useState(false)
  //Obtener id
  const [currentId, setCurrentId] = useState("");
  //Obtener datos de los inputs
  const [task, setTask] = useState({ title: '', descripcion: '', })
  //Manejador de errores, inputs vacios
  const [error, setError] = useState(false);
  //Manejador de éxito
  const [success, setSuccess] = useState(false);
  const [seeMore, setSeeMore] = useState(false)
  //Extraccion de valores
  const { title, descripcion } = task;

  //Funcion escucha cuando el usuario escribe
  const handleTask = e => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    })
  }

  const editTask = (e) => {
    e.preventDefault();

    //validacion de los campos
    if (title.trim() === '' || descripcion.trim() === '') {
      setError(true)
      return;
    }
    setError(false)

    axios
      .put(`https://6411afc8b6067ba2f141c093.mockapi.io/api/v1/todos/${currentId}`, { title: task.title, description: task.descripcion })
      .then(() => {
        updateTodos();
      })
      .catch((error) => console.log(error))
    setSuccess(true);
    updateTodos();

    setTask({
      title: '',
      descripcion: '',
    })
    closeAll()
  }

  const closeAll = () => {
    setSuccess(false)
  }

  const handleSeeMore = (id) => {
    setCurrentId(id)
    setSeeMore(true);
  }

  const handleSeeLess = () => {
    setCurrentId("")
    setSeeMore(false)
  }

  const handleOpenModal = (id) => {
    setCurrentId(id)
    setStateModal(!stateModal)
  }

  const handleDeleteTask = (id) => {
    axios
      .delete(`https://6411afc8b6067ba2f141c093.mockapi.io/api/v1/todos/${id}`)
      .then(() => {
        updateTodos();
        alert(`Se eliminó corectamente la tarea Nº: ${id}`)
      })
      .catch((error) => console.log(error))
  }

  return (
    <div className={`text-gray-400 scrollbar justify-center w-full h-full bg-gray-600/30 flex flex-wrap items-center p-6`}>
      {
        todo.map((todo, index) => (
          todo.id === currentId
            ?
            <ModalReusable key={index} isTitle={true} title={currentId} stateModal={stateModal} setStateModal={setStateModal}>
              <form onSubmit={editTask} action="none" className={`w-full h-full flex flex-col items-center justify-start py-6 `}>
                {error ? <h2 className='text-red-700 uppercase'><strong>Todos los campos son requeridos</strong></h2> : success ? <h2 className='text-green-700 uppercase'><strong>La tarea se ha actualizado correctamente</strong></h2> : null}
                <input className={`placeholder-slate-900/60 bg-slate-300 text-black w-3/4 h-12 rounded-lg px-2 my-5`} type="text" name="title" id="title" placeholder='Editar Titulo' value={title} onChange={handleTask} />
                <textarea value={descripcion} onChange={handleTask} className={`placeholder-slate-900/60 bg-slate-300 text-black w-3/4 h-24 rounded-lg p-2`} placeholder={`Editar Descripcion`} name="descripcion" id="description" cols="20" rows="15"></textarea>
                <input className={`bg-slate-600 hover:bg-slate-800 cursor-pointer duration-300  w-3/4 h-12 rounded-lg my-5 p-2`} type="submit" value="Editar" />
              </form>
            </ModalReusable>
            : null
        ))
      }
      {todo
        ?
        todo.map((todo, index) => (
          <div key={index} className={`flex flex-col rounded-2xl w-[25rem] min-h-[32rem] bg-slate-700 m-7 p-5`}>
            <div className={`flex justify-around flex-col h-[8rem]`}>
              <div className={`flex  text-gray-400 `}>
                <h1 className={`text-xl my-1`}><strong>Titulo:</strong></h1>
                <h1 className={`text-xl mx-1  text-gray-300 px-2 `}><>{todo.title}</></h1>
              </div>
              <div className={`flex  text-gray-400 `}>
                <h1 className={`text-xl my-1`}><strong>Nº de Tarea:</strong></h1>
                <h1 className={`text-xl mx-1 text-gray-300 px-2 `}><>{todo.id}</></h1>
              </div>
            </div>
            <div className={`flex flex-col text-gray-400 overflow-hidden duration-300 h-[14rem] my-[1rem] `}>
              <h1 className={`text-xl my-1`}><strong>Descripcion:</strong></h1>
              <p className={`text-justify`}>{todo.description}</p>
            </div>
            <div className={`flex w-full h-[4rem]  justify-center items-center mt-3`}>
              <div onClick={() => handleOpenModal(todo.id)} className={`flex justify-between items-center h-8 p-1 bg-gray-800 mx-3 rounded-md hover:bg-slate-200 hover:text-black duration-300 cursor-pointer`}>
                <AiFillEdit className={`mx-1`} />
                <h2 className={`mx-1`}>Editar</h2>
              </div>
              <div onClick={todo.id === currentId ? () => handleSeeLess() : () => handleSeeMore(todo.id)} className={`flex justify-between items-center h-8 p-1 bg-gray-800 mx-3 rounded-md hover:bg-slate-200 hover:text-black duration-300 cursor-pointer`}>
                <CgMoreVertical className={`mx-1`} />
                <h2 className={`mx-1`}>Ver Mas</h2>
              </div>
              <div onClick={() => handleDeleteTask(todo.id)} className={`flex justify-between items-center h-8 p-1 bg-gray-800 mx-3 rounded-md hover:bg-slate-200 hover:text-black duration-300 cursor-pointer`}>
                <BsTrash className={`mx-1`} />
                <h2 className={`mx-1`}>Eliminar</h2>
              </div>
            </div>

          </div>
        ))
        : 
        <div className={`h-full w-full`}>
          <h1>no hay registros</h1>
        </div>
      }

    </div>
  )
}

export default Logs