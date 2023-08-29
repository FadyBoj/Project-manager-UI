import React from 'react'
import { createBrowserRouter } from "react-router-dom";

//pages
import MainPage from './pages/MainPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
]);

export default router