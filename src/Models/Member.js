class Member {
  constructor() {
    this.sheet = DataProvider.GetSheetByName(SheetDcoument.MEMBERS);
  }

  MakePayment(payerMemberId, payeeMemberId, generatedOn)
  { 
    let payerMemberIdRowNumber = new MemberSheet().GetRowNumberByMemberId(payerMemberId);
    let ExpiredPayeeMemberIdColumnNumber = new MemberSheet().GetColumnNumberByExpiredMemberId(payeeMemberId);
    
    console.log(payerMemberIdRowNumber +'  ----  '+ ExpiredPayeeMemberIdColumnNumber)

   this.sheet.getRange(payerMemberIdRowNumber,ExpiredPayeeMemberIdColumnNumber).setValue(generatedOn);
   
  }

  SetExpired(memberId)
  {
     // get memberdata
     // validate if memeber is already expired or not?
     // set expired
     // save
  }

}

const MemberStatus = {
  PENDING: "PENDING", 
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  ELIMINATED: "ELIMINATED"
};

