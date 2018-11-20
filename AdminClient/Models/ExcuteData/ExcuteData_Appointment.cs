using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;
namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_Appointment : EntityHelp<Appointment>
    {
        public static List<Object> GetDataCalendarScheul(DateTime DateFrom, DateTime DateTo, long BusinessID, long LocationID, List<long> EmployeeIDs, List<long> ResourceIDs)
        {
            ResourceIDs = ResourceIDs ?? new List<long>();
            EmployeeIDs = EmployeeIDs ?? new List<long>();
            List<Object> result = new List<object>();
            string statusCancel = Library.Enum.APPOINTMENT_STATUS_CANCELLED;
            ModelEntity excute = new ModelEntity();
            var query = (from a_s in excute.AppointmentServices.Where(n=>n.BusinessID == BusinessID)
                         join a in (from b in excute.Appointments.Where(n => n.BusinessID == BusinessID)
                                    join c in excute.Invoices.Where(n => n.BusinessID == BusinessID) on new { b.BusinessID, InvoiceID = b.InvoiceID ?? 0 } equals new { c.BusinessID, c.InvoiceID } into lsC
                                    from c in lsC.DefaultIfEmpty()
                                    join d in excute.Clients.Where(n => n.BusinessID == BusinessID) on new { b.BusinessID, ClientID = b.ClientID ?? 0 } equals new { d.BusinessID, d.ClientID } into lsD
                                    from d in lsD.DefaultIfEmpty()
                                    select new { Appointment = b, Invoice = c, Clients = d }) on new { a_s.AppointmentID, a_s.BusinessID } equals new { a.Appointment.AppointmentID, a.Appointment.BusinessID } into lsA
                         from a in lsA.DefaultIfEmpty()
                         join r in excute.Resources.Where(n => n.BusinessID == BusinessID) on new { ResourceID = a_s.ResourceID ?? 0, BusinessID = a_s.BusinessID } equals new { ResourceID = r.ResourceID, BusinessID = r.BusinessID } into lsR
                         from r in lsR.DefaultIfEmpty()
                         join u in excute.Users.Where(n => n.BusinessID == BusinessID) on new { UserID = a_s.StaffID, BusinessID = a_s.BusinessID } equals new { UserID = u.UserID, BusinessID = u.BusinessID } into lsU
                         from u in lsU.DefaultIfEmpty()
                         join s in (from service in excute.Services.Where(n => n.BusinessID == BusinessID)
                                    join g in excute.ServiceGroups.Where(n => n.BusinessID == BusinessID) on service.ServiceGroupID equals g.ServiceGroupID into lsG
                                    from g in lsG.DefaultIfEmpty()
                                    select new { service.ServiceID, service.ServiceName, g.ServiceGroupID, g.ServiceGroupName, g.AppointmentColor }) on a_s.ServiceID equals s.ServiceID into lsS
                         from s in lsS.DefaultIfEmpty()
                         where a_s.BusinessID == BusinessID && a.Appointment.LocationID == LocationID && a.Appointment.ScheduledDate >= DateFrom && a.Appointment.ScheduledDate < DateTo && a.Appointment.Status != statusCancel
                         select new
                         {
                             a_s.AppointmentServiceID,
                             a_s.AppointmentID,
                             a_s.Duration,
                             a_s.ServiceID,
                             a_s.ServiceName,
                             a_s.RetailPrice,
                             a_s.Price,
                             a_s.RefNo,
                             a_s.SpecialPrice,
                             a_s.StartTime,
                             a_s.EndTime,
                             a_s.IsRequest,
                             StartTimeInSecond = a_s.StartTime.Minute * 60 + a_s.StartTime.Hour * 3600,
                             EndTimeInSecond = (a_s.EndTime).Value.Minute * 60 + (a_s.EndTime).Value.Hour * 3600,
                             a.Appointment.ClientID,
                             a.Appointment.BookingType,
                             a.Appointment.ClientName,
                             a.Appointment.Status,
                             ScheduledDate = a.Appointment.ScheduledDate.Year + "-" + a.Appointment.ScheduledDate.Month + "-" + a.Appointment.ScheduledDate.Day,
                             //a.Appointment.ScheduledDate,
                             a_s.ResourceID,
                             s.ServiceGroupName,
                             u.UserID,
                             a.Invoice.InvoiceStatus,
                             a.Clients.MobileNumber,
                             a.Clients.MobileNumberDialCode,
                             a.Appointment.Notes,
                             TypeItem = "appointment",
                             ServiceColor = s.AppointmentColor,
                             StaffColor = u.AppointmentColor,
                             UserName = u.FirstName + " " + u.LastName
                         }).AsQueryable();
            query = EmployeeIDs.Count > 0 ? query.Where(n => EmployeeIDs.Any(m => m == n.UserID)) : query;
            query = ResourceIDs.Count > 0 ? query.Where(n => ResourceIDs.Any(m => m == n.ResourceID)) : query;
            query = query.Where(n => n.Status != Library.Enum.APPOINTMENT_STATUS_CANCELLED);
            result = query.ToList<Object>();
            excute.BlockTimes.Where(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.DateWorking >= DateFrom && n.DateWorking < DateTo && EmployeeIDs.Any(m => m == n.StaffID)).Select(n => new
            {
                n.BlockTimeID,
                n.StaffID,
                DateWorking = n.DateWorking.Year + "-" + n.DateWorking.Month + "-" + n.DateWorking.Day,
                //n.DateWorking,
                n.StartTime,
                n.EndTime,
                StartTimeInSecond = n.StartTime.Minute * 60 + n.StartTime.Hour * 3600,
                EndTimeInSecond = n.EndTime.Minute * 60 + n.EndTime.Hour * 3600,
                n.Description,
                TypeItem = "blocktime",
            }).ToList<Object>().ForEach(n => result.Add(n));
            return result;
        }
    }
}