import { useState } from 'react'
import Products from './pages/Products'
import {Routes,Route} from 'react-router-dom'
import Todo from './pages/Todo'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './App.css'
import OrderHistory from './pages/OrderHistory'


function App() {


  return (
    <>
    <Routes>

      <Route path='/' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/products' element={<Products />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/orderslist' element={<OrderHistory />} />
      <Route path='/todo' element={<Todo />} />
    </Routes>
    </>
  )
}

export default App
