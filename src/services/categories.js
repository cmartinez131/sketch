import axios from 'axios'

const baseUrl = '/api/categories'

const getAll = () => {
	return axios.get(baseUrl)
}

const getById = id => {
	return axios.get(`${baseUrl}/${id}`)
}

const create = newCategory => {
	return axios.post(baseUrl, newCategory)
}

const update = (id, updatedCategory) => {
	return axios.put(`${baseUrl}/${id}`, updatedCategory)
}

const remove = id => {
	return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, getById, create, update, remove }
