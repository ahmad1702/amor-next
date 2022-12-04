import { Post } from '@prisma/client'
import MarkdownIt from 'markdown-it'
import { GetStaticPaths } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

import CustomNav from '../../components/global/CustomNav'
import Footer from '../../components/global/Footer'
import LoadingPage from '../../components/global/LoadingPage'
import { prisma } from '../../server/db/client'

export const getStaticPaths: GetStaticPaths = async () => {
    const posts: Post[] = await prisma.post.findMany()
    const paths = posts.map(({ id }: Post) => {
        return ({
            params: { id: id.toString() }
        })
    })
    console.log('paths:', paths)
    return {
        paths, //indicates that no page needs be created at build time
        fallback: true //indicates the type of fallback
    }
}
export async function getStaticProps({ params }: any) {
    const parsedId = parseInt(params.id)
    if (parsedId) {
        const post: Post | null = await prisma.post.findUnique({
            where: {
                id: parsedId,
            },
        })
        return {
            props: {
                post
            },
        };
    } else {
        return {
            props: {
                post: null
            }
        }
    }
}

const mdParser = new MarkdownIt(/* Markdown-it options */);
type PostPageProps = {
    post: Post | null;
}
const PostPage = ({ post }: PostPageProps) => {
    const router = useRouter()
    const session = useSession()
    useEffect(() => {
        if (!post) {
            router.push('/')
        }
    }, [post, router])
    if (!post) {
        return <LoadingPage />
    }
    return (
        <>
            <Head>
                <title>Amor My Decor</title>
                <meta name="description" content={post.intro} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CustomNav />
            {session.status === 'authenticated' && (
                <div className=''>authpanel</div>
            )}
            <main className='py-32 min-h-[calc(100vh-270px)]'>
                <article className='px-10 lg:p-20'>
                    <div className='lg:max-w-[70vw] mx-auto'>
                        <h1 className='text-6xl font-bold'>{post.title}</h1>
                        <h6 className='text-neutral-content'>Created at</h6>
                        <div className='markdown-container'>
                            <ReactMarkdown>
                                {post.content || ''}
                                {/* {mdParser.render(post.content)} */}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </>
    )
}

export default PostPage