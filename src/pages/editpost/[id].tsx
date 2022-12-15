import { Post } from "@prisma/client";
import { FormEvent, useState } from "react";
import { prisma } from '../../server/db/client';

import MarkdownIt from "markdown-it";
import { GetStaticPaths } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import 'react-markdown-editor-lite/lib/index.css';
import CustomNav from "../../components/global/CustomNav";
import Footer from "../../components/global/Footer";
import LoadingPage from "../../components/global/LoadingPage";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { router } from "../../server/trpc/trpc";

export const getStaticPaths: GetStaticPaths = async () => {
    const posts: Post[] = await prisma.post.findMany()
    const paths = posts.map(({ id }: Post) => {
        return ({
            params: { id: id.toString() }
        })
    })
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
                post: JSON.stringify(post)
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

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

type EditPostProps = {
    post: string | null;
}
type PostForm = Pick<Post, 'title' | 'intro' | 'content' | 'published'>

const mdParser = new MarkdownIt(/* Markdown-it options */);

const EditPost = ({ post: jsonPost }: EditPostProps) => {
    const post: Post | null = (!!jsonPost && (JSON.parse(jsonPost) as Post)) || null
    const session = useSession()
    const router = useRouter()
    const useEditPostMutation = trpc.example.editPost.useMutation()
    const [postForm, setPostForm] = useState<PostForm>(post || {
        title: '',
        intro: '',
        content: '',
        published: true,
    })

    if (session.status === 'unauthenticated') {
        if (window) {
            window.location.href = '/'
        }
        return <LoadingPage />
    }
    if (session.status === 'loading' || !post) {
        return <LoadingPage />
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (postForm.title.length < 5 || postForm.intro.length < 5 || !postForm.content || (postForm.content && postForm.content.length < 5)) {
            return;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const editPostMutate = await useEditPostMutation.mutate({
                ...postForm,
                id: post.id,
            })
            router.push(`/posts/${post.id}`)
        } catch (error) {
            console.error(error)
        }
    }
    function handleEditorChange({ text }: {
        text: string;
        html: string;
    }) {
        setPostForm({ ...postForm, content: text })
    }
    function handleImageUpload(file: File) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = data => {
                resolve(data.target?.result);
            };
            reader.readAsDataURL(file);
        });
    }
    if (!postForm.content) {
        postForm.content = ''
    }
    return (
        <>
            <CustomNav />
            <div className="pt-[6rem] p-20 shadow-xl m-auto">
                <div className="bootstrap-container">
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-4xl font-extrabold">Edit Post</h2>
                            <div className="flex items-center gap-2">
                                <div className="btn-group border-2 overflow-hidden rounded-full">
                                    <button
                                        type="button"
                                        onClick={() => setPostForm(prev => ({ ...prev, published: false }))}
                                        className={`btn ${!postForm.published ? 'btn-active' : 'btn-ghost'}`}
                                    >
                                        Private
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPostForm(prev => ({ ...prev, published: true }))}
                                        className={`btn ${postForm.published ? 'btn-active' : 'btn-ghost'}`}
                                    >
                                        Published
                                    </button>
                                </div>
                                <button type="submit" className="btn btn-primary">SAVE</button>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-5">
                            <div className="form-control w-1/2">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Type here"
                                    className="input input-bordered w-full"
                                    name='title'
                                    value={postForm.title}
                                    onChange={e => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                                {/* Where an error would be in daisyui */}
                                {/* <label className="label">
                                    <span className="label-text-alt">Alt label</span>
                                </label> */}
                            </div>
                            <div className="form-control w-1/2">
                                <label className="label">
                                    <span className="label-text">Intro</span>
                                    <span className="label-text italic">A short blurb about your post</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Type here"
                                    className="input input-bordered w-full"
                                    value={postForm.intro}
                                    name="intro"
                                    onChange={e => setPostForm(prev => ({ ...prev, intro: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="markdown-container">
                            <MdEditor value={postForm.content} onImageUpload={handleImageUpload} style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default EditPost