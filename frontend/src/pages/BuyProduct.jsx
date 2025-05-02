import axios from 'axios'
import React, { useState } from 'react'

const BuyProduct = ({product,token,fetchProducts}) => {
    const [quantity,setQuantity] = useState(1)
    const [message,setMessage] = useState('')

    const handleBuy =async() => {
        try {
            const res =await axios.post(`http://127.0.0.1:8000/api/orders/`,{
                product : product.id,
                quantity,
                total_price : product.price * quantity
            },{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            await fetchProducts();
            console.log(res);
            setMessage('Purchase Successful!')
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
    <div className='products'>

        <h4> {product.name} </h4>
        <img src={product.images} alt={product.name} width={100}/>
        <p> Price : <i>{product.price}</i> </p>
        <p>Stock : {product.units === 0 ? <b style={{color:'red'}}>"Out Of Stock"</b> : <b style={{color:'green'}}>{product.units} Available</b> }</p>
        <input type="text"  min={1} max={product.stock} value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
        <button onClick={handleBuy} disabled={product.units === 0} style={{ cursor: product.units === 0 ? 'not-allowed' : ''}}>Buy</button>
        {message && <p> {message} </p> }

    </div>
  )
}

export default BuyProduct