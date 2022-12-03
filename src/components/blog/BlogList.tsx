import { Post } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'

type BlogListProps = {
    posts: Post[];
}

const BlogList = ({ posts }: BlogListProps) => {
    const router = useRouter()
    return (
        <section className='h-full lg:max-w-[70vw] mx-auto px-10 lg:px-20 py-20'>
            <div className='flex items-center justify-between'>
                <div className='text-6xl font-extrabold '>Blog</div>
                {router.pathname !== '/blog' && (
                    <Link href='/blog' className='btn btn-primary'>See All</Link>
                )}
            </div>
            {posts.map((post, i) => (
                <Link href={`/posts/${post.id}`} key={post.id}>
                    <div className={`w-full py-8 hover:py-16 hover:text-primary-focus duration-300 lg:flex gap-4 items-center justify-between text-right ${posts.length - 1 !== i && ('border-b-2')}`}>
                        <img className="w-full h-64 lg:h-32 lg:w-1/3 mb-5 lg:mb-0 object-cover" src="https://placeimg.com/400/400/arch" alt="Album" />
                        <div className='lg:w-2/3 pl-5'>
                            <h1 className='text-4xl font-bold mb-2'>{post.title}</h1>
                            <p className='max-h-32 text-2xl font-light truncate'>{post.intro} Lorem ipsum dolor sit, amet consectetur adipisicing elit. At rerum nobis quam ea, velit nam fugiat repellendus in dicta similique ab quaerat sint aut distinctio! Fuga obcaecati odio error quas animi. Officia, similique? Odio nihil commodi alias ducimus officiis adipisci officia! Non molestias maiores delectus ex, obcaecati eum itaque blanditiis inventore. Minima repellat nobis labore animi temporibus iste! Doloribus iste modi sunt blanditiis ducimus vero a labore voluptatum voluptatibus ipsum. Voluptates odit blanditiis voluptatem culpa, reprehenderit sed voluptatum molestiae asperiores omnis? Illo doloremque et asperiores cum in sed omnis ducimus quas quod! Hic minima, dignissimos accusantium eos perferendis atque beatae ea quas exercitationem ab! Nemo qui incidunt dignissimos enim temporibus officia ipsa consectetur, recusandae quas veritatis aperiam! Sapiente, adipisci error repellat doloribus possimus veniam, explicabo aliquid expedita iure nostrum commodi. Similique, deserunt nulla. Laudantium ad omnis vero eaque dolor ea, nesciunt sit tempore reiciendis sunt placeat aspernatur nisi aperiam consectetur vel aliquam provident voluptates esse repudiandae odio. Adipisci, reprehenderit voluptatibus nam dolores, iure fugit facere exercitationem repellendus modi veniam labore illum cum dolore dolor totam perferendis aut magni repellat alias cumque voluptas tempora ea aliquid tenetur! Eos illum aliquam nemo ullam quam quas, quis voluptatem explicabo ratione commodi. Quibusdam, provident? </p>
                        </div>
                    </div>
                </Link>
            ))}
        </section>
    )
}

export default BlogList