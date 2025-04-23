import AxiosInstance from "./instance";


export const createDocs = async () => {
    const instance = await AxiosInstance.getInstance();
    const response = await instance.get('/docs/create');
    return response.data;
}


export const getAllDocs = async (userId: string) => {
    const instance = await AxiosInstance.getInstance();
    const response = await instance.get(`/docs/all-docs/${userId}`);
    return response.data;
}

export const getDocById = async (docId: string) => {
    const instance = await AxiosInstance.getInstance();
    const response = await instance.get(`/docs/get-doc-by-id/${docId}`);
    return response.data;
}


export const updateDocName = async (docId: string, docName: string, signal: AbortSignal) => {
    const instance = await AxiosInstance.getInstance();
    const response = await instance.post(`/docs/update-doc-name/${docId}`, { name: docName }, { signal });
    return response.data;
}


export const shareDoc = async (docId: string, email: string) => {
    const instance = await AxiosInstance.getInstance();
    const response = await instance.post(`/docs/share-doc/${docId}`, { email });
    return response.data;
}

export const saveDocument = async (docId: string, content: string, signal: AbortSignal) => {
    const instance = await AxiosInstance.getInstance();
    const response = await instance.post(`/docs/save-doc/${docId}`, { content }, { signal });
    return response.data;
}