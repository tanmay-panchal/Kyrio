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
    
    public partial class V_MESSAGE
    {
        public long MessageID { get; set; }
        public long BusinessID { get; set; }
        public System.DateTime TimeSent { get; set; }
        public Nullable<long> ClientID { get; set; }
        public string ClientName { get; set; }
        public Nullable<long> AppointmentID { get; set; }
        public string AppointmentNo { get; set; }
        public string SendFrom { get; set; }
        public string Destination { get; set; }
        public string MessageType { get; set; }
        public string MessageSubject { get; set; }
        public string MessageBody { get; set; }
        public string MessageStatus { get; set; }
        public Nullable<long> UserCreate { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string TimeSentString { get; set; }
        public string CreateDateString { get; set; }
        public int Retry { get; set; }
    }
}
