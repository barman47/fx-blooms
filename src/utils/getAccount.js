const getAccount = (account, accounts) =>  account ? accounts.find(item => item.bankName === account || item.nicKName === account) : {};

export default getAccount;