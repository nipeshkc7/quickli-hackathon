export const generateRandomName = () => {
    const adjectives = [
        'Happy',
        'Sad',
        'Angry',
        'Excited',
        'Bored',
        'Tired',
        'Crazy',
        'Silly',
        'Grumpy',
        'Hungry',
    ]
    const nouns = [
        'Cat',
        'Dog',
        'Bird',
        'Fish',
        'Lion',
        'Tiger',
        'Elephant',
        'Monkey',
        'Giraffe',
        'Zebra',
    ]
    const adjective =
        adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    return `${adjective} ${noun}`
}