using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_Resource : EntityHelp<Resource>
    {
        public static List<Object> GetEntityBaseBusinessIDGroupLocation(long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            List<Object> entity = (from l in excute.Locations
                                   join r in excute.Resources.Where(n => n.BusinessID == BusinessID) on l.LocationID equals r.LocationID into lsR
                                   from r in lsR.DefaultIfEmpty()
                                   group r by l into g
                                   where g.Key.BusinessID == BusinessID
                                   select new { g.Key.LocationID, g.Key.LocationName, Resources = g.Select(n => n) }).ToList<Object>();
            return entity;
        }
        public static List<Resource> GetEntityBaseLocationServiceNotPagging(long BusinessID, long LocationID, long ServiceID)
        {
            ModelEntity excute = new ModelEntity();
            List<Resource> result = (from sr in excute.ServiceResources
                                     join r in excute.Resources on new { sr.BusinessID, sr.ResourceID } equals new { r.BusinessID, r.ResourceID } into lsR
                                     from r in lsR.DefaultIfEmpty()
                                     join s in excute.Services on new { sr.ServiceID, sr.BusinessID } equals new { s.ServiceID, s.BusinessID } into lsS
                                     from s in lsS.DefaultIfEmpty()
                                     where sr.BusinessID == BusinessID && sr.LocationID == LocationID && sr.ServiceID == ServiceID && s.ResourceRequired
                                     orderby r.SortOrder
                                     select r).ToList();
            return result;
        }
        public static List<Resource> GetEntityBaseLocationService(long BusinessID, long LocationID, long ServiceID, string search, int pageIndex, int pageSize)
        {
            ModelEntity excute = new ModelEntity();
            List<Resource> result = (from sr in excute.ServiceResources
                                     join r in excute.Resources on new { sr.BusinessID, sr.ResourceID } equals new { r.BusinessID, r.ResourceID } into lsR
                                     from r in lsR.DefaultIfEmpty()
                                     join s in excute.Services on new { sr.ServiceID, sr.BusinessID } equals new { s.ServiceID, s.BusinessID } into lsS
                                     from s in lsS.DefaultIfEmpty()
                                     where sr.BusinessID == BusinessID && sr.LocationID == LocationID && sr.ServiceID == ServiceID && (r.ResourceName ?? "").Contains(search) && s.ResourceRequired
                                     orderby r.SortOrder
                                     select r).Skip(pageIndex).Take(pageSize).ToList();
            return result;
        }
        public static long CountEntityBaseLocationService(long BusinessID, long LocationID, long ServiceID, string search)
        {
            ModelEntity excute = new ModelEntity();
            long result = (from sr in excute.ServiceResources
                           join r in excute.Resources on new { sr.BusinessID, sr.ResourceID } equals new { r.BusinessID, r.ResourceID } into lsR
                           from r in lsR.DefaultIfEmpty()
                           join s in excute.Services on new { sr.ServiceID, sr.BusinessID } equals new { s.ServiceID, s.BusinessID } into lsS
                           from s in lsS.DefaultIfEmpty()
                           where sr.BusinessID == BusinessID && sr.LocationID == LocationID && sr.ServiceID == ServiceID && (r.ResourceName ?? "").Contains(search) && s.ResourceRequired
                           orderby r.SortOrder
                           select r).Count();
            return result;
        }
    }
}