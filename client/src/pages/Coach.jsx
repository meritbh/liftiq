import { useState } from 'react';
import api from '../api/axios';

const Coach = () => {
  const [analysis, setAnalysis] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const getAnalysis = async () => {
    setLoadingAnalysis(true);
    setAnalysis('');
    try {
      const res = await api.post('/ai/analyze');
      setAnalysis(res.data.analysis);
    } catch (err) {
      setAnalysis(err.response?.data?.message || 'Failed to get analysis. Make sure you have workouts logged.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoadingChat(true);

    try {
      const res = await api.post('/ai/chat', {
        message: userMessage,
        conversationHistory,
      });

      const reply = res.data.reply;
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
      setConversationHistory([
        ...conversationHistory,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: reply },
      ]);
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: err.response?.data?.message || 'Something went wrong. Please try again.'
      }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>{line}<br /></span>
    ));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Coach</h1>
      <p style={styles.sub}>
        Powered by Claude — analyzes your actual workout history to give specific, personalized coaching
      </p>

      {/* Weekly Analysis Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Weekly Analysis</h2>
          <button
            style={loadingAnalysis ? styles.buttonDisabled : styles.button}
            onClick={getAnalysis}
            disabled={loadingAnalysis}
          >
            {loadingAnalysis ? 'Analyzing...' : '🔍 Analyze My Training'}
          </button>
        </div>

        {analysis && (
          <div style={styles.analysisCard}>
            <p style={styles.analysisText}>{formatMessage(analysis)}</p>
          </div>
        )}

        {!analysis && !loadingAnalysis && (
          <div style={styles.emptyAnalysis}>
            <p style={styles.muted}>
              Click "Analyze My Training" to get a detailed coaching report based on your workout history.
            </p>
          </div>
        )}

        {loadingAnalysis && (
          <div style={styles.emptyAnalysis}>
            <p style={styles.muted}>Analyzing your training history...</p>
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Ask Your Coach</h2>
        <p style={styles.sub}>Ask anything about your training — the AI has full access to your workout history</p>

        <div style={styles.chatContainer}>
          {messages.length === 0 && (
            <div style={styles.chatEmpty}>
              <p style={styles.muted}>Ask your coach anything. Examples:</p>
              <div style={styles.suggestions}>
                {[
                  'How did I do on bench press last month?',
                  'Am I training legs enough?',
                  'Why has my squat stalled?',
                  'What should I focus on this week?',
                ].map((s) => (
                  <button
                    key={s}
                    style={styles.suggestion}
                    onClick={() => setInput(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
            >
              <div style={msg.role === 'user' ? styles.userBubble : styles.assistantBubble}>
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}

          {loadingChat && (
            <div style={styles.assistantMessage}>
              <div style={styles.assistantBubble}>
                <span style={styles.typing}>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div style={styles.inputRow}>
          <textarea
            style={styles.input}
            placeholder="Ask your coach a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button
            style={loadingChat || !input.trim() ? styles.sendDisabled : styles.send}
            onClick={sendMessage}
            disabled={loadingChat || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem', background: '#0a0a0a',
    minHeight: '100vh', maxWidth: '800px', margin: '0 auto',
  },
  title: { color: '#fff', fontSize: '1.8rem', margin: '0 0 0.25rem' },
  sub: { color: '#666', margin: '0 0 2rem', lineHeight: '1.5', fontSize: '0.9rem' },
  section: { marginBottom: '3rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { color: '#fff', fontSize: '1.2rem', margin: 0 },
  button: {
    background: '#3b82f6', color: '#fff', border: 'none',
    padding: '0.6rem 1.2rem', borderRadius: '8px',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
  },
  buttonDisabled: {
    background: '#1e3a5f', color: '#555', border: 'none',
    padding: '0.6rem 1.2rem', borderRadius: '8px',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'not-allowed',
  },
  analysisCard: {
    background: '#1a1a1a', borderRadius: '12px',
    padding: '1.5rem', border: '1px solid #2a2a2a',
  },
  analysisText: {
    color: '#ccc', lineHeight: '1.7',
    margin: 0, fontSize: '0.95rem', whiteSpace: 'pre-wrap',
  },
  emptyAnalysis: {
    background: '#111', borderRadius: '12px',
    padding: '2rem', textAlign: 'center',
    border: '1px dashed #222',
  },
  chatContainer: {
    background: '#111', borderRadius: '12px',
    padding: '1.5rem', minHeight: '200px',
    marginBottom: '1rem', border: '1px solid #1a1a1a',
  },
  chatEmpty: { textAlign: 'center' },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' },
  suggestion: {
    background: '#1a1a1a', border: '1px solid #333',
    color: '#888', padding: '0.4rem 0.8rem',
    borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem',
  },
  userMessage: { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
  assistantMessage: { display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' },
  userBubble: {
    background: '#3b82f6', color: '#fff',
    padding: '0.75rem 1rem', borderRadius: '12px 12px 2px 12px',
    maxWidth: '70%', fontSize: '0.9rem', lineHeight: '1.5',
  },
  assistantBubble: {
    background: '#1a1a1a', color: '#ccc',
    padding: '0.75rem 1rem', borderRadius: '12px 12px 12px 2px',
    maxWidth: '80%', fontSize: '0.9rem', lineHeight: '1.5',
    border: '1px solid #2a2a2a',
  },
  typing: { color: '#555', fontStyle: 'italic' },
  inputRow: { display: 'flex', gap: '0.75rem', alignItems: 'flex-end' },
  input: {
    flex: 1, padding: '0.75rem 1rem',
    background: '#1a1a1a', border: '1px solid #333',
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem',
    resize: 'none', fontFamily: 'inherit',
  },
  send: {
    background: '#3b82f6', color: '#fff', border: 'none',
    padding: '0.75rem 1.25rem', borderRadius: '8px',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
  },
  sendDisabled: {
    background: '#1e3a5f', color: '#555', border: 'none',
    padding: '0.75rem 1.25rem', borderRadius: '8px',
    fontSize: '0.9rem', fontWeight: '600', cursor: 'not-allowed',
  },
  muted: { color: '#555', margin: 0 },
};

export default Coach;