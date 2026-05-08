import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import CreateAluno from '../pages/CreateAluno'
import CreateResponsavel from '../pages/CreateResponsavel'
import ResponsavelDetails from '../pages/ResponsavelDetails'

export default function AppRoutes(){
return(
<Routes>
<Route path='/' element={<Home />} />
<Route path='/alunos/criar' element={<CreateAluno />} />
<Route path='/responsaveis/criar' element={<CreateResponsavel />} />
<Route
  path='/responsaveis/:id'
  element={<ResponsavelDetails />}
/>
</Routes>
)
}