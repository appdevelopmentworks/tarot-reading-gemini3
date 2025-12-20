export interface TarotCard {
    id: number;
    name: string;
    suit?: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
    number?: number;
    arcana: 'major' | 'minor';
}

const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;
const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];

export const TAROT_DECK: TarotCard[] = [
    // Major Arcana (0-21)
    { id: 0, name: "The Fool", arcana: 'major', number: 0 },
    { id: 1, name: "The Magician", arcana: 'major', number: 1 },
    { id: 2, name: "The High Priestess", arcana: 'major', number: 2 },
    { id: 3, name: "The Empress", arcana: 'major', number: 3 },
    { id: 4, name: "The Emperor", arcana: 'major', number: 4 },
    { id: 5, name: "The Hierophant", arcana: 'major', number: 5 },
    { id: 6, name: "The Lovers", arcana: 'major', number: 6 },
    { id: 7, name: "The Chariot", arcana: 'major', number: 7 },
    { id: 8, name: "Strength", arcana: 'major', number: 8 },
    { id: 9, name: "The Hermit", arcana: 'major', number: 9 },
    { id: 10, name: "Wheel of Fortune", arcana: 'major', number: 10 },
    { id: 11, name: "Justice", arcana: 'major', number: 11 },
    { id: 12, name: "The Hanged Man", arcana: 'major', number: 12 },
    { id: 13, name: "Death", arcana: 'major', number: 13 },
    { id: 14, name: "Temperance", arcana: 'major', number: 14 },
    { id: 15, name: "The Devil", arcana: 'major', number: 15 },
    { id: 16, name: "The Tower", arcana: 'major', number: 16 },
    { id: 17, name: "The Star", arcana: 'major', number: 17 },
    { id: 18, name: "The Moon", arcana: 'major', number: 18 },
    { id: 19, name: "The Sun", arcana: 'major', number: 19 },
    { id: 20, name: "Judgement", arcana: 'major', number: 20 },
    { id: 21, name: "The World", arcana: 'major', number: 21 },
];

let idCounter = 22;

suits.forEach(suit => {
    ranks.forEach((rank, index) => {
        TAROT_DECK.push({
            id: idCounter++,
            name: `${rank} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
            suit: suit,
            number: index + 1,
            arcana: 'minor'
        });
    });
});

export const getCardById = (id: number): TarotCard => {
    return TAROT_DECK[id] || TAROT_DECK[0];
};
