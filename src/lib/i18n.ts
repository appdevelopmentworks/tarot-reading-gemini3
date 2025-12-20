export type Language = 'en' | 'ja';

export const translations = {
    en: {
        title: "CELESTIA",
        subtitle: "Digital Tarot Reading",
        start: "INITIALIZE READING",
        placeholder: "Focus your intent... (e.g., What is my career path?)",
        submit: "TRANSMIT QUERY",
        shuffling: "SYSTEM SYNCHRONIZING...",
        dealing: "SELECT YOUR CARD",
        decoding: "/// DECODING FATE STREAM...",
        reset: "NEW SESSION",
        error: "Signal Lost. Please reconnect.",
    },
    ja: {
        title: "CELESTIA",
        subtitle: "デジタルタロット占い",
        start: "リーディングを開始",
        placeholder: "問いを入力してください... (例: 今後のキャリアは？)",
        submit: "送信",
        shuffling: "システム同期中...",
        dealing: "カードを選択してください",
        decoding: "/// 運命ストリーム解読中...",
        reset: "新しいセッション",
        error: "信号ロスト。再接続してください。",
    }
};
