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
    
    public partial class V_APPOINTMENT_REMINDER
    {
        public long AppointmentID { get; set; }
        public long BusinessID { get; set; }
        public string MobileNumberDialCode { get; set; }
        public string MobileNumber { get; set; }
        public string AppointmentNotificationType { get; set; }
        public Nullable<System.DateTime> StartTime { get; set; }
        public string config_reminders_send_by { get; set; }
        public Nullable<int> config_reminders_advance_period { get; set; }
        public Nullable<System.DateTime> ToDay { get; set; }
        public Nullable<int> DiffMinute { get; set; }
        public string Status { get; set; }
    }
}
