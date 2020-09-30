var Member = function(memberId)
{
  this.MemberId = memberId;
  
  this.ChangeStatus = function(newStatus)
  {
  }
}


const MemberStatus = {
  PENDING: 1, 
  ACTIVE: 2,
  EXPIRED: 3,
  ELIMINATED: 4
};

