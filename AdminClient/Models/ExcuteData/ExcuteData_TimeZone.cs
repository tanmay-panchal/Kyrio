using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_TimeZone : EntityHelp<Models.TimeZone>
    {
        public static Models.TimeZone GetTimeZoneBaseCountry(int countryId)
        {
            ModelEntity excute = new ModelEntity();
            Models.TimeZone result = new Models.TimeZone();
            result = (from c in excute.Countries
                      join t in excute.TimeZones on c.TimeZone equals t.TimeZoneCode into lsT
                      from t in lsT.DefaultIfEmpty()
                      where c.CountryID == countryId
                      select t).FirstOrDefault() ?? new Models.TimeZone();
            return result;
        }
    }
}