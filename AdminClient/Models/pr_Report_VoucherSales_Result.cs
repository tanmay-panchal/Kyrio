//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AdminClient.Models
{
    using System;
    
    public partial class pr_Report_VoucherSales_Result
    {
        public System.DateTime InvoiceDate { get; set; }
        public string InvoiceNo { get; set; }
        public long InvoiceID { get; set; }
        public string ClientName { get; set; }
        public Nullable<long> ClientID { get; set; }
        public Nullable<decimal> IssuedValue { get; set; }
        public Nullable<decimal> Discount { get; set; }
        public Nullable<decimal> TotalSales { get; set; }
    }
}
