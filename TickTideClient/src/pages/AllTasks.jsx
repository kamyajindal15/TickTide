import React, { useState, useEffect } from "react";
import Cards from "../components/Home/Cards";
import { IoIosAddCircle } from "react-icons/io";
import InputData from "../components/Home/InputData";
import axios from "axios";

const AllTasks = () => {
  const [InputDiv, setInputDiv] = useState("hidden"); // Controls input form visibility
  const [Data, setData] = useState([]); // Holds all tasks data
  const [refreshTasks, setRefreshTasks] = useState(false); // Trigger for re-fetching tasks dynamically

  // Headers for API authentication
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v2/get-all-tasks",
          { headers }
        );
        if (response.data && response.data.data) {
          setData(response.data.data); // Set tasks data from response
        }
      } catch (error) {
        console.error("Error fetching all tasks:", error.response?.data || error.message);
      }
    };

    fetchAllTasks();
  }, [refreshTasks]); // Trigger fetch when `refreshTasks` changes

  return (
    <>
      <div className="w-full px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#5f9ea0] mb-6 text-center">
          All Tasks
        </h1>
        <div className="flex justify-end p-2">
          <button
            onClick={() => setInputDiv(InputDiv === "hidden" ? "fixed" : "hidden")} // Toggle input form visibility
            className="text-4xl text-black hover:text-gray-600 transition-all duration-300"
          >
            <IoIosAddCircle />
          </button>
        </div>
        {/* Render tasks dynamically */}
        <Cards
          home={"true"}
          setInputDiv={setInputDiv}
          apiRoute="/get-all-tasks"  // Make sure to pass the correct apiRoute for fetching tasks
        />
      </div>

      {/* Input form for adding new tasks */}
      <InputData
        InputDiv={InputDiv}
        setInputDiv={setInputDiv}
        refreshTasks={() => setRefreshTasks(!refreshTasks)} // Trigger refresh after adding a task
      />
    </>
  );
};

export default AllTasks;
