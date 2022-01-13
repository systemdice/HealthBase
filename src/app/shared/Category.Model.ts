export class CategoryModel{
    public Id: number;
    public ExpenseCategory : string;
    CategoryType : string;
    CategoryStatus : string;
    UnqueID:string;
    Name:string;
}

export class CategoryFilterModel{
   UnqueID :string;

       Notes :string;

       CategoryName :string;
       CategoryType :string;
       CategoryStatus :string;

       Date :string;
}

export class TimesheetModel{
    public Id: number;
    public TimesheetCategory : string;
    UnqueID:string;
    Name:string;
}