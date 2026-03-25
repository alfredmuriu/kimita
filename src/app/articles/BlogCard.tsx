'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/supabase';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const threshold = 12;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="blog-card"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      {/* Image container with fixed height */}
      <div style={{
        width: '100%',
        height: '180px',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <img
          src={post.featured_image || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=2000&auto=format&fit=crop'}
          alt={post.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Content area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '16px'
      }}>
        {/* Title - limited to 2 lines */}
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937',
          lineHeight: '1.4',
          marginBottom: '8px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {post.title}
        </h3>

        {/* Excerpt - limited to 3 lines */}
        <p style={{
          fontSize: '13px',
          color: '#4b5563',
          lineHeight: '1.5',
          flex: 1,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>
          {post.excerpt || 'Read more about this topic...'}
        </p>

        {/* Button at bottom */}
        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <Link
            href={`/articles/${post.slug}`}
            className="btn btn--stroke"
            style={{
              fontSize: '11px',
              padding: '10px 20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              height: '48px'
            }}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}

