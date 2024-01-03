import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Registrer from './pages/Registrer'
import Attractions from './pages/Attractions'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<React.StrictMode>
		<Router>
			<Routes>
				<Route path="/" element={<Attractions />} />
				<Route path="/cadastrar" element={<Registrer />} />
			</Routes>
		</Router>
	</React.StrictMode>
)
