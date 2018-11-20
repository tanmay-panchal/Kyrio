using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_Location : EntityHelp<Location>
    {
        public static List<Location> GetDataComboboxSchelude(long BusinessId)
        {
            ModelEntity excuteData = new ModelEntity();
            List<Location> result = (from uc in excuteData.UserLocations.Where(n => n.BusinessID == BusinessId)
                                     join u in excuteData.Users.Where(n => n.BusinessID == BusinessId) on new { uc.UserID, uc.BusinessID } equals new { u.UserID, u.BusinessID } into lsU
                                     from u in lsU.DefaultIfEmpty()
                                     join l in excuteData.Locations.Where(n => n.BusinessID == BusinessId) on new { uc.LocationID, uc.BusinessID } equals new { l.LocationID, l.BusinessID } into lsL
                                     from l in lsL.DefaultIfEmpty()
                                     where uc.BusinessID == BusinessId && u.EnableAppointmentBooking && l.EnableOnlineBooking
                                     select l).Distinct().OrderBy(n => n.SortOrder).ToList();
            return result;
        }
    }
}