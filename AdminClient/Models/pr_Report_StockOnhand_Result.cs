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
    
    public partial class pr_Report_StockOnhand_Result
    {
        public string ProductName { get; set; }
        public string LocationName { get; set; }
        public int OnHand { get; set; }
        public decimal OnHandCost { get; set; }
        public Nullable<decimal> AVGCost { get; set; }
        public Nullable<decimal> TotalRetailValue { get; set; }
        public decimal RetailPrice { get; set; }
        public int ReorderPoint { get; set; }
        public int ReorderQty { get; set; }
        public string Barcode { get; set; }
        public string SKU { get; set; }
        public string CategoryName { get; set; }
        public string BrandName { get; set; }
        public string SupplierName { get; set; }
    }
}