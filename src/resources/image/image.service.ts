import { Image } from './image.resource'
import { useAuth } from '../users/authentication.service'

class ImageService {
    baseUrl: string = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/v1/images`;

    async getImages(query: string = "", extension: string = ""): Promise<Image[]> {
        const params = new URLSearchParams({ query, extension });
        const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
            headers: this.authorizationHeaders(),
        });
        if (!response.ok) throw new Error('Unable to load images.')
        return await response.json();
    }

    async save(dados: FormData): Promise<string> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            body: dados,
            headers: this.authorizationHeaders(),
        })

        if (!response.ok) throw new Error('Unable to save image.')
        return response.headers.get('Location') ?? '';
    }

    private authorizationHeaders(): HeadersInit {
        const accessToken = useAuth().getUserSession()?.accessToken
        return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    }
}

export const useImageService = () => new ImageService(); 
