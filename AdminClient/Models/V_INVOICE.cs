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
    
    public partial class V_INVOICE
    {
        public long InvoiceID { get; set; }
        public long BusinessID { get; set; }
        public Nullable<long> AppointmentID { get; set; }
        public string InvoiceNo { get; set; }
        public System.DateTime InvoiceDate { get; set; }
        public string InvoiceStatus { get; set; }
        public Nullable<System.DateTime> DueDate { get; set; }
        public long LocationID { get; set; }
        public long ClientID { get; set; }
        public string ClientName { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TipAmount { get; set; }
        public decimal Total { get; set; }
        public decimal TotalPayment { get; set; }
        public decimal Balance { get; set; }
        public decimal Change { get; set; }
        public Nullable<long> PaymentReceivedBy { get; set; }
        public string Notes { get; set; }
        public long UserCreate { get; set; }
        public System.DateTime CreateDate { get; set; }
        public Nullable<long> UserModify { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
        public string Channel { get; set; }
        public string InvoiceType { get; set; }
        public string LocationName { get; set; }
        public decimal SubTotalBeForeTax { get; set; }
        public decimal TotalWithTip { get; set; }
        public string PaymentReceivedByName { get; set; }
        public bool HasRefund { get; set; }
        public Nullable<long> RefundInvoiceID { get; set; }
        public string UserCreateName { get; set; }
        public Nullable<long> RefInvoiceID { get; set; }
        public string InvoiceDateString { get; set; }
        public string DueDateString { get; set; }
        public string CreateDateString { get; set; }
        public string ModifyDateString { get; set; }
    }
}
