using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_UserWorkingHour : EntityHelp<UserWorkingHour>
    {
        public static List<UserWorkingHour> GetUserWorkingHour(long BusinessID, DateTime Start, DateTime End, List<long> StaffId, long LocationID)
        {
            ModelEntity excute = new ModelEntity();
            List<UserWorkingHour> result = (from w in excute.UserWorkingHours.Where(n => n.BusinessID == BusinessID)
                                            where w.LocationID == LocationID && w.BusinessID == BusinessID && StaffId.Any(m => m == w.UserID) && Start <= w.DateWorking && w.DateWorking < End
                                            && !(from n in excute.ClosedDate_Location.Where(n => n.BusinessID == BusinessID)
                                                 join m in excute.ClosedDates.Where(n => n.BusinessID == BusinessID) on new { n.ClosedDateID, n.BusinessID } equals new { m.ClosedDateID, m.BusinessID } into lsM
                                                 from m in lsM.DefaultIfEmpty()
                                                 where n.BusinessID == BusinessID && n.LocationID == LocationID
                                                 select m).Any(n => n.StartDate <= w.DateWorking && n.EndDate >= w.DateWorking)
                                            select w).OrderBy(n => n.DateWorking).ToList();
            return result;
        }
    }
}