import Image from 'next/image'
import React, { ReactNode, useState } from 'react'
import { z } from 'zod'
import { ContactMeZodType } from '../../server/trpc/router/example'
import { trpc } from '../../utils/trpc'

type ContactMeForm = z.infer<typeof ContactMeZodType>
export type Alert = {
    content: string;
    type: 'success' | 'error' | 'warning'
}
const ContactMe = () => {
    const useContactMeMutation = trpc.example.contactMe.useMutation()
    const [alert, setAlert] = useState<Alert>()
    const [contactMeForm, setContactMeForm] = useState<ContactMeForm>({
        name: "",
        email: "",
        message: "",
    })
    const { name, email, message } = contactMeForm

    const showSuccessMessage = async () => {
        if (name) {
            setAlert({
                content: `Thanks for Contacting us ${name}. Message has been sent. We'll reach back to you soon!`,
                type: 'success'
            })
        }
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (contactMeForm.name.length < 3 || contactMeForm.email.length < 3 || contactMeForm.message.length < 3) {
            return;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _ = await useContactMeMutation.mutate(contactMeForm)
            showSuccessMessage()
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <section className="text-white body-font relative">
            <div className="container px-5 py-10 mx-auto">
                {alert && (
                    <div className={`alert alert-${alert.type} shadow-lg`}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Your purchase has been confirmed!</span>
                        </div>
                    </div>
                )}
                <div className="flex flex-col text-center w-full my-12">
                    <h1 className="sm:text-8xl text-6xl font-bold title-font mb-4 tracking-tight">Contact Us</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">We are always open for collaboration, {"Let's"} Connect</p>
                </div>
                <div className="lg:w-1/2 md:w-2/3 mx-auto">
                    <form onSubmit={handleFormSubmit} className="flex flex-wrap -m-2">
                        <div className="p-2 w-full md:w-1/2">
                            <label htmlFor="name" className="leading-7 font-semibold">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder='Your Name...'
                                className="input input-bordered block w-full text-base-content"
                                value={name}
                                onChange={(e) => setContactMeForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="p-2 w-full md:w-1/2">
                            <label htmlFor="email" className="leading-7 font-semibold">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder='Your Email...'
                                className="input input-bordered block w-full text-base-content"
                                value={email}
                                onChange={(e) => setContactMeForm(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div className="p-2 w-full">
                            <label htmlFor="message" className="leading-7 font-semibold">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder='What can we do for you?'
                                className="textarea textarea-bordered block w-full text-base-content"
                                value={message}
                                onChange={(e) => setContactMeForm(prev => ({ ...prev, message: e.target.value }))}
                            />
                        </div>
                        <div className="p-2 w-full flex items-center justify-center">
                            <button type="submit" className="btn btn-primary">button</button>
                        </div>

                        <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                            <a className="text-primary ">example@email.com</a>
                            <p className="leading-normal my-5">49 Smith St.
                                <br />Saint Cloud, MN 56301
                            </p>
                            <span className="inline-flex">
                                <a className="text-gray-500">
                                    <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                    </svg>
                                </a>
                                <a className="ml-4 text-gray-500">
                                    <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                    </svg>
                                </a>
                                <a className="ml-4 text-gray-500">
                                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                                    </svg>
                                </a>
                                <a className="ml-4 text-gray-500">
                                    <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                    </svg>
                                </a>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
            <Image fill className='absolute top-0 left-0 -z-10 w-full h-full brightness-75' src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" alt="" />
        </section>
    )
}

export default ContactMe