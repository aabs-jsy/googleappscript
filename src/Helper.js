var Helper = function()
{
    this.IsMemberExpired = async (member) =>
    {
    var rows = await GetRowObjectsByColumns(memberIdColumnNumber,memberStatusColumnName);

    return rows.filter((x)=>x.MemberId == member.MemberId && x.Status == MemberStatus.ACTIVE).length > 0;
    }
}