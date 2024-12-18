import React from 'react';
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { TbNotebookOff } from "react-icons/tb";
import { FiBarChart } from "react-icons/fi"; // Add an icon for the Report button
import { Link, useNavigate } from "react-router-dom";
import { authActions } from '../../store/auth';
import { useDispatch } from 'react-redux';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Corrected the variable name here

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  const data = [
    { title: "All Tasks", icon: <CgNotes />, link: "/" },
    { title: "Important Tasks", icon: <MdLabelImportant />, link: "/importantTasks" },
    { title: "Completed Tasks", icon: <FaCheckDouble />, link: "/completedTasks" },
    { title: "Incomplete Tasks", icon: <TbNotebookOff />, link: "/incompleteTasks" },
    { title: "Report", icon: <FiBarChart />, link: "/report" }, // Report button link update
  ];

  const logout = () => {
    dispatch(authActions.logout());
    localStorage.clear();
    navigate("/signUp");  // Navigate to SignUp page after logout
  };

  return (
    <>
      <div className="text-center mb-4">
        {name && email ? (
          <>
            <h2 className="text-xl font-semibold">{name}</h2>
            <h4 className="mb-1 text-gray-900">{email}</h4>
          </>
        ) : (
          <p className="text-gray-500">User details not available.</p>
        )}
        <hr className="my-4 border-gray-300" />
      </div>

      <div className="flex-grow flex flex-col items-start">
        {data.map((item, i) => (
          <Link
            to={item.link}
            key={i}
            className="my-2 flex items-center hover:bg-black hover:text-white transition-all duration-300 px-2 py-1 rounded"
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <button
          className="bg-gray-300 hover:bg-gray-400 w-full p-2 rounded text-center"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    </>
  );
};

export default Sidebar;
