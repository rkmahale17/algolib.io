import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Lightbulb, Brain, Route, CheckCircle2, User as UserIcon, ArrowUp, X, Loader2, Copy, ThumbsUp, ThumbsDown, Eye, Wrench, Bug } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';
import { AIChatMessage } from '@/types/ai';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProOverlay } from '@/components/ProOverlay';
import { AIWelcomeScreen } from './AIWelcomeScreen';

interface RulaPanelProps {
    algorithmId: string;
    algorithmData: any;
    currentCode: string;
    language: string;
    onClose: () => void;
    hasPremiumAccess: boolean;
    onCopyToEditor?: (code: string) => void;
    onOpenVisualizations?: () => void;
}

export const RulaPanel: React.FC<RulaPanelProps> = ({
    algorithmId,
    algorithmData,
    currentCode,
    language,
    onClose,
    hasPremiumAccess,
    onCopyToEditor,
    onOpenVisualizations
}) => {
    const [messages, setMessages] = useState<AIChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Load chat history from DB
    useEffect(() => {
        const loadHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('ai_chats')
                .select('messages')
                .eq('user_id', user.id)
                .eq('algorithm_id', algorithmId)
                .maybeSingle();

            if (data && data.messages) {
                setMessages(data.messages as AIChatMessage[]);
            }
        };
        if (hasPremiumAccess) {
            loadHistory();
        }
    }, [algorithmId, hasPremiumAccess]);

    // Save chat history to DB
    const saveHistory = async (newMessages: AIChatMessage[]) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('ai_chats')
            .upsert({
                user_id: user.id,
                algorithm_id: algorithmId,
                messages: newMessages,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,algorithm_id' });
            
        if (error) console.error("Failed to save chat history", error);
    };

    const handleFeedback = async (messageId: string, feedback: 'like' | 'dislike') => {
        const updatedMessages = messages.map(msg => 
            msg.id === messageId ? { ...msg, feedback } : msg
        );
        setMessages(updatedMessages);
        await saveHistory(updatedMessages);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isStreaming]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = '80px';
            const scrollHeight = inputRef.current.scrollHeight;
            inputRef.current.style.height = Math.max(80, Math.min(scrollHeight, 400)) + 'px';
        }
    }, [inputValue]);

    /** Strip HTML tags and collapse whitespace to get plain text for the AI */
    const stripHtml = (html: string): string => {
        if (!html) return '';
        const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#?\w+;/g, ' ');
        return text.replace(/\s+/g, ' ').trim();
    };

    /** Extract a concise problem summary from the algorithm data */
    const getProblemSummary = (): string => {
        const name = algorithmData?.name || algorithmData?.title || algorithmId;
        const rawDesc = algorithmData?.description || '';
        const plainDesc = stripHtml(rawDesc);
        // Take first 1500 chars to ensure we capture constraints and examples which are usually at the bottom
        const shortDesc = plainDesc.length > 1500 ? plainDesc.slice(0, 1500) + '...' : plainDesc;
        
        let summary = `${name}\n\n${shortDesc}`;

        // Include Test Cases
        if (algorithmData?.test_cases) {
            try {
                const testCasesStr = typeof algorithmData.test_cases === 'string' 
                    ? algorithmData.test_cases 
                    : JSON.stringify(algorithmData.test_cases, null, 2);
                summary += `\n\nTest Cases:\n${testCasesStr.slice(0, 1000)}`;
            } catch (e) {
                console.error("Error formatting test cases for AI", e);
            }
        }

        // Include Optimized Solution (Implementation)
        if (algorithmData?.implementations) {
            try {
                let impls = algorithmData.implementations;
                if (typeof impls === 'string') {
                    impls = JSON.parse(impls);
                }
                if (Array.isArray(impls)) {
                    // Find implementation for current language, or fallback to first available
                    const langImpl = impls.find(i => 
                        i.lang?.toLowerCase() === language?.toLowerCase() || 
                        i.language?.toLowerCase() === language?.toLowerCase()
                    ) || impls[0];
                    
                    if (langImpl) {
                        const code = Array.isArray(langImpl.code) 
                            ? langImpl.code.map((c: any) => c.code).join('\n\n') 
                            : (langImpl.code || '');
                            
                        if (code) {
                            summary += `\n\nOptimized Solution (${langImpl.lang || language}):\n${code}`;
                        }
                    }
                }
            } catch (e) {
                console.error("Error formatting implementations for AI", e);
            }
        }

        return summary;
    };

    /** Make the actual API call and read the SSE stream */
    const streamFromAPI = async (
        requestBody: any,
        aiMessageId: string
    ): Promise<{ content: string; error: string | null }> => {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            return { content: '', error: errText || `HTTP ${response.status}` };
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        if (reader) {
            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(trimmedLine.slice(6));

                            if (data.error) {
                                return { content: fullResponse, error: data.error?.message || JSON.stringify(data.error) };
                            }

                            const chunkText = data.choices?.[0]?.delta?.content || "";
                            if (chunkText) {
                                fullResponse += chunkText;
                                setMessages(prev => prev.map(m =>
                                    m.id === aiMessageId ? { ...m, content: fullResponse } : m
                                ));
                            }
                        } catch {
                            // Ignore JSON parse errors for incomplete chunks
                        }
                    }
                }
            }
        }

        return { content: fullResponse, error: null };
    };

    const handleSendMessage = async (text: string, mode: string = 'chat') => {
        if (!text.trim() || isLoading) return;

        const userMessage: AIChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);
        setIsStreaming(true);

        const aiMessageId = uuidv4();
        setMessages(prev => [...prev, {
            id: aiMessageId,
            role: 'model',
            content: '',
            timestamp: new Date().toISOString()
        }]);

        try {
            // Only send last 4 history messages, excluding the new user message
            const historyForApi = updatedMessages.slice(0, -1).slice(-4).map(m => ({
                role: m.role,
                content: m.content
            }));

            const requestBody = {
                problemId: algorithmId,
                problemDescription: getProblemSummary(),
                userCode: currentCode,
                language,
                message: text,
                mode,
                history: historyForApi
            };

            // ---- Attempt 1 ----
            let result = await streamFromAPI(requestBody, aiMessageId);

            // ---- Auto-retry once if failed with no content ----
            if (result.error && result.content.trim().length === 0) {
                console.warn('RULA: First attempt failed, retrying...', result.error);
                // Reset the placeholder
                setMessages(prev => prev.map(m =>
                    m.id === aiMessageId ? { ...m, content: '' } : m
                ));
                result = await streamFromAPI(requestBody, aiMessageId);
            }

            // Handle final result
            if (result.content.trim().length > 0) {
                // If there was an error mid-stream but we have content, we just stop naturally.
                // No need to append error text which confuses the UI.
                const finalContent = result.content;

                setMessages(prev => prev.map(m =>
                    m.id === aiMessageId ? { ...m, content: finalContent } : m
                ));

                saveHistory([...updatedMessages, {
                    id: aiMessageId,
                    role: 'model',
                    content: finalContent,
                    timestamp: new Date().toISOString()
                }]);
            } else if (result.error) {
                throw new Error(result.error);
            }

        } catch (error: any) {
            console.error('RULA stream error:', error);
            setMessages(prev => prev.filter(m => m.id !== aiMessageId));

            const friendlyMsg = error.message?.includes('Internal Server Error')
                ? 'The AI service is temporarily unavailable. Please try again in a moment.'
                : error.message?.includes('401') || error.message?.includes('Unauthorized')
                ? 'Authentication error. Please refresh the page.'
                : error.message?.includes('429')
                ? 'Rate limit reached. Please wait a few seconds and try again.'
                : 'Something went wrong. Please try again.';
            toast.error(friendlyMsg);
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    };

    if (!hasPremiumAccess) {
        return (
            <div className="flex-1 w-full h-full">
                <ProOverlay 
                    title="Rula AI Assistant" 
                    description="Purchase premium to unlock your personal AI coding assistant, unlimited hints, step-by-step thinking, and optimal approaches."
                    className="border-0 rounded-none h-full"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-transparent w-full">


            {/* Chat Area */}
            <ScrollArea className="flex-1 overflow-hidden" viewportRef={scrollRef}>
                {messages.length === 0 ? (
                    <AIWelcomeScreen />
                ) : (
                    <div className="space-y-4 pb-4 p-4 w-full overflow-hidden">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex flex-col gap-1.5 w-full">
                                {/* Header */}
                                <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} px-1`}>
                                    {msg.role === 'model' && (
                                        <>
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary/20 shrink-0">
                                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                            </div>
                                            <span className="text-xs font-semibold text-foreground/80">Buddy</span>
                                        </>
                                    )}
                                    {msg.role === 'user' && (
                                        <>
                                            <span className="text-xs font-semibold text-foreground/80">You</span>
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-muted shrink-0">
                                                <UserIcon className="w-3.5 h-3.5 text-foreground" />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Message Box */}
                                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start w-full'}`}>
                                    <div className={
                                        msg.role === 'user' 
                                            ? 'px-4 py-3 rounded-2xl rounded-tr-sm text-sm bg-muted/60 border border-border/40 text-foreground overflow-hidden max-w-[85%]' 
                                            : 'py-1 text-sm text-foreground overflow-hidden w-full'
                                    }>
                                        {msg.role === 'user' ? (
                                            msg.content
                                        ) : (
                                            <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden break-words
                                                prose-p:leading-snug prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-border/50
                                                prose-pre:m-0 prose-pre:mt-2 prose-pre:mb-2 prose-pre:p-0 prose-pre:rounded-lg prose-pre:overflow-x-auto">
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({node, inline, className, children, ...props}: any) {
                                                            const match = /language-(\w+)/.exec(className || '')
                                                            const codeString = String(children).replace(/\n$/, '')
                                                            return !inline && match ? (
                                                                <div className="relative group">
                                                                    <SyntaxHighlighter
                                                                        {...props}
                                                                        children={codeString}
                                                                        style={vscDarkPlus as any}
                                                                        language={match[1]}
                                                                        PreTag="div"
                                                                        customStyle={{ fontFamily: 'inherit' }}
                                                                        codeTagProps={{ style: { fontFamily: 'inherit' } }}
                                                                        className="text-[13px] font-mono rounded-lg !bg-zinc-950/50 !p-4 !m-0 overflow-x-auto"
                                                                    />
                                                                    <div className="absolute top-2 right-2 flex gap-2">
                                                                        {onCopyToEditor && (
                                                                            (() => {
                                                                                const lines = codeString.split('\n');
                                                                                const isFull = lines.length > 15 || ['class ', 'def ', 'function ', 'func ', 'public ', 'impl ', 'object ', 'struct '].some(kw => codeString.includes(kw));
                                                                                return isFull;
                                                                            })()
                                                                        ) && (
                                                                            <Button size="sm" variant="secondary" className="h-7 text-xs bg-primary/20 hover:bg-primary text-primary font-medium rounded border border-primary/30 hover:text-primary-foreground shadow-sm transition-colors"
                                                                                title="Apply to editor"
                                                                                onClick={() => onCopyToEditor(codeString)}>
                                                                                <ArrowUp className="w-3 h-3 mr-1.5" />
                                                                                Apply to Editor
                                                                            </Button>
                                                                        )}
                                                                        <Button size="icon" variant="ghost" className="h-7 w-7 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700/50 shadow-sm transition-colors"
                                                                            title="Copy to clipboard"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(codeString);
                                                                                toast.success("Copied to clipboard");
                                                                            }}>
                                                                            <Copy className="w-3 h-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <code {...props} className="bg-muted-foreground/20 px-1 py-0.5 rounded text-[12px] font-mono">
                                                                    {children}
                                                                </code>
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                                {msg.content === '' && isStreaming && (
                                                    <div className="flex items-center gap-2 py-1 text-muted-foreground">
                                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                        <span className="text-xs">Buddy is thinking...</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {msg.role === 'model' && msg.content !== '' && !isStreaming && (
                                    <div className="flex items-center gap-1 mt-1 px-1 w-full">
                                        <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full ${msg.feedback === 'like' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`} onClick={() => handleFeedback(msg.id, 'like')} title="Helpful">
                                            <ThumbsUp className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full ${msg.feedback === 'dislike' ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'}`} onClick={() => handleFeedback(msg.id, 'dislike')} title="Not helpful">
                                            <ThumbsDown className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10" onClick={() => window.open('https://github.com/rkmahale17/algolib.io/issues/new?title=AI%20Response%20Bug&body=Please%20describe%20the%20issue%20with%20the%20AI%20response.%0A%0AProblem:%20' + algorithmId, '_blank')} title="Report AI Bug">
                                            <Bug className="w-3 h-3" />
                                        </Button>
                                        {onOpenVisualizations && algorithmData?.problemType !== 'sql' && algorithmData?.problem_type !== 'sql' && (
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 ml-auto" onClick={onOpenVisualizations} title="Open Visualizations">
                                                <Eye className="w-3 h-3" /> Visualize
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Quick Actions (Floating Chips) */}
            <div className="flex items-center justify-center overflow-x-auto gap-1.5 p-2 shrink-0 border-t border-border/70 bg-background/50 backdrop-blur-sm shadow-sm w-full no-scrollbar">
                <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-full whitespace-nowrap text-[11px] justify-center gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 bg-background border-border"
                    onClick={() => handleSendMessage("Can you give me a hint on how to start?", "hint")}
                    disabled={isLoading}>
                    <Lightbulb className="w-3 h-3 text-muted-foreground" /> Hint
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-full whitespace-nowrap text-[11px] justify-center gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 bg-background border-border"
                    onClick={() => handleSendMessage("What is the best approach to solve this?", "approach")}
                    disabled={isLoading}>
                    <Route className="w-3 h-3 text-muted-foreground" /> Approach
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-full whitespace-nowrap text-[11px] justify-center gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 bg-background border-border"
                    onClick={() => handleSendMessage("Walk me through the step-by-step thinking for this problem.", "thinking")}
                    disabled={isLoading}>
                    <Brain className="w-3 h-3 text-muted-foreground" /> Thinking
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-full whitespace-nowrap text-[11px] justify-center gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 bg-background border-border"
                    onClick={() => handleSendMessage("Is there an optimal solution I should know about?", "solution")}
                    disabled={isLoading}>
                    <CheckCircle2 className="w-3 h-3 text-muted-foreground" /> Solution
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-full whitespace-nowrap text-[11px] justify-center gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30 bg-background border-border"
                    onClick={() => handleSendMessage("Can you review my code, fix any bugs, and explain what you changed?", "fix")}
                    disabled={isLoading || !currentCode.trim()}>
                    <Wrench className="w-3 h-3 text-muted-foreground" /> Fix Code
                </Button>
            </div>

            {/* Input Area */}
            <div className="p-4 pt-2 bg-background">
                <div className="relative flex items-end gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-border/40 p-1.5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }
                        }}
                        placeholder="Shift+Enter to insert a line break."
                        className="flex-1 max-h-[400px] min-h-[80px] bg-transparent border-0 outline-none resize-none px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground overflow-y-auto"
                        rows={1}
                    />
                    <Button 
                        size="icon" 
                        className="h-8 w-8 rounded-full shrink-0 bg-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors mb-1 mr-1"
                        disabled={!inputValue.trim() || isLoading}
                        onClick={() => handleSendMessage(inputValue)}
                    >
                        <ArrowUp className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
