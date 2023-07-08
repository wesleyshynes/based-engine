export function createDeck() {
    const deck: any = []
    const suits = [
        {
            name: 'hearts',
            symbol: '♥',
            color: 'red',
        },
        {
            name: 'diamonds',
            symbol: '♦',
            color: 'red',
        },
        {
            name: 'clubs',
            symbol: '♣',
            color: 'black',
        },
        {
            name: 'spades',
            symbol: '♠',
            color: 'black',
        },
    ]
    const values = [
        { name: 'ace', value: 11, altValue: 1, letter: 'A' },
        { name: 'two', value: 2, letter: '2' },
        { name: 'three', value: 3, letter: '3' },
        { name: 'four', value: 4, letter: '4' },
        { name: 'five', value: 5, letter: '5' },
        { name: 'six', value: 6, letter: '6' },
        { name: 'seven', value: 7, letter: '7' },
        { name: 'eight', value: 8, letter: '8' },
        { name: 'nine', value: 9, letter: '9' },
        { name: 'ten', value: 10, letter: '10' },
        { name: 'jack', value: 10, letter: 'J' },
        { name: 'queen', value: 10, letter: 'Q' },
        { name: 'king', value: 10, letter: 'K' },
    ]
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push({
                suit: suits[i].name,
                symbol: suits[i].symbol,
                value: values[j].value,
                altValue: values[j].altValue ? values[j].altValue : 0,
                name: values[j].name,
                letter: values[j].letter,
                color: suits[i].color,
            })
        }
    }

    for (let i = 0; i < deck.length; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length)
        const temp = deck[i]
        deck[i] = deck[randomIndex]
        deck[randomIndex] = temp
    }
    return deck
}

export function calculateHandValue(cards: any[]) {
    let handValue = 0
    const altValues: any[] = []
    cards.forEach((card: any, idx: number) => {
        handValue += card.value
        if (card.altValue > 0) {
            altValues.push(card)
        }
        if (handValue > 21 && card.altValue > 0) {
            handValue -= card.value
            handValue += card.altValue
            altValues.pop()
        }
    })
    while (handValue > 21 && altValues.length > 0) {
        const card = altValues.pop()
        handValue -= card.value
        handValue += card.altValue
    }
    return handValue
}