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
    
    public partial class pr_Report_PaymentsLog_Result
    {
        public System.DateTime PaymentDate { get; set; }
        public long PaymentNo { get; set; }
        public string LocationName { get; set; }
        public Nullable<System.DateTime> InvoiceDate { get; set; }
        public string InvoiceNo { get; set; }
        public string ClientName { get; set; }
        public string ClientID { get; set; }
        public string Staff { get; set; }
        public string InvoiceType { get; set; }
        public string PaymentTypeName { get; set; }
        public decimal PaymentAmount { get; set; }
        public Nullable<long> InvoiceID { get; set; }
    }
}
