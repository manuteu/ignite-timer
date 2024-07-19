import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/index.tsx'
import DefaultLayout from './layouts/DetaultLayout.tsx'
import History from './pages/History/index.tsx'

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<DefaultLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/history' element={<History />} />
      </Route>
    </Routes>
  )
}
