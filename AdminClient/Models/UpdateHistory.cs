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
    
    public partial class UpdateHistory
    {
        public long UpdateID { get; set; }
        public System.DateTime DateUpdate { get; set; }
        public string Subject { get; set; }
        public string Detail { get; set; }
        public string Link { get; set; }
        public bool IsShow { get; set; }
    }
}
