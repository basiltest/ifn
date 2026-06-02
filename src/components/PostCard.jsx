import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/store.jsx'
import { useToast } from './Toast.jsx'
import { Icon } from './Icons.jsx'
import Avatar from './Avatar.jsx'
import { RoleBadge, HardBadge, SuperTag } from './Badge.jsx'
import { timeAgo } from '../lib/tags.js'

export default function PostCard({ post, onTagClick, activeTag, footer = null }) {
  const {
    currentUser,
    getMember,
    vote,
    togglePin,
    toggleBadge,
    requestSuccess,
  } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)

  const author = getMember(post.authorId) || { name: 'Unknown', role: 'student' }
  const isAuthor = post.authorId === 'me'
  const isAdmin = currentUser.role === 'admin'
  const score = post.up - post.down

  const share = () => {
    const url = `${location.origin}/post/${post.id}`
    navigator.clipboard?.writeText(url).catch(() => {})
    toast('Link copied to clipboard')
  }

  const act = (fn, msg) => {
    fn()
    setMenu(false)
    if (msg) toast(msg)
  }

  const canRequestSuccess =
    isAuthor && !post.badges.includes('Success') && post.successRequest !== 'pending'

  return (
    <article
      className={`card relative flex overflow-hidden transition-shadow hover:shadow-pop ${
        post.pinned ? 'ring-1 ring-accent/30' : ''
      }`}
    >
      {/* vote rail */}
      <div className="flex w-12 flex-col items-center gap-0.5 bg-page/60 py-3">
        <button
          onClick={() => vote(post.id, 1)}
          className={`rounded-full p-1 hover:bg-up/10 ${post.myVote === 1 ? 'text-up' : 'text-faint'}`}
          aria-label="Upvote"
        >
          <Icon name="arrowUp" size={20} strokeWidth={2.3} />
        </button>
        <span
          className={`text-sm font-bold tabular-nums ${
            post.myVote === 1 ? 'text-up' : post.myVote === -1 ? 'text-down' : 'text-ink'
          }`}
        >
          {score}
        </span>
        <button
          onClick={() => vote(post.id, -1)}
          className={`rounded-full p-1 hover:bg-down/10 ${post.myVote === -1 ? 'text-down' : 'text-faint'}`}
          aria-label="Downvote"
        >
          <Icon name="arrowDown" size={20} strokeWidth={2.3} />
        </button>
      </div>

      {/* body */}
      <div className="min-w-0 flex-1 p-3.5">
        <div className="mb-1 flex items-center gap-2 text-sm">
          <Avatar member={author} size={28} />
          <span className="font-bold">{author.name}</span>
          <RoleBadge role={author.role} />
          {post.startup && <span className="chip">{post.startup}</span>}
          <span className="text-faint">· {timeAgo(post.createdAt)}</span>
          {post.pinned && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-accent">
              <Icon name="pin" size={14} /> Pinned
            </span>
          )}

          {/* more menu */}
          {(isAdmin || isAuthor) && (
            <div className={`relative ${post.pinned ? '' : 'ml-auto'}`}>
              <button
                onClick={() => setMenu((v) => !v)}
                className="rounded-full p-1 text-muted hover:bg-black/5 hover:text-ink"
                aria-label="More"
              >
                <Icon name="dots" size={18} />
              </button>
              {menu && (
                <>
                  <button
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setMenu(false)}
                    tabIndex={-1}
                    aria-hidden
                  />
                  <div className="absolute right-0 z-20 mt-1 w-56 animate-pop-in rounded-xl border border-line bg-card py-1 shadow-pop">
                    {isAdmin && (
                      <MenuItem
                        icon="pin"
                        label={post.pinned ? 'Unpin post' : 'Pin to top'}
                        onClick={() =>
                          act(() => togglePin(post.id), post.pinned ? 'Post unpinned' : 'Post pinned')
                        }
                      />
                    )}
                    {isAuthor && (
                      <>
                        <MenuItem
                          icon="shield"
                          label={
                            post.badges.includes('IdeaValidation')
                              ? 'Remove #IdeaValidation'
                              : 'Add #IdeaValidation'
                          }
                          onClick={() => act(() => toggleBadge(post.id, 'IdeaValidation'))}
                        />
                        <MenuItem
                          icon="flask"
                          label={
                            post.badges.includes('IdeaAutopsy')
                              ? 'Remove #IdeaAutopsy'
                              : 'Mark as #IdeaAutopsy'
                          }
                          onClick={() =>
                            act(
                              () => toggleBadge(post.id, 'IdeaAutopsy'),
                              post.badges.includes('IdeaAutopsy')
                                ? 'Autopsy removed'
                                : 'Marked as Idea Autopsy — removed from pipeline'
                            )
                          }
                        />
                        {canRequestSuccess && (
                          <MenuItem
                            icon="check"
                            label="Request #Success badge"
                            onClick={() =>
                              act(() => requestSuccess(post.id), 'Requested — awaiting admin approval')
                            }
                          />
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="group cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
          <h3 className="text-[15px] font-extrabold leading-snug group-hover:underline">{post.title}</h3>

          {(post.problem || post.solution) && (
            <div className="mt-1 space-y-1 text-sm text-muted">
              {post.problem && (
                <p className="line-clamp-2">
                  <span className="font-semibold text-ink">Problem: </span>
                  {post.problem}
                </p>
              )}
              {post.solution && (
                <p className="line-clamp-2">
                  <span className="font-semibold text-ink">Solution: </span>
                  {post.solution}
                </p>
              )}
            </div>
          )}
        </div>

        {/* tags + badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {post.badges.map((b) => (
            <HardBadge key={b} badge={b} />
          ))}
          {post.successRequest === 'pending' && <HardBadge badge="Success" pending />}
          {post.tags.map((t) => (
            <SuperTag
              key={t}
              tag={t}
              active={activeTag === t}
              onClick={onTagClick ? () => onTagClick(t) : undefined}
            />
          ))}
        </div>

        {/* footer */}
        <div className="mt-3 flex items-center gap-1 text-muted">
          <button
            onClick={() => navigate(`/post/${post.id}`)}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold hover:bg-black/5 hover:text-ink"
          >
            <Icon name="comment" size={16} /> {post.comments?.length || 0}
            <span className="hidden sm:inline">Comments</span>
          </button>
          <button
            onClick={share}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold hover:bg-black/5 hover:text-ink"
          >
            <Icon name="share" size={16} /> Share
          </button>
          {footer}
        </div>
      </div>
    </article>
  )
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-medium hover:bg-black/5"
    >
      <Icon name={icon} size={16} className="text-muted" />
      {label}
    </button>
  )
}
