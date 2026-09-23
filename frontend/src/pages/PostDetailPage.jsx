import React, { use, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPostBySlug } from '../api';
import { LoadingState } from '../components/States';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

export default function PostDetailPage() {
  const { slug } = useParams();

  const postPromise = React.useMemo(() => fetchPostBySlug(slug), [slug]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#2D312E]">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F3EF] border border-[#E8E5DF] text-xs font-medium text-[#4A5568] hover:bg-[#EADECA] transition mb-8"
        >
          <ArrowLeft size={14} /> Return to list
        </Link>

        <Suspense fallback={<LoadingState message="Unfolding article details..." />}>
          <PostDetailContent postPromise={postPromise} />
        </Suspense>
      </main>
    </div>
  );
}

function PostDetailContent({ postPromise }) {
  const post = use(postPromise);

  return (
    <article>
      <header className="mb-10">
        <div className="flex items-center gap-3 text-xs text-[#718096] font-medium mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          {post.category && (
            <>
              <span>•</span>
              <Link
                to={`/?category=${post.category.slug}`}
                className="inline-flex items-center gap-1 bg-[#EADECA] text-[#2C3531] px-3 py-0.5 rounded-full font-medium"
              >
                <Tag size={12} />
                {post.category.name}
              </Link>
            </>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2D312E] tracking-tight leading-tight">
          {post.title}
        </h1>
      </header>

      <div className="prose prose-stone max-w-none text-[#4A5568] text-base leading-relaxed space-y-5 border-t border-[#E8E5DF] pt-8">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
