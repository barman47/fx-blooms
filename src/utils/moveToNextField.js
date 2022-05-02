const moveToNextField = (current, nextField, previousField) => {
    if (nextField === null && current.value) {
        return;
    }

    if (previousField && current.value.length === 0) {
        return previousField.getElementsByTagName('input')[0].focus();
    }

    const input = nextField.getElementsByTagName('input')[0];

    if (current.value.length >= current.maxLength) {
        return input.focus();
    }
};

export default moveToNextField;