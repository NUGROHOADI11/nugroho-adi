"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  Send,
  RotateCcw,
  Bot,
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isIndo = locale === "id";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "skills":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "experience":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "bio":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "faq":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      default:
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col h-[750px] max-h-[85vh]">
      {/* 1. Header Profil Singkat */}
      <div className="p-5 border-b border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-cyan-500/20">
              NA
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-950 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-base text-white">{profileName}</h2>
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Digital Twin
              </span>
            </div>
            <p className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
              <span>{profileRole}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Assistant Online
              </span>
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 rounded-xl transition border border-neutral-700/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isIndo ? "Reset Chat" : "Reset Chat"}</span>
          </button>
        )}
      </div>

      {/* 2. Messages Feed & Suggested Chips */}
      <div className="flex-1 p-6 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-neutral-800 text-sm">
        {messages.length === 0 && (
          <div className="py-6 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-950/50 border border-neutral-800/80 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>
                  {isIndo
                    ? "Selamat Datang di Asisten AI Digital Twin Nugroho Adi"
                    : "Welcome to Nugroho Adi's Digital Twin AI Assistant"}
                </span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {isIndo
                  ? "Asisten ini terhubung langsung dengan vector database portofolio saya yang mencakup pengalaman kerja di PT Kimia Farma Tbk, Telkom Indonesia SPSE, Venturo Studio, Bangkit Academy Google, serta arsitektur cloud & microservices yang pernah saya rancang."
                  : "This assistant is directly grounded on my verified portfolio vector database covering professional experiences at PT Kimia Farma Tbk, Telkom Indonesia SPSE, Venturo Studio, Bangkit Academy Google, and modern cloud/microservices architectures."}
              </p>
            </div>

            {/* 4 Suggested Question Chips */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {isIndo ? "Pertanyaan Populer (Suggested Questions):" : "Suggested Questions:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => {
                  const Icon = q.icon;
                  const text = isIndo ? q.label : q.labelEn;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(text)}
                      className="group flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-950/40 hover:bg-neutral-800/80 border border-neutral-800 hover:border-cyan-500/40 text-left text-xs text-neutral-300 hover:text-white transition-all duration-200"
                    >
                      <div className="p-2 rounded-xl bg-neutral-800 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-105 transition">
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
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-lg"
                  : "bg-neutral-950/90 text-neutral-200 rounded-bl-none border border-neutral-800 shadow-lg"
              }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap leading-relaxed text-sm">
                  {msg.content}
                </p>
              ) : (
                <div className="space-y-3 text-sm">
                  {msg.content ? (
                    <div className="prose prose-invert prose-sm max-w-none space-y-2 leading-relaxed text-neutral-200 prose-p:my-1.5 prose-headings:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-cyan-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-neutral-400 py-1">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span className="text-sm">
                        {isIndo
                          ? "Menganalisis vector embedding & menyusun jawaban..."
                          : "Analyzing vector embeddings & streaming answer..."}
                      </span>
                    </div>
                  )}

                  {/* Metadata Source Badges */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-3 border-t border-neutral-800/80 mt-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
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

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input Footer */}
      <div className="p-4 bg-neutral-950/80 border-t border-neutral-800">
        <div className="relative flex items-center bg-neutral-900 rounded-2xl border border-neutral-800 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30 transition">
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
            className="w-full bg-transparent text-sm text-neutral-200 placeholder-neutral-500 px-4 py-3 pr-12 focus:outline-none resize-none max-h-32"
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

        <p className="text-[11px] text-center text-neutral-500 mt-2.5">
          Didukung oleh Google Gemini 3.5 & Supabase pgvector • Strict Grounding & Anti-Halusinasi
        </p>
      </div>
    </div>
  );
}
