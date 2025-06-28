import axios from 'axios';

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}

export async function urlToBase64(url: string): Promise<string> {
    const response = await axios.get(url, {
        responseType: 'blob',
    });

    return await fileToBase64(response.data)
}