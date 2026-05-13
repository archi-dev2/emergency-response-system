'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SYMPTOM_CHIPS, TRIAGE_RULES, SEVERITY_LABELS } from '@/lib/mock-data';
import type { TriageResult } from '@/types';

interface TriageChatProps {
  onTriggerSOS: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  triageResult?: TriageResult;
  timestamp: Date;
}

function analyzeSymptoms(message: string): TriageResult | null {
  const lowerMsg = message.toLowerCase();
  let bestMatch = 0;
  let matchedRule = TRIAGE_RULES[0];

  for (const rule of TRIAGE_RULES) {
    let matchCount = 0;
    for (const kw of rule.keywords) {
      if (lowerMsg.includes(kw.toLowerCase())) {
        matchCount++;
      }
    }
    if (matchCount > bestMatch) {
      bestMatch = matchCount;
      matchedRule = rule;
    }
  }

  if (bestMatch === 0) return null;

  const severityLabelMap: Record<number, 'LOW' | 'MODERATE' | 'SERIOUS' | 'CRITICAL' | 'EXTREME'> = {
    1: 'LOW',
    2: 'MODERATE',
    3: 'SERIOUS',
    4: 'CRITICAL',
    5: 'EXTREME',
  };

  const callToActionMap: Record<number, string> = {
    1: 'Monitor your condition. If symptoms worsen, consider visiting a nearby clinic.',
    2: 'Rest and stay hydrated. Consult a doctor if symptoms persist for more than 24 hours.',
    3: 'Please seek medical attention. Consider visiting the nearest emergency room.',
    4: 'This requires immediate medical attention. Call emergency services or visit ER immediately.',
    5: 'THIS IS A LIFE-THREATENING EMERGENCY. Call emergency services NOW or trigger SOS immediately.',
  };

  return {
    severity: matchedRule.severity,
    severityLabel: severityLabelMap[matchedRule.severity],
    possibleConditions: matchedRule.conditions,
    immediateActions: matchedRule.actions,
    callToAction: callToActionMap[matchedRule.severity],
  };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const severityBarColors: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-yellow-500',
  3: 'bg-orange-500',
  4: 'bg-red-500',
  5: 'bg-red-900',
};

export default function TriageChat({ onTriggerSOS }: TriageChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'ai',
      content: "Hello! I'm LifeLink's AI Triage Assistant. Describe your symptoms or tap a quick option below, and I'll help assess the severity of your situation.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sosButtonRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsTyping(true);

      const triageResult = analyzeSymptoms(text);

      const delay = 1200 + Math.random() * 800;
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: triageResult
            ? `Based on your symptoms, here is my assessment:`
            : "I couldn't determine the severity from your description. Could you provide more specific symptoms? For example: chest pain, difficulty breathing, head injury, etc.",
          triageResult: triageResult ?? undefined,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, delay);
    },
    [isTyping]
  );

  const handleSosScroll = () => {
    onTriggerSOS();
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-t-xl bg-zinc-900/80 border border-zinc-800 border-b-0 hover:bg-zinc-900 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold text-zinc-200">AI Triage Assessment</span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronUp className="w-4 h-4 text-zinc-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-b-xl bg-zinc-900/60 border border-zinc-800 border-t-zinc-700/50 backdrop-blur-sm">
              {/* Chat Messages */}
              <div ref={scrollRef} className="max-h-80 overflow-hidden">
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                          msg.role === 'ai'
                            ? 'bg-red-600/20 border border-red-600/30'
                            : 'bg-zinc-700 border border-zinc-600'
                        }`}
                      >
                        {msg.role === 'ai' ? (
                          <Bot className="w-3.5 h-3.5 text-red-400" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-zinc-300" />
                        )}
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`max-w-[80%] ${
                          msg.role === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-red-600/20 border border-red-600/20 text-zinc-100 rounded-tr-md'
                              : 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 rounded-tl-md'
                          }`}
                        >
                          {msg.content}
                        </div>

                        {/* Triage Result */}
                        {msg.triageResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-2 rounded-xl bg-zinc-900/80 border border-zinc-700/50 p-4 space-y-3"
                          >
                            {/* Severity Bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                                  Severity Assessment
                                </span>
                                <span
                                  className={`text-xs font-bold ${SEVERITY_LABELS[msg.triageResult.severity]?.color ?? 'text-zinc-400'}`}
                                >
                                  {msg.triageResult.severityLabel}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`h-2 flex-1 rounded-full transition-all ${
                                      level <= msg.triageResult!.severity
                                        ? severityBarColors[level]
                                        : 'bg-zinc-800'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Possible Conditions */}
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                                Possible Conditions
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.triageResult.possibleConditions.map((cond) => (
                                  <span
                                    key={cond}
                                    className="inline-block rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                                  >
                                    {cond}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Immediate Actions */}
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                                Immediate Actions
                              </span>
                              <ul className="space-y-1">
                                {msg.triageResult.immediateActions.map((action, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-400">
                                    <span className="text-red-400 mt-0.5 flex-shrink-0">&#8226;</span>
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Call to Action */}
                            <div className="pt-1">
                              <p className="text-xs text-zinc-300 leading-relaxed">
                                {msg.triageResult.callToAction}
                              </p>
                            </div>

                            {/* Trigger SOS button for high severity */}
                            {msg.triageResult.severity >= 4 && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <Button
                                  onClick={handleSosScroll}
                                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 mt-1 border-0"
                                >
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  TRIGGER SOS NOW
                                </Button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}

                        <span className="block text-[10px] text-zinc-600 mt-1 px-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3"
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-red-600/20 border border-red-600/30">
                        <Bot className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex gap-1.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-zinc-500"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Symptom Chips */}
              <div className="px-4 pb-2 pt-1 border-t border-zinc-800/50">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600 font-medium mb-2">
                  Quick Select Symptoms
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin pb-1">
                  {SYMPTOM_CHIPS.map((chip) => (
                    <motion.button
                      key={chip}
                      type="button"
                      onClick={() => sendMessage(chip)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center rounded-full bg-zinc-800/80 border border-zinc-700/50 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
                    >
                      {chip}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="px-4 pb-4 pt-1">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(inputValue);
                  }}
                  className="flex gap-2"
                >
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your symptoms..."
                    disabled={isTyping}
                    className="flex-1 h-10 border-zinc-700 bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-600 text-sm focus-visible:border-red-800/50 focus-visible:ring-red-900/20"
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="h-10 w-10 p-0 bg-red-600 hover:bg-red-700 border-0 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
