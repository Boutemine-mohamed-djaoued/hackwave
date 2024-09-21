export default function cleanNumber(str) {
     // Mapping of number words to digits
     const numberWords = {
        'zero': '0',
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9',
        'ten': '10',
        // Add more numbers as needed
    };

    // Replace number words with their corresponding digits
    const wordsPattern = new RegExp(Object.keys(numberWords).join("|"), "gi");
    str = str.replace(wordsPattern, (matched) => {
        return numberWords[matched.toLowerCase()];
    });

    // Remove everything except numbers
    return str.replace(/\D/g, '');
}