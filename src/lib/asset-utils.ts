import { TarotCard } from "./tarot-data";

export function getCardTexturePath(card: TarotCard): string {
    const basePath = "/assets/tarot_images";

    if (card.arcana === 'major') {
        const numStr = card.number!.toString().padStart(2, '0');
        return `${basePath}/ar${numStr}.jpg`;
    }

    // Minor Arcana
    const suitMap: Record<string, string> = {
        'wands': 'wa',
        'cups': 'cu',
        'swords': 'sw',
        'pentacles': 'pe'
    };

    const suitPrefix = suitMap[card.suit!];


    let rankSuffix = '';
    const n = card.number!;

    if (n === 1) rankSuffix = 'ac';
    else if (n >= 2 && n <= 10) rankSuffix = n.toString().padStart(2, '0');
    else if (n === 11) rankSuffix = 'pa'; // Page
    else if (n === 12) rankSuffix = 'kn'; // Knight
    else if (n === 13) rankSuffix = 'qu'; // Queen
    else if (n === 14) rankSuffix = 'ki'; // King

    return `${basePath}/${suitPrefix}${rankSuffix}.jpg`;
}
