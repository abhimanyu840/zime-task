import React from 'react'
import Navbar from './components/Navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';




const App = (): React.JSX.Element => {


  return (

    <>
      <ToastContainer />
      <Navbar />
      <div className="container min-h-screen mx-auto">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div></div>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </>
  )
}

export default App
