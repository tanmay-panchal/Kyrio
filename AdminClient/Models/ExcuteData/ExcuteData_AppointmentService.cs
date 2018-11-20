using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_AppointmentService : EntityHelp<AppointmentService>
    {
        public static List<Object> GetDataBaseAppointmentId(long AppointmentID)
        {
            ModelEntity excute = new ModelEntity();
            var query = (from s in excute.V_TBL_APPOINTMENT_SERVICE
                         join u in excute.Users on s.StaffID equals u.UserID into lsS
                         from u in lsS.DefaultIfEmpty()
                         join resource in excute.Resources on s.ResourceID equals resource.ResourceID into lsResource
                         from resource in lsResource.DefaultIfEmpty()
                         where s.AppointmentID == AppointmentID
                         select new
                         {
                             s.AppointmentServiceID,
                             s.ServiceID,
                             s.ServiceName,
                             s.RetailPrice,
                             s.SpecialPrice,
                             s.Price,
                             s.StartTime,
                             StartTimeInSecond = s.StartTime.Value.Minute * 60 + s.StartTime.Value.Hour * 3600,
                             s.Duration,
                             s.StaffID,
                             s.ResourceID,
                             ResourceName = resource == null ? "" : resource.ResourceName,
                             s.SortOrder,
                             s.RefNo,
                             s.IsRequest,
                             StaffName = u.FirstName + " " + u.LastName,
                         }).OrderBy(n => n.SortOrder);
            return query.ToList<Object>();
        }
        public static List<Object> GetItemAllowPagging(long BusinessID, int pageIndex, int pageSize)
        {
            ModelEntity excute = new ModelEntity();
            List<Object> result = (from sv in excute.V_TBL_APPOINTMENT_SERVICE
                                   where sv.BusinessID == BusinessID
                                   join s in (from a in excute.Appointments
                                              join b in excute.Locations on new { a.LocationID, a.BusinessID } equals new { b.LocationID, b.BusinessID }
                                              select new { a.BusinessID, a.AppointmentID, a.LocationID, a.Status, b.LocationName, a.ModifyDate, a.ClientName, a.ClientID, a.CreateDate }) on new { sv.AppointmentID, sv.BusinessID } equals new { s.AppointmentID, s.BusinessID } into lsS
                                   from s in lsS.DefaultIfEmpty()
                                   join u in excute.Users on new { sv.StaffID, sv.BusinessID } equals new { StaffID = u.UserID, u.BusinessID } into lsU
                                   from u in lsU.DefaultIfEmpty()
                                   where sv.BusinessID == BusinessID
                                   select new
                                   {
                                       s.LocationID,
                                       s.LocationName,
                                       s.Status,
                                       s.AppointmentID,
                                       s.ClientID,
                                       s.ClientName,
                                       s.ModifyDate,
                                       s.CreateDate,
                                       sv.AppointmentServiceID,
                                       sv.ServiceID,
                                       sv.ServiceName,
                                       StartTime = sv.StartTime.HasValue ? (sv.StartTime.Value.Year.ToString() + "-" + (sv.StartTime.Value.Month <= 9 ? ("0" + sv.StartTime.Value.Month.ToString()) : sv.StartTime.Value.Month.ToString()) + "-" + (sv.StartTime.Value.Day <= 9 ? ("0" + sv.StartTime.Value.Day.ToString()) : sv.StartTime.Value.Day.ToString()) + "T" + ((sv.StartTime.Value.Hour <= 9 ? "0" : "") + sv.StartTime.Value.Hour.ToString()) + ":" + ((sv.StartTime.Value.Minute <= 9 ? "0" : "") + sv.StartTime.Value.Minute) + ":00") : "",
                                       StartTimeInSecond = sv.StartTime.HasValue ? (sv.StartTime.Value.Minute * 60 + sv.StartTime.Value.Hour * 3600) : 0,
                                       sv.EndTime,
                                       sv.StaffID,
                                       sv.Duration,
                                       StaffName = (u.FirstName ?? "") + " " + (u.LastName ?? ""),
                                   }).OrderBy(n => n.ModifyDate ?? n.CreateDate).Skip(pageIndex).Take(pageSize).ToList<Object>();
            return result;
        }
        public static List<V_APPOINTMENT_SERVICE> GetDataSearchScheul(string search, long BusinessID, DateTime date)
        {
            ModelEntity excute = new ModelEntity();
            List<V_APPOINTMENT_SERVICE> result = new List<V_APPOINTMENT_SERVICE>();
            result = (from ap in excute.V_APPOINTMENT_SERVICE
                      join c in excute.V_CLIENT on ap.ClientID equals c.ClientID into lsC
                      from c in lsC.DefaultIfEmpty()
                      where (ap.ClientName.Contains(search) || ap.RefNo.Contains(search) || c.MobileNumber.Contains(search)) && ap.StartTime >= date && ap.BusinessID == BusinessID
                      select ap).ToList<V_APPOINTMENT_SERVICE>();
            return result;
        }
        public static Boolean CheckTimeForScheulReschedule(DateTime StartTime, long BusinessID, long StaffId, long LocationID)
        {
            ModelEntity excute = new ModelEntity();
            Boolean result = (from s in excute.Appointments
                              join sv in excute.V_APPOINTMENT_SERVICE on new { s.BusinessID, s.AppointmentID } equals new { sv.BusinessID, sv.AppointmentID } into lsSV
                              from sv in lsSV.DefaultIfEmpty()
                              where s.BusinessID == BusinessID && sv.StaffID == StaffId && s.LocationID == LocationID && sv.StartTime <= StartTime && StartTime < sv.EndTime
                              select s).Any();
            return result;
        }
    }
}