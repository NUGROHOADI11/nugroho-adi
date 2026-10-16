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
  Cpu,
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

  // Scroll strictly inside the message container so the main webpage window does NOT jump down
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
    <div className="bg-white dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-xl flex flex-col h-[750px] max-h-[85vh] transition-colors duration-200">
      {/* 1. Header Profil Singkat */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md shadow-cyan-500/20">
              NA
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-neutral-950 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                {profileName}
              </h2>
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                Digital Twin
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <span>{profileRole}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Online
              </span>
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/60 dark:hover:bg-neutral-800 rounded-xl transition border border-neutral-200 dark:border-neutral-700/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isIndo ? "Reset Chat" : "Reset Chat"}</span>
          </button>
        )}
      </div>

      {/* 2. Messages Feed & Suggested Chips */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-800 text-sm"
      >
        {messages.length === 0 && (
          <div className="py-4 sm:py-6 space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800/80 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold text-sm">
                <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>
                  {isIndo
                    ? "Selamat Datang di Asisten AI Digital Twin Nugroho Adi"
                    : "Welcome to Nugroho Adi's Digital Twin AI Assistant"}
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed">
                {isIndo
                  ? "Asisten ini terhubung langsung dengan database portofolio terverifikasi yang mencakup pengalaman kerja di PT Kimia Farma Tbk, Telkom Indonesia SPSE, Venturo Studio, Bangkit Academy Google, serta arsitektur cloud & microservices yang pernah dikembangkan."
                  : "This assistant is directly grounded on verified portfolio data covering professional experience at PT Kimia Farma Tbk, Telkom Indonesia SPSE, Venturo Studio, Bangkit Academy Google, and modern cloud architectures."}
              </p>
            </div>

            {/* 4 Suggested Question Chips */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-1">
                {isIndo ? "Pertanyaan Populer:" : "Suggested Questions:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => {
                  const Icon = q.icon;
                  const text = isIndo ? q.label : q.labelEn;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(text)}
                      className="group flex items-start gap-3 p-3.5 rounded-2xl bg-white hover:bg-neutral-50 dark:bg-neutral-950/40 dark:hover:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 hover:border-cyan-500/50 text-left text-xs text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white shadow-sm transition-all duration-200"
                    >
                      <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-105 transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 font-medium leading-relaxed">{text}</span>
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
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md"
                  : "bg-neutral-50 dark:bg-neutral-950/90 text-neutral-800 dark:text-neutral-200 rounded-bl-none border border-neutral-200 dark:border-neutral-800 shadow-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap leading-relaxed text-sm">
                  {msg.content}
                </p>
              ) : (
                <div className="space-y-3 text-sm">
                  {msg.content ? (
                    <div className="prose prose-neutral dark:prose-invert prose-sm max-w-none space-y-2 leading-relaxed text-neutral-800 dark:text-neutral-200 prose-p:my-1.5 prose-headings:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-cyan-600 dark:prose-strong:text-cyan-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400 py-1">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                      <span className="text-xs sm:text-sm">
                        {isIndo
                          ? "Menganalisis vector embedding & menyusun jawaban..."
                          : "Analyzing vector embeddings & streaming answer..."}
                      </span>
                    </div>
                  )}

                  {/* Metadata Source Badges */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800/80 mt-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>{isIndo ? "Sumber RAG Terverifikasi:" : "Verified RAG Sources:"}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.sources.map((src, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${getCategoryColor(
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

      {/* 3. Input Footer */}
      <div className="p-3 sm:p-4 bg-neutral-50/90 dark:bg-neutral-950/80 border-t border-neutral-200 dark:border-neutral-800">
        <div className="relative flex items-center bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-800 focus-within:border-cyan-500 dark:focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition">
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
            rows={2}
            disabled={isLoading}
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 px-4 py-3 pr-12 focus:outline-none resize-none max-h-32"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="absolute right-3 p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition shadow-md"
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
