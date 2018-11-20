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
    
    public partial class User
    {
        public long UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string MobileNumber { get; set; }
        public System.DateTime CreateDate { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
        public short Status { get; set; }
        public long BusinessID { get; set; }
        public int RoleID { get; set; }
        public bool EnableAppointmentBooking { get; set; }
        public string Notes { get; set; }
        public System.DateTime StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public string AppointmentColor { get; set; }
        public string DialCode { get; set; }
        public bool FirstLogin { get; set; }
        public decimal ServiceCommission { get; set; }
        public decimal ProductCommission { get; set; }
        public decimal VoucherSalesCommission { get; set; }
        public int SortOrder { get; set; }
        public Nullable<long> UserCreate { get; set; }
        public Nullable<long> UserModify { get; set; }
    }
}
