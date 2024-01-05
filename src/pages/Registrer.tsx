import React, { useState } from 'react'
import '../styles/Registrer.css'
import axios from 'axios'
import { ResponseSucessRequest } from '../interfaces/ResponseSucessRequest'
const Registrer: React.FC = () => {
	const [name, setName] = useState('')
	const [state, setState] = useState('')
	const [city, setCity] = useState('')
	const [location, setLocation] = useState('')
	const [description, setDescription] = useState('')
	const [validationErrors, setValidationErrors] = useState<string[]>([])
	const [loading, setLoading] = useState(false)

	const handleGoBack = () => {
		window.history.back()
	}

	const handleCreate = async () => {
		try {
			setLoading(true)
			setValidationErrors([])
			const response = await axios.post<ResponseSucessRequest>(
				'https://sinqia-challenge-boehh.ondigitalocean.app/api/v1/pontos-turisticos',
				{
					name,
					state,
					city,
					location,
					description
				},
				{
					headers: {
						accept: 'application/json',
						'Content-Type': 'application/json'
					}
				}
			)

			console.log('Response Data:', response.data)

			alert('Cadastro realizado com sucesso!')

			handleGoBack()
		} catch (error: any) {
			const errors = error?.response.data.data.messages

			if (errors.length > 0) {
				console.log('Errors:', errors)
				setValidationErrors(errors)
				console.log(name, state, city, location, description)
			} else {
				console.error('Erro na requisição:', error)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="registrer-container">
			<img
				src="https://sinqia.com.br/wp-content/themes/sinqia/assets/images/logo.svg"
				alt="Logo"
			/>

			<p>Nome</p>
			<input
				type="text"
				id="nameSelect"
				name="name"
				placeholder="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			<div>
				<label htmlFor="stateSelect">UF/Cidade</label>
				<div>
					<select
						id="stateSelect"
						name="state"
						value={state}
						onChange={(e) => setState(e.target.value)}
					>
						<option value="">UF</option>
						<option value="AC">AC</option>
						<option value="AL">AL</option>
						<option value="AP">AP</option>
						<option value="AM">AM</option>
						<option value="BA">BA</option>
						<option value="CE">CE</option>
						<option value="DF">DF</option>
						<option value="ES">ES</option>
						<option value="GO">GO</option>
						<option value="MA">MA</option>
						<option value="MT">MT</option>
						<option value="MS">MS</option>
						<option value="MG">MG</option>
						<option value="PA">PA</option>
						<option value="PB">PB</option>
						<option value="PR">PR</option>
						<option value="PE">PE</option>
						<option value="PI">PI</option>
						<option value="RJ">RJ</option>
						<option value="RN">RN</option>
						<option value="RS">RS</option>
						<option value="RO">RO</option>
						<option value="RR">RR</option>
						<option value="SC">SC</option>
						<option value="SP">SP</option>
						<option value="SE">SE</option>
						<option value="TO">TO</option>
					</select>
					<input
						type="text"
						id="citySelect"
						name="city"
						placeholder="City"
						value={city}
						onChange={(e) => setCity(e.target.value)}
					/>{' '}
				</div>
			</div>

			<p>Localização</p>
			<input
				type="text"
				id="locationSelect"
				name="location"
				placeholder="location"
				value={location}
				onChange={(e) => setLocation(e.target.value)}
			/>

			<p>Descrição</p>
			<textarea
				placeholder="Description"
				id="descriptionSelect"
				name="description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			></textarea>

			<div>
				<button onClick={handleGoBack}>Voltar</button>
				<button onClick={handleCreate}>Cadastrar</button>
			</div>

			{validationErrors.length > 0 && (
				<div className="validation-errors">
					<ul>
						{validationErrors.map((error, index) => (
							<li key={index} style={{ color: 'red' }}>
								{error}
							</li>
						))}
					</ul>
				</div>
			)}

			{loading && <p>Loading...</p>}
		</div>
	)
}

export default Registrer
