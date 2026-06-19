'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import s from '@/styles/agent.module.css'

// ── Types ──────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  publishResult?: string
  ts: number
}

interface Post {
  id: string
  platform: string
  content_type: string
  content: string
  hashtags: string[]
  status: 'pending' | 'published' | 'failed'
  post_url?: string
  error_message?: string
  published_at?: string
  created_at: string
}

type PostsTab = 'all' | 'pending' | 'published' | 'failed'
type RightTab = 'posts' | 'publish'

const PLATFORMS = ['Twitter', 'Facebook', 'Instagram', 'LinkedIn']
const SESSION_ID = `session_${Math.random().toString(36).slice(2)}`

const PLATFORM_CLASS: Record<string, string> = {
  Twitter: s.platformTwitter,
  Facebook: s.platformFacebook,
  Instagram: s.platformInstagram,
  LinkedIn: s.platformLinkedIn,
  TikTok: s.platformTikTok,
}

const STATUS_CLASS: Record<string, string> = {
  pending: s.statusPending,
  published: s.statusPublished,
  failed: s.statusFailed,
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function MarketingAgentPage() {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Posts state
  const [posts, setPosts] = useState<Post[]>([])
  const [postsTab, setPostsTab] = useState<PostsTab>('all')
  const [postsLoading, setPostsLoading] = useState(false)
  const [publishingId, setPublishingId] = useState<string | null>(null)

  // Right panel tab
  const [rightTab, setRightTab] = useState<RightTab>('posts')

  // Compose / manual publish state
  const [composePlatforms, setComposePlatforms] = useState<string[]>(['Instagram'])
  const [composeCaption, setComposeCaption] = useState('')
  const [composeHashtags, setComposeHashtags] = useState('')
  const [composeFile, setComposeFile] = useState<File | null>(null)
  const [composePreview, setComposePreview] = useState<string | null>(null)
  const [composeUploading, setComposeUploading] = useState(false)
  const [composePublishing, setComposePublishing] = useState(false)
  const [composeResult, setComposeResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [composeScheduleEnabled, setComposeScheduleEnabled] = useState(false)
  const [composeScheduleAt, setComposeScheduleAt] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Run state
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'ok' | 'error'>('idle')
  const [runMessage, setRunMessage] = useState('')

  // ── Fetch posts ────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    setPostsLoading(true)
    try {
      const params = postsTab !== 'all' ? `?status=${postsTab}` : ''
      const res = await fetch(`/api/marketing/posts${params}`)
      const data = await res.json()
      setPosts(data.posts ?? [])
    } catch {
      // silent
    } finally {
      setPostsLoading(false)
    }
  }, [postsTab])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  // ── Auto-scroll chat ───────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, chatLoading])

  // ── Auto-resize textarea ───────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  // ── Send chat message ──────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim()
    if (!text || chatLoading) return

    const userMsg: ChatMessage = { role: 'user', content: text, ts: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setChatLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: SESSION_ID }),
      })
      const data = await res.json()

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply || 'Something went wrong.',
        publishResult: data.publish_result ?? undefined,
        ts: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMsg])
      if (data.publish_result) fetchPosts()
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error — please try again.', ts: Date.now() },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Publish a saved post ───────────────────────────────────
  const publishPost = async (postId: string) => {
    setPublishingId(postId)
    try {
      await fetch('/api/marketing/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId }),
      })
      fetchPosts()
    } catch {
      // silent
    } finally {
      setPublishingId(null)
    }
  }

  // ── Trigger full pipeline ──────────────────────────────────
  const triggerRun = async () => {
    if (runStatus === 'running') return
    setRunStatus('running')
    setRunMessage('Running research, strategy, and publishing pipeline...')
    try {
      const res = await fetch('/api/marketing/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': process.env.NEXT_PUBLIC_AGENT_CRON_SECRET || '',
        },
      })
      const data = await res.json()
      if (data.success) {
        setRunStatus('ok')
        setRunMessage(`Done — ${data.published} published, ${data.failed} failed in ${Math.round(data.duration_seconds)}s`)
        fetchPosts()
      } else {
        setRunStatus('error')
        setRunMessage(data.error || 'Run failed')
      }
    } catch {
      setRunStatus('error')
      setRunMessage('Network error')
    }
  }

  // ── File pick for compose ──────────────────────────────────
  const acceptFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setComposeResult({ ok: false, msg: 'Only image or video files are allowed' })
      return
    }
    setComposeFile(file)
    setComposeResult(null)
    const url = URL.createObjectURL(file)
    setComposePreview(url)
  }

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) acceptFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!isDragging) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) acceptFile(file)
  }

  const clearFile = () => {
    setComposeFile(null)
    setComposePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Manual compose & publish ───────────────────────────────
  const handleComposePublish = async () => {
    if (!composeCaption.trim() || composePlatforms.length === 0) return

    // Validate schedule input if enabled
    let scheduledIso: string | null = null
    if (composeScheduleEnabled) {
      if (!composeScheduleAt) {
        setComposeResult({ ok: false, msg: 'Pick a date and time to schedule' })
        return
      }
      const when = new Date(composeScheduleAt)
      if (isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        setComposeResult({ ok: false, msg: 'Schedule time must be in the future' })
        return
      }
      scheduledIso = when.toISOString()
    }

    setComposePublishing(true)
    setComposeResult(null)

    try {
      let mediaUrl: string | undefined

      // Upload file once, reuse URL across platforms
      if (composeFile) {
        setComposeUploading(true)
        const fd = new FormData()
        fd.append('file', composeFile)
        const uploadRes = await fetch('/api/marketing/upload', { method: 'POST', body: fd })
        const uploadData = await uploadRes.json()
        setComposeUploading(false)

        if (!uploadRes.ok) {
          setComposeResult({ ok: false, msg: uploadData.error || 'Upload failed' })
          setComposePublishing(false)
          return
        }
        mediaUrl = uploadData.url
      }

      const hashtags = composeHashtags
        .split(/[\s,]+/)
        .map((h) => (h.startsWith('#') ? h : `#${h}`))
        .filter(Boolean)

      const text = [composeCaption.trim(), hashtags.join(' ')].filter(Boolean).join('\n\n')

      // Publish (or schedule) to all selected platforms in parallel
      const results = await Promise.all(
        composePlatforms.map((platform) =>
          fetch('/api/marketing/publish-compose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform,
              content: composeCaption.trim(),
              hashtags,
              media_url: mediaUrl,
              media_type: composeFile?.type.startsWith('video') ? 'video' : 'image',
              text,
              scheduled_for: scheduledIso,
            }),
          }).then((r) => r.json().then((d) => ({ platform, ...d })))
        )
      )

      if (scheduledIso) {
        const ok = results.filter((r) => r.success).map((r) => r.platform)
        const bad = results.filter((r) => !r.success).map((r) => r.platform)
        const when = new Date(scheduledIso).toLocaleString()
        if (bad.length === 0) {
          setComposeResult({ ok: true, msg: `Scheduled for ${when} on ${ok.join(', ')}.` })
          setComposeCaption('')
          setComposeHashtags('')
          clearFile()
          setComposePlatforms(['Instagram'])
          setComposeScheduleEnabled(false)
          setComposeScheduleAt('')
          fetchPosts()
          setRightTab('posts')
        } else {
          setComposeResult({
            ok: false,
            msg: `Scheduled on ${ok.join(', ') || 'none'}. Failed: ${bad.join(', ')}.`,
          })
          fetchPosts()
        }
        return
      }

      const succeeded = results.filter((r) => r.success).map((r) => r.platform)
      const failed = results.filter((r) => !r.success).map((r) => r.platform)

      if (failed.length === 0) {
        setComposeResult({ ok: true, msg: `Published to ${succeeded.join(', ')}!` })
        setComposeCaption('')
        setComposeHashtags('')
        clearFile()
        setComposePlatforms(['Instagram'])
        fetchPosts()
        setRightTab('posts')
      } else if (succeeded.length > 0) {
        setComposeResult({
          ok: false,
          msg: `Published to ${succeeded.join(', ')}. Failed: ${failed.join(', ')}.`,
        })
        fetchPosts()
      } else {
        setComposeResult({ ok: false, msg: `Failed to publish to ${failed.join(', ')}.` })
      }
    } catch {
      setComposeResult({ ok: false, msg: 'Network error' })
    } finally {
      setComposePublishing(false)
      setComposeUploading(false)
    }
  }

  const togglePlatform = (p: string) => {
    setComposePlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
    setComposeResult(null)
  }

  const isVideo = composeFile?.type.startsWith('video')
  const needsMedia = composePlatforms.includes('Instagram')

  return (
    <div className={s.page}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.headerLeft}>
          <img className={s.logo} src="/logo.png" alt="Agrikima" />
        </div>
        <button
          className={s.runBtn}
          onClick={triggerRun}
          disabled={runStatus === 'running'}
        >
          {runStatus === 'running' ? 'Running...' : 'Run Pipeline'}
        </button>
      </header>

      {/* Run status banner */}
      {runStatus !== 'idle' && (
        <div className={`${s.banner} ${
          runStatus === 'running' ? s.bannerRunning :
          runStatus === 'ok' ? s.bannerOk : s.bannerErr
        }`}>
          {runMessage}
          {runStatus !== 'running' && (
            <button type="button" className={s.dismissBtn} onClick={() => setRunStatus('idle')}>
              dismiss
            </button>
          )}
        </div>
      )}

      {/* Main layout */}
      <div className={s.layout}>

        {/* ── Left: Chat ── */}
        <div className={`${s.panel} ${s.divider}`}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>Chat</span>
          </div>

          <div className={s.chatMessages}>
            {messages.length === 0 ? (
              <div className={s.chatEmpty}>
                <div className={s.chatEmptyIcon}>💬</div>
                <div className={s.chatEmptyText}>Ask the agent anything</div>
                <div className={s.chatEmptySub}>
                  Try: "Write a LinkedIn post about AMR" or "Post this to Twitter: [text]"
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`${s.msg} ${msg.role === 'user' ? s.msgUser : s.msgAssistant}`}>
                  <div className={s.msgBubble}>{msg.content}</div>
                  {msg.publishResult && (
                    <div className={`${s.publishResult} ${
                      msg.publishResult.startsWith('Published') ? s.publishResultOk : s.publishResultErr
                    }`}>
                      {msg.publishResult}
                    </div>
                  )}
                  <div className={s.msgMeta}>{formatTime(msg.ts)}</div>
                </div>
              ))
            )}

            {chatLoading && (
              <div className={s.msgAssistant} style={{ display: 'flex' }}>
                <div className={s.typing}>
                  <div className={s.typingDot} />
                  <div className={s.typingDot} />
                  <div className={s.typingDot} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={s.chatInputArea}>
            <textarea
              ref={textareaRef}
              className={s.chatInput}
              placeholder="Message the agent... (Shift+Enter for new line)"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className={s.sendBtn}
              onClick={sendMessage}
              disabled={chatLoading || !input.trim()}
              aria-label="Send"
            >
              ↑
            </button>
          </div>
        </div>

        {/* ── Right: Posts + Publish Post ── */}
        <div className={`${s.panel} ${s.postsPanel}`}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>
              {rightTab === 'posts' ? 'Posts' : 'Publish Post'}
            </span>
            {rightTab === 'posts' && (
              <button type="button" className={s.refreshBtn} onClick={fetchPosts}>
                Refresh
              </button>
            )}
          </div>

          {/* Right panel tabs */}
          <div className={s.tabs}>
            <button
              type="button"
              className={`${s.tab} ${rightTab === 'posts' ? s.activeTab : ''}`}
              onClick={() => setRightTab('posts')}
            >
              Posts
            </button>
            <button
              type="button"
              className={`${s.tab} ${rightTab === 'publish' ? s.activeTab : ''}`}
              onClick={() => { setRightTab('publish'); setComposeResult(null) }}
            >
              Publish Post
            </button>
          </div>

          {/* ── Posts list ── */}
          {rightTab === 'posts' && (
            <>
              <div className={`${s.tabs} ${s.subTabRow}`}>
                {(['all', 'pending', 'published', 'failed'] as PostsTab[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${s.tab} ${s.subTab} ${postsTab === t ? s.activeTab : ''}`}
                    onClick={() => setPostsTab(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className={s.postsList}>
                {postsLoading ? (
                  <div className={s.postsEmpty}>Loading...</div>
                ) : posts.length === 0 ? (
                  <div className={s.postsEmpty}>
                    No {postsTab === 'all' ? '' : postsTab} posts yet
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className={s.postCard}>
                      <div className={s.postCardTop}>
                        <div className={s.postCardMeta}>
                          <span className={`${s.platformBadge} ${PLATFORM_CLASS[post.platform] || ''}`}>
                            {post.platform}
                          </span>
                          <span className={s.typeBadge}>{post.content_type}</span>
                        </div>
                        <span className={`${s.statusBadge} ${STATUS_CLASS[post.status] || ''}`}>
                          {post.status}
                        </span>
                      </div>

                      <div className={s.postContent}>{post.content}</div>

                      {post.hashtags?.length > 0 && (
                        <div className={s.postHashtags}>{post.hashtags.join(' ')}</div>
                      )}

                      <div className={s.postCardBottom}>
                        <span className={s.postDate}>
                          {formatDate(post.status === 'published' && post.published_at ? post.published_at : post.created_at)}
                        </span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          {post.status === 'pending' && (
                            <button
                              className={s.publishNowBtn}
                              onClick={() => publishPost(post.id)}
                              disabled={publishingId === post.id}
                            >
                              {publishingId === post.id ? 'Publishing...' : 'Publish'}
                            </button>
                          )}
                          {post.status === 'published' && post.post_url && (
                            <a href={post.post_url} target="_blank" rel="noopener noreferrer" className={s.viewLink}>
                              View post →
                            </a>
                          )}
                          {post.status === 'failed' && post.error_message && (
                            <span className={s.postErrorText} title={post.error_message}>
                              {post.error_message.slice(0, 40)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* ── Publish Post compose ── */}
          {rightTab === 'publish' && (
            <div className={s.composeForm}>

              {/* Platform selector */}
              <div className={s.composeField}>
                <label className={s.composeLabel}>Platform</label>
                <div className={s.platformPills}>
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`${s.platformPill} ${composePlatforms.includes(p) ? s.platformPillActive : ''}`}
                      onClick={() => togglePlatform(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {composePlatforms.length > 1 && (
                  <div className={s.composeLabelHint}>
                    Posting to {composePlatforms.length} platforms simultaneously
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className={s.composeField}>
                <label className={s.composeLabel}>Caption</label>
                <textarea
                  className={s.composeTextarea}
                  placeholder="Write your caption..."
                  value={composeCaption}
                  onChange={(e) => setComposeCaption(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Hashtags */}
              <div className={s.composeField}>
                <label className={s.composeLabel}>Hashtags <span className={s.composeLabelHint}>(space or comma separated)</span></label>
                <input
                  type="text"
                  className={s.composeInput}
                  placeholder="#organicfarming #agrikima #kenya"
                  value={composeHashtags}
                  onChange={(e) => setComposeHashtags(e.target.value)}
                />
              </div>

              {/* Media upload */}
              <div className={s.composeField}>
                <label className={s.composeLabel}>
                  Media
                  {needsMedia && <span className={s.composeRequired}> *required for Instagram</span>}
                </label>

                {!composeFile ? (
                  <div
                    className={`${s.dropzone} ${isDragging ? s.dropzoneActive : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className={s.dropzoneIcon}>↑</div>
                    <div className={s.dropzoneText}>
                      {isDragging ? 'Drop file to upload' : 'Click or drag a file to upload'}
                    </div>
                    <div className={s.dropzoneHint}>JPG, PNG, MP4, MOV — max 100MB</div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      aria-label="Upload image or video"
                      title="Upload image or video"
                      style={{ display: 'none' }}
                      onChange={handleFilePick}
                    />
                  </div>
                ) : (
                  <div className={s.mediaPreview}>
                    {isVideo ? (
                      <video
                        src={composePreview || ''}
                        controls
                        className={s.mediaPreviewVideo}
                      />
                    ) : (
                      <img
                        src={composePreview || ''}
                        alt="preview"
                        className={s.mediaPreviewImg}
                      />
                    )}
                    <div className={s.mediaPreviewMeta}>
                      <span className={s.mediaPreviewName}>{composeFile.name}</span>
                      <span className={s.mediaPreviewSize}>{formatBytes(composeFile.size)}</span>
                      <button type="button" className={s.mediaRemoveBtn} onClick={clearFile}>Remove</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule */}
              <div className={s.composeField}>
                <label className={s.composeLabel}>
                  <input
                    type="checkbox"
                    checked={composeScheduleEnabled}
                    onChange={(e) => {
                      setComposeScheduleEnabled(e.target.checked)
                      if (!e.target.checked) setComposeScheduleAt('')
                    }}
                  />
                  &nbsp;Schedule for later
                </label>
                {composeScheduleEnabled && (
                  <input
                    type="datetime-local"
                    className={s.composeInput}
                    value={composeScheduleAt}
                    onChange={(e) => setComposeScheduleAt(e.target.value)}
                    min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
                    aria-label="Schedule publish date and time"
                    title="Schedule publish date and time"
                  />
                )}
              </div>

              {/* Result */}
              {composeResult && (
                <div className={`${s.composeResult} ${composeResult.ok ? s.composeResultOk : s.composeResultErr}`}>
                  {composeResult.msg}
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                className={s.composeSubmitBtn}
                onClick={handleComposePublish}
                disabled={
                  composePublishing ||
                  !composeCaption.trim() ||
                  composePlatforms.length === 0 ||
                  (needsMedia && !composeFile) ||
                  (composeScheduleEnabled && !composeScheduleAt)
                }
              >
                {composeUploading
                  ? 'Uploading media...'
                  : composePublishing
                  ? (composeScheduleEnabled ? 'Scheduling...' : 'Publishing...')
                  : composePlatforms.length === 0
                  ? 'Select a platform'
                  : composeScheduleEnabled
                  ? composePlatforms.length === 1
                    ? `Schedule for ${composePlatforms[0]}`
                    : `Schedule for ${composePlatforms.length} platforms`
                  : composePlatforms.length === 1
                  ? `Publish to ${composePlatforms[0]}`
                  : `Publish to ${composePlatforms.length} platforms`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
