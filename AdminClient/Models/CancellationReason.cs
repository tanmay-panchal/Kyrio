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
    
    public partial class CancellationReason
    {
        public long CancellationReasonID { get; set; }
        public long BusinessID { get; set; }
        public string CancellationReasonName { get; set; }
        public bool IsDefault { get; set; }
        public int SortOrder { get; set; }
        public long UserCreate { get; set; }
        public System.DateTime CreateDate { get; set; }
        public Nullable<long> UserModify { get; set; }
        public Nullable<System.DateTime> ModifyDate { get; set; }
    }
}