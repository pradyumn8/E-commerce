import React from 'react'

const NewsLetterbox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='text-center mt-10'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className="text-gray-400 mt-3">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo qui consequuntur blanditiis! Facere, harum maxime!
        </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email'/>
            <button className='bg-black text-white text-x5 px-10 py-4' type='submit'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsLetterbox