import axios from 'axios';
import supabase from './../supabase'


const getAuthorizationHeader = async () => {
  const {data: {session}} = await supabase.auth.getSession()
  if (session) {
    return session.access_token
  }
  return null
}

// const refreshToken = async () => {
//   const {data: {session}} = await supabase.auth.getSession()
//   if (session) {
//     const { data, error } = await supabase.auth.refreshSession()
//     if (error) {
//       throw new Error(error.message)
//     }
//     return data.session?.access_token
//   }
//   return null
// }

class AxiosInstance {
  private static instance: ReturnType<typeof axios.create> | null = null;

  static async getInstance() {
    if (!this.instance) {
      const token = await getAuthorizationHeader();
      this.instance = axios.create({
        baseURL: 'http://localhost:3000/',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
    }
    return this.instance;
  }
}

export default AxiosInstance;