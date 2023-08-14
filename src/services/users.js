import axios from 'axios'

const baseUrl = '/api/users'

const getAll = () => {
	return axios.get(baseUrl)
}

const getById = id => {
	return axios.get(`${baseUrl}/${id}`)
}

const create = newUser => {
	return axios.post(baseUrl, newUser)
}

const update = (id, updatedUser) => {
	return axios.put(`${baseUrl}/${id}`, updatedUser)
}

const remove = id => {
	return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, getById, create, update, remove }
