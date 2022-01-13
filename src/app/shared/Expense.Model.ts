export class Expenses{
    public UnqueID:string;
    public  ExpenseAmount : string;
    public  Date : string;
    public  ExpenseCategory : string;
    public  Notes : string;
    public  CategoryName : string;
    public  CategoryType : string;
    public BusinessType:string;
}
export class Followups{
    public UnqueID:string;
    WorkStatus: string;
        BusinessType: string;
        ExpenseCategory: string;
        CategoryName:string;
        UserName: string;
        ClientName: string;
        ClientLocation: string;
        FollowupStartDate: Date;
        ClientAddress: string;
        ClientContactName: string;
        ClientContactNumber: string;
        ClientWebsite: string;
        FollowupCategory: string;
        ClientReply: string;
        ExperienceNotes: string;
        DemoRequired: string;
        DemoDate: Date;
        DemoStatus: string;
        DemoAssignedTo: string;
        InstallationRequired: string;
        InstallationRequiredDate: Date;
        InstallationStatus: string;
        InstallationAssignedTo: string;
        BasePrice: string;
        ExpectedPrice: string;
        ActualPrice: string;
        CommisionPrice: string;
        SupportAssigned: string;
        RenewalStatus :string;
        AgreementProcess:string;
        AgreementJob: string;
        Signup: string;
        ClosedBy : string;
        CurrentUserRole : string;
        ExperienceNotesHL:string;
        UpdatedBy :string;
            UpdatedRole :string;
}

export class Category{
    public UnqueID:string;
    public  CategoryName : string;
    CategoryType:string;
    public  Date : string;
    public  Notes : string;
}