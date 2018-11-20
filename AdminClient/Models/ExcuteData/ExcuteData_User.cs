using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web;
using AdminClient.Models;
namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_User : EntityHelp<User>
    {
        public static List<User> GetUserByLocation(int LocationID, long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            List<User> result = (from l in excute.UserLocations
                                 join u in excute.Users on l.UserID equals u.UserID into lsU
                                 from u in lsU.DefaultIfEmpty()
                                 where l.LocationID == LocationID && u.BusinessID == BusinessID && l.BusinessID == BusinessID
                                 && u.Status == 1
                                 && u.EnableAppointmentBooking == true
                                 select u).OrderBy(n => n.UserID).ToList<User>();
            return result;
        }
        public static List<User> GetUserByLocationPagging(string search, int LocationID, long BusinessID, int pageIndex, int pageSize)
        {
            ModelEntity excute = new ModelEntity();
            List<User> result = (from l in excute.UserLocations
                                 join u in excute.Users on l.UserID equals u.UserID into lsU
                                 from u in lsU.DefaultIfEmpty()
                                 where l.LocationID == LocationID && u.BusinessID == BusinessID && l.BusinessID == BusinessID
                                 && u.Status == 1
                                 && (u.FirstName.Contains(search) || u.LastName.Contains(search) || u.Email.Contains(search) || u.MobileNumber.Contains(search))
                                 select u).OrderBy(n => n.UserID).Skip(pageIndex).Take(pageSize).ToList<User>();
            return result;
        }
        public static List<User> GetUserByLocationBooking(long LocationID, long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            List<User> result = (from l in excute.UserLocations
                                 join u in excute.Users on l.UserID equals u.UserID into lsU
                                 from u in lsU.DefaultIfEmpty()
                                 where l.LocationID == LocationID && u.BusinessID == BusinessID && l.BusinessID == BusinessID
                                 && u.Status == 1 && u.EnableAppointmentBooking == true
                                 select u).OrderBy(n => n.UserID).ToList<User>();
            return result;
        }
        public static List<User> GetUserByLocationBookingPagging(string search, int LocationID, long BusinessID, int pageIndex, int pageSize)
        {
            ModelEntity excute = new ModelEntity();
            List<User> result = (from l in excute.UserLocations
                                 join u in excute.Users on l.UserID equals u.UserID into lsU
                                 from u in lsU.DefaultIfEmpty()
                                 where l.LocationID == LocationID && u.BusinessID == BusinessID && l.BusinessID == BusinessID
                                 && u.Status == 1
                                 && u.EnableAppointmentBooking == true
                                 && (u.FirstName.Contains(search) || u.LastName.Contains(search) || u.Email.Contains(search) || u.MobileNumber.Contains(search))
                                 select u).OrderBy(n => n.UserID).Skip(pageIndex).Take(pageSize).ToList<User>();
            return result;
        }
        public static long CountUserByLocationPagging(string search, int LocationID, long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            long result = (from l in excute.UserLocations
                           join u in excute.Users on l.UserID equals u.UserID into lsU
                           from u in lsU.DefaultIfEmpty()
                           where l.LocationID == LocationID && u.BusinessID == BusinessID && l.BusinessID == BusinessID
                           && u.Status == 1
                           && (u.FirstName.Contains(search) || u.LastName.Contains(search) || u.Email.Contains(search) || u.MobileNumber.Contains(search))
                           select u).Count();
            return result;
        }
        public static long CountUserByLocationBookingPagging(string search, int LocationID, long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            long result = (from l in excute.UserLocations
                           join u in excute.Users on l.UserID equals u.UserID into lsU
                           from u in lsU.DefaultIfEmpty()
                           where l.LocationID == LocationID && u.BusinessID == BusinessID && l.BusinessID == BusinessID
                           && u.Status == 1
                           && u.EnableAppointmentBooking == true
                           && (u.FirstName.Contains(search) || u.LastName.Contains(search) || u.Email.Contains(search) || u.MobileNumber.Contains(search))
                           select u).Count();
            return result;
        }
        public static List<Object> GetUserCheckUserLocation(int LocationID, long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            List<Object> result = (from u in excute.Users
                                   where u.BusinessID == BusinessID
                                   select new
                                   {
                                       u.UserID,
                                       u.FirstName,
                                       u.LastName,
                                       ExcitLocation = excute.UserLocations.Any(n => n.UserID == u.UserID && n.LocationID == LocationID && n.BusinessID == BusinessID)
                                   }).OrderBy(n => n.UserID).ToList<Object>();
            return result;
        }
        public static List<Object> GetUserGroupUserWorking(int LocationID, long BusinessID, int UserID, DateTime DateFrom, DateTime DateTo)
        {
            DateFrom = DateFrom.Date;
            DateTo = DateTo.Date;
            ModelEntity excute = new ModelEntity();
            List<Object> result = (from u in (from a in excute.UserLocations
                                              join b in excute.Users on new { a.BusinessID, a.UserID } equals new { b.BusinessID, b.UserID } into lsB
                                              from b in lsB.DefaultIfEmpty()
                                              where b.EnableAppointmentBooking
                                              select new { FirstName = b.FirstName, LastName = b.LastName, a.LocationID, a.UserID, a.BusinessID })
                                   join w in excute.UserWorkingHours on new { u.UserID, u.LocationID, u.BusinessID } equals new { w.UserID, w.LocationID, w.BusinessID } into lsW
                                   from w in lsW.DefaultIfEmpty()
                                   group w by u into g
                                   where g.Key.BusinessID == BusinessID && (g.Key.UserID == UserID || UserID == 0) && g.Key.LocationID == LocationID
                                   select new
                                   {
                                       g.Key.FirstName,
                                       g.Key.LastName,
                                       g.Key.UserID,
                                       g.Key.LocationID,
                                       g.Key.BusinessID,
                                       WorkingHours = g.Where(n => n.DateWorking >= DateFrom && n.DateWorking <= DateTo).OrderBy(n => n.DateWorking),
                                       Sum = g.Where(n => n.DateWorking >= DateFrom && n.DateWorking <= DateTo).Count() > 0 ? g.Where(n => n.DateWorking >= DateFrom && n.DateWorking <= DateTo).Sum(n => n.WorkingTimeInMinutes) : 0
                                   }).ToList<Object>();

            return result;
        }
        public static List<Object> GetDataTableStaffMember(long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            List<Object> result = (from u in excute.Users
                                   join r in excute.Roles on u.RoleID equals r.RoleID into lsR
                                   from r in lsR.DefaultIfEmpty()
                                   where u.BusinessID == BusinessID
                                   && u.Status == 1
                                   select new { u.StartDate, u.EndDate, u.Notes, u.ServiceCommission, u.ProductCommission, u.VoucherSalesCommission, u.UserID, u.SortOrder, u.FirstName, u.LastName, u.MobileNumber, u.Email, u.EnableAppointmentBooking, u.AppointmentColor, r.RoleName }).OrderBy(n => n.SortOrder).ToList<Object>();
            return result;
        }
        public static Object GetDataEditStaffMember(long UserID)
        {
            ModelEntity excute = new ModelEntity();
            Object result = (from u in excute.Users.Where(n => n.UserID == UserID)
                             join r in excute.Roles on u.RoleID equals r.RoleID into lsR
                             from r in lsR.DefaultIfEmpty()
                             join l in excute.UserLocations.Where(n => n.UserID == UserID) on new { u.UserID, u.BusinessID } equals new { l.UserID, l.BusinessID } into lsL
                             from l in lsL.DefaultIfEmpty()
                             join s in excute.ServiceStaffs.Where(n => n.UserID == UserID) on u.UserID equals s.UserID into lsS
                             from s in lsS.DefaultIfEmpty()
                             join d in excute.Dial_Code on u.DialCode equals d.DialCode into lsD
                             from d in lsD.DefaultIfEmpty()
                             group new { s, l } by new { u, r, d } into gr
                             where gr.Key.u.UserID == UserID
                             select new { User = gr.Key.u, Role = gr.Key.r, DialCode = gr.Key.d.CountryCode, UserLocations = gr.Where(n => n.l != null).Select(n => n.l), ServiceStaffs = gr.Where(n => n.s != null).Select(n => n.s) }).FirstOrDefault();
            return result;
        }
        public static List<User> GetDataComboboxUser(long BusinessID, int LocationID)
        {
            ModelEntity excute = new ModelEntity();
            List<User> result = (from u in excute.Users.Where(n => n.BusinessID == BusinessID)
                                 join u_l in excute.UserLocations.Where(n => n.BusinessID == BusinessID) on new { u.UserID, u.BusinessID } equals new { u_l.UserID, u_l.BusinessID } into lsUL
                                 from u_l in lsUL.DefaultIfEmpty()
                                 where u.BusinessID == BusinessID && u_l.LocationID == LocationID && u.EnableAppointmentBooking
                                 && u.Status == 1
                                 orderby u.SortOrder
                                 select u).ToList();
            return result;
        }
        public static List<User> GetDataComboboxChooseWokingStaff(long BusinessID, DateTime Date, int LocationID)
        {
            ModelEntity excute = new ModelEntity();
            List<User> result = (from u in excute.Users.Where(n => n.BusinessID == BusinessID)
                                 join u_l in excute.UserLocations.Where(n => n.BusinessID == BusinessID && n.LocationID == LocationID) on new { u.UserID, u.BusinessID } equals new { u_l.UserID, u_l.BusinessID } into lsUL
                                 from u_l in lsUL.DefaultIfEmpty()
                                 join w_h in excute.UserWorkingHours.Where(n => n.BusinessID == BusinessID && n.LocationID == LocationID) on new { u.UserID, u.BusinessID } equals new { w_h.UserID, w_h.BusinessID } into lsWH
                                 from w_h in lsWH.DefaultIfEmpty()
                                 join a_p in (from a in excute.AppointmentServices.Where(n => n.BusinessID == BusinessID)
                                              join b in excute.Appointments.Where(n => n.BusinessID == BusinessID) on new { a.AppointmentID, a.BusinessID } equals new { b.AppointmentID, b.BusinessID } into lsB
                                              from b in lsB.DefaultIfEmpty()
                                              select new { a.StaffID, a.BusinessID, b.ScheduledDate }) on new { u.UserID, u.BusinessID } equals new { UserID = a_p.StaffID, a_p.BusinessID } into lsAP
                                 from a_p in lsAP.DefaultIfEmpty()
                                 where u.BusinessID == BusinessID && u.EnableAppointmentBooking && u.Status == 1 && (a_p.ScheduledDate == Date || w_h.DateWorking == Date)
                                 orderby u.SortOrder
                                 select u).Distinct().ToList();
            return result;
        }
        public static List<User> GetDataComboboxChooseWokingStaff_V2(long BusinessID, DateTime Date, int LocationID)
        {
            ModelEntity excute = new ModelEntity();

            List<User> result1 = (from u in excute.Users.Where(n => n.BusinessID == BusinessID)
                                  join u_l in excute.UserLocations.Where(n => n.BusinessID == BusinessID && n.LocationID == LocationID) on new { u.UserID, u.BusinessID } equals new { u_l.UserID, u_l.BusinessID } into lsUL
                                  from u_l in lsUL
                                  join w_h in excute.UserWorkingHours.Where(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.DateWorking == Date) on new { u.UserID, u.BusinessID } equals new { w_h.UserID, w_h.BusinessID } into lsWH
                                  from w_h in lsWH
                                  where u.BusinessID == BusinessID && u.EnableAppointmentBooking && u.Status == 1
                                  orderby u.SortOrder
                                  select u).ToList();

            List<User> result2 = (from u in excute.Users.Where(n => n.BusinessID == BusinessID)
                                  join u_l in excute.UserLocations.Where(n => n.BusinessID == BusinessID && n.LocationID == LocationID) on new { u.UserID, u.BusinessID } equals new { u_l.UserID, u_l.BusinessID } into lsUL
                                  from u_l in lsUL
                                  join a_p in (from a in excute.AppointmentServices.Where(n => n.BusinessID == BusinessID)
                                               join b in excute.Appointments.Where(n => n.BusinessID == BusinessID && n.LocationID == LocationID) on new { a.AppointmentID, a.BusinessID } equals new { b.AppointmentID, b.BusinessID } into lsB
                                               from b in lsB
                                               select new { a.StaffID, a.BusinessID, b.ScheduledDate }) on new { u.UserID, u.BusinessID } equals new { UserID = a_p.StaffID, a_p.BusinessID } into lsAP
                                  from a_p in lsAP
                                  where u.BusinessID == BusinessID && u.EnableAppointmentBooking && u.Status == 1 && a_p.ScheduledDate == Date
                                  orderby u.SortOrder
                                  select u).ToList();

            List<User> result = result1.Concat(result2).Distinct().ToList();
            return result;
        }
        public static List<Object> GetUserBaseBussines(string search, long BusinessID, string sortColumn, string sortColumnDir)
        {
            ModelEntity excute = new ModelEntity();
            List<Object> result = (from u in excute.Users
                                   join r in excute.Roles on u.RoleID equals r.RoleID into lsR
                                   from r in lsR.DefaultIfEmpty()
                                   where u.Status == 1 && u.BusinessID == BusinessID && (u.FirstName.Contains(search) || (u.LastName ?? "").Contains(search) || (r.RoleName ?? "").Contains(search))
                                   select new { Name = u.FirstName + " " + (u.LastName ?? ""), u.UserID, CreateDate = u.CreateDate.Year + "/" + u.CreateDate.Month + "/" + u.CreateDate.Day, r.RoleName })
                                   .OrderBy((sortColumn == "" && sortColumnDir == "") ? "UserID asc" : sortColumn + " " + sortColumnDir).ToList<Object>();
            return result;
        }
    }
}