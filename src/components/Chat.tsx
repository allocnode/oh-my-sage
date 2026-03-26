'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Space, Typography, Spin, message, Tag, Collapse } from 'antd';
import { SendOutlined, LoadingOutlined, ToolOutlined, RobotOutlined, QuestionCircleOutlined, StopOutlined, RollbackOutlined, ThunderboltOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Text } = Typography;
const { TextArea } = Input;

interface AgentOutput {
  type: 'thinking' | 'tool_start' | 'tool_result' | 'complete' | 'waiting_input' | 'error';
  content?: string;
  tool?: string;
  args?: any;
  result?: any;
  question?: string;
  options?: string[];
  error?: string;
  message?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  seq?: number;
  process?: {
    toolCalls: Array<{ tool: string; args?: any; result?: any; success: boolean }>;
    thinking: string;
  };
}

interface SessionMessage {
  seq: number;
  role: 'user' | 'assistant' | 'compressed';
  content: string;
  timestamp: string;
  thinking?: string;
  toolCalls?: Array<{ tool: string; args?: any; result?: any; success: boolean }>;
}

interface ChatProps {
  passcode?: string;
  sessionId?: string;
  initialMessages?: SessionMessage[];
  onSessionCreated?: (sessionId: string, messages: SessionMessage[]) => void;
  onResetSession?: (sessionId: string, seq: number) => Promise<void>;
}

let messageIdCounter = 0;
function generateMessageId(): string {
  return `msg_${Date.now()}_${++messageIdCounter}`;
}

export default function Chat({
  passcode: propPasscode,
  sessionId,
  initialMessages,
  onSessionCreated,
  onResetSession,
}: ChatProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitingInput, setWaitingInput] = useState<{ question: string; options: string[] } | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionId);

  const [streamThinking, setStreamThinking] = useState('');
  const [streamToolCalls, setStreamToolCalls] = useState<Array<{ tool: string; args?: any; result?: any; success: boolean }>>([]);
  const [streamFinalContent, setStreamFinalContent] = useState('');

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const passcode = propPasscode || '';
  const prevSessionIdRef = useRef<string | undefined>(sessionId);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (sessionId !== prevSessionIdRef.current) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setStreamThinking('');
      setStreamToolCalls([]);
      setStreamFinalContent('');
      setWaitingInput(null);
      setIsLoading(false);
      setCurrentSessionId(sessionId);
      prevSessionIdRef.current = sessionId;
      initializedRef.current = false;
    }
  }, [sessionId]);

  useEffect(() => {
    if (initializedRef.current) return;

    if (initialMessages && initialMessages.length > 0) {
      // 过滤掉 compressed 类型消息，不展示给用户
      const visibleMessages = initialMessages.filter(
        (m): m is SessionMessage & { role: 'user' | 'assistant' } => m.role !== 'compressed'
      );
      const convertedMessages: ChatMessage[] = visibleMessages.map(msg => ({
        id: generateMessageId(),
        role: msg.role,
        content: msg.content || '',
        seq: msg.seq,
        process: (msg.toolCalls && msg.toolCalls.length > 0) || msg.thinking ? {
          toolCalls: (msg.toolCalls || []).map(tc => ({
            tool: tc.tool || '',
            args: tc.args,
            result: tc.result,
            success: tc.success !== false,
          })),
          thinking: msg.thinking || '',
        } : undefined,
      }));
      setMessages(convertedMessages);
      initializedRef.current = true;
    } else if (initialMessages && initialMessages.length === 0 && !isLoading) {
      setMessages([]);
      initializedRef.current = true;
    }
  }, [initialMessages, isLoading]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, streamThinking, streamToolCalls, streamFinalContent, waitingInput]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: messageText,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setWaitingInput(null);

    let currentThinking = '';
    const currentToolCalls: Array<{ tool: string; args?: any; result?: any; success: boolean }> = [];
    let finalContent = '';
    setStreamThinking('');
    setStreamToolCalls([]);
    setStreamFinalContent('');

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, passcode, sessionId: currentSessionId }),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();

      while (true) {
        if (abortController.signal.aborted) { reader.cancel(); break; }
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const output: AgentOutput = JSON.parse(data);
            switch (output.type) {
              case 'thinking':
                currentThinking += output.content || '';
                setStreamThinking(currentThinking);
                break;
              case 'tool_start':
                currentToolCalls.push({ tool: output.tool || '', args: output.args, success: false });
                setStreamToolCalls([...currentToolCalls]);
                break;
              case 'tool_result':
                const lastIndex = currentToolCalls.length - 1;
                if (lastIndex >= 0) {
                  currentToolCalls[lastIndex].success = output.result?.success !== false;
                  currentToolCalls[lastIndex].result = output.result;
                  setStreamToolCalls([...currentToolCalls]);
                }
                if (output.result?.needsUserInput && output.result?.options && Array.isArray(output.result.options) && output.result.options.length > 0) {
                  setWaitingInput({ question: output.result.question || output.result.message || '请选择', options: output.result.options });
                }
                break;
              case 'complete':
                finalContent = output.message || output.content || '';
                setStreamFinalContent(finalContent);
                break;
              case 'waiting_input':
                const opts = Array.isArray(output.options) ? output.options : [];
                if (opts.length > 0) setWaitingInput({ question: output.question || '请选择', options: opts });
                break;
              case 'error':
                message.error(output.error || '发生错误');
                break;
            }
          } catch (parseError) {
            // 忽略解析错误（可能是不完整的 JSON 行）
            if (data.length > 2) { // 只记录非空行的错误
              console.warn('流式数据解析失败:', data, parseError);
            }
          }
        }
      }

      if (abortController.signal.aborted) return;

      if (!currentSessionId) {
        const sessionsResponse = await fetch('/api/sessions');
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.success && sessionsData.sessions.length > 0) {
          const newSessionId = sessionsData.sessions[0].id;
          setCurrentSessionId(newSessionId);
          const assistantSessionMessage: SessionMessage = {
            seq: 0, role: 'assistant', content: finalContent,
            timestamp: new Date().toISOString(),
            thinking: currentThinking || undefined,
            toolCalls: currentToolCalls.length > 0 ? currentToolCalls : undefined,
          };
          const userSessionMessage: SessionMessage = {
            seq: 0, role: 'user', content: messageText, timestamp: new Date().toISOString(),
          };
          onSessionCreated?.(newSessionId, [userSessionMessage, assistantSessionMessage]);
        }
      }

      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: finalContent,
        process: currentToolCalls.length > 0 || currentThinking ? {
          toolCalls: currentToolCalls, thinking: currentThinking,
        } : undefined,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setStreamThinking('');
      setStreamToolCalls([]);
      setStreamFinalContent('');

    } catch (error: any) {
      if (error.name === 'AbortError') return;
      message.error('发送失败: ' + error.message);
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, [isLoading, passcode, currentSessionId, onSessionCreated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (waitingInput) setWaitingInput(null);
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) handleSubmit(e as any);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setStreamThinking('');
    setStreamToolCalls([]);
    setStreamFinalContent('');
    setWaitingInput(null);
  };

  const handleReset = useCallback(async (targetSeq: number, messageContent: string) => {
    if (!currentSessionId || !onResetSession) return;
    handleStop();
    try {
      // targetSeq - 1：删除选中的那条消息及其后续所有消息
      await onResetSession(currentSessionId, targetSeq - 1);
      setInput(messageContent);
      initializedRef.current = false;
    } catch (error) {}
  }, [currentSessionId, onResetSession]);

  const renderMarkdown = (content: string) => {
    if (!content) return null;
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    );
  };

  // ─── 助手消息 ───
  const renderAssistantMessage = (msg: ChatMessage) => {
    const toolCalls = msg.process?.toolCalls || [];
    const hasProcess = msg.process && (toolCalls.length > 0 || msg.process.thinking);

    return (
      <div key={msg.id} className="msg-enter" style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {/* 头像 */}
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-primary)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          marginTop: 2,
        }}>
          <ThunderboltOutlined style={{ color: '#fff', fontSize: 14 }} />
        </div>

        <div style={{ flex: 1, maxWidth: '82%' }}>
          {hasProcess && (
            <Collapse
              size="small"
              style={{ marginBottom: 8 }}
              items={[{
                key: '1',
                label: (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>执行过程</span>
                    {toolCalls.map((tc, i) => (
                      <Tag key={`${msg.id}-tc-${i}`} color={tc.success ? 'success' : 'error'}>{tc.tool}</Tag>
                    ))}
                  </div>
                ),
                children: (
                  <div style={{ fontSize: 12 }}>
                    {msg.process!.thinking && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: 4, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>思考</div>
                        <div style={{
                          padding: 10, borderRadius: 'var(--radius-sm)',
                          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
                          whiteSpace: 'pre-wrap', color: '#fbbf24', lineHeight: 1.6,
                        }}>
                          {msg.process!.thinking}
                        </div>
                      </div>
                    )}
                    {toolCalls.map((tc, i) => (
                      <div key={`${msg.id}-tool-${i}`} style={{
                        marginBottom: 6, padding: 10, borderRadius: 'var(--radius-sm)',
                        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)',
                      }}>
                        <Space style={{ marginBottom: 4 }}>
                          <ToolOutlined style={{ color: '#818cf8' }} />
                          <Text strong style={{ fontSize: 12, color: 'var(--text-bright)' }}>{tc.tool}</Text>
                          <Tag color={tc.success ? 'success' : 'error'} style={{ fontSize: 10 }}>
                            {tc.success ? '✓' : '✗'}
                          </Tag>
                        </Space>
                        {tc.args && Object.keys(tc.args).length > 0 && (
                          <div style={{ marginTop: 4, color: 'var(--text-muted)' }}>
                            <Text style={{ fontSize: 11, fontFamily: 'monospace' }}>{JSON.stringify(tc.args)}</Text>
                          </div>
                        )}
                        {tc.result && (
                          <div style={{ marginTop: 6, maxHeight: 160, overflow: 'auto' }}>
                            <Text style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--text-secondary)' }}>
                              {typeof tc.result === 'object' ? JSON.stringify(tc.result, null, 2) : String(tc.result)}
                            </Text>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ),
              }]}
            />
          )}

          {msg.content && (
            <div style={{
              padding: '14px 18px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
              animation: 'fadeInUp 0.3s var(--ease-out)',
            }}>
              <div className="markdown-content">{renderMarkdown(msg.content)}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── 流式输出 ───
  const renderStreaming = () => {
    if (!isLoading) return null;
    const toolCalls = streamToolCalls || [];
    const hasContent = streamThinking || toolCalls.length > 0 || streamFinalContent;
    if (!hasContent) {
      return (
        <div className="msg-enter" style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ThunderboltOutlined style={{ color: '#fff', fontSize: 14 }} />
          </div>
          <div style={{
            padding: '14px 18px', background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
          }}>
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="msg-enter" style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-primary)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulseGlow 2s infinite',
        }}>
          <ThunderboltOutlined style={{ color: '#fff', fontSize: 14 }} />
        </div>

        <div style={{ flex: 1, maxWidth: '82%' }}>
          {(streamThinking || toolCalls.length > 0) && (
            <Collapse
              size="small"
              defaultActiveKey={['1']}
              style={{ marginBottom: 8 }}
              items={[{
                key: '1',
                label: (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 12, color: '#818cf8' }} spin />} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>执行中</span>
                    {toolCalls.map((tc, i) => (
                      <Tag key={i} color={tc.success ? 'success' : 'processing'}>{tc.tool}</Tag>
                    ))}
                  </div>
                ),
                children: (
                  <div style={{ fontSize: 12 }}>
                    {streamThinking && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: 4, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>思考</div>
                        <div style={{
                          padding: 10, borderRadius: 'var(--radius-sm)',
                          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
                          whiteSpace: 'pre-wrap', color: '#fbbf24',
                        }}>
                          {streamThinking}
                        </div>
                      </div>
                    )}
                    {toolCalls.map((tc, i) => (
                      <div key={i} style={{
                        marginBottom: 6, padding: 10, borderRadius: 'var(--radius-sm)',
                        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)',
                      }}>
                        <Space style={{ marginBottom: 4 }}>
                          <ToolOutlined style={{ color: '#818cf8' }} />
                          <Text strong style={{ fontSize: 12, color: 'var(--text-bright)' }}>{tc.tool}</Text>
                          <Tag color={tc.success ? 'success' : tc.result ? 'error' : 'processing'}>
                            {tc.success ? '✓' : tc.result ? '✗' : '…'}
                          </Tag>
                        </Space>
                        {tc.args && Object.keys(tc.args).length > 0 && (
                          <div style={{ marginTop: 4, color: 'var(--text-muted)' }}>
                            <Text style={{ fontSize: 11, fontFamily: 'monospace' }}>{JSON.stringify(tc.args)}</Text>
                          </div>
                        )}
                        {tc.result && (
                          <div style={{ marginTop: 6, maxHeight: 160, overflow: 'auto' }}>
                            <Text style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--text-secondary)' }}>
                              {typeof tc.result === 'object' ? JSON.stringify(tc.result, null, 2) : String(tc.result)}
                            </Text>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ),
              }]}
            />
          )}

          {streamFinalContent && (
            <div style={{
              padding: '14px 18px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px var(--radius-lg) var(--radius-lg) var(--radius-lg)',
            }}>
              <div className="markdown-content">{renderMarkdown(streamFinalContent)}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 顶栏 */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Space size={10}>
          <div style={{
            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
            background: 'var(--gradient-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <RobotOutlined style={{ fontSize: 14, color: '#fff' }} />
          </div>
          <Text strong style={{ color: 'var(--text-bright)', fontSize: 14 }}>智者</Text>
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 13, color: '#818cf8' }} spin />} />
              <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>思考中...</Text>
            </div>
          )}
        </Space>
      </div>

      {/* 消息区 */}
      <div ref={messagesContainerRef} style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
        {messages.length === 0 && !isLoading && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            animation: 'fadeIn 0.6s var(--ease-out)',
          }}>
            <div style={{
              width: 72, height: 72, margin: '0 auto 20px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(99,102,241,0.25)',
            }}>
              <RobotOutlined style={{ fontSize: 32, color: '#fff' }} />
            </div>
            <div className="gradient-text" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              你好！我是智者
            </div>
            <Text style={{ color: 'var(--text-muted)', fontSize: 14, display: 'block', marginBottom: 28 }}>
              米家自动化极客版 AI 助手
            </Text>
            <Space direction="vertical" size={10}>
              <Button
                onClick={() => sendMessage('帮我查看设备状态')}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 20px',
                  height: 'auto',
                }}
              >
                查看设备状态
              </Button>
              <Button
                onClick={() => sendMessage('帮我创建自动化规则')}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 20px',
                  height: 'auto',
                }}
              >
                创建自动化规则
              </Button>
            </Space>
          </div>
        )}

        {messages.map((msg, index) => (
          msg.role === 'user' ? (
            <div key={msg.id} className="msg-enter" style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ maxWidth: '82%' }}>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)',
                  background: 'var(--gradient-primary)',
                  color: '#fff',
                  boxShadow: 'var(--shadow-glow)',
                }}>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.content}</div>
                </div>
                {currentSessionId && onResetSession && !isLoading && msg.seq !== undefined && (
                  <div style={{ textAlign: 'right', marginTop: 4 }}>
                    <Button
                      type="text" size="small"
                      icon={<RollbackOutlined />}
                      onClick={() => handleReset(msg.seq!, msg.content)}
                      style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 6px' }}
                    >
                      重做
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            renderAssistantMessage(msg)
          )
        ))}

        {renderStreaming()}

        {/* 选项卡片 */}
        {waitingInput && Array.isArray(waitingInput.options) && waitingInput.options.length > 0 && (
          <div className="msg-enter" style={{
            padding: 18,
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 16,
          }}>
            {waitingInput.question && (
              <div style={{ marginBottom: 14 }}>
                <Space style={{ marginBottom: 8 }}>
                  <QuestionCircleOutlined style={{ color: '#818cf8' }} />
                  <Text strong style={{ fontSize: 14, color: 'var(--text-bright)' }}>需要你的选择</Text>
                </Space>
                <div className="markdown-content">{renderMarkdown(waitingInput.question)}</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {waitingInput.options.map((opt, i) => (
                <Button
                  key={`option-${i}`}
                  onClick={() => { setWaitingInput(null); sendMessage(opt); }}
                  style={{
                    textAlign: 'left', height: 'auto', whiteSpace: 'normal', padding: '10px 14px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {opt}
                </Button>
              ))}
            </div>
            <Text style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 10 }}>
              也可直接输入自定义回复
            </Text>
          </div>
        )}
      </div>

      {/* 输入区 */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <form onSubmit={handleSubmit}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={waitingInput ? "选择上方选项，或输入自定义回复..." : "输入消息... (Enter 发送, Shift+Enter 换行)"}
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isLoading && !waitingInput}
              style={{
                borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
                resize: 'none',
              }}
            />
            {isLoading ? (
              <Button
                danger
                icon={<StopOutlined />}
                onClick={handleStop}
                style={{
                  borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                  height: 40,
                  background: 'rgba(239,68,68,0.1)',
                  borderColor: 'rgba(239,68,68,0.3)',
                  color: '#ef4444',
                }}
              >
                停止
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<SendOutlined />}
                htmlType="submit"
                disabled={!input.trim()}
                style={{
                  borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                  height: 40,
                }}
              >
                发送
              </Button>
            )}
          </Space.Compact>
        </form>
      </div>
    </div>
  );
}
