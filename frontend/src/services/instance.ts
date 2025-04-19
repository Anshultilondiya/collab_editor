import axios from 'axios';
import supabase from './../supabase'


const getAuthorizationHeader = async () => {
  const {data: {session}} = await supabase.auth.getSession()
  if (session) {
    return session.access_token
  }
  return null
}

const getAxiosInstance = async () => {
  const token = await getAuthorizationHeader()
  return axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
}


export default getAxiosInstance;