var Member = function(memberId)
{
  this.MemberId = memberId;
  
  this.ChangeStatus = function(newStatus)
  {
  }
}


const MemberStatus = {
  PENDING: "PENDING", 
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  ELIMINATED: "ELIMINATED"
};

