class Member {
  constructor() {
    this.activeSheet = Library.GetSheetByName('Members');
  }

  MakePayment(payerMemberId, payeeMemberId, paidOn)
  { 
    let payerMemberIdRowNumber = new MemberSheet().GetRowNumberByMemberId(payerMemberId);
    let ExpiredPayeeMemberIdColumnNumber = new MemberSheet().GetColumnNumberByExpiredMemberId(payeeMemberId);
    
   this.activeSheet.getRange(payerMemberIdRowNumber,ExpiredPayeeMemberIdColumnNumber).setValue(paidOn);
   
  }

  SetExpired()
  {

  }

}

const MemberStatus = {
  PENDING: "PENDING", 
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  ELIMINATED: "ELIMINATED"
};

