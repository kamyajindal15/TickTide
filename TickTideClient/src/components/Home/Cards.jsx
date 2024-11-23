import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";

const Cards = ({ home, setInputDiv, apiRoute }) => {
  const [data, setData] = useState([]);
  const [editTask, setEditTask] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch tasks based on the passed apiRoute prop
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/v2${apiRoute}`, {
          headers,
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
      }
    };

    if (apiRoute) {
      fetchTasks();
    }
  }, [apiRoute, headers]);

  // Toggle task completion
  const handleCompletedTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:1000/api/v2/update-complete-task/${id}`,
        {},
        { headers }
      );
      setData((prevData) =>
        prevData.map((task) =>
          task._id === id ? { ...task, complete: !task.complete } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
    }
  };

  // Toggle task importance
  const handleImportantTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:1000/api/v2/update-important-task/${id}`,
        {},
        { headers }
      );
      setData((prevData) =>
        prevData.map((task) =>
          task._id === id ? { ...task, important: !task.important } : task
        )
      );
    } catch (error) {
      console.error("Error updating important status:", error.response?.data || error.message);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:1000/api/v2/delete-task/${id}`, {
        headers,
      });
      setData((prevData) => prevData.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error.response?.data || error.message);
    }
  };

  // Edit task
  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
      // Send the updated task data to the backend
      await axios.put(
        `http://localhost:1000/api/v2/update-task/${editTask._id}`,
        { title: editTask.title, desc: editTask.desc },
        { headers }
      );

      // Update the task in the UI
      setData((prevData) =>
        prevData.map((task) =>
          task._id === editTask._id ? { ...editTask } : task
        )
      );

      // Close the edit form
      setEditTask(null);
    } catch (error) {
      console.error("Error editing task:", error.response?.data || error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {data.length > 0 ? (
        data.map((items, i) => (
          <div
            key={i}
            className="flex flex-col justify-between bg-gray-400 rounded-sm p-4"
          >
            <div>
              <h3 className="text-xl font-semibold">{items.title}</h3>
              <p className="text-gray-800 my-2">{items.desc}</p>
            </div>
            <div className="mt-4 w-full flex items-center">
              <button
                className={`${
                  items.complete ? "bg-green-700" : "bg-red-400"
                } px-2 py-1 rounded w-3/6`}
                onClick={() => handleCompletedTask(items._id)}
              >
                {items.complete ? "Completed" : "Incomplete"}
              </button>
              <div className="p-2 w-3/6 font-semibold text-xl flex justify-around">
                <button onClick={() => handleImportantTask(items._id)}>
                  {items.important ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
                </button>
                <button onClick={() => setEditTask(items)}>
                  <MdEdit />
                </button>
                <button onClick={() => handleDeleteTask(items._id)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-gray-500">No tasks available.</h1>
      )}
      {home === "true" && (
        <button
          className="flex flex-col justify-center items-center bg-gray-400 rounded-sm p-4 text-gray-800 hover:scale-105 hover:cursor-pointer transition-all duration-300"
          onClick={() => setInputDiv("fixed")}
        >
          <IoIosAddCircle className="text-4xl" />
          <h2 className="text-2xl mt-4">Add Task</h2>
        </button>
      )}
      {editTask && (
        <div className="fixed top-0 left-0 h-screen w-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-gray-900 text-white p-6 rounded w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4 text-center">Edit Task</h2>
            <form onSubmit={handleEditTask} className="flex flex-col items-start">
              <label className="text-white mb-2 font-semibold">Title:</label>
              <input
                type="text"
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded mb-4"
                placeholder="Enter task title"
                required
              />
              <label className="text-white mb-2 font-semibold">Description:</label>
              <textarea
                value={editTask.desc}
                onChange={(e) => setEditTask({ ...editTask, desc: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded mb-4"
                rows="5"
                placeholder="Enter task description"
                required
              />
              <div className="w-full flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-center w-1/2"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-center w-1/2 ml-2"
                  onClick={() => setEditTask(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
