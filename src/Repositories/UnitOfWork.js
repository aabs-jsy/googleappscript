class UnitOfWork
{
    constructor()
    {
        this.memberRepostitory = new MemberRepository();
        this.receiptLogRepository = new ReceiptLogRepository();
        this.settingRepository = new SettingRepository();
    }
}