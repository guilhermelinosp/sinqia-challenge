import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../styles/Attractions.css'
import {
	ResponseSucessRequest,
	ResponseAttraction
} from '../interfaces/ResponseSucessRequest'
import { DateTime } from 'luxon'

const Attractions: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState('')
	const [searchResults, setSearchResults] = useState<ResponseAttraction[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [showDetailsArray, setShowDetailsArray] = useState<boolean[]>([])

	const handleVerDetalhesClick = (index: number) => {
		setShowDetailsArray((prevShowDetailsArray) => {
			const updatedShowDetailsArray = [...prevShowDetailsArray]
			updatedShowDetailsArray[index] = !updatedShowDetailsArray[index]
			return updatedShowDetailsArray
		})
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value)
		setError(null)
	}

	const handleSearch = async () => {
		try {
			const response = await axios.get<ResponseSucessRequest>(
				'http://localhost:5232/api/v1/pontos-turisticos',
				{
					params: { search: searchTerm },
					headers: {
						accept: 'application/json',
						'Content-Type': 'application/json'
					}
				}
			)

			console.log('Response Data:', response.data)

			setSearchResults(response.data.data as ResponseAttraction[])

			if (
				Array.isArray(response.data.data) &&
				response.data.data.length === 0
			) {
				setError('Nenhum resultado encontrado.')
			} else {
				setError(null)
			}
		} catch (error) {
			console.error('Erro na requisição:', error)
			setSearchResults([])
			setError('Nenhum resultado encontrado.')
		} finally {
			setLoading(false)
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleSearch()
		}
	}

	useEffect(() => {
		localStorage.setItem('searchResults', JSON.stringify(searchResults))
	}, [searchResults])

	const sortedResults = searchResults.sort((a, b) => {
		const dateA =
			a.createdAt instanceof DateTime
				? a.createdAt
				: DateTime.fromJSDate(new Date(a.createdAt))

		const dateB =
			b.createdAt instanceof DateTime
				? b.createdAt
				: DateTime.fromJSDate(new Date(b.createdAt))

		return dateB.toMillis() - dateA.toMillis()
	})

	const indexOfLastItem = currentPage * 8
	const currentResults = sortedResults.slice(
		indexOfLastItem - 8,
		indexOfLastItem
	)

	const totalPages = Math.ceil(sortedResults.length / 8)

	const handlePageChange = (page: React.SetStateAction<number>) => {
		setCurrentPage(page)
	}

	return (
		<div className="attractions-container">
			<img
				src="https://sinqia.com.br/wp-content/themes/sinqia/assets/images/logo.svg"
				alt="Logo"
			/>
			<div>
				<input
					type="search"
					placeholder="Pesquisar"
					value={searchTerm}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
				/>
				<button onClick={handleSearch} disabled={loading}>
					Buscar
				</button>

				<Link to="/cadastrar">
					<button>Cadastrar</button>
				</Link>
			</div>
			{error && <p style={{ color: 'red' }}>{error}</p>}

			<div>
				{loading ? (
					<p>Carregando...</p>
				) : (
					Array.isArray(searchResults) &&
					searchResults.length > 0 && (
						<div>
							{currentResults.map((result, index) => (
								<div
									key={result.attractionId}
									className="result-widget"
									style={{
										textAlign: 'start',
										padding: '10px'
									}}
								>
									<h1>{result.name}</h1>
									<p>
										<strong>Descrição:</strong> {result.description}
									</p>
									{showDetailsArray[index] && (
										<>
											<p>
												<strong>Localização:</strong> {result.location}
											</p>
											<p>
												<strong>Estado:</strong> {result.state}
											</p>
											<p>
												<strong>Cidade:</strong> {result.city}
											</p>
										</>
									)}
									<button onClick={() => handleVerDetalhesClick(index)}>
										{showDetailsArray[index]
											? 'Esconder detalhes'
											: 'Ver detalhes'}
									</button>{' '}
								</div>
							))}
							<div className="pagination">
								{Array.from({ length: totalPages }).map((_, index) => (
									<button
										key={index + 1}
										onClick={() => handlePageChange(index + 1)}
										className={currentPage === index + 1 ? 'active' : ''}
										style={{ marginLeft: '5px' }}
									>
										{index + 1}
									</button>
								))}
							</div>
						</div>
					)
				)}
			</div>
		</div>
	)
}

export default Attractions
