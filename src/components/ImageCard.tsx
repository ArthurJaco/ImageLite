'use client'

import { useAuth } from '@/resources'
import { useEffect, useState } from 'react'

interface ImageCardProps {
    name?: string
    size?: number
    uploadDate?: string
    src?: string
    extension?: string
}

export const ImageCard: React.FC<ImageCardProps> = ({ name, size, uploadDate, src, extension }) => {
    const [displaySrc, setDisplaySrc] = useState<string>()
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

    useEffect(() => {
        if (!src) {
            setDisplaySrc(undefined)
            setImageStatus('error')
            return
        }

        const controller = new AbortController()
        let objectUrl: string | undefined
        let active = true
        setImageStatus('loading')
        setDisplaySrc(undefined)

        const accessToken = useAuth().getUserSession()?.accessToken
        fetch(src, {
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) throw new Error('Image request failed')
                return response.blob()
            })
            .then((blob) => {
                if (!active) return
                objectUrl = URL.createObjectURL(blob)
                setDisplaySrc(objectUrl)
                setImageStatus('loaded')
            })
            .catch((error: unknown) => {
                if (!active || (error instanceof DOMException && error.name === 'AbortError')) return
                setImageStatus('error')
            })

        return () => {
            active = false
            controller.abort()
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [src])

    function openImage() {
        if (displaySrc) window.open(displaySrc, '_blank', 'noopener,noreferrer')
    }

    const parsedDate = uploadDate ? new Date(uploadDate) : undefined
    const formattedDate = parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString('pt-BR')
        : 'Data não informada'

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
            <button type="button" onClick={openImage} disabled={!displaySrc} aria-label={`Abrir imagem ${name ?? ''} em nova aba`}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left focus:outline-none focus:ring-4 focus:ring-inset focus:ring-indigo-500/40 disabled:cursor-default">
                {imageStatus === 'loaded' && displaySrc ? (
                    <img src={displaySrc} alt={name ? `Imagem: ${name}` : 'Imagem da galeria'} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                ) : (
                    <span className="flex h-full flex-col items-center justify-center gap-2 px-4 text-sm text-slate-400">
                        {imageStatus === 'loading' ? (
                            <><span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" /><span>Carregando imagem...</span></>
                        ) : (
                            <><svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z" stroke="currentColor" strokeWidth="1.6"/><path d="m5 17 4.3-4.3a1.5 1.5 0 0 1 2.1 0l1.1 1.1 1.8-1.8a1.5 1.5 0 0 1 2.1 0L20 15.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="8.5" r="1.2" fill="currentColor"/></svg><span>Não foi possível carregar a imagem</span></>
                        )}
                    </span>
                )}
                <span className="absolute right-3 top-3 rounded-lg bg-slate-950/65 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                    {extension || 'Imagem'}
                </span>
                <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-xl bg-white/95 text-slate-700 opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path d="M14 4h6v6m-.5-5.5-8 8M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </button>
            <div className="p-4 sm:p-5">
                <h2 className="truncate text-base font-semibold text-slate-900" title={name}>{name || 'Imagem sem nome'}</h2>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 3v18m-5-5 5 5 5-5M7 8l5-5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {formatBytes(size)}
                    </span>
                    <time>{formattedDate}</time>
                </div>
            </div>
        </article>
    )
}

function formatBytes(bytes = 0) {
    if (!bytes) return '0 Bytes'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1)
    return `${parseFloat((bytes / Math.pow(1024, index)).toFixed(1))} ${sizes[index]}`
}
