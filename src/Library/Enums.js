const SheetDcoument = {
    MEMBERS: "Members",
    TRANSACTIONLOG: "TransactionLog"
};

const SheetEvent = {
    GENERATEPAYMENTLINKS: "GeneratePaymentLinks"
};


const ErrorCodes =
{
    ERRORCODE1001 : { Code: '10001', message: "Member is already Inactive, system can not generate payment links for him/her.!"},
}

const MemberStatus = {
    PENDING: "PENDING", 
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    EXPIRED: "EXPIRED",
    ELIMINATED: "ELIMINATED"
  };