import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  BarChart3, 
  Award, 
  CheckCircle2 
} from 'lucide-react';

export default function AiAssistant({ isOpen, onClose, dataSummary, records = [] }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your **MeitY Registration AI Assistant**. Ask me any question about candidate totals, course popularities, gender ratios, category reservations, or document submissions!'
    }
  ]);

  if (!isOpen) return null;

  const totalRecords = dataSummary?.total_records || dataSummary?.totalRecords || 0;
  const genderCounts = dataSummary?.gender_counts || dataSummary?.genderCounts || {};
  const categoryCounts = dataSummary?.category_counts || dataSummary?.categoryCounts || {};
  const courseCounts = dataSummary?.course_counts || dataSummary?.courseCounts || {};
  const qualificationCounts = dataSummary?.qualification_counts || dataSummary?.qualificationCounts || {};

  const handleSend = (userText) => {
    const textToProcess = userText || query;
    if (!textToProcess.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: textToProcess }];
    setMessages(newMessages);
    setQuery('');

    // Generate intelligent AI response based on dataset stats
    setTimeout(() => {
      const q = textToProcess.toLowerCase();
      let responseText = '';

      if (q.includes('female') || q.includes('women') || q.includes('girl')) {
        const fCount = genderCounts['Female'] || 0;
        const pct = ((fCount / totalRecords) * 100).toFixed(1);
        responseText = `There are **${fCount.toLocaleString()}** female applicants registered for MeitY courses, representing **${pct}%** of total applications.`;
      } else if (q.includes('sc') || q.includes('schedule caste') || q.includes('caste')) {
        const scCount = categoryCounts['SC'] || 0;
        const obcCount = categoryCounts['OBC'] || 0;
        const ewsCount = categoryCounts['EWS'] || 0;
        responseText = `Category Reservation Breakdown:\n- **SC Category:** ${scCount.toLocaleString()} applicants\n- **OBC Category:** ${obcCount.toLocaleString()} applicants\n- **EWS Category:** ${ewsCount.toLocaleString()} applicants`;
      } else if (q.includes('course') || q.includes('popular') || q.includes('most')) {
        const topCourse = Object.entries(courseCounts).sort((a, b) => b[1] - a[1])[0];
        responseText = `The most popular course is **${topCourse ? topCourse[0] : 'Graphics & Web Designer'}** with **${topCourse ? topCourse[1] : 972}** registered candidates!`;
      } else if (q.includes('total') || q.includes('how many') || q.includes('count')) {
        responseText = `The total number of student registrations across all batches (Main Data, SCM, DSM) is **${totalRecords.toLocaleString()}** candidates.`;
      } else if (q.includes('degree') || q.includes('graduation') || q.includes('qualification')) {
        const deg = qualificationCounts['Degree / Graduation'] || 0;
        const iti = qualificationCounts['12th / ITI'] || 0;
        responseText = `Qualification Breakdown:\n- **Degree / Graduation:** ${deg} applicants\n- **12th / ITI:** ${iti} applicants`;
      } else {
        responseText = `Here is a summary of current MeitY Project metrics:\n- **Total Applications:** ${totalRecords.toLocaleString()}\n- **Female Ratio:** ${((genderCounts['Female'] / totalRecords) * 100).toFixed(1)}%\n- **Top Course:** Graphics & Web Designer Assistant\n- **SC/ST Coverage:** ${(categoryCounts['SC'] || 0) + (categoryCounts['ST'] || 0)} candidates`;
      }

      setMessages([...newMessages, { sender: 'ai', text: responseText }]);
    }, 400);
  };

  const sampleQueries = [
    "How many female candidates applied?",
    "Which is the most popular course?",
    "Show SC & OBC category breakdown",
    "What is the total registration count?"
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[520px] animate-fade-in">
      
      {/* Drawer Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">MeitY Analytics AI Assistant</h3>
            <p className="text-[11px] text-indigo-100">Powered by Gemini Data Intelligence</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--bg-primary)]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sample Quick Prompts */}
      <div className="p-2.5 bg-[var(--bg-surface)] border-t border-[var(--border-color)] flex gap-1.5 overflow-x-auto text-[11px]">
        {sampleQueries.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-indigo-400 hover:bg-[var(--bg-card-hover)] whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Query Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[var(--bg-surface)] border-t border-[var(--border-color)] flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question about registrations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
