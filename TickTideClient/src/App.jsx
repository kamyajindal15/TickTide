import React, { useEffect } from 'react'
import Home from './pages/Home';
import './index.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import AllTasks from './pages/AllTasks';
import ImportantTasks from './pages/ImportantTasks';
import CompletedTasks from './pages/CompletedTasks';
import IncompleteTasks from './pages/IncompleteTasks';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/auth';
const App = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    if(localStorage.getItem("id") && localStorage.getItem("token")) {
      dispatch(authActions.login());
    }
    else if(isLoggedIn === false) {
      navigate("/signUp");
    }
  }, []);
  
  return <div className="bg-[#d7ddde] text-black h-screen p-2 relative">
      <Routes>
        <Route exact path="/"  element= {< Home />}>
          <Route index element={<AllTasks />} />
          <Route path='/importantTasks' element={<ImportantTasks />} />
          <Route path='/completedTasks' element={<CompletedTasks />} />
          <Route path='/incompleteTasks' element={<IncompleteTasks />} />
        </Route>
        <Route path='/signUp' element={<SignUp />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
  </div>
};

export default App;