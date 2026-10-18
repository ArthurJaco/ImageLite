'use client'

import { FieldError, RenderIf, useNotification } from '@/components'
import { useAuth } from '@/resources'
import { AccessToken, Credentials, User } from '@/resources/users/users.resource'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { LoginForm, formScheme, validationScheme } from './formScheme'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [newUserState, setNewUserState] = useState(false)
    const auth = useAuth()
    const notification = useNotification()
    const router = useRouter()

    async function onSubmit(values: LoginForm) {
        setLoading(true)
        try {
            if (!newUserState) {
                const credentials: Credentials = { email: values.email, password: values.password }
                const accessToken: AccessToken = await auth.authenticate(credentials)
                auth.initSession(accessToken)
                router.replace('/gallery')
                return
            }

            const user: User = { email: values.email, name: values.name, password: values.password }
            await auth.save(user)
            notification.notify('Conta criada com sucesso!', 'success')
            formik.resetForm()
            setNewUserState(false)
        } catch (error: any) {
            notification.notify(error?.message ?? 'Não foi possível concluir. Tente novamente.', 'error')
        } finally {
            setLoading(false)
        }
    }

    const formik = useFormik<LoginForm>({
        initialValues: formScheme,
        validationSchema: validationScheme,
        onSubmit,
    })

    function changeMode() {
        formik.resetForm()
        setNewUserState(!newUserState)
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f6fb] px-4 py-8 text-slate-900 sm:px-6">
            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-cyan-100/70 blur-3xl" />

            <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_-35px_rgba(30,41,59,0.32)] md:min-h-[620px] md:grid-cols-[1.02fr_0.98fr]">
                <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#211b56] via-[#37318a] to-[#176c91] p-10 text-white md:flex lg:p-14">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 0.7px, transparent 0.7px)', backgroundSize: '19px 19px' }} />
                    <div className="absolute -right-20 top-28 h-72 w-72 rounded-full border border-white/20" />
                    <div className="absolute -right-6 top-44 h-44 w-44 rounded-full border border-white/20" />
                    <div className="absolute bottom-24 right-16 h-20 w-20 rounded-3xl border border-white/25 bg-white/10 backdrop-blur-sm" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                <path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold tracking-tight">ImageLite</span>
                    </div>

                    <div className="relative z-10 max-w-md py-12">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            Suas imagens, em um só lugar
                        </div>
                        <h1 className="text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
                            Guarde suas ideias. Encontre inspiração.
                        </h1>
                        <p className="mt-5 max-w-sm text-base leading-7 text-indigo-100/80">
                            Organize e explore sua coleção de imagens com uma experiência simples e intuitiva.
                        </p>
                    </div>

                    <p className="relative z-10 text-sm text-white/55">Desenvolvido por Arthur Jacó</p>
                </div>

                <div className="flex items-center justify-center px-6 py-10 sm:px-12 md:px-10 lg:px-14">
                    <div className="w-full max-w-sm">
                        <div className="mb-8 md:hidden">
                            <div className="mb-7 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-white">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                                        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                                        <path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-lg font-semibold">ImageLite</span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="mb-2 text-sm font-medium text-indigo-700">{newUserState ? 'Crie sua conta' : 'Bem-vindo de volta'}</p>
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                                {newUserState ? 'Comece por aqui' : 'Acesse sua conta'}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {newUserState ? 'Preencha seus dados para criar uma conta.' : 'Entre para continuar organizando suas imagens.'}
                            </p>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-5">
                            <RenderIf condition={newUserState}>
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Nome</label>
                                    <input id="name" name="name" type="text" autoComplete="name" placeholder="Como podemos te chamar?"
                                        value={formik.values.name ?? ''} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                                    {formik.touched.name && <FieldError error={formik.errors.name} />}
                                </div>
                            </RenderIf>

                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
                                <input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com"
                                    value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                                {formik.touched.email && <FieldError error={formik.errors.email} />}
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
                                <input id="password" name="password" type="password" autoComplete={newUserState ? 'new-password' : 'current-password'} placeholder="Pelo menos 8 caracteres"
                                    value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                                {formik.touched.password && <FieldError error={formik.errors.password} />}
                            </div>

                            <RenderIf condition={newUserState}>
                                <div>
                                    <label htmlFor="passwordMatch" className="mb-2 block text-sm font-medium text-slate-700">Repita a senha</label>
                                    <input id="passwordMatch" name="passwordMatch" type="password" autoComplete="new-password" placeholder="Digite a senha novamente"
                                        value={formik.values.passwordMatch ?? ''} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
                                    {formik.touched.passwordMatch && <FieldError error={formik.errors.passwordMatch} />}
                                </div>
                            </RenderIf>

                            <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-700/20 transition hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60">
                                {loading ? 'Aguarde...' : newUserState ? 'Criar conta' : 'Entrar'}
                                {!loading && <span aria-hidden="true">→</span>}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            {newUserState ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
                            <button type="button" onClick={changeMode} className="font-semibold text-indigo-700 hover:text-indigo-900 focus:outline-none focus:underline">
                                {newUserState ? 'Fazer login' : 'Criar conta'}
                            </button>
                        </div>

                        <p className="mt-10 text-center text-xs text-slate-400 md:hidden">Desenvolvido por Arthur Jacó</p>
                    </div>
                </div>
            </section>
            <ToastContainer position="bottom-right" autoClose={8000} hideProgressBar={false} draggable={false} closeOnClick pauseOnHover />
        </main>
    )
}
