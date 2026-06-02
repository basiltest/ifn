import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { Icon } from '../components/Icons.jsx'
import Avatar from '../components/Avatar.jsx'
import GateBar from '../components/GateBar.jsx'
import { RoleBadge, HardBadge, SuperTag } from '../components/Badge.jsx'
import { gateFull, gateMeaning, timeAgo } from '../lib/tags.js'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { data, currentUser, getMember, vote, togglePin, requestSuccess, addComment, deleteComment } =
    useStore()
  const [text, setText] = useState('')

  const post = data.posts.find((p) => p.id === id)

  if (!post) {
    return (
      <div className="card p-10 text-center">
        <p className="font-bold">Post not found.</p>
        <p className="mt-1 text-sm text-muted">It may have been deleted or is a draft.</p>
        <Link to="/" className="btn-primary mt-4 inline-flex">Back to Feed</Link>
      </div>
    )
  }

  const author = getMember(post.authorId) || { name: 'Unknown', role: 'student' }
  const isAuthor = post.authorId === 'me'
  const isAdmin = currentUser.role === 'admin'
  const score = post.up - post.down

  const share = () => {
    navigator.clipboard?.writeText(`${location.origin}/post/${post.id}`).catch(() => {})
    toast('Link copied to clipboard')
  }

  const comments = post.comments || []
  const submitComment = () => {
    if (!text.trim()) return
    addComment(post.id, text)
    setText('')
    toast('Comment added')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <button onClick={() => navigate(-1)} className="btn-ghost px-2 text-sm">
        <Icon name="arrowDown" size={16} className="rotate-90" /> Back
      </button>

      <article className="card flex overflow-hidden">
        {/* vote rail */}
        <div className="flex w-14 flex-col items-center gap-1 bg-page/60 py-4">
          <button
            onClick={() => vote(post.id, 1)}
            className={`rounded-full p-1.5 hover:bg-up/10 ${post.myVote === 1 ? 'text-up' : 'text-faint'}`}
            aria-label="Upvote"
          >
            <Icon name="arrowUp" size={22} strokeWidth={2.4} />
          </button>
          <span
            className={`text-base font-bold tabular-nums ${
              post.myVote === 1 ? 'text-up' : post.myVote === -1 ? 'text-down' : 'text-ink'
            }`}
          >
            {score}
          </span>
          <button
            onClick={() => vote(post.id, -1)}
            className={`rounded-full p-1.5 hover:bg-down/10 ${post.myVote === -1 ? 'text-down' : 'text-faint'}`}
            aria-label="Downvote"
          >
            <Icon name="arrowDown" size={22} strokeWidth={2.4} />
          </button>
        </div>

        {/* content */}
        <div className="min-w-0 flex-1 p-5">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
            <Avatar member={author} size={32} />
            <span className="font-bold">{author.name}</span>
            <RoleBadge role={author.role} />
            {post.startup && <span className="chip">{post.startup}</span>}
            <span className="text-faint">· {timeAgo(post.createdAt)}</span>
            {post.pinned && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                <Icon name="pin" size={14} /> Pinned
              </span>
            )}
          </div>

          <h1 className="text-2xl font-extrabold leading-tight">{post.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {post.badges.map((b) => <HardBadge key={b} badge={b} />)}
            {post.successRequest === 'pending' && <HardBadge badge="Success" pending />}
          </div>

          <div className="mt-4 space-y-3 text-[15px] leading-relaxed">
            {post.problem && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted">Problem</div>
                <p>{post.problem}</p>
              </div>
            )}
            {post.solution && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-muted">Solution</div>
                <p>{post.solution}</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <Link key={t} to={`/?tag=${t}`}>
                <SuperTag tag={t} />
              </Link>
            ))}
          </div>

          {/* submission details (structured G1 fields) */}
          {[post.targetUsers, post.solutionHypothesis, post.marketSize, post.team, post.testsDone].some(
            (v) => v && v.trim()
          ) && (
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-line bg-page/40 p-4 sm:grid-cols-2">
              {[
                ['Target users', post.targetUsers],
                ['Solution hypothesis', post.solutionHypothesis],
                ['Market size', post.marketSize],
                ['Team', post.team],
                ['Tests done so far', post.testsDone],
              ]
                .filter(([, v]) => v && v.trim())
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs font-bold text-ink">{label}</dt>
                    <dd className="text-sm text-muted">{value}</dd>
                  </div>
                ))}
            </dl>
          )}

          {/* pipeline status (if part of the pipeline) */}
          {post.gate != null && (
            <div className="mt-5 rounded-xl border border-line bg-page/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <Icon name="pipeline" size={14} /> Pipeline · G{post.gate} {gateFull(post.gate)} · {post.gateStatus}
              </div>
              <p className="mb-3 text-xs leading-relaxed text-muted">{gateMeaning(post.gate)}</p>
              <GateBar gate={post.gate} />
            </div>
          )}

          {/* actions */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-muted">
            <span className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold">
              <Icon name="comment" size={16} /> {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
            <button onClick={share} className="btn-ghost px-3 py-1.5 text-sm">
              <Icon name="share" size={16} /> Share
            </button>
            {isAdmin && (
              <button
                onClick={() => { togglePin(post.id); toast(post.pinned ? 'Post unpinned' : 'Post pinned') }}
                className="btn-ghost px-3 py-1.5 text-sm"
              >
                <Icon name="pin" size={16} /> {post.pinned ? 'Unpin' : 'Pin'}
              </button>
            )}
            {isAuthor && !post.badges.includes('Success') && post.successRequest !== 'pending' && (
              <button
                onClick={() => { requestSuccess(post.id); toast('Requested — awaiting admin approval') }}
                className="btn-ghost px-3 py-1.5 text-sm"
              >
                <Icon name="check" size={16} /> Request #Success
              </button>
            )}
          </div>

          {/* comments */}
          <section className="mt-6 border-t border-line pt-5">
            <h2 className="mb-3 text-base font-extrabold">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h2>

            {/* composer */}
            <div className="mb-5 flex gap-2.5">
              <Avatar member={currentUser} size={36} />
              <div className="min-w-0 flex-1">
                <textarea
                  className="input min-h-[64px] resize-y"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add a comment…"
                />
                <div className="mt-2 flex justify-end">
                  <button className="btn-primary" disabled={!text.trim()} onClick={submitComment}>
                    Comment
                  </button>
                </div>
              </div>
            </div>

            {/* list */}
            <div className="space-y-4">
              {comments.length === 0 && (
                <p className="text-sm text-faint">No comments yet. Start the discussion.</p>
              )}
              {comments.map((c) => {
                const ca = getMember(c.authorId) || { name: 'Unknown', role: 'student' }
                const canDelete = c.authorId === 'me' || isAdmin
                return (
                  <div key={c.id} className="flex gap-2.5">
                    <Avatar member={ca} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold">{ca.name}</span>
                        <RoleBadge role={ca.role} />
                        <span className="text-faint">· {timeAgo(c.createdAt)}</span>
                        {canDelete && (
                          <button
                            onClick={() => { deleteComment(post.id, c.id); toast('Comment deleted') }}
                            className="ml-auto rounded-full p-1 text-faint hover:bg-black/5 hover:text-down"
                            aria-label="Delete comment"
                          >
                            <Icon name="trash" size={14} />
                          </button>
                        )}
                      </div>
                      <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
