interface ConversationBubbleProps {
  role: 'user' | 'ai';
  userName?: string;
  aiName?: string;
  text: string;
  timestamp?: string;
}

export function ConversationBubble({ role, userName, aiName, text, timestamp }: ConversationBubbleProps) {
  const isUser = role === 'user';
  const displayName = isUser ? userName || '나' : aiName || 'AI';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div className="flex items-center gap-2 mb-1">
          {!isUser && <span className="text-sm text-gray-600">{displayName}</span>}
          {isUser && <span className="text-sm text-gray-600">{displayName}</span>}
        </div>
        <div 
          className={`p-4 rounded-2xl ${
            isUser 
              ? 'bg-red-500 text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-900 rounded-tl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
        {timestamp && (
          <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
}
