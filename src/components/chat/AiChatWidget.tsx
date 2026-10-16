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
} from "lucide-react";

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

  // Scroll strictly inside the chat container so the webpage window never jumps down
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

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "projects":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "skills":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "experience":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20";
      case "bio":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "faq":
        return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-500/10 dark:text-neutral-400 dark:border-neutral-500/20";
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
          >
            {/* Context Tooltip Pill */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="hidden md:flex items-center gap-2 bg-white/95 dark:bg-neutral-900/95 text-neutral-800 dark:text-white text-xs px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-xl backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">
                {isIndo ? "Tanya Asisten AI Nugroho" : "Ask Nugroho's AI Assistant"}
              </span>
            </motion.div>

            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              aria-label="Open AI Chatbot"
              className="relative group p-4 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-40 blur-sm group-hover:opacity-75 transition duration-300 animate-tilt" />
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "620px",
            }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-w-[460px] bg-white/95 dark:bg-neutral-950/95 text-neutral-900 dark:text-neutral-100 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden font-sans transition-colors duration-200"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 px-4 sm:px-5 border-b border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/90 dark:bg-neutral-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md font-bold text-sm">
                    NA
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-neutral-950 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm tracking-wide text-neutral-900 dark:text-white">
                      Nugroho Adi
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
                      Digital Twin
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    {isIndo
                      ? "AI Assistant • Online"
                      : "AI Assistant • Online"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && !isMinimized && (
                  <button
                    onClick={handleClearChat}
                    title={isIndo ? "Mulai ulang percakapan" : "Clear conversation"}
                    className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-xl transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Perbesar" : "Perkecil"}
                  className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-xl transition"
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
                  className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 rounded-xl transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body (only if not minimized) */}
            {!isMinimized && (
              <>
                <div
                  ref={scrollContainerRef}
                  className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-800 text-sm"
                >
                  {/* Greeting & Suggested Chips when empty */}
                  {messages.length === 0 && (
                    <div className="py-3 space-y-4">
                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-xs">
                          <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          <span>
                            {isIndo ? "Halo! Ada yang bisa dibantu?" : "Hello! How can I help?"}
                          </span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
                          {isIndo
                            ? "Saya adalah asisten AI resmi Nugroho Adi. Saya dilatih khusus dengan database portofolio, pengalaman kerja, proyek enterprise, tech stack, dan sertifikasinya."
                            : "I am Nugroho Adi's official AI assistant. I am grounded on his verified portfolio database, enterprise experience, tech stack, and certifications."}
                        </p>
                      </div>

                      {/* 4 Suggested Questions */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-1">
                          {isIndo ? "Pertanyaan Populer:" : "Suggested Questions:"}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {SUGGESTED_QUESTIONS.map((q, idx) => {
                            const Icon = q.icon;
                            const text = isIndo ? q.label : q.labelEn;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleSend(text)}
                                className="group flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-neutral-50 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 hover:border-cyan-500/40 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shadow-sm transition-all duration-200"
                              >
                                <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500/20 transition">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="flex-1 font-medium">{text}</span>
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
                        className={`max-w-[88%] rounded-2xl p-3.5 ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md"
                            : "bg-neutral-50 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-200 rounded-bl-none border border-neutral-200 dark:border-neutral-800/80 shadow-sm"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap leading-relaxed text-xs">
                            {msg.content}
                          </p>
                        ) : (
                          <div className="space-y-2 text-xs">
                            {msg.content ? (
                              <div className="prose prose-neutral dark:prose-invert prose-xs max-w-none space-y-2 leading-relaxed text-neutral-800 dark:text-neutral-200 prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-cyan-600 dark:prose-strong:text-cyan-300">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 py-1">
                                <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                                <span className="text-xs">
                                  {isIndo
                                    ? "Mencari konteks & menyusun jawaban..."
                                    : "Retrieving context & generating answer..."}
                                </span>
                              </div>
                            )}

                            {/* Source badges */}
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800/80 mt-2 space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                                  <Layers className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                                  <span>{isIndo ? "Sumber Terverifikasi:" : "Verified Sources:"}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {msg.sources.map((src, idx) => (
                                    <span
                                      key={idx}
                                      className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${getCategoryColor(
                                        src.category
                                      )}`}
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

                {/* Input Form */}
                <div className="p-3 bg-neutral-50/90 dark:bg-neutral-900/80 border-t border-neutral-200 dark:border-neutral-800/80">
                  <div className="relative flex items-center bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-300 dark:border-neutral-800 focus-within:border-cyan-500 dark:focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition">
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
                      className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 px-3.5 py-3 pr-10 focus:outline-none resize-none max-h-24"
                    />

                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isLoading}
                      aria-label="Send message"
                      className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition shadow"
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
