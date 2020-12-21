var Helper = function()
{
    this.IsMemberExpired = async (member) =>
    {
    var rows = await GetRowObjectsByColumns(memberIdColumnNumber,memberStatusColumnName);

    return rows.filter((x)=>x.MemberId == member.MemberId && x.Status == MemberStatus.ACTIVE).length > 0;
    }
}

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};


