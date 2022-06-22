const formatDate = (date) => {
    const newDate = new Date(date);
    const hours = newDate.getHours();
    const mins = newDate.getMinutes();

    const transTime = hours + ":" + mins;
    const transDate =
        newDate.getDate() +
        " " +
        new Intl.DateTimeFormat("en", { month: "short" }).format(newDate) +
        " " +
        newDate.getFullYear().toString().substr(-2);
    return transTime + " | " + transDate;
};

export default formatDate;
