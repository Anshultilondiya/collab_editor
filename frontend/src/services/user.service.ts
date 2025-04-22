import AxiosInstance from "./instance";


export const loginUser = async (email: string) => {
    const instance = await AxiosInstance.getInstance();
    const response = await instance.post('/auth/login', { email });
    return response.data;
}
