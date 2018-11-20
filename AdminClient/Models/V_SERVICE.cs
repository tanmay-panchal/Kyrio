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
    
    public partial class V_SERVICE
    {
        public long ServiceID { get; set; }
        public long BusinessID { get; set; }
        public long ServiceGroupID { get; set; }
        public string ServiceName { get; set; }
        public string PricingType { get; set; }
        public int TreatmentType { get; set; }
        public string AvailableFor { get; set; }
        public string ExtraTimeType { get; set; }
        public Nullable<int> ExtraTimeDuration { get; set; }
        public Nullable<long> TaxID { get; set; }
        public decimal TaxRate { get; set; }
        public bool EnableCommission { get; set; }
        public bool ResourceRequired { get; set; }
        public bool EnableOnlineBookings { get; set; }
        public bool EnableVoucherSales { get; set; }
        public string VoucherExpiryPeriod { get; set; }
        public string ServiceDescription { get; set; }
        public long UserCreate { get; set; }
        public System.DateTime CreateDate { get; set; }
        public Nullable<long> UserModify { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
        public int SortOrder { get; set; }
        public Nullable<int> Duration { get; set; }
        public Nullable<decimal> RetailPrice { get; set; }
        public Nullable<decimal> SpecialPrice { get; set; }
        public string Caption { get; set; }
        public string ServiceGroupName { get; set; }
        public Nullable<int> GroupSortOrder { get; set; }
        public string AppointmentColor { get; set; }
        public string DurationName { get; set; }
    }
}