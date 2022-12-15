import { Post } from '@prisma/client'
import { motion, Variants } from 'framer-motion'
import BlogList from '../components/blog/BlogList'
import CustomNav from '../components/global/CustomNav'
import Footer from '../components/global/Footer'
import LoadingPage from '../components/global/LoadingPage'
import { trpc } from '../utils/trpc'

const ItemFramerVariants: Variants = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 1
        }
    },
    hidden: {
        opacity: 0,
        y: 50,
        transition: {
            duration: 1
        }
    }
}

const Blog = () => {
    const posts: Post[] | undefined = trpc.example.getPosts.useQuery().data
    if (!posts) {
        return <LoadingPage />
    }
    return (
        <>
            <CustomNav textColor='primary' />
            <header className={`h-[60vh] pt-20 overflow-x-hidden bg-[url('/assets/img/pink-city.jpg')] bg-cover bg-bottom text-white`}>
                <div className='h-full flex items-center justify-center'>
                    <div className='flex flex-col items-center justify-center'>
                        <motion.div
                            initial='hidden'
                            whileInView={'visible'}
                            variants={{
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                        duration: 1
                                    }
                                },
                                hidden: {
                                    opacity: 0,
                                    x: -100,
                                    transition: {
                                        duration: 1
                                    }
                                }
                            }}
                            className='text-5xl md:text-[4.5rem] lg:text-[6rem] mx-auto font-extrabold uppercase whitespace-nowrap text-center'
                        >
                            THE BLOG OF DECOR
                        </motion.div>
                        <motion.div
                            initial='hidden'
                            whileInView={'visible'}
                            variants={{
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        duration: 1
                                    }
                                },
                                hidden: {
                                    opacity: 0,
                                    transition: {
                                        duration: 1
                                    }
                                }
                            }}
                            className='divider tracking-[1rem] bootstrap-container'
                        >
                            DESIGN
                        </motion.div>
                        <motion.div
                            initial='hidden'
                            whileInView={'visible'}
                            variants={{
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                        duration: 1
                                    }
                                },
                                hidden: {
                                    opacity: 0,
                                    x: 100,
                                    transition: {
                                        duration: 1
                                    }
                                }
                            }}
                            className='text-5xl md:text-[4.5rem] lg:text-[6rem] mx-auto font-extralight uppercase'
                        >
                            Amor My Decor
                        </motion.div>
                    </div>
                </div>
            </header>
            <div className=''>
                <BlogList posts={posts} />
            </div>
            <Footer />
        </>
    )
}

export default Blog