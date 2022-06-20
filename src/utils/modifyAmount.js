const modifyAmount = (e) => {
    //console.log(e)
    if (e < 1000) return e;
    if (+e > 1000 && +e < 999999) {
        return e.toPrecision(7) + "K";
    }
    if (+e > 1000000 && +e < 999999999) {
        return e.toPrecision(7) / 1000000 + "M";
    } else {
        return e.toString() / 1000000000 + "Bn";
    }
};

export default modifyAmount;
