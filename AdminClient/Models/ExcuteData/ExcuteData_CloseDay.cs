using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_CloseDay : EntityHelp<ClosedDate>
    {
        public static List<Object> GetDataCloseDate(long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            long countAllLocation = excute.Locations.Count(n => n.BusinessID == BusinessID);
            List<Object> result = (from c in excute.ClosedDates
                                   join l in (from a in excute.ClosedDate_Location
                                              join b in excute.Locations on a.LocationID equals b.LocationID into lsB
                                              from b in lsB.DefaultIfEmpty()
                                              select new { a.LocationID, b.LocationName, a.ClosedDateID, a.BusinessID }) on c.ClosedDateID equals l.ClosedDateID into lsL
                                   from l in lsL.DefaultIfEmpty()
                                   group l by c into g
                                   where g.Key.BusinessID == BusinessID && g.Any(n => n.BusinessID == BusinessID)
                                   select new { g.Key.ClosedDateID, g.Key.StartDate, g.Key.EndDate, g.Key.NoOfDays, g.Key.Description, Locations = g.Select(n => new { n.LocationID, n.LocationName }) }).AsEnumerable()
                                   .Select(n => new
                                   {
                                       n.ClosedDateID,
                                       n.StartDate,
                                       n.EndDate,
                                       n.NoOfDays,
                                       n.Description,
                                       Locations = n.Locations,
                                       LocationName = n.Locations.Count() == countAllLocation ? "All locations" : string.Join(" ,", n.Locations.Select(m => m.LocationName).ToArray())
                                   }).ToList<Object>();
            return result;
        }
        public static List<ClosedDate> GetDataCloseDateBaseLocationId(long LocationId, long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            List<ClosedDate> result = (from n in excute.ClosedDate_Location
                                       join m in excute.ClosedDates on new { n.ClosedDateID, n.BusinessID } equals new { m.ClosedDateID, m.BusinessID } into lsM
                                       from m in lsM.DefaultIfEmpty()
                                       where n.BusinessID == BusinessID && m.BusinessID == BusinessID && n.LocationID == LocationId
                                       select m).ToList();
            return result;
        }
    }
}