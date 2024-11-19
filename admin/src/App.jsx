import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const App = () => {
  return (
   <>
   <Navbar/>
   <hr />
   <div className="flex w-full">
    <Sidebar/>
   </div>
   </>
  )
}

export default App