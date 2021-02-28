class UnitOfWork
{
    constructor()
    {
        this.memberRepostitory = new MemberRepository();
        this.transactionLogRepository = new TransactionLogRepository();
        this.settingRepository = new SettingRepository();
       // this.paymentHandler =  new PaymentHandler();
    }
}