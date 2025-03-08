import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import SingUp from './Components/clientSignUp/signUp.jsx'
import LogIn from './Components/clientSignUp/login.jsx'
import Approved from './Components/approve.jsx';
import ToDo from './Components/todo.jsx';
import Payment from './Components/payment.jsx';
import FoldersToDo from './Components/toDo-folders.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/signup',
    element: <SingUp/>
  },
  {
    path: '/login',
    element: <LogIn/>
  },
  {
    path: '/verify',
    element: <Approved/>
  }, 
  {
    path: '/to-do',
    element: <FoldersToDo/>
  },
  {
    path: '/to-do/:id',
    element: <ToDo/>
  },
  {
    path: '/payment',
    element: <Payment/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
