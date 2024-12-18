import React from "react";
import Cards from "../components/Home/Cards";

const ImportantTasks = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 drop-shadow-lg">
        Important Tasks
      </h1>
      <Cards home={"false"} apiRoute="/get-imp-tasks" />
    </div>
  );
};

export default ImportantTasks;