import { Post } from '@prisma/client'
import BlogList from '../components/blog/BlogList'
import CustomNav from '../components/global/CustomNav'
import Footer from '../components/global/Footer'
import LoadingPage from '../components/global/LoadingPage'
import { trpc } from '../utils/trpc'


const Blog = () => {
    const posts: Post[] | undefined = trpc.example.getPosts.useQuery().data
    if (!posts) {
        return <LoadingPage />
    }
    return (
        <>
            <CustomNav textColor='primary' />
            <header className='h-screen bg-primary pt-20'>
                <div className='bootstrap-container'>
                    <div className='flex items-center justify-center'>
                        <div className='text-[8rem] mx-auto font-extrabold uppercase'>Amor My Decor</div>
                    </div>
                </div>
            </header>
            <div className='pt-20'>
                <BlogList posts={posts} />
            </div>
            <Footer />
        </>
    )
}

export default Blog