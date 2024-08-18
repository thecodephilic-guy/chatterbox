import React from 'react'
import { Outlet } from 'react-router-dom'

function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        <Outlet />
    </div>
  )
}

export default Root