"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal typings for the Web Speech API (not in standard lib.dom).
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [interim, setInterim] = useState("");
  const [sttSupported, setSttSupported] = useState(false);

  const recogRef = useRef<SpeechRecognitionLike | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const finalRef = useRef("");
  const onFinalRef = useRef<((t: string) => void) | null>(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSttSupported(!!Ctor);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const startListening = useCallback(
    (onFinal: (text: string) => void) => {
      const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Ctor) return false;
      stopSpeaking();
      const recog = new Ctor();
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = true;
    finalRef.current = "";
    onFinalRef.current = onFinal;

    recog.onresult = (e) => {
      let interimStr = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript;
        else interimStr += r[0].transcript;
      }
      setInterim(interimStr);
    };
    recog.onerror = () => {};
    recog.onend = () => {
      setListening(false);
      setInterim("");
      const text = finalRef.current.trim();
      if (text && onFinalRef.current) onFinalRef.current(text);
    };

      recogRef.current = recog;
      try {
        recog.start();
        setListening(true);
        return true;
      } catch {
        return false;
      }
    },
    [stopSpeaking]
  );

  const stopListening = useCallback(() => {
    recogRef.current?.stop();
  }, []);

  // Speak: try premium server TTS first, fall back to browser SpeechSynthesis.
  const speak = useCallback(
    async (text: string) => {
      if (!text) return;
      stopSpeaking();
      setSpeaking(true);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (res.ok && res.status === 200) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => {
            setSpeaking(false);
            URL.revokeObjectURL(url);
          };
          await audio.play();
          return;
        }
      } catch {
        /* fall through to browser voice */
      }
      // Free fallback
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.04;
        u.pitch = 1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find((v) => /natural|google|samantha|daniel/i.test(v.name));
        if (preferred) u.voice = preferred;
        u.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      } else {
        setSpeaking(false);
      }
    },
    [stopSpeaking]
  );

  useEffect(() => () => {
    recogRef.current?.abort();
    stopSpeaking();
  }, [stopSpeaking]);

  return {
    listening,
    speaking,
    interim,
    sttSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
