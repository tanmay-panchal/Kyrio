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
    
    public partial class ProductStockMovement
    {
        public long ProductStockMovementID { get; set; }
        public long BusinessID { get; set; }
        public long ProductID { get; set; }
        public Nullable<long> SupplierID { get; set; }
        public System.DateTime TransactionTime { get; set; }
        public long LocationID { get; set; }
        public long UserCreate { get; set; }
        public string StockType { get; set; }
        public string Action { get; set; }
        public int Adjustment { get; set; }
        public decimal AdjustmentCost { get; set; }
        public decimal CostPrice { get; set; }
        public int OnHand { get; set; }
        public decimal OnHandCost { get; set; }
        public Nullable<long> OrderID { get; set; }
        public Nullable<long> InvoiceID { get; set; }
        public Nullable<long> InvoiceDetailID { get; set; }
        public string RefNo { get; set; }
    }
}