'use client'

import { useAuth } from '@/resources'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

interface TemplateProps {
    children?: React.ReactNode
    loading?: boolean
}

export const Template: React.FC<TemplateProps> = ({ children, loading }) => (
    <div className="flex min-h-screen flex-col bg-[#f4f6fb] text-slate-900">
        <Header />
        <main className="flex-1 py-7 sm:py-9">
            <div className="container mx-auto px-4">
                {loading && (
                    <div role="status" aria-live="polite" className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-indigo-700">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
                        Processando...
                    </div>
                )}
                {children}
            </div>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar draggable={false} closeOnClick pauseOnHover />
    </div>
)

interface RenderIfProps {
    condition?: boolean
    children?: React.ReactNode
}

export const RenderIf: React.FC<RenderIfProps> = ({ condition = true, children }) => condition ? children : null

const Header: React.FC = () => {
    const auth = useAuth()
    const router = useRouter()
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const session = auth.getUserSession()
        setUserName(session?.name?.trim() || session?.email || 'Usuário')
    }, [])

    function handleLogout() {
        auth.clearSession()
        router.replace('/login')
    }

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="container mx-auto flex h-[68px] items-center justify-between gap-2 px-3 sm:px-4">
                <Link href="/gallery" className="flex shrink-0 items-center gap-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/15 sm:gap-3" aria-label="ImageLite, ir para a galeria">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950 text-white shadow-sm sm:h-10 sm:w-10">
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                            <path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">ImageLite</span>
                </Link>

                <nav aria-label="Navegação principal" className="flex min-w-0 items-center gap-0.5 sm:gap-2">
                    <Link href="/gallery" className="hidden rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 sm:inline-flex sm:px-3 sm:text-sm">Galeria</Link>
                    <Link href="/forms" aria-label="Adicionar imagem" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-700 text-sm font-semibold text-white transition hover:bg-indigo-800 sm:h-auto sm:w-auto sm:px-4 sm:py-2">
                        <span className="sm:hidden" aria-hidden="true">+</span>
                        <span className="hidden sm:inline">Adicionar imagem</span>
                    </Link>

                    <div className="ml-1 flex shrink-0 items-center gap-1.5 border-l border-slate-200 pl-2 sm:ml-2 sm:gap-2 sm:pl-3">
                        <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold uppercase text-indigo-800">
                            {userName.charAt(0) || 'U'}
                        </span>
                        <span title={userName} className="max-w-12 truncate text-[11px] font-medium text-slate-700 sm:max-w-28 sm:text-sm">{userName}</span>
                        <button type="button" onClick={handleLogout} title="Sair da conta" aria-label="Sair da conta" className="inline-flex h-9 items-center justify-center gap-1 rounded-lg px-2 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/10 sm:px-2.5">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M10 17l5-5-5-5m5 5H3m9-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="hidden md:inline">Sair</span>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    )
}

const Footer: React.FC = () => (
    <footer className="border-t border-slate-200/80 bg-white">
        <div className="container mx-auto flex min-h-14 flex-col items-center justify-center gap-1 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:justify-between">
            <span>© 2026 ImageLite</span>
            <span>Desenvolvido por Arthur Jacó</span>
        </div>
    </footer>
)
