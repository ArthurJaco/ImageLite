'use client'

import { AuthenticatedPage, FieldError, Template, useNotification } from '@/components'
import { useImageService } from '@/resources/image/image.service'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FormProps, formScheme, formValidationScheme } from './formScheme'

export default function FormsPage() {
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string>()
    const service = useImageService()
    const notification = useNotification()

    const formik = useFormik<FormProps>({
        initialValues: formScheme,
        onSubmit: handleSubmit,
        validationSchema: formValidationScheme,
    })

    useEffect(() => () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview)
    }, [imagePreview])

    async function handleSubmit(values: FormProps) {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('file', values.file)
            formData.append('name', values.name.trim())
            formData.append('tags', values.tags.trim())

            await service.save(formData)
            formik.resetForm()
            setImagePreview(undefined)
            notification.notify('Imagem salva com sucesso!', 'success')
        } catch {
            notification.notify('Não foi possível enviar a imagem. Tente novamente.', 'error')
        } finally {
            setLoading(false)
        }
    }

    function onFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.currentTarget.files?.[0]
        event.currentTarget.value = ''
        if (!file) return

        formik.setFieldValue('file', file)
        formik.setFieldTouched('file', true, false)
        setImagePreview(URL.createObjectURL(file))
    }

    return (
        <AuthenticatedPage>
            <Template loading={loading}>
                <div className="mx-auto max-w-5xl">
                    <div className="mb-7">
                        <Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-700">
                            <span aria-hidden="true">←</span> Voltar para a galeria
                        </Link>
                        <div className="mt-5">
                            <p className="text-sm font-medium text-indigo-700">Compartilhe com sua coleção</p>
                            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Adicionar imagem</h1>
                            <p className="mt-2 text-sm leading-6 text-slate-500">Escolha um arquivo e adicione alguns detalhes para encontrá-lo depois.</p>
                        </div>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
                        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-6">
                                <h2 className="text-base font-semibold text-slate-900">Informações da imagem</h2>
                                <p className="mt-1 text-sm text-slate-500">Os campos marcados com * são obrigatórios.</p>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Nome <span className="text-indigo-600">*</span></label>
                                    <input id="name" name="name" type="text" maxLength={50} value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Ex.: Fim de tarde na praia"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                                    {formik.touched.name && <FieldError error={formik.errors.name} />}
                                </div>

                                <div>
                                    <label htmlFor="tags" className="mb-2 block text-sm font-medium text-slate-700">Tags <span className="text-indigo-600">*</span></label>
                                    <input id="tags" name="tags" type="text" maxLength={50} value={formik.values.tags} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Ex.: praia, natureza, viagem"
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                                    {formik.touched.tags && <FieldError error={formik.errors.tags} />}
                                    <p className="mt-2 text-xs text-slate-400">Separe as tags por vírgula.</p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
                            <div className="mb-5">
                                <h2 className="text-base font-semibold text-slate-900">Arquivo</h2>
                                <p className="mt-1 text-sm text-slate-500">PNG, JPG ou GIF · até 5 MB</p>
                            </div>

                            <input id="image-file" type="file" accept="image/png,image/jpeg,image/gif" onChange={onFileUpload} className="sr-only" />
                            <label htmlFor="image-file" className={`group flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed p-4 text-center transition ${imagePreview ? 'border-indigo-200 bg-slate-50' : 'border-slate-300 bg-slate-50/70 hover:border-indigo-400 hover:bg-indigo-50/50'}`}>
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Prévia da imagem selecionada" className="max-h-64 w-full rounded-xl object-contain" />
                                        <span className="mt-3 text-sm font-medium text-indigo-700">Clique para trocar a imagem</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200 transition group-hover:scale-105">
                                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        <span className="mt-4 text-sm font-semibold text-slate-800">Clique para escolher uma imagem</span>
                                        <span className="mt-1 text-xs text-slate-500">Selecione um arquivo do seu dispositivo</span>
                                    </>
                                )}
                            </label>
                            {formik.touched.file && <div className="mt-2"><FieldError error={formik.errors.file} /></div>}

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Link href="/gallery" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancelar</Link>
                                <button type="submit" disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-700/15 transition hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60">
                                    {loading ? 'Enviando...' : 'Salvar imagem'}
                                    {!loading && <span aria-hidden="true">→</span>}
                                </button>
                            </div>
                        </section>
                    </form>
                </div>
            </Template>
        </AuthenticatedPage>
    )
}
