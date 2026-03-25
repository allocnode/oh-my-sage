'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Space, Typography, Spin, message, Tag, Collapse, Alert } from 'antd';
import { SendOutlined, ClearOutlined, LoadingOutlined, ToolOutlined, RobotOutlined, QuestionCircleOutlined } from '@ant-design/icons';
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
  id: string;
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
  onSessionCreated?: (sessionId: string, messages: SessionMessage[]) => void;
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
}: ChatProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitingInput, setWaitingInput] = useState<{ question: string; options: string[] } | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(sessionId);
  const [isSwitchingSession, setIsSwitchingSession] = useState(false);

  const [streamThinking, setStreamThinking] = useState('');
  const [streamToolCalls, setStreamToolCalls] = useState<Array<{ tool: string; args?: any; result?: any; success: boolean }>>([]);
  const [streamFinalContent, setStreamFinalContent] = useState('');

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const passcode = propPasscode || '';
  const prevSessionIdRef = useRef<string | undefined>(sessionId);
  const initializedRef = useRef(false);

  // 当 sessionId 变化时，取消正在进行的请求并更新 currentSessionId
  // 只在真正的 session 切换时才重置状态（prevSessionIdRef.current 有值时）
  useEffect(() => {
    if (sessionId !== prevSessionIdRef.current) {
      // 只有当之前有 session 时才认为是切换，需要重置状态
      // 新创建 session 时 prevSessionIdRef.current 是 undefined，不重置
      if (prevSessionIdRef.current !== undefined) {
        // 取消正在进行的请求
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        
        // 重置流式状态
        setStreamThinking('');
        setStreamToolCalls([]);
        setStreamFinalContent('');
        setWaitingInput(null);
        
        if (isLoading) {
          setIsLoading(false);
        }
        
        setIsSwitchingSession(true);
      }
      
      setCurrentSessionId(sessionId);
      prevSessionIdRef.current = sessionId;
    }
  }, [sessionId, isLoading]);

  // 当 initialMessages 变化时，加载历史消息
  useEffect(() => {
    // 如果正在切换 session，等待切换完成并重置初始化标志
    if (isSwitchingSession) {
      setIsSwitchingSession(false);
      initializedRef.current = false;
    }
    
    // 只在未初始化时才用 initialMessages 覆盖 messages
    // 这样可以避免在用户发送消息后被 effect 覆盖
    if (!initializedRef.current) {
      if (initialMessages && initialMessages.length > 0) {
        const convertedMessages: ChatMessage[] = initialMessages.map(msg => ({
          id: generateMessageId(),
          role: msg.role,
          content: msg.content,
          process: (msg.toolCalls && msg.toolCalls.length > 0) || msg.thinking ? {
            toolCalls: msg.toolCalls || [],
            thinking: msg.thinking || '',
          } : undefined,
        }));
        setMessages(convertedMessages);
        initializedRef.current = true;
      } else if (initialMessages && initialMessages.length === 0 && !isLoading) {
        // 只有在非加载状态下且明确为空数组时才清空
        // 避免在流式响应期间清空消息
        setMessages([]);
        initializedRef.current = true;
      }
    }
  }, [initialMessages, sessionId, isSwitchingSession, isLoading]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, streamThinking, streamToolCalls, streamFinalContent, waitingInput]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // 创建用户消息
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

    // 创建 AbortController 用于取消请求
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText, 
          passcode,
          sessionId: currentSessionId,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();

      while (true) {
        // 检查是否被取消
        if (abortController.signal.aborted) {
          reader.cancel();
          break;
        }

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
                // 检查是否需要用户输入
                const result = output.result;
                if (result?.needsUserInput && result?.options && Array.isArray(result.options) && result.options.length > 0) {
                  setWaitingInput({
                    question: result.question || result.message || '请选择',
                    options: result.options,
                  });
                }
                break;

              case 'complete':
                finalContent = output.message || output.content || '';
                setStreamFinalContent(finalContent);
                break;

              case 'waiting_input':
                // 确保 options 有有效值
                const question = output.question || '请选择';
                const options = output.options || [];
                if (options.length > 0) {
                  setWaitingInput({ question, options });
                }
                break;

              case 'error':
                message.error(output.error || '发生错误');
                break;
            }
          } catch (e) {}
        }
      }

      // 检查是否被取消
      if (abortController.signal.aborted) {
        return;
      }

      // 如果是新 session，刷新 session 列表
      if (!currentSessionId) {
        // 刷新 session 列表
        const sessionsResponse = await fetch('/api/sessions');
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.success && sessionsData.sessions.length > 0) {
          const newSessionId = sessionsData.sessions[0].id;
          setCurrentSessionId(newSessionId);
          // 构造要传递给父组件的消息列表（包含当前对话的所有消息）
          const assistantSessionMessage: SessionMessage = {
            seq: 0,
            role: 'assistant',
            content: finalContent,
            timestamp: new Date().toISOString(),
            thinking: currentThinking || undefined,
            toolCalls: currentToolCalls.length > 0 ? currentToolCalls : undefined,
          };
          const userSessionMessage: SessionMessage = {
            seq: 0,
            role: 'user',
            content: messageText,
            timestamp: new Date().toISOString(),
          };
          onSessionCreated?.(newSessionId, [userSessionMessage, assistantSessionMessage]);
        }
      }

      // 创建助手消息
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: finalContent,
        process: currentToolCalls.length > 0 || currentThinking ? {
          toolCalls: currentToolCalls,
          thinking: currentThinking,
        } : undefined,
      };
      setMessages(prev => [...prev, assistantMessage]);

      setStreamThinking('');
      setStreamToolCalls([]);
      setStreamFinalContent('');

    } catch (error: any) {
      // 如果是取消操作，不显示错误
      if (error.name === 'AbortError') {
        return;
      }
      message.error('发送失败: ' + error.message);
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, [isLoading, passcode, currentSessionId, onSessionCreated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // 如果有 waitingInput，清除它（用户选择通过输入框回复）
    if (waitingInput) {
      setWaitingInput(null);
    }
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as any);
      }
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

  const renderAssistantMessage = (msg: ChatMessage) => {
    const hasProcess = msg.process && (msg.process.toolCalls.length > 0 || msg.process.thinking);

    return (
      <div key={msg.id} style={{ marginBottom: 16, textAlign: 'left' }}>
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
                      <Tag key={`${msg.id}-tc-${i}`} color={tc.success ? 'success' : 'error'}>{tc.tool}</Tag>
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
                      <div key={`${msg.id}-tool-${i}`} style={{ marginBottom: 8, padding: 8, background: '#f0f5ff', borderRadius: 4 }}>
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
                            <div style={{ maxHeight: 200, overflow: 'auto' }}>
                              <Text style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                {typeof tc.result === 'object' ? JSON.stringify(tc.result, null, 2) : String(tc.result)}
                              </Text>
                            </div>
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
                            <div style={{ maxHeight: 200, overflow: 'auto' }}>
                              <Text style={{ fontSize: 11, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                {typeof tc.result === 'object' ? JSON.stringify(tc.result, null, 2) : String(tc.result)}
                              </Text>
                            </div>
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

        {messages.map((msg) => (
          msg.role === 'user' ? (
            <div key={msg.id} style={{ marginBottom: 16, textAlign: 'right' }}>
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
            renderAssistantMessage(msg)
          )
        ))}

        {renderStreaming()}

        {waitingInput && Array.isArray(waitingInput.options) && waitingInput.options.length > 0 && (
          <div style={{ 
            padding: 16, 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            borderRadius: 8, 
            marginBottom: 16 
          }}>
            {waitingInput.question && (
              <div style={{ marginBottom: 12 }}>
                <Space style={{ marginBottom: 8 }}>
                  <QuestionCircleOutlined style={{ color: '#52c41a' }} />
                  <Text strong style={{ fontSize: 14 }}>需要你的选择</Text>
                </Space>
                <div className="markdown-content">
                  {renderMarkdown(waitingInput.question)}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {waitingInput.options.map((opt, i) => (
                <Button 
                  key={`option-${i}`}
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
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              你也可以直接在输入框中输入自定义回复
            </Text>
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
              placeholder={waitingInput ? "选择上方选项，或输入自定义回复..." : "输入消息..."}
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isLoading && !waitingInput}
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              htmlType="submit"
              disabled={!input.trim() || (isLoading && !waitingInput)}
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
