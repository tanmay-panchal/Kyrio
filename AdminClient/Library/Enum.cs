using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdminClient.Library
{
    public static class Enum
    {
        public const string APPOINTMENT_STATUS_NEW = "New";
        public const string APPOINTMENT_STATUS_COMPLETED = "Completed";
        public const string APPOINTMENT_STATUS_CANCELLED = "Cancelled";
        public const string APPOINTMENT_STATUS_NOSHOW = "NoShow";
        public const string APPOINTMENT_STATUS_CONFIRMED = "Confirmed";
        public const string APPOINTMENT_STATUS_ARRIVED = "Arrived";
        public const string APPOINTMENT_STATUS_STARTED = "Started";

        public const string GENDER_MALE = "gender_male";
        public const string GENDER_FEMALE = "gender_female";
        public const string GENDER_UNKNOWN = "gender_unknown";

        public const string STOCK_TYPE_IN = "I";
        public const string STOCK_TYPE_OUT = "O";
    }
}