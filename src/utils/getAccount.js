const getAccount = (account, accounts) => {
    const bank = accounts.find(item => item.bankName === account || item.nicKName === account);
    return bank;
};

export default getAccount;