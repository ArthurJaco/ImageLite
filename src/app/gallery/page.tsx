'use client'

import { AuthenticatedPage, Template, useNotification } from '@/components'
import { ImageCard } from '@/components/ImageCard'
import { useImageService } from '@/resources'
import { Image } from '@/resources/image/image.resource'
import { useState } from 'react'
import Link from 'next/link'

export default function GalleryPage() {
    const service = useImageService()
    const notification = useNotification()
    const [images, setImages] = useState<Image[]>([])
    const [query, setQuery] = useState('')
    const [extension, setExtension] = useState('')
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    async function searchImage(event?: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault()
        setLoading(true)
        try {
            const result = await service.getImages(query.trim(), extension)
            setImages(result)
            setHasSearched(true)
            if (!result.length) notification.notify('Nenhuma imagem encontrada. Tente outros filtros.', 'warning')
        } catch {
            notification.notify('Não foi possível carregar as imagens. Tente novamente.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthenticatedPage>
            <Template loading={loading}>
                <div className="mx-auto max-w-7xl">
                    <section className="relative mb-8 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#211b56] via-[#37318a] to-[#176c91] px-6 py-8 text-white shadow-lg shadow-indigo-950/10 sm:px-9 sm:py-10">
                        <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10" />
                        <div className="pointer-events-none absolute -right-2 -top-12 h-48 w-48 rounded-full border border-white/10" />
                        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div className="max-w-xl">
                                <p className="mb-2 text-sm font-medium text-cyan-200">Seu espaço criativo</p>
                                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Galeria de imagens</h1>
                                <p className="mt-3 text-sm leading-6 text-indigo-100/80 sm:text-base">
                                    Encontre suas imagens favoritas ou adicione novas à sua coleção.
                                </p>
                            </div>
                            <Link href="/forms" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-white/30">
                                <span className="text-lg leading-none" aria-hidden="true">+</span>
                                Adicionar imagem
                            </Link>
                        </div>
                    </section>

                    <form onSubmit={searchImage} className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_auto]">
                            <label className="relative block">
                                <span className="sr-only">Buscar por nome ou tag</span>
                                <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome ou tag..."
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                            </label>
                            <label>
                                <span className="sr-only">Filtrar por formato</span>
                                <select value={extension} onChange={(event) => setExtension(event.target.value)}
                                    className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10">
                                    <option value="">Todos os formatos</option>
                                    <option value="PNG">PNG</option>
                                    <option value="JPEG">JPEG</option>
                                    <option value="GIF">GIF</option>
                                </select>
                            </label>
                            <button type="submit" disabled={loading} className="h-12 rounded-xl bg-indigo-700 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-700/15 transition hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60">
                                {loading ? 'Buscando...' : 'Buscar imagens'}
                            </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                            <span>Pesquise pelo nome ou pelas tags da imagem</span>
                            {hasSearched && <span>{images.length} {images.length === 1 ? 'imagem encontrada' : 'imagens encontradas'}</span>}
                        </div>
                    </form>

                    {images.length > 0 ? (
                        <section aria-label="Resultados da galeria" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {images.map((image) => (
                                <ImageCard key={image.url} name={image.name} src={image.url} size={image.size} extension={image.extension} uploadDate={image.uploadDate} />
                            ))}
                        </section>
                    ) : (
                        <section className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center sm:py-16">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.7" />
                                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                    <path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="mt-5 text-lg font-semibold text-slate-900">
                                {hasSearched ? 'Nenhuma imagem por aqui' : 'Sua próxima imagem favorita está aqui'}
                            </h2>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                {hasSearched ? 'Experimente mudar os filtros ou adicione uma nova imagem à sua galeria.' : 'Busque na sua coleção ou envie uma imagem para começar.'}
                            </p>
                            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                                {!hasSearched && <button type="button" onClick={() => searchImage()} disabled={loading} className="h-11 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-60">Explorar galeria</button>}
                                <Link href="/forms" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700">Adicionar imagem</Link>
                            </div>
                        </section>
                    )}
                </div>
            </Template>
        </AuthenticatedPage>
    )
}
