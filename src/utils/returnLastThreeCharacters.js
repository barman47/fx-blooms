const returnLastThreeCharacters = (string) => {
    const startIndex = string.length - 3;
    const endIndex = string.length;
    return string.slice(startIndex, endIndex);
};

export default returnLastThreeCharacters;