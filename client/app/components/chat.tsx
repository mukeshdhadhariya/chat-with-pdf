'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import axios from 'axios';

interface Doc {
  pageContent?: string;
  metdata?: {
    loc?: {
      pageNumber?: number;
    };
    source?: string;
  };
}
interface IMessage {
  role: 'model' | 'user';
  content?: string;
  documents?: Doc[];
}

const ChatComponent: React.FC = () => {
  const [message, setMessage] = React.useState<string>('');
  const [messages, setMessages] = React.useState<IMessage[]>([]);

  const handleSendChatMessage = async () => {
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    let msg='hwllo'
    const res = await axios.get("http://localhost:8000/chat",{
      params:{msg}
    });
    const data = res.data
    setMessages((prev) => [
      ...prev,
      {
        role: 'model',
        content: data?.message,
        documents: data?.docs,
      },
    ]);
    setMessage('')
  };

  return (
    <div className="p-4">
      <div>
        {messages.map((message, index) => (
          <pre key={index}>{JSON.stringify(message, null, 2)}</pre>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 w-full px-4 py-3 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          {/* Input Box */}
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-2xl px-4 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Send Button */}
          <Button
            onClick={handleSendChatMessage}
            disabled={!message.trim()}
            className="rounded-2xl px-6 py-2 font-medium shadow-md hover:scale-105 transition-transform"
          >
            Send
          </Button>
        </div>
      </div>

    </div>
  );
};
export default ChatComponent;