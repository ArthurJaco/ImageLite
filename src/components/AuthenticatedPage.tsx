import Login from '@/app/login/page';
import { useAuth } from '@/resources'
import { useEffect, useState } from 'react'

interface AuthenticatedPageProps{
    children: React.ReactNode
}

export const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({
    children 
}) => {
    const [sessionValid, setSessionValid] = useState(false)
    const [sessionChecked, setSessionChecked] = useState(false)

    useEffect(() => {
        setSessionValid(useAuth().isSessionValid())
        setSessionChecked(true)
    }, [])

    if (!sessionChecked || !sessionValid) {
        return <Login />
    }


    return (
        <>
            {children}
        </>
    )
}
