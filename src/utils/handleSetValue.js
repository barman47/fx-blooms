// Accept only numbers
const handleSetValue = (value, setFunction) => {
    if (!isNaN(value)) {
        setFunction(value);
    } 
};

export default handleSetValue;