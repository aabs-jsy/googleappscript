class Helper
{
    async IsMemberExpired(member) 
    {
    var rows = await GetRowObjectsByColumns(memberIdColumnNumber,memberStatusColumnName);

    return rows.filter((x)=>x.MemberId == member.MemberId && x.Status == MemberStatus.ACTIVE).length > 0;
    }

    static SanitizeApiParameters(parameters)
    {
        let returnObject = {};

        for (var key in parameters) 
        {
            returnObject[key] = parameters[key][0];
        }

        return returnObject;
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


