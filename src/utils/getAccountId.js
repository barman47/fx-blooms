const getAccountId = (account, accounts) => {
    const bank = accounts.find(item => item.bankName === account || item.nicKName === account);
    return bank.accountID;
};

export default getAccountId;