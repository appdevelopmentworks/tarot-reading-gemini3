import { create } from 'zustand';

type AppState = {
    phase: 'idle' | 'shuffling' | 'dealing' | 'reading' | 'result';
    setPhase: (phase: AppState['phase']) => void;
    hoveredCardId: number | null;
    setHoveredCardId: (id: number | null) => void;
    language: 'en' | 'ja';
    setLanguage: (lang: 'en' | 'ja') => void;
    selectedCardIds: number[];
    addSelectedCardId: (id: number) => void;
    resetSelection: () => void;
    isStreaming: boolean;
    setIsStreaming: (isStreaming: boolean) => void;
    readingResult: string;
    setReadingResult: (result: string) => void;
    appendReadingResult: (chunk: string) => void;
    question: string;
    setQuestion: (q: string) => void;
};

export const useStore = create<AppState>((set) => ({
    phase: 'idle',
    setPhase: (phase) => set({ phase }),
    hoveredCardId: null,
    setHoveredCardId: (id) => set({ hoveredCardId: id }),
    language: 'en',
    setLanguage: (language) => set({ language }),
    selectedCardIds: [],
    addSelectedCardId: (id) => set((state) => ({ selectedCardIds: [...state.selectedCardIds, id] })),
    resetSelection: () => set({ selectedCardIds: [] }),
    isStreaming: false,
    setIsStreaming: (isStreaming) => set({ isStreaming }),
    readingResult: "",
    setReadingResult: (readingResult) => set({ readingResult }),
    appendReadingResult: (chunk) => set((state) => ({ readingResult: state.readingResult + chunk })),
    question: "",
    setQuestion: (question) => set({ question }),
}));
