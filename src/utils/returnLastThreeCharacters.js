const returnLastThreeCharacters = (string, count = 3) => {
    const startIndex = string.length - count;
    const endIndex = string.length;
    return string.slice(startIndex, endIndex);
};

export default returnLastThreeCharacters;