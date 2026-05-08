import Layout from '@/components/Layout';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { findVideoBySlug, getAllVideoSlugs, getFlatVideoList } from '@/lib/academy-data';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllVideoSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const found = findVideoBySlug(params.slug);
  if (!found) return { title: 'Video Not Found' };
  const { video, groupName, section } = found;
  const description = `Watch "${video.title}" — a free farming video guide from Agrikima Academy (${groupName} › ${section.name}).`;
  const thumbnail = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  return {
    title: `${video.title} | Agrikima Academy`,
    description,
    openGraph: {
      title: video.title,
      description,
      type: 'video.other',
      images: [thumbnail],
      videos: [`https://www.youtube.com/embed/${video.id}`],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description,
      images: [thumbnail],
    },
  };
}

export default function VideoPage({ params }: PageProps) {
  const found = findVideoBySlug(params.slug);
  if (!found) notFound();
  const { video, groupName, section } = found;

  const allVideos = getFlatVideoList();
  const globalIdx = allVideos.findIndex((v) => v.slug === video.slug);
  const prev = globalIdx > 0 ? allVideos[globalIdx - 1] : null;
  const next = globalIdx < allVideos.length - 1 ? allVideos[globalIdx + 1] : null;
  const related = section.videos.filter((v) => v.slug !== video.slug).slice(0, 6);

  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: `Learn about ${video.title} in this Agrikima Academy farming video guide.`,
    thumbnailUrl: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
    publisher: {
      '@type': 'Organization',
      name: 'Agrikima',
      url: 'https://www.agrikima.co.ke',
    },
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        body, .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, #page, .s-pagewrap, .s-content, main {
          background-color: #ffffff !important;
          color: #111111 !important;
        }
        .s-header__menu-links a, .s-header__social .email { color: #111111 !important; }
        .s-header__menu-links li.current > a { color: #014d4b !important; }
        .s-header__social svg path { fill: #111111 !important; }
        .s-header__menu-toggle span, .s-header__menu-toggle span::before, .s-header__menu-toggle span::after { background-color: #111111 !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu { background-color: #ffffff !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu a { color: #111111 !important; }
        .s-header__menu-links > .dropdown > .dropdown-menu a:hover { color: #014d4b !important; }
        .video-page-wrap { max-width: 960px; margin: 0 auto; padding: 30px 20px 80px; }
        .video-page-back { color: #0d4a3f; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px; font-size: 14px; }
        .video-page-crumbs { color: #6b7280; font-size: 13px; margin-bottom: 12px; }
        .video-page-crumbs a { color: #0d4a3f; text-decoration: none; }
        .video-page-title { font-size: 28px; line-height: 1.25; margin: 0 0 24px; color: #111111; font-weight: 700; }
        .video-page-stage { display: flex; align-items: center; gap: 12px; }
        .video-page-arrow { flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; border: 1px solid #e5e7eb; background: #ffffff; color: #0d4a3f; font-size: 24px; line-height: 1; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: background 0.2s, color 0.2s; }
        .video-page-arrow:hover { background: #0d4a3f; color: #ffffff; border-color: #0d4a3f; }
        .video-page-arrow.disabled { opacity: 0.3; pointer-events: none; }
        .video-page-player { position: relative; padding-top: 56.25%; background: #000; border-radius: 8px; overflow: hidden; flex: 1; }
        .video-page-player iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        .video-related { margin-top: 50px; }
        .video-related h2 { font-size: 18px; margin: 0 0 16px; color: #111111; font-weight: 700; }
        .video-related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .video-related-card { display: block; text-decoration: none; color: inherit; border-radius: 8px; overflow: hidden; border: 1px solid #eee; transition: border-color 0.2s; }
        .video-related-card:hover { border-color: #0d4a3f; }
        .video-related-card img { width: 100%; height: auto; display: block; aspect-ratio: 16/9; object-fit: cover; }
        .video-related-card .t { padding: 10px 12px; font-size: 13px; font-weight: 600; color: #111111; }
        @media (max-width: 600px) {
          .video-page-arrow { width: 36px; height: 36px; font-size: 20px; }
        }
      `}} />
      <main>
        <div className="video-page-wrap">
          <Link href="/agrikima-academy" className="video-page-back">← Back to Academy</Link>
          <div className="video-page-crumbs">
            <Link href={`/agrikima-academy?filter=${encodeURIComponent(groupName)}`}>{groupName}</Link>
            {' › '}
            <Link href={`/agrikima-academy?filter=${section.anchor}`}>{section.name}</Link>
          </div>
          <h1 className="video-page-title">{video.title}</h1>
          <div className="video-page-stage">
            {prev ? (
              <Link href={`/agrikima-academy/${prev.slug}`} className="video-page-arrow" aria-label={`Previous: ${prev.title}`}>‹</Link>
            ) : (
              <span className="video-page-arrow disabled" aria-hidden="true">‹</span>
            )}
            <div className="video-page-player">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {next ? (
              <Link href={`/agrikima-academy/${next.slug}`} className="video-page-arrow" aria-label={`Next: ${next.title}`}>›</Link>
            ) : (
              <span className="video-page-arrow disabled" aria-hidden="true">›</span>
            )}
          </div>

          {related.length > 0 && (
            <div className="video-related">
              <h2>More from {section.name}</h2>
              <div className="video-related-grid">
                {related.map((v) => (
                  <Link key={v.slug} href={`/agrikima-academy/${v.slug}`} className="video-related-card">
                    <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} alt={v.title} loading="lazy" />
                    <div className="t">{v.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
