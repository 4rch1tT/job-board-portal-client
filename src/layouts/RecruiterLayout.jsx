import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/recruiter/Navbar'
import Footer from '@/components/recruiter/Footer'

const RecruiterLayout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default RecruiterLayout