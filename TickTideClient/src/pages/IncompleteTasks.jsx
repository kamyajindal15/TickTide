import React from "react";
import Cards from "../components/Home/Cards";

const IncompleteTasks = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-6 drop-shadow-lg">
        You have some leftover tasks!!
      </h1>
      <Cards home={"false"} apiRoute="/get-incomplete-tasks" />
    </div>
  );
};

export default IncompleteTasks;