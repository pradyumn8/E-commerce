import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'

const Order = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      // console.log(response.data);
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event,orderId)=>{
    try {
      const response = await axios.post(backendUrl+'/api/order/status',{orderId,status:event.target.value},{headers:{token}})
      console.log(response.data)
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.console.error(response.data.message);
      
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div class="p-4 md:p-8">
    <h3 class="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Order Page</h3>
    <div>
      {
        orders.map((order, index) => (
          <div
            class="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-200 rounded-lg p-4 md:p-6 mb-4"
            key={index}
          >
            {/* <!-- Parcel Icon --> */}
            <img class="w-12 h-auto" src={assets.parcel_icon} alt="Parcel Icon" />
  
            {/* <!-- Order Details --> */}
            <div>
              <div>
                {order.items.map((item, index) => (
                  <p class="py-0.5 text-gray-700">
                    {item.name} x {item.quantity} <span>{item.size}</span>
                    {index !== order.items.length - 1 && ','}
                  </p>
                ))}
              </div>
              <p class="mt-3 mb-2 font-medium text-gray-800">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div class="text-gray-600">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city + "," + order.address.state + "," + order.address.country + "," + order.address.zipcode}
                </p>
                <p>{order.address.phone}</p>
              </div>
            </div>
  
            {/* <!-- Payment & Status --> */}
            <div>
              <p class="text-gray-700 text-sm sm:text-base">Items: {order.items.length}</p>
              <p class="mt-3 text-gray-700">Method: {order.paymentMethod}</p>
              <p class={`text-${order.payment ? "green" : "red"}-600`}>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
  
            {/* <!-- Total Amount --> */}
            <div class="text-gray-800 text-sm sm:text-base font-semibold">
              {currency}{order.amount}
            </div>
  
            {/* <!-- Status Dropdown --> */}
            <div>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} class="border border-gray-300 rounded-md p-2 text-gray-700">
                <option value="OrderPlaced">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))
      }
    </div>
  </div>
  
  )
}

export default Order