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
    using System.Collections.Generic;
    
    public partial class V_VOUCHER
    {
        public long VoucherID { get; set; }
        public long BusinessID { get; set; }
        public long InvoiceID { get; set; }
        public System.DateTime IssueDate { get; set; }
        public Nullable<System.DateTime> ExpireDate { get; set; }
        public Nullable<long> ClientID { get; set; }
        public string ClientName { get; set; }
        public string VoucherType { get; set; }
        public Nullable<long> ServiceID { get; set; }
        public Nullable<int> Duration { get; set; }
        public string VoucherStatus { get; set; }
        public string VoucherCode { get; set; }
        public decimal Total { get; set; }
        public decimal Redeemed { get; set; }
        public Nullable<decimal> Remaining { get; set; }
        public long UserCreate { get; set; }
        public System.DateTime CreateDate { get; set; }
        public Nullable<long> UserModify { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
        public Nullable<long> InvoiceDetailID { get; set; }
        public Nullable<long> OldInvoiceID { get; set; }
        public Nullable<long> OldInvoiceDetailID { get; set; }
        public string InvoiceNo { get; set; }
        public string ServiceName { get; set; }
        public string DurationName { get; set; }
        public Nullable<System.DateTime> RedeemedDate { get; set; }
        public Nullable<long> RedeemedInvoiceID { get; set; }
        public string RedeemedInvoiceNo { get; set; }
        public int RemainTime { get; set; }
        public string IssueDateString { get; set; }
        public string ExpireDateString { get; set; }
        public string CreateDateString { get; set; }
        public string ModifyDateString { get; set; }
        public string RedeemedDateString { get; set; }
    }
}
