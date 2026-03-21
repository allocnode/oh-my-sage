'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Space, Typography, Spin, message, Tag, Collapse } from 'antd';
import { SendOutlined, ClearOutlined, LoadingOutlined, ToolOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Text, Paragraph } = Typography;
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
  role: 'user' | 'assistant';
  content: string;
  process?: {
    toolCalls: Array<{ tool: string; args?: any; result?: any; success: boolean }>;
    thinking: string;
  };
}

interface SessionMessage {
  seq: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thinking?: string;
  toolCalls?: Array<{ tool: string; args?: any; result?: any; success: boolean }>;
}

interface ChatProps {
  passcode?: string;
  sessionId?: string;
  initialMessages?: SessionMessage[];
  onSessionCreated?: (sessionId: string) => void;
}

export default function Chat({ 
  passcode: propPasscode,
  sessionId,
  initialMessages,
  onSessionCreated,
}: ChatProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitingInput, setWaitingInput] = useState<{ question?: string; options?: string[] } | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionId);

  const [streamThinking, setStreamThinking] = useState('');
  const [streamToolCalls, setStreamToolCalls] = useState<Array<{ tool: string; args?: any; result?: any; success: boolean }>>([]);
  const [streamFinalContent, setStreamFinalContent] = useState('');

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const passcode = propPasscode || '';

  // 当 sessionId 变化时，更新 currentSessionId
  useEffect(() => {
    setCurrentSessionId(sessionId);
  }, [sessionId]);

  // 当 initialMessages 变化时，加载历史消息
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      const convertedMessages: ChatMessage[] = initialMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        process: (msg.toolCalls && msg.toolCalls.length > 0) || msg.thinking ? {
          toolCalls: msg.toolCalls || [],
          thinking: msg.thinking || '',
        } : undefined,
      }));
      setMessages(convertedMessages);
    } else {
      setMessages([]);
    }
  }, [initialMessages, sessionId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, streamThinking, streamFinalContent]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setInput('');
    setIsLoading(true);
    setWaitingInput(null);

    let currentThinking = '';
    const currentToolCalls: Array<{ tool: string; args?: any; result?: any; success: boolean }> = [];
    let finalContent = '';
    setStreamThinking('');
    setStreamToolCalls([]);
    setStreamFinalContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText, 
          passcode,
          sessionId: currentSessionId,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();

      while (true) {
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
                  currentToolCalls[lastIndex].success = output.result?.success || false;
                  currentToolCalls[lastIndex].result = output.result;
                  setStreamToolCalls([...currentToolCalls]);
                }
                break;

              case 'complete':
                finalContent = output.message || output.content || '';
                setStreamFinalContent(finalContent);
                break;

              case 'waiting_input':
                setWaitingInput({ question: output.question, options: output.options });
                break;

              case 'error':
                message.error(output.error || '发生错误');
                break;
            }
          } catch (e) {}
        }
      }

      // 如果是新 session，刷新 session 列表
      if (!currentSessionId) {
        // 刷新 session 列表
        const sessionsResponse = await fetch('/api/sessions');
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.success && sessionsData.sessions.length > 0) {
          const newSessionId = sessionsData.sessions[0].id;
          setCurrentSessionId(newSessionId);
          onSessionCreated?.(newSessionId);
        }
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: finalContent,
        process: {
          toolCalls: currentToolCalls,
          thinking: currentThinking,
        },
      }]);

      setStreamThinking('');
      setStreamToolCalls([]);
      setStreamFinalContent('');

    } catch (error: any) {
      message.error('发送失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, passcode, currentSessionId, onSessionCreated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) handleSubmit(e as any);
    }
  };

  const renderMarkdown = (content: string) => {
    if (!content) return null;
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({children}) => <h1 style={{ fontSize: 20, fontWeight: 600, margin: '12px 0 8px' }}>{children}</h1>,
          h2: ({children}) => <h2 style={{ fontSize: 18, fontWeight: 600, margin: '10px 0 6px' }}>{children}</h2>,
          h3: ({children}) => <h3 style={{ fontSize: 16, fontWeight: 600, margin: '8px 0 4px' }}>{children}</h3>,
          p: ({children}) => <p style={{ margin: '6px 0' }}>{children}</p>,
          ul: ({children}) => <ul style={{ margin: '6px 0', paddingLeft: 20 }}>{children}</ul>,
          ol: ({children}) => <ol style={{ margin: '6px 0', paddingLeft: 20 }}>{children}</ol>,
          li: ({children}) => <li style={{ margin: '2px 0' }}>{children}</li>,
          strong: ({children}) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
          code: ({children}) => (
            <code style={{ background: 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>{children}</code>
          ),
          table: ({children}) => <table style={{ borderCollapse: 'collapse', width: '100%', margin: '8px 0' }}>{children}</table>,
          th: ({children}) => <th style={{ border: '1px solid #d9d9d9', padding: '6px 10px', background: '#fafafa' }}>{children}</th>,
          td: ({children}) => <td style={{ border: '1px solid #d9d9d9', padding: '6px 10px' }}>{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const renderAssistantMessage = (msg: ChatMessage, index: number) => {
    const hasProcess = msg.process && (msg.process.toolCalls.length > 0 || msg.process.thinking);

    return (
      <div key={index} style={{ marginBottom: 16, textAlign: 'left' }}>
        <div style={{ maxWidth: '85%' }}>
          {hasProcess && (
            <Collapse
              size="small"
              style={{ marginBottom: 8 }}
              items={[{
                key: '1',
                label: (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12, color: '#8c8c8c' }}>查看执行过程</span>
                    {msg.process!.toolCalls.map((tc, i) => (
                      <Tag key={i} color={tc.success ? 'success' : 'error'}>{tc.tool}</Tag>
                    ))}
                  </div>
                ),
                children: (
                  <div style={{ fontSize: 12 }}>
                    {msg.process!.thinking && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ color: '#8c8c8c', marginBottom: 4 }}>思考过程</div>
                        <div style={{ padding: 8, background: '#fffbe6', borderRadius: 4, whiteSpace: 'pre-wrap', color: '#595959' }}>
                          {msg.process!.thinking}
                        </div>
                      </div>
                    )}
                    {msg.process!.toolCalls.map((tc, i) => (
                      <div key={i} style={{ marginBottom: 8, padding: 8, background: '#f0f5ff', borderRadius: 4 }}>
                        <Space style={{ marginBottom: 4 }}>
                          <ToolOutlined style={{ color: '#1890ff' }} />
                          <Text strong style={{ fontSize: 12 }}>{tc.tool}</Text>
                          <Tag color={tc.success ? 'success' : 'error'}>
                            {tc.success ? '成功' : '失败'}
                          </Tag>
                        </Space>
                        {tc.args && Object.keys(tc.args).length > 0 && (
                          <div style={{ marginTop: 4, color: '#595959' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>参数: </Text>
                            <Text code style={{ fontSize: 11 }}>{JSON.stringify(tc.args)}</Text>
                          </div>
                        )}
                        {tc.result && (
                          <div style={{ marginTop: 4, color: tc.success ? '#52c41a' : '#ff4d4f' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>结果: </Text>
                            <Text style={{ fontSize: 11 }}>{JSON.stringify(tc.result).substring(0, 200)}</Text>
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
              display: 'inline-block',
              padding: '12px 16px',
              background: '#f5f5f5',
              borderRadius: '16px 16px 16px 4px',
              textAlign: 'left',
            }}>
              <div className="markdown-content">{renderMarkdown(msg.content)}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStreaming = () => {
    if (!isLoading) return null;
    const hasContent = streamThinking || streamToolCalls.length > 0 || streamFinalContent;
    if (!hasContent) return null;

    return (
      <div style={{ marginBottom: 16, textAlign: 'left' }}>
        <div style={{ maxWidth: '85%' }}>
          {(streamThinking || streamToolCalls.length > 0) && (
            <Collapse
              size="small"
              defaultActiveKey={['1']}
              style={{ marginBottom: 8 }}
              items={[{
                key: '1',
                label: (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 12 }} spin />} />
                    <span style={{ fontSize: 12, color: '#8c8c8c' }}>正在执行...</span>
                    {streamToolCalls.map((tc, i) => (
                      <Tag key={i} color={tc.success ? 'success' : 'processing'}>{tc.tool}</Tag>
                    ))}
                  </div>
                ),
                children: (
                  <div style={{ fontSize: 12 }}>
                    {streamThinking && (
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ color: '#8c8c8c', marginBottom: 4 }}>思考过程</div>
                        <div style={{ padding: 8, background: '#fffbe6', borderRadius: 4, whiteSpace: 'pre-wrap', color: '#595959' }}>
                          {streamThinking}
                        </div>
                      </div>
                    )}
                    {streamToolCalls.map((tc, i) => (
                      <div key={i} style={{ marginBottom: 8, padding: 8, background: '#f0f5ff', borderRadius: 4 }}>
                        <Space style={{ marginBottom: 4 }}>
                          <ToolOutlined style={{ color: '#1890ff' }} />
                          <Text strong style={{ fontSize: 12 }}>{tc.tool}</Text>
                          <Tag color={tc.success ? 'success' : tc.result ? 'error' : 'processing'}>
                            {tc.success ? '成功' : tc.result ? '失败' : '...'}
                          </Tag>
                        </Space>
                        {tc.args && Object.keys(tc.args).length > 0 && (
                          <div style={{ marginTop: 4, color: '#595959' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>参数: </Text>
                            <Text code style={{ fontSize: 11 }}>{JSON.stringify(tc.args)}</Text>
                          </div>
                        )}
                        {tc.result && (
                          <div style={{ marginTop: 4, color: tc.success ? '#52c41a' : '#ff4d4f' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>结果: </Text>
                            <Text style={{ fontSize: 11 }}>{JSON.stringify(tc.result).substring(0, 200)}</Text>
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
              display: 'inline-block',
              padding: '12px 16px',
              background: '#f5f5f5',
              borderRadius: '16px 16px 16px 4px',
              textAlign: 'left',
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
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <RobotOutlined style={{ fontSize: 18, color: '#1890ff' }} />
          <Text strong>智者</Text>
          {isLoading && <Spin indicator={<LoadingOutlined spin />} />}
        </Space>
      </div>

      <div ref={messagesContainerRef} style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {messages.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <RobotOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Text style={{ display: 'block', fontSize: 18, marginTop: 16 }}>你好！我是智者</Text>
            <Text type="secondary">米家自动化极客版 AI 助手</Text>
            <div style={{ marginTop: 24 }}>
              <Button onClick={() => sendMessage('帮我查看设备状态')} style={{ marginBottom: 8 }}>查看设备</Button><br/>
              <Button onClick={() => sendMessage('帮我创建自动化规则')}>创建规则</Button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          msg.role === 'user' ? (
            <div key={i} style={{ marginBottom: 16, textAlign: 'right' }}>
              <div style={{
                display: 'inline-block',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '16px 16px 4px 16px',
                background: '#1890ff',
                color: '#fff',
                textAlign: 'left',
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              </div>
            </div>
          ) : (
            renderAssistantMessage(msg, i)
          )
        ))}

        {renderStreaming()}

        {waitingInput && (
          <div style={{ padding: 16, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, marginBottom: 16 }}>
            {waitingInput.question && (
              <div className="markdown-content" style={{ marginBottom: 12 }}>
                {renderMarkdown(waitingInput.question)}
              </div>
            )}
            {waitingInput.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {waitingInput.options.map((opt, i) => (
                  <Button 
                    key={i} 
                    onClick={() => { setWaitingInput(null); sendMessage(opt); }} 
                    type={i === 0 ? 'primary' : 'default'}
                    style={{ 
                      textAlign: 'left', 
                      height: 'auto',
                      whiteSpace: 'normal',
                      padding: '8px 12px',
                    }}
                  >
                    {i === 0 && <span style={{ marginRight: 8 }}>⭐ 推荐</span>}
                    {opt}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
        <form onSubmit={handleSubmit}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isLoading}
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              htmlType="submit"
              disabled={!input.trim() || isLoading}
              style={{ borderRadius: '0 8px 8px 0' }}
            >
              发送
            </Button>
          </Space.Compact>
        </form>
      </div>
    </div>
  );
}
