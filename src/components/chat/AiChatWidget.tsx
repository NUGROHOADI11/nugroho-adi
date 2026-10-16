"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Bot,
  ChevronDown,
  Layers,
  Briefcase,
  Code2,
  Mail,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import ChatSkeleton from "./ChatSkeleton";

interface SourceItem {
  category: string;
  title: string;
  source?: string;
  similarity?: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceItem[];
}

const SUGGESTED_QUESTIONS = [
  {
    icon: Code2,
    label: "Apa saja tech stack utama yang dikuasai?",
    labelEn: "What are the primary tech stacks mastered?",
  },
  {
    icon: Sparkles,
    label: "Ceritakan proyek AI atau Cloud yang pernah dibuat",
    labelEn: "Tell me about AI or Cloud projects built",
  },
  {
    icon: Briefcase,
    label: "Bagaimana pengalaman kerjanya?",
    labelEn: "What is the professional work experience?",
  },
  {
    icon: Mail,
    label: "Bagaimana cara menghubungi untuk kolaborasi?",
    labelEn: "How to contact for hiring or collaboration?",
  },
];

export default function AiChatWidget({ locale = "id" }: { locale?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isIndo = locale === "id";

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSend = async (textToSend?: string) => {
    const question = (textToSend || input).trim();
    if (!question || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        sources: [],
      },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server returned ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let streamBuffer = "";
      let accumulatedText = "";
      let retrievedSources: SourceItem[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        const lines = streamBuffer.split("\n");
        streamBuffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.type === "sources") {
              retrievedSources = data.sources || [];
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, sources: retrievedSources }
                    : m
                )
              );
            } else if (data.type === "chunk") {
              accumulatedText += data.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulatedText }
                    : m
                )
              );
            } else if (data.type === "error") {
              accumulatedText += `\n\n⚠️ *${data.message}*`;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: accumulatedText }
                    : m
                )
              );
            }
          } catch {
            // Ignore non-json lines
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content: isIndo
                  ? "Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba kembali sesaat lagi."
                  : "Sorry, an error occurred while connecting to the AI assistant. Please try again shortly.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 font-dm-sans"
          >
            {/* Context Tooltip Pill */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="hidden md:flex items-center gap-2.5 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100 text-xs px-4 py-2 rounded-full border border-gray-200 dark:border-neutral-800 shadow-lg backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">
                {isIndo ? "Tanya P'nu" : "Ask P'nu"}
              </span>
            </motion.div>

            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              aria-label="Open P'nu Assistant"
              className="relative group p-4 rounded-full bg-secondary text-white hover:bg-[#034435] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-500/20"
            >
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-300 dark:text-emerald-700 animate-pulse" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "600px",
            }}
            exit={{ opacity: 0, y: 35, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[440px] bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-100 rounded-[2rem] border border-gray-200 dark:border-neutral-800 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden font-dm-sans transition-colors duration-200"
          >
            {/* Header */}
            <div className="p-4 px-5 border-b border-gray-100 dark:border-neutral-800 bg-[#f1f3f4]/80 dark:bg-neutral-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-accent dark:bg-emerald-950 text-secondary dark:text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                    P&apos;nu
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0f0f0f] rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      P&apos;nu
                    </h3>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Nugroho Adi • Online</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && !isMinimized && (
                  <button
                    onClick={handleClearChat}
                    title={isIndo ? "Mulai ulang percakapan" : "Clear conversation"}
                    className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-neutral-800 rounded-full transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Perbesar" : "Perkecil"}
                  className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-neutral-800 rounded-full transition"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMinimized ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title={isIndo ? "Tutup" : "Close"}
                  className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-neutral-800 rounded-full transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <>
                <div
                  ref={scrollContainerRef}
                  className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-neutral-800 text-sm"
                >
                  {/* Empty state greeting */}
                  {messages.length === 0 && (
                    <div className="py-2 space-y-4">
                      <div className="p-4 rounded-3xl bg-[#f1f3f4] dark:bg-neutral-900/40 border border-gray-200/60 dark:border-neutral-800/80 space-y-1.5">
                        <div className="flex items-center gap-2 text-secondary dark:text-emerald-300 font-medium text-xs">
                          <Bot className="w-4 h-4" />
                          <span>
                            {isIndo ? "Halo! Ada yang bisa dibantu?" : "Hello! How can I help?"}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                          {isIndo
                            ? "Halo! Saya P'nu, asisten AI resmi Nugroho Adi. Saya dilatih dengan data portofolio, pengalaman kerja enterprise, tech stack, dan proyek aslinya."
                            : "Hello! I am P'nu, Nugroho Adi's official AI assistant. Ask me about his background, projects, work experience, or technical stack."}
                        </p>
                      </div>

                      {/* Suggested questions */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
                          {isIndo ? "Pertanyaan Populer:" : "Suggested Questions:"}
                        </p>
                        <div className="flex flex-col gap-2">
                          {SUGGESTED_QUESTIONS.map((q, idx) => {
                            const text = isIndo ? q.label : q.labelEn;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSend(text)}
                                className="group flex items-center justify-between p-3 rounded-full bg-[#f1f3f4] hover:bg-accent text-gray-700 hover:text-secondary dark:bg-neutral-900 dark:hover:bg-emerald-950/60 dark:text-gray-300 dark:hover:text-emerald-200 border border-transparent hover:border-emerald-300/40 text-left text-xs font-medium transition-all duration-200"
                              >
                                <span className="truncate pr-2">{text}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages Feed */}
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] text-xs sm:text-sm ${
                          msg.role === "user"
                            ? "bg-secondary text-white rounded-3xl rounded-br-sm px-4 py-3 shadow-xs"
                            : "bg-[#f1f3f4] dark:bg-neutral-900/90 text-gray-800 dark:text-gray-200 rounded-3xl rounded-bl-sm p-4 border border-gray-200/60 dark:border-neutral-800 shadow-xs"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        ) : (
                          <div className="space-y-2">
                            {msg.content ? (
                              <div className="prose prose-neutral dark:prose-invert prose-xs max-w-none text-gray-800 dark:text-gray-200 leading-relaxed prose-p:my-1 prose-strong:text-emerald-700 dark:prose-strong:text-emerald-300 prose-ul:my-1 prose-li:my-0.5">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <ChatSkeleton locale={locale} isCompact={true} />
                            )}

                            {/* Source badges */}
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="pt-2 border-t border-gray-200/60 dark:border-neutral-800 mt-2 space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                                  <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>{isIndo ? "Sumber Terverifikasi:" : "Verified Sources:"}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {msg.sources.map((src, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-accent dark:bg-emerald-950 text-secondary dark:text-emerald-300 border border-emerald-500/20"
                                    >
                                      {src.category.toUpperCase()}: {src.title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-3 bg-[#f1f3f4]/80 dark:bg-neutral-900/60 border-t border-gray-100 dark:border-neutral-800">
                  <div className="relative flex items-center bg-white dark:bg-black rounded-full border border-gray-200 dark:border-neutral-800 focus-within:border-emerald-600 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 px-3.5 py-1 transition">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isIndo
                          ? "Tanyakan seputar profil, proyek, atau tech stack..."
                          : "Ask about profile, projects, or tech stack..."
                      }
                      rows={1}
                      disabled={isLoading}
                      className="w-full bg-transparent text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-2.5 pr-8 focus:outline-none resize-none max-h-24"
                    />

                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      aria-label="Send message"
                      className="p-2 rounded-full bg-secondary text-white hover:bg-[#034435] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
