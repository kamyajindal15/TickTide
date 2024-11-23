import React from 'react'
import Sidebar from '../components/Home/Sidebar'
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row h-[98vh] gap-4">
      <div className="w-full md:w-1/5 border border-gray-500 rounded-xl p-4 flex flex-col bg-gray-500 justify-between">
        <Sidebar />
      </div>
      <div className="w-full md:w-4/5 p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default Home;
