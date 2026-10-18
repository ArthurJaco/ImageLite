import { User, Credentials, UserSessionToken, AccessToken } from './users.resource'
import jwt from 'jwt-decode'

class AuthService {
    baseURL: string = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/v1/users`
    static AUTH_PARAM: string = '_auth';

    async authenticate(credentials: Credentials) : Promise<AccessToken> {
        const response = await fetch(this.baseURL + '/auth', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 401){
            throw new Error('E-mail ou senha incorretos.')
        }

        if (!response.ok) {
            throw new Error('Não foi possível entrar. Tente novamente.')
        }

        return await response.json();

    } 

    async save(user : User) : Promise<void> {
        const response = await fetch(this.baseURL, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(  response);

          if(response.status == 409){
            const responseError = await response.json();
            throw new Error(responseError.error);
        }

    }

    initSession(token : AccessToken){
        if(token.accessToken){
            const decodedToken: any = jwt(token.accessToken);

            const userSessionToken : UserSessionToken = {
                accessToken: token.accessToken,
                email: decodedToken.sub,
                name: decodedToken.name,
                expiration: decodedToken.exp
            }
            this.setAuth(userSessionToken);
            return;
        }

        throw new Error('A API não retornou o token de acesso.')
    }

    setAuth(userSessionToken: UserSessionToken){
        localStorage.setItem(AuthService.AUTH_PARAM, JSON.stringify(userSessionToken));
    }

    clearSession(){
        localStorage.removeItem(AuthService.AUTH_PARAM);
    }

    getUserSession() : UserSessionToken | null {
        if (typeof window === 'undefined') {
            return null;
        }

        const authString = localStorage.getItem(AuthService.AUTH_PARAM);
        if(!authString){
            return null;
        }

        try {
            const token : UserSessionToken = JSON.parse(authString);
            return token;
        } catch {
            localStorage.removeItem(AuthService.AUTH_PARAM);
            return null;
        }
    }

    isSessionValid(){
        if (typeof window === 'undefined') {
            return false;
        }

        const userSession : UserSessionToken | null = this.getUserSession();
        const expiration = userSession?.expiration;
        if(!userSession?.accessToken || typeof expiration !== 'number' || !Number.isFinite(expiration)){
            localStorage.removeItem(AuthService.AUTH_PARAM);
            return false;
        }

        return Date.now() < expiration * 1000
    }

}

export const useAuth =  () => new AuthService();
