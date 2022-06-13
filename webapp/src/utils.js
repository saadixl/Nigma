const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                   'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
                   'U', 'V', 'W', 'X', 'Y', 'Z'];

const getRotatedAlphabets = (rotorDigit, reverse) => {
    let firstHalf = alphabets.slice(0, rotorDigit - 1);
    let secondHalf = alphabets.slice(rotorDigit - 1);
    if(reverse) {
        firstHalf = alphabets.slice(0, 26 - rotorDigit + 1);
        secondHalf = alphabets.slice(-1 * (rotorDigit - 1));
    }
    return [...secondHalf, ...firstHalf];
};

const crypt = ({msg, rotorCode, reverse = false}) => {
    msg = msg.toUpperCase().trim();
    let charArr = msg.split('');
    const rotorDigits = rotorCode.split('-');
    rotorDigits.forEach((rotorDigit) => {
        rotorDigit = parseInt(rotorDigit);
        const rotatedAlphabets = getRotatedAlphabets(rotorDigit, reverse);
        charArr.forEach((char, i) => {
            if(char !== ' ' && char >= 'A' && char <= 'Z') {
                const charIndex = char.charCodeAt(0) - 65;
                charArr[i] = rotatedAlphabets[charIndex];
            }
        });
    });
    return charArr.join('');
};

const encrypt = ({msg, rotorCode}) => {
    return crypt({msg, rotorCode});
};

const decrypt = ({msg, rotorCode}) => {
    return crypt({msg, rotorCode, reverse: true});
};

export {
    encrypt,
    decrypt
}