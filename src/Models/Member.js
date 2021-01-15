class Member {
  constructor() {
    this.sheet = DataProvider.GetSheetByName(SheetDcoument.MEMBERS);
  }

  MakePayment(payerMemberId, payeeMemberId, generatedOn) {
    let payerMemberIdRowNumber = new MemberSheet().GetRowNumberByMemberId(payerMemberId);
    let ExpiredPayeeMemberIdColumnNumber = new MemberSheet().GetColumnNumberByExpiredMemberId(payeeMemberId);

    console.log(payerMemberIdRowNumber + '  ----  ' + ExpiredPayeeMemberIdColumnNumber)

    this.sheet.getRange(payerMemberIdRowNumber, ExpiredPayeeMemberIdColumnNumber).setValue(generatedOn);

  }

  SetExpired(memberId) {
    // get memberdata
    // validate if memeber is already expired/eliminated or not?
    // set expired
    // save

    var memberSheet = new MemberSheet();

    var allMemberRows = memberSheet.GetRowObjectsByColumns();

    if (!DataProvider.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {

      var payerMember = allMemberRows
        .filter(row => row[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberId.header] == memberId)[0];

      if (payerMember.Status != MemberStatus.ACTIVE) {
        throw new Error(ErrorCodes.ERRORCODE1001.Code);
      }

      payerMember.Status = MemberStatus.EXPIRED;
      payerMember.ExpiredOn = Utility.GetCurrentDateTime();

      this.UpdateMember(payerMember)

      memberSheet.SetExpiredStyleOnMemberRow(memberId)
    }
  }

  SetEliminated(eliminatedByPayeeMemberId, payerMemberId) {
    // get memberdata
    // validate if memeber is already expired/eliminated or not?
    // set expired
    // save

    var memberSheet = new MemberSheet();

    var allMemberRows = memberSheet.GetRowObjectsByColumns();

    if (!DataProvider.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) {

      var payerMember = allMemberRows
        .filter(row => row[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberId.header] == payerMemberId)[0];

      if (payerMember.Status != MemberStatus.ACTIVE && payerMember.Status != MemberStatus.PENDING) return false;

      payerMember.Status = MemberStatus.ELIMINATED;
      payerMember.EliminatedOn = Utility.GetCurrentDateTime();

      //let eliminatedByPayeeMemberColumnNumber = memberSheet.GetColumnNumberByExpiredMemberId(eliminatedByPayeeMemberId);
      //let lastColumnOfMemberSheet = memberSheet.lastColumnNumber;

      // for (let index = eliminatedByPayeeMemberColumnNumber-1; index < lastColumnOfMemberSheet; index++) {
      //   payerMember[memberSheetHeaderRow[index]] = 'Eliminated';
      // }

      this.UpdateMember(payerMember)

      return true;
    }
  }

  UpdateMember(member, includingExpiredMemberColumns = false) {
    var memberSheet = new MemberSheet();
    var memberRowNumber = memberSheet.GetRowNumberByMemberId(member.MemberId);

    // if (includingExpiredMemberColumns) {
    //   let headerRow = memberSheet.GetRowObjectsByColumns(memberSheet.headerRowNumber, 1);
    //   var memberSheetHeaderColumnList = Utility.ObjectPropertiesToList(headerRow[memberSheet.headerRowNumber - 1]);

    //   memberSheetHeaderColumnList = memberSheetHeaderColumnList.filter(function (item, pos) {
    //     return memberSheetHeaderColumnList.indexOf(item) == pos;
    //   })

    //   memberSheetHeaderColumnList.forEach((headerColumn, index) => {
    //     memberSheet.SetCellValue(member[headerColumn], memberRowNumber, index + 1)
    //   });
    // }
    // else {

      var memberSheetHeaderColumnList = Utility.ObjectPropertiesToList(AppConfig.SheetColumnHeaderAndIndexes.MemberSheet);

      let updatingRange = [];

      memberSheetHeaderColumnList.forEach(headerColumn => {
        updatingRange.push(member[headerColumn.header]);
        //memberSheet.SetCellValue(member[headerColumn.header], memberRowNumber, headerColumn.index + 1)
      });

      memberSheet.sheet.getRange(memberRowNumber, 1, 1, memberSheetHeaderColumnList.length ).setValues([updatingRange]);

      
    //}
  }

 static UpdateMembers(members) {
    var memberSheet = new MemberSheet();
    
    var memberSheetHeaderColumnList = Utility.ObjectPropertiesToList(AppConfig.SheetColumnHeaderAndIndexes.MemberSheet);

      members.forEach((member,memberRowNumber)=>
        {
          let memberRowRange = [];

          memberSheetHeaderColumnList.forEach(headerColumn => {
            memberRowRange.push(member[headerColumn.header]);
          });
          memberSheet.sheet.getRange(memberRowNumber + 2, 1, 1, memberSheetHeaderColumnList.length ).setValues([memberRowRange]);
        }
      );
  }

  GetMemberById(memberId) 
  {
    var memberSheet = new MemberSheet();
    var allMemberRows = memberSheet.GetRowObjectsByColumns();

    if (!DataProvider.IsValueNullEmptyUndefied(allMemberRows) && allMemberRows.length > 0) 
    {
      return allMemberRows
        .filter(row => row[AppConfig.SheetColumnHeaderAndIndexes.MemberSheet.MemberId.header] == memberId)[0];
    }

    return null;
  }
}


