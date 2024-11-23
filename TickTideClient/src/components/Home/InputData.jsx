import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const InputData = ({ InputDiv, setInputDiv, setData }) => {
  const [task, setTask] = useState({ title: "", desc: "" });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setInputDiv("hidden"); // Close the modal immediately

    try {
      const response = await axios.post(
        "http://localhost:1000/api/v2/create-task",
        task,
        { headers }
      );

      const newTaskData = {
        ...task,
        _id: response.data._id,
        complete: false,
        important: false,
      };

      setData((prevData) => [newTaskData, ...prevData]); // Update tasks in the parent component
      setTask({ title: "", desc: "" }); // Clear the form
    } catch (error) {
      console.error("Error adding task:", error.response?.data || error.message);
    }
  };

  return (
    <>
      {/* Background overlay */}
      <div
        className={` ${InputDiv} fixed top-0 left-0 bg-gray-800 opacity-50 h-screen w-full`}
      />
      {/* Form modal */}
      <div
        className={` ${InputDiv} fixed top-0 left-0 flex items-center justify-center h-screen w-full`}
      >
        <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-gray-900 rounded p-4 text-white">
          <div className="flex justify-end">
            <button
              className="text-2xl text-white mb-3"
              onClick={() => setInputDiv("hidden")}
            >
              <RxCross2 />
            </button>
          </div>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="px-3 py-2 rounded w-full bg-gray-700"
              required
            />
            <textarea
              name="desc"
              cols="30"
              rows="10"
              placeholder="Description..."
              value={task.desc}
              onChange={(e) => setTask({ ...task, desc: e.target.value })}
              className="px-3 py-2 rounded w-full bg-gray-700 my-3"
              required
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-500 rounded text-black text-xl w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InputData;
