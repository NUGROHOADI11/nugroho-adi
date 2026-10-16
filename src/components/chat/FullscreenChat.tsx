"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  Send,
  RotateCcw,
  Layers,
  Briefcase,
  Code2,
  Mail,
  Loader2,
  ArrowUpRight,
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

interface FullscreenChatProps {
  locale: string;
  profileName: string;
  profileRole: string;
}

export default function FullscreenChat({
  locale = "id",
  profileName = "Nugroho Adi",
  profileRole = "Software & AI/Cloud Engineer",
}: FullscreenChatProps) {
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
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className="w-full bg-[#f1f3f4] dark:bg-neutral-900/30 border border-gray-200/80 dark:border-neutral-900 rounded-[2.5rem] shadow-sm flex flex-col h-[760px] max-h-[85vh] overflow-hidden font-dm-sans transition-colors duration-200">
      {/* 1. Header */}
      <div className="p-5 sm:p-6 border-b border-gray-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-accent dark:bg-emerald-950 text-secondary dark:text-emerald-300 flex items-center justify-center font-bold text-sm sm:text-base border border-emerald-500/20 shadow-xs">
              NA
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-neutral-900 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                {profileName}
              </h2>
              <span className="text-xs font-medium px-3 py-0.5 rounded-full bg-accent dark:bg-emerald-950 text-secondary dark:text-emerald-300">
                Digital Twin
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
              <span>{profileRole}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                AI Assistant Online
              </span>
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-white hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full transition border border-gray-200 dark:border-neutral-700 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isIndo ? "Reset Chat" : "Reset Chat"}</span>
          </button>
        )}
      </div>

      {/* 2. Messages List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-800 text-sm"
      >
        {messages.length === 0 && (
          <div className="py-4 sm:py-6 space-y-6 max-w-2xl mx-auto">
            <div className="p-6 rounded-[2rem] bg-white dark:bg-neutral-900/60 border border-gray-200/70 dark:border-neutral-800 space-y-3 shadow-xs">
              <div className="inline-flex items-center gap-2 bg-accent dark:bg-emerald-950 text-secondary dark:text-emerald-200 px-4 py-1.5 rounded-full font-medium text-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>AI Digital Twin Nugroho Adi</span>
              </div>
              <h3 className="text-lg sm:text-xl font-normal text-gray-900 dark:text-white tracking-tight leading-snug">
                Selamat datang! Tanyakan apa saja mengenai latar belakang, proyek enterprise, dan keahlian rekayasa sistem Nugroho.
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Asisten ini terhubung dengan database portofolio terverifikasi mencakup pengalaman di PT Kimia Farma Tbk, Telkom Indonesia SPSE, Venturo Pro, dan Bangkit Google.
              </p>
            </div>

            {/* Suggested Question Chips */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2">
                {isIndo ? "Pertanyaan Populer:" : "Suggested Questions:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTED_QUESTIONS.map((q, idx) => {
                  const text = isIndo ? q.label : q.labelEn;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(text)}
                      className="group flex items-center justify-between p-4 rounded-full bg-white hover:bg-accent text-gray-700 hover:text-secondary dark:bg-neutral-900/80 dark:hover:bg-emerald-950/70 dark:text-gray-200 dark:hover:text-emerald-200 border border-gray-200/80 dark:border-neutral-800 hover:border-emerald-300/50 text-left text-xs sm:text-sm font-medium shadow-xs transition-all duration-200"
                    >
                      <span className="truncate pr-2">{text}</span>
                      <ArrowUpRight className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chat message bubbles */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] text-sm ${
                msg.role === "user"
                  ? "bg-secondary text-white rounded-[1.75rem] rounded-br-sm px-6 py-3.5 shadow-xs font-medium"
                  : "bg-white dark:bg-neutral-900/90 text-gray-800 dark:text-gray-200 rounded-[1.75rem] rounded-bl-sm p-5 sm:p-6 border border-gray-200/70 dark:border-neutral-800 shadow-xs"
              }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              ) : (
                <div className="space-y-3">
                  {msg.content ? (
                    <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none text-gray-800 dark:text-gray-200 leading-relaxed prose-p:my-1.5 prose-strong:text-emerald-700 dark:prose-strong:text-emerald-300 prose-ul:my-2 prose-li:my-0.5">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 py-1">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm">
                        {isIndo
                          ? "Menganalisis vector database & menyusun jawaban..."
                          : "Retrieving verified facts & generating answer..."}
                      </span>
                    </div>
                  )}

                  {/* Metadata Source Badges */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 mt-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{isIndo ? "Sumber RAG Terverifikasi:" : "Verified RAG Sources:"}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {msg.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full font-medium bg-accent dark:bg-emerald-950 text-secondary dark:text-emerald-300 border border-emerald-500/20"
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

      {/* 3. Input Footer */}
      <div className="p-4 sm:p-5 bg-white/80 dark:bg-neutral-900/70 border-t border-gray-200/70 dark:border-neutral-800 backdrop-blur-md">
        <div className="relative flex items-center bg-[#f1f3f4] dark:bg-neutral-900 rounded-full border border-gray-200/80 dark:border-neutral-800 focus-within:border-emerald-600 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 px-5 py-2 transition">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isIndo
                ? "Tanyakan apa saja seputar profil, pengalaman, tech stack, atau proyek Nugroho..."
                : "Ask anything about Nugroho's profile, experience, tech stack, or projects..."
            }
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-1.5 pr-10 focus:outline-none resize-none max-h-28"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="p-2.5 rounded-full bg-secondary text-white hover:bg-[#034435] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
