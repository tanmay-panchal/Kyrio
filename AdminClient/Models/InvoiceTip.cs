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
    
    public partial class InvoiceTip
    {
        public long InvoiceTipID { get; set; }
        public long InvoiceID { get; set; }
        public long BusinessID { get; set; }
        public long StaffID { get; set; }
        public decimal TipAmount { get; set; }
        public decimal TipPercent { get; set; }
        public bool TipIsAmount { get; set; }
    }
}
