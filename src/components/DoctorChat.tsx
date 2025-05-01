
import { useState, useRef, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: number;
  sender: 'user' | 'doctor';
  text: string;
  timestamp: Date;
}

interface DoctorChatProps {
  doctorName: string;
  doctorImage: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DoctorChat = ({ doctorName, doctorImage, open, onOpenChange }: DoctorChatProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'doctor',
      text: `Hello! I'm Dr. ${doctorName}. How can I help with your health concern today?`,
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Extract previous messages for context (limit to last 5 for relevance)
      const previousMessages = messages.slice(-5).map(msg => ({
        role: msg.sender === 'doctor' ? 'bot' : 'user',
        content: msg.text
      }));
      
      // Call the Supabase Edge Function for AI response
      const { data, error } = await supabase.functions.invoke('gemini-health-chat', {
        body: { 
          prompt: message,
          previousMessages
        }
      });
      
      if (error) throw new Error('Failed to get response');
      
      // Add doctor response
      const doctorMessage: Message = {
        id: messages.length + 2,
        sender: 'doctor',
        text: data.generatedText || "I can only discuss health matters. How can I help with your medical concern?",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, doctorMessage]);
      
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Communication Error",
        description: "Couldn't reach doctor. Please try again.",
        variant: "destructive",
      });
      
      // Add fallback message
      const errorMessage: Message = {
        id: messages.length + 2,
        sender: 'doctor',
        text: "I apologize, but I'm having trouble connecting. Please try again or contact the clinic directly.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] max-h-[85vh] flex flex-col">
        <DrawerHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={doctorImage} 
                alt={doctorName}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <DrawerTitle>{doctorName}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-health-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
        
        {/* Message input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your medical question..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-health-primary"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className="rounded-full bg-health-primary hover:bg-health-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DoctorChat;
