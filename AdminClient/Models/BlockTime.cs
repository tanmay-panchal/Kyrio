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
    
    public partial class BlockTime
    {
        public long BlockTimeID { get; set; }
        public long BusinessID { get; set; }
        public long LocationID { get; set; }
        public long StaffID { get; set; }
        public System.DateTime DateWorking { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public string Description { get; set; }
    }
}
