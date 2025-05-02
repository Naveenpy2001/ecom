import React, { useEffect } from 'react'
import axios from 'axios'

const Todo = () => {

  useEffect(() => {
    
    fetchData()
  },[])

  const fetchData = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/products/published/')
    console.log(res.data);
  }
  return (
    <div>
      hello
    </div>
  )
}

export default Todo