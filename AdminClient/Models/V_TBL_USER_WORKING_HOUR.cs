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
    
    public partial class V_TBL_USER_WORKING_HOUR
    {
        public long BusinessID { get; set; }
        public long LocationID { get; set; }
        public long UserID { get; set; }
        public short DayOfWeek { get; set; }
        public Nullable<System.DateTimeOffset> DateWorking { get; set; }
        public Nullable<System.DateTimeOffset> Shift1Start { get; set; }
        public Nullable<System.DateTimeOffset> Shift1End { get; set; }
        public Nullable<System.DateTimeOffset> Shift2Start { get; set; }
        public Nullable<System.DateTimeOffset> Shift2End { get; set; }
        public int BreakTimeInMinutes { get; set; }
        public bool IsRepeat { get; set; }
        public string RepeatType { get; set; }
        public Nullable<System.DateTime> EndRepeat { get; set; }
        public int WorkingTimeInMinutes { get; set; }
    }
}
