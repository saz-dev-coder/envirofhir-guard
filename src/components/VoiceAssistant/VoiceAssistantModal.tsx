/**
 * AI Voice Assistant Modal Component (Hybrid Audio Blueprint)
 * Features:
 * - 10 Supported Languages (English, Hindi, Spanish, French, German, Japanese, Chinese, Arabic, Portuguese, Russian)
 * - OS Regional Voice Pack Inspector with clear, transparent fallback warnings
 * - Microphone input via Web Speech API with fallback
 * - Tactical Cyberpunk Neon Equalizer
 * - Clean open-source client-side architecture
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  answerQuestion,
  speechSynthesizer,
} from '../../services/voiceAssistant';
import { hybridAudio, VoicePackStatus } from '../../services/hybridAudio';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Globe,
  Send,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(
    SUPPORTED_LANGUAGES[0]
  );
  const [queryInput, setQueryInput] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'user' | 'assistant'; text: string; timestamp: string }>
  >([
    {
      sender: 'assistant',
      text:
        'Hello! I am your EnviroFHIR-Guard Voice Assistant. Ask me anything about our zero-trust architecture, cryptographic ECDSA verification, or select a prompt below.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voicePackStatus, setVoicePackStatus] = useState<VoicePackStatus>({
    hasNativeVoice: true,
    voiceName: 'Detecting...',
    langCode: 'en-US',
    isFallback: false,
  });

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inspect OS Voice Pack on language change
  useEffect(() => {
    const status = hybridAudio.inspectVoicePack(selectedLang.langCode, selectedLang.name);
    setVoicePackStatus(status);
  }, [selectedLang]);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLang.langCode;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQueryInput(transcript);
          handleAsk(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      speechSynthesizer.stop();
    };
  }, [selectedLang]);

  if (!isOpen) return null;

  const handleAsk = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    // Play subtle audio cue
    hybridAudio.playStudioCue('VERIFY');

    // Add user message
    const userMsg = {
      sender: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Generate answer
    const answer = answerQuestion(q, selectedLang.code);
    const botMsg = {
      sender: 'assistant' as const,
      text: answer,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setQueryInput('');

    // Speak answer in selected accent
    speechSynthesizer.speak(answer, selectedLang.langCode, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      speechSynthesizer.stop();
      setIsSpeaking(false);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = selectedLang.langCode;
          recognitionRef.current.start();
        }
      } catch (_e) {
        setIsListening(false);
      }
    }
  };

  const handleToggleSpeech = (textToSpeak: string) => {
    if (isSpeaking) {
      speechSynthesizer.stop();
      setIsSpeaking(false);
    } else {
      speechSynthesizer.speak(textToSpeak, selectedLang.langCode, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    speechSynthesizer.stop();
    setIsSpeaking(false);
    setSelectedLang(lang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang.langCode;
    }

    const greetings: Record<string, string> = {
      en: 'Switched to English. Ask me what this website is about or test our Zero-Trust FHIR engine.',
      hi: 'भाषा हिन्दी में बदली गई। मुझसे पूछें कि यह वेबसाइट किस बारे में है या हमारी कार्यप्रणाली समझें।',
      es: 'Cambiado a Español. Pregúntame de qué trata este sitio o cómo funciona nuestro motor de confianza.',
      fr: 'Passé en Français. Posez-moi des questions sur ce site ou le moteur d’interopérabilité.',
      de: 'Auf Deutsch umgestellt. Fragen Sie mich, worum es auf dieser Website geht.',
      ja: '日本語に切り替えました。このウェブサイトの機能や仕組みについて何でもお尋ねください。',
      zh: '已切换到中文。请向我询问本网站的功能或零信任管道的运作机制。',
      ar: 'تم التحويل إلى اللغة العربية. تفضل بطرح أي سؤال حول آلية عمل المنصة وحماية البيانات.',
      pt: 'Mudou para Português. Pergunte-me sobre o que é este site ou como funciona o motor de confiança.',
      ru: 'Переключено на русский язык. Спросите меня, о чем этот сайт или как работает механизм доверия.',
    };

    const newGreeting = greetings[lang.code] || greetings['en'];
    setMessages((prev) => [
      ...prev,
      {
        sender: 'assistant',
        text: newGreeting,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    speechSynthesizer.speak(newGreeting, lang.langCode, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090714] border border-pink-500/40 rounded-2xl shadow-2xl shadow-purple-950/80 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Glow ambient background header */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-r from-pink-500/15 via-purple-500/20 to-cyan-500/15 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-5 py-4 border-b border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono tracking-tight">
                  AI Voice Assistant // Hybrid Audio Blueprint
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-950 to-purple-950 text-pink-300 border border-pink-500/40">
                  10 LANGUAGES
                </span>
              </div>
              <p className="text-[11px] text-purple-300/80">
                Spoken answers in native accents with speech recognition & OS language-pack diagnostics.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              speechSynthesizer.stop();
              setIsSpeaking(false);
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selection Strip */}
        <div className="relative z-10 px-4 py-2.5 bg-[#070510] border-b border-purple-950 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1 text-[11px] font-mono text-purple-300 mr-2 shrink-0">
            <Globe className="w-3.5 h-3.5" /> Language:
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md shadow-pink-500/30 ring-1 ring-pink-400'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-600'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>

        {/* OS Voice Pack Status & Equalizer Bar */}
        <div className="relative z-10 px-5 py-2 bg-[#0c0818] border-b border-purple-900/40 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            {voicePackStatus.hasNativeVoice ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Native Voice Pack Active:</span>
                <span className="text-slate-300 max-w-[200px] truncate">{voicePackStatus.voiceName}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>OS Pack Missing: Falling back to {voicePackStatus.voiceName}</span>
              </span>
            )}
          </div>

          {/* Audio Equalizer */}
          <div className="flex items-center gap-1">
            {[35, 65, 25, 90, 55, 100, 45, 80, 50, 70].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-pink-500 to-purple-400 rounded-full transition-all duration-150"
                style={{
                  height: isSpeaking || isListening ? `${h * 0.22}px` : '4px',
                  opacity: isSpeaking || isListening ? 1 : 0.3,
                }}
              />
            ))}
            <span className="ml-2 text-[10px] font-mono text-purple-300">
              {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Chat History Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin text-xs bg-[#06040e]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                    : 'bg-[#120d24] border border-purple-900/60 text-slate-200 rounded-bl-sm'
                }`}
              >
                <div className="text-[10px] font-mono text-pink-300/80 mb-1 flex items-center justify-between gap-4">
                  <span>{m.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                {m.sender === 'assistant' && (
                  <div className="mt-2 pt-2 border-t border-purple-900/50 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">
                      Language: {selectedLang.name}
                    </span>
                    <button
                      onClick={() => handleToggleSpeech(m.text)}
                      className="flex items-center gap-1 text-pink-300 hover:text-white transition-colors cursor-pointer"
                      title="Speak again"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" /> Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-[#080512] border-t border-purple-950">
          <div className="text-[10px] font-mono text-purple-300 uppercase mb-1.5 flex items-center justify-between">
            <span>Quick Prompts ({selectedLang.name}):</span>
            <span className="text-slate-500">Click to ask & speak</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {selectedLang.sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleAsk(q)}
                className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-purple-950/40 border border-purple-800/60 text-pink-200 hover:bg-pink-900/40 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Mic Input & Send */}
        <div className="p-3 bg-[#0a0716] border-t border-purple-900/50 flex items-center gap-2">
          <button
            onClick={handleToggleListening}
            className={`p-3 rounded-xl transition-all shadow-md cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white hover:brightness-110 shadow-pink-500/30'
            }`}
            title={isListening ? 'Stop listening' : `Speak in ${selectedLang.name}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk(queryInput);
            }}
            placeholder={`Ask in ${selectedLang.name} (e.g. "${selectedLang.sampleQuestions[0]}")...`}
            className="flex-1 bg-slate-950 border border-purple-900/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
          />

          <button
            onClick={() => handleAsk(queryInput)}
            disabled={!queryInput.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:brightness-110 disabled:opacity-40 transition-all shadow-md cursor-pointer"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
