import { Post } from '@prisma/client'
import { format, formatRelative, subDays } from 'date-fns'
import MarkdownIt from 'markdown-it'
import { GetStaticPaths } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Modal from '../../components/blog/Modal'

import CustomNav from '../../components/global/CustomNav'
import Footer from '../../components/global/Footer'
import LoadingPage from '../../components/global/LoadingPage'
import { prisma } from '../../server/db/client'
import { trpc } from '../../utils/trpc'

const DeletePostModal = ({ id }: { id: number }) => {
    const router = useRouter()
    const deleteMutation = trpc.example.deletePost.useMutation()

    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleDelete = () => {
        setLoading(true)
        try {
            const deletedPost = deleteMutation.mutateAsync(id).then(post => {
                router.push('/blog')
            }).catch(error => setError(JSON.stringify(error)))
        } catch (error) {
            setError('An Error Occured, Post could not be deleted')
        }
        setLoading(false)
    }

    useEffect(() => {

        return () => {
            setLoading(false)
            setError('')
        }
    }, [])
    return (
        <>
            <button
                className='btn btn-error'
                onClick={() => setDeleteModalOpen(prev => !prev)}
            >
                Delete
            </button>
            <Modal
                id="delete-modal"
                open={deleteModalOpen}
                setOpen={setDeleteModalOpen}
            >
                <div className='text-2xl font-semibold mb-5'>Are you sure you want to delete the post?</div>
                {loading && (
                    <progress className='progress porgress-accent mb-5'></progress>
                )}
                {error.length > 0 && (
                    <div className='alert alert-error mb-5'>{error}</div>
                )}

                <div className='flex items-center justify-between'>
                    <button onClick={() => setDeleteModalOpen(false)} className='btn btn-primary'>Cancel</button>
                    <button onClick={handleDelete} className='btn btn-error'>Delete</button>
                </div>
            </Modal>
        </>
    )
}
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
                post: JSON.stringify(post),
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
    post: string | null;
}
const PostPage = ({ post: jsonPost }: PostPageProps) => {
    const post: Post | null = jsonPost ? (JSON.parse(jsonPost) as Post) : null

    console.log(post)
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
    const createdAt = new Date(post.createdAt)
    return (
        <>
            <Head>
                <title>Amor My Decor</title>
                <meta name="description" content={post.intro} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <CustomNav />
            <div className={`pt-[88px] ${session.status !== 'authenticated' && ('bg-primary')}`}></div>
            {session.status === 'authenticated' && (
                <div>
                    <div className='py-5 bg-base-200 border-y-[1.5px] px-10 flex items-center justify-between'>
                        <div className='text-xl font-semibold'>
                            Admin Panel
                            <span className='font-light'>{` | Welcome, ${session.data.user?.name}`}</span>
                        </div>
                        <div className='flex gap-3'>
                            <Link href={`/editpost/${post.id}`} className='btn btn-primary'>Edit</Link>
                            <DeletePostModal id={post.id} />
                        </div>
                    </div>
                </div>
            )}
            <main className='pb-32 min-h-[calc(100vh-270px)] bg-white text-black'>
                <article className='p-10 lg:p-20'>
                    <div className='lg:max-w-[70vw] mx-auto'>
                        <h1 className='text-5xl lg:text-6xl font-bold'>{post.title}</h1>
                        <h6 className='text-neutral-content font-light'>Created {formatRelative(createdAt, new Date())}</h6>
                        <div className='divider'></div>
                        <div className='markdown-container'>
                            <ReactMarkdown>
                                {post.content || ''}
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