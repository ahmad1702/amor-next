import { Post } from "@prisma/client";
import { Session } from "next-auth";
import { getSession, GetSessionParams } from "next-auth/react";
import { FormEvent, useState } from "react";

import axios from "axios";
import dynamic from "next/dynamic";
import 'react-markdown-editor-lite/lib/index.css';
import { useRouter } from "next/router";
import MarkdownIt from "markdown-it";
import Footer from "../components/global/Footer";
import CustomNav from "../components/global/CustomNav";

export async function getServerSideProps(context: GetSessionParams | undefined) {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    return {
        props: { session }
    }
}

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});

type CreatePostProps = {
    session: Session;
}
type PostForm = Pick<Post, 'title' | 'intro' | 'content' | 'published'>

const mdParser = new MarkdownIt(/* Markdown-it options */);

const Createpost = ({ session }: CreatePostProps) => {
    const router = useRouter()
    const [postForm, setPostForm] = useState<PostForm>({
        title: '',
        intro: '',
        content: '',
        published: false,
    })
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (postForm.title.length < 5 || postForm.intro.length < 5 || !postForm.content || (postForm.content && postForm.content.length < 5)) {
            return;
        }
        const res = await axios.post(`${window.location.origin}/api/posts`, postForm)
        if (res.status === 200) {
            router.push(`/posts/${res.data.id}`)
        }
        // alert(JSON.stringify(postForm))
    }
    function handleEditorChange({ html, text }: {
        text: string;
        html: string;
    }) {
        setPostForm({ ...postForm, content: text })
        // console.log('handleEditorChange', html, text);
    }
    function handleImageUpload(file: File) {
        // console.log('image uipload?')
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = data => {
                resolve(data.target?.result);
            };
            reader.readAsDataURL(file);
        });
    }
    return (
        <>
            <CustomNav />
            <div className="min-h-screen w-full p-20 bg-base-200">
                <div className="card w-[80vw] bg-base-100 shadow-xl m-auto">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-between items-center">
                                <h2 className="text-4xl font-extrabold">Create Post</h2>
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
                                <MdEditor onImageUpload={handleImageUpload} style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Createpost