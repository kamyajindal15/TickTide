import React from "react";
import Cards from "../components/Home/Cards";

const CompletedTasks = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-6 drop-shadow-lg">
        Completed Tasks
      </h1>
      <Cards home={"false"} apiRoute="/get-complete-tasks" />
    </div>
  );
};

export default CompletedTasks;