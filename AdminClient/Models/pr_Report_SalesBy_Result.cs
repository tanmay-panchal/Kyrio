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
    
    public partial class pr_Report_SalesBy_Result
    {
        public Nullable<long> ItemID { get; set; }
        public string ItemType { get; set; }
        public string ItemName { get; set; }
        public Nullable<int> ItemsSold { get; set; }
        public Nullable<decimal> GrossSales { get; set; }
        public Nullable<decimal> Discounts { get; set; }
        public Nullable<decimal> Refunds { get; set; }
        public Nullable<decimal> NetSales { get; set; }
        public Nullable<decimal> Tax { get; set; }
        public Nullable<decimal> TotalSales { get; set; }
    }
}
