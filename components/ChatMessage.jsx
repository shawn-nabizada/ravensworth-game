'use client'

export default function ChatMessage({ role, content, characterName, userLabel }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[80%] rounded-md px-4 py-3 leading-relaxed',
          isUser
            ? 'bg-amber/15 border border-amber/40 text-parchment'
            : 'bg-ink/80 border border-amber-dim/50 text-parchment',
        ].join(' ')}
      >
        <div
          className={`mb-1 text-xs uppercase tracking-widest ${
            isUser ? 'text-amber-bright' : 'text-amber'
          }`}
        >
          {isUser ? userLabel || 'Detective' : characterName}
        </div>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}
