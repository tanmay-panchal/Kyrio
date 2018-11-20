using AdminClient.Controllers.Global;
using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using System.Transactions;
using System.Data.SqlClient;
using AdminClient.Library;
using System.IO;

namespace AdminClient.Controllers
{
    public class OnlineBookingsController : Controller
    {
        #region Load Page
        [Route("OnlineBookings/{id?}")]
        public ActionResult View(long id)
        {
            return OnlineBookings(id);

        }
        [Route("OnlineBookings/{id}/link")]
        public ActionResult Link(long id)
        {
            return OnlineBookings(id);
        }

        [Route("OnlineBookings/{id}/facebook")]
        public ActionResult Facebook(long id)
        {
            return OnlineBookings(id);
        }

        public ActionResult OnlineBookings(long id)
        {
            Business b = ExcuteData_Main<Business>.GetById(id);
            if (b != null)
            {
                Country c = ExcuteData_Main<Country>.GetById(b.CountryID);
                Currency currency = ExcuteData_Main<Currency>.Single(n => n.CurrencyCode == b.CurrencyCode);
                if (currency != null)
                {
                    ViewBag.CurrencySymbol = currency.CurrencySymbol;
                    ViewBag.NumberDecimal = currency.NumberDecimal;
                }
                else
                {
                    ViewBag.CurrencySymbol = "";
                    ViewBag.NumberDecimal = 2;
                }
                BusinessSetting bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == b.BusinessID && n.SettingCode == "business_online_booking").FirstOrDefault();
                ViewBag.Token = Library.CryptorEngine.GenerateToken();
                Location l = ExcuteData_Main<Location>.Find(n => n.BusinessID == b.BusinessID && n.IsDefault == true).FirstOrDefault();
                User uMain = ExcuteData_Main<User>.Find(n => n.BusinessID == b.BusinessID && n.RoleID == 5).FirstOrDefault();
                ViewBag.BusinessID = id;
                ViewBag.LocationID = l == null ? 0 : l.LocationID;
                ViewBag.LocationName = l == null ? "" : l.LocationName;
                ViewBag.ContactEmail = uMain.Email;
                ViewBag.CountryCode = c.CountryCode.ToLower();
                ViewBag.DialCode = c.DialCode;
                ViewBag.CountryName = c.CountryName;
                ViewBag.business_online_booking = bs.Value;
                bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == b.BusinessID && n.SettingCode == "business_widget_allows_employee_selection").FirstOrDefault();
                ViewBag.business_widget_allows_employee_selection = bs.Value;
                bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == b.BusinessID && n.SettingCode == "business_cancellation_time").FirstOrDefault();
                if (bs.Value == "0")
                {
                    ViewBag.business_cancellation_time = "";
                }
                else if (bs.Value == "1")
                {
                    ViewBag.business_cancellation_time = "Cancellation allowed up to 1 hour in advance";
                }
                else
                {
                    ViewBag.business_cancellation_time = "Cancellation allowed up to " + bs.Value + " hours in advance";
                }
                bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == b.BusinessID && n.SettingCode == "business_cancellation_policy").FirstOrDefault();
                ViewBag.business_cancellation_policy = bs.Value;
                ViewBag.ShowCancellation = false;
                if (ViewBag.business_cancellation_policy != "" || ViewBag.business_cancellation_time != "")
                {
                    ViewBag.ShowCancellation = true;
                }

                return View("/Views/OnlineBookings/Index.cshtml");
            }
            else
            {
                return View("/Views/OnlineBookings/");
            }

        }
        #endregion

        #region Ajax
        #endregion
    }

    class remove
    {
        // Auto-implemented properties.
        public int from { get; set; }
        public int to { get; set; }
    }
    public class OnlineBookingsDataController : Controller
    {
        #region Ajax
        [HttpPost]
        public JsonResult GetLocation(long BusinessID, string Token)
        {
            if (Library.CryptorEngine.CheckToken(Token))
            {
                List<Location> lst = ExcuteData_Main<Location>.Find(n => n.BusinessID == BusinessID).OrderBy(n => n.SortOrder).ToList();
                return Json(new { Result = true, Location = lst }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { Result = false, Location = "" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetService(long BusinessID, long LocationID, string Token)
        {
            if (Library.CryptorEngine.CheckToken(Token))
            {
                //lay danh sach staff theo location
                List<UserLocation> lstUL = ExcuteData_Main<UserLocation>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID).ToList();
                //lay danh sach service theo staff
                List<ServiceStaff> lstSS = ExcuteData_Main<ServiceStaff>.Find(n => n.BusinessID == BusinessID).ToList().Where(n => lstUL.Any(m => m.UserID == n.UserID)).ToList();

                List<V_SERVICE> lst = ExcuteData_Main<V_SERVICE>.Find(n => n.BusinessID == BusinessID && n.EnableOnlineBookings == true).ToList().Where(n => lstSS.Any(m => m.ServiceID == n.ServiceID)).OrderBy(n => n.GroupSortOrder).ThenBy(n => n.ServiceGroupID).ThenBy(n => n.SortOrder).ToList();
                return Json(new { Result = true, Service = lst }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { Result = false, Service = "" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetStaff(long BusinessID, long LocationID, string Token, List<int> lstService)
        {
            if (Library.CryptorEngine.CheckToken(Token))
            {
                Business b = ExcuteData_Main<Business>.GetById(BusinessID);
                Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
                string sTargetTimeZone = ExcuteData_Main<Country>.Find(n => n.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(sTargetTimeZone);
                //check business_advance_notice_time_in_seconds
                DateTime current = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                BusinessSetting y = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "business_widget_max_advance_time_in_months").FirstOrDefault();
                DateTime todate = current.AddMonths(Convert.ToInt32(y.Value));
                //lay danh sach staff theo location
                List<UserLocation> lstUL = ExcuteData_Main<UserLocation>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID).ToList();

                var lst = ExcuteData_Main<User>.Find(n => n.BusinessID == BusinessID && n.EnableAppointmentBooking == true).ToList().Where(n => lstUL.Any(m => m.UserID == n.UserID)).OrderBy(n => n.SortOrder).Select(i => new { UserID = i.UserID, FirstName = i.FirstName, LastName = i.LastName, MinSlot = 0 }).ToList();
                foreach (var item in lst.ToList())
                {
                    List<ServiceStaff> ss = ExcuteData_Main<ServiceStaff>.Find(n => n.BusinessID == BusinessID && n.UserID == item.UserID && lstService.Any(m => m == n.ServiceID)).ToList();
                    if (!(ss != null && ss.Count == lstService.Count))
                    {
                        lst.Remove(item);
                    }
                    else
                    {
                        int countWH = ExcuteData_Main<UserWorkingHour>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.UserID == item.UserID && n.DateWorking >= current.Date && n.DateWorking <= todate).Count();
                        if (countWH == 0)
                        {
                            lst.Remove(item);
                        }
                    }
                }
                return Json(new { Result = true, Staff = lst }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { Result = false, Staff = "" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]

        public JsonResult GetOpenHour(long BusinessID, string Token, DateTime date, long StaffID, long LocationID, List<int> lstService, int TotalDuration)
        {
            if (StaffID == 0)
            {
                return GetOpenHourNoStaff(BusinessID, Token, date, LocationID, lstService, TotalDuration);
            }
            else
            {
                return GetOpenHourWithStaff(BusinessID, Token, date, StaffID, LocationID, TotalDuration);
            }
        }

        public JsonResult GetOpenHourWithStaff(long BusinessID, string Token, DateTime date, long StaffID, long LocationID, int TotalDuration)
        {
            if (Library.CryptorEngine.CheckToken(Token))
            {
                Business b = ExcuteData_Main<Business>.GetById(BusinessID);
                Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
                string sTargetTimeZone = ExcuteData_Main<Country>.Find(n => n.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(sTargetTimeZone);

                date = date.Date;
                //check business_advance_notice_time_in_seconds
                DateTime current = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                BusinessSetting x = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "business_advance_notice_time_in_seconds").FirstOrDefault();
                int begin = x == null ? 0 : Convert.ToInt32(x.Value);
                current = current.AddSeconds(begin);
                int t1 = (current.Hour * 3600) + (current.Minute * 60);
                t1 = (t1 / 900) * 900;

                //check business_widget_max_advance_time_in_months
                BusinessSetting y = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "business_widget_max_advance_time_in_months").FirstOrDefault();
                int end = y == null ? 0 : Convert.ToInt32(y.Value);
                DateTime future = current.Date.AddMonths(end);
                if (date > future)
                {
                    return Json(new { Result = true, store_open = false, open = 0, close = 0 }, JsonRequestBehavior.AllowGet);
                }

                //check close date
                ModelEntity excute = new ModelEntity();
                List<ClosedDate> result = (from n in excute.ClosedDate_Location
                                           join m in excute.ClosedDates on new { n.ClosedDateID, n.BusinessID } equals new { m.ClosedDateID, m.BusinessID } into lsM
                                           from m in lsM.DefaultIfEmpty()
                                           where n.BusinessID == BusinessID && m.BusinessID == BusinessID && n.LocationID == LocationID
                                           && m.StartDate <= date && m.EndDate >= date
                                           select m).ToList();
                if (result != null && result.Count > 0)
                {
                    return Json(new { Result = true, store_open = false, open = "0", close = "0" }, JsonRequestBehavior.AllowGet);
                }

                List<UserWorkingHour> lst = ExcuteData_Main<UserWorkingHour>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.UserID == StaffID && n.DateWorking == date).ToList();
                var lstBT = ExcuteData_Main<BlockTime>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.StaffID == StaffID && n.DateWorking == date).ToList();
                var lstAPS = ExcuteData_Main<V_APPOINTMENT_SERVICE>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.StaffID == StaffID && n.ScheduledDate == date && n.Status != Library.Enum.APPOINTMENT_STATUS_CANCELLED).ToList();

                List<remove> lstremove = new List<remove>();
                if (lst != null)
                {
                    if (lst.Count == 1 && lst[0].Shift2End.HasValue)
                    {
                        remove item = new remove
                        {
                            from = lst[0].Shift1End.Hour * 3600 + lst[0].Shift1End.Minute * 60,
                            to = lst[0].Shift2Start.Value.Hour * 3600 + lst[0].Shift2Start.Value.Minute * 60
                        };
                        lstremove.Add(item);
                    }
                }
                if (lstBT != null)
                {
                    foreach (var n in lstBT)
                    {
                        remove item = new remove
                        {
                            from = n.StartTime.Hour * 3600 + n.StartTime.Minute * 60,
                            to = n.EndTime.Hour * 3600 + n.EndTime.Minute * 60
                        };
                        lstremove.Add(item);
                    }
                }
                if (lstAPS != null)
                {
                    foreach (var n in lstAPS)
                    {
                        remove item = new remove
                        {
                            from = n.StartTime.Hour * 3600 + n.StartTime.Minute * 60,
                            to = (n.StartTime.Hour * 3600 + n.StartTime.Minute * 60) + n.Duration
                        };
                        lstremove.Add(item);
                    }
                }

                if (lst != null && lst.Count > 0)
                {
                    int open = (lst[0].Shift1Start.Hour * 3600 + lst[0].Shift1Start.Minute * 60);
                    int close = lst[0].Shift2End.HasValue ? (lst[0].Shift2End.Value.Hour * 3600 + lst[0].Shift2End.Value.Minute * 60) : (lst[0].Shift1End.Hour * 3600 + lst[0].Shift1End.Minute * 60);
                    close = close - TotalDuration;//tru gio service
                    if (current <= date.AddSeconds(open))
                    {
                        return Json(new { Result = true, StaffID = StaffID, store_open = true, open = open, close = close, lstRemove = lstremove }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        if (current.Date == date.AddSeconds(open).Date)//cung ngay thi moi lay gio hien tai
                        {
                            return Json(new { Result = true, StaffID = StaffID, store_open = true, open = t1, close = close, lstRemove = lstremove }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            return Json(new { Result = true, StaffID = StaffID, store_open = false, open = 0, close = 0, lstRemove = lstremove }, JsonRequestBehavior.AllowGet);
                        }

                    }
                }
                else
                {
                    return Json(new { Result = true, store_open = false, open = "0", close = "0", lstRemove = lstremove }, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(new { Result = false }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOpenHourNoStaff(long BusinessID, string Token, DateTime date, long LocationID, List<int> lstService, int TotalDuration)
        {
            if (Library.CryptorEngine.CheckToken(Token))
            {
                Business b = ExcuteData_Main<Business>.GetById(BusinessID);
                Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
                string sTargetTimeZone = ExcuteData_Main<Country>.Find(n => n.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(sTargetTimeZone);

                date = date.Date;
                //check business_advance_notice_time_in_seconds
                DateTime current = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                BusinessSetting x = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "business_advance_notice_time_in_seconds").FirstOrDefault();
                int begin = x == null ? 0 : Convert.ToInt32(x.Value);
                current = current.AddSeconds(begin);
                int t1 = (current.Hour * 3600) + (current.Minute * 60);
                t1 = (t1 / 900) * 900;

                //check business_widget_max_advance_time_in_months
                BusinessSetting y = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "business_widget_max_advance_time_in_months").FirstOrDefault();
                int end = y == null ? 0 : Convert.ToInt32(y.Value);
                DateTime future = current.Date.AddMonths(end);
                if (date > future)
                {
                    return Json(new { Result = true, store_open = false, open = 0, close = 0 }, JsonRequestBehavior.AllowGet);
                }

                //check close date
                ModelEntity excute = new ModelEntity();
                List<ClosedDate> result = (from n in excute.ClosedDate_Location
                                           join m in excute.ClosedDates on new { n.ClosedDateID, n.BusinessID } equals new { m.ClosedDateID, m.BusinessID } into lsM
                                           from m in lsM.DefaultIfEmpty()
                                           where n.BusinessID == BusinessID && m.BusinessID == BusinessID && n.LocationID == LocationID
                                           && m.StartDate <= date && m.EndDate >= date
                                           select m).ToList();
                if (result != null && result.Count > 0)
                {
                    return Json(new { Result = true, store_open = false, open = "0", close = "0" }, JsonRequestBehavior.AllowGet);
                }

                //lay danh sach staff ma co the lam danh sach service
                List<UserLocation> lstUL = ExcuteData_Main<UserLocation>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID).ToList();

                var lst = ExcuteData_Main<User>.Find(n => n.BusinessID == BusinessID && n.EnableAppointmentBooking == true).ToList().Where(n => lstUL.Any(m => m.UserID == n.UserID)).OrderBy(n => n.SortOrder).Select(i => new { UserID = i.UserID, FirstName = i.FirstName, LastName = i.LastName }).ToList();
                foreach (var item in lst.ToList())
                {
                    List<ServiceStaff> ss = ExcuteData_Main<ServiceStaff>.Find(n => n.BusinessID == BusinessID && n.UserID == item.UserID && lstService.Any(m => m == n.ServiceID)).ToList();
                    if (!(ss != null && ss.Count == lstService.Count))
                    {
                        lst.Remove(item);
                    }
                }
                //duyet tung staff xem staff nao con tong thoi gian con lai >= totalduration
                foreach (var item in lst)
                {
                    List<UserWorkingHour> lstWH = ExcuteData_Main<UserWorkingHour>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.UserID == item.UserID && n.DateWorking == date).ToList();
                    var lstBT = ExcuteData_Main<BlockTime>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.StaffID == item.UserID && n.DateWorking == date).ToList();
                    var lstAPS = ExcuteData_Main<V_APPOINTMENT_SERVICE>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID && n.StaffID == item.UserID && n.ScheduledDate == date && n.Status != Library.Enum.APPOINTMENT_STATUS_CANCELLED).ToList();

                    Double TotalWH = 0;
                    Double TotalBlock = 0;
                    Double TotalBook = 0;
                    if (lstWH != null && lstWH.Count == 1)
                    {
                        TotalWH = (lstWH[0].Shift1End - lstWH[0].Shift1Start).TotalSeconds;
                        if (lstWH[0].Shift2Start.HasValue)
                        {
                            TotalWH = TotalWH + (lstWH[0].Shift2End.Value - lstWH[0].Shift2Start.Value).TotalSeconds;
                        }
                    }
                    foreach (var itemBT in lstBT)
                    {
                        TotalBlock = TotalBlock + (itemBT.EndTime - itemBT.StartTime).TotalSeconds;
                    }
                    foreach (var itemBook in lstAPS)
                    {
                        TotalBook = TotalBook + itemBook.Duration;
                    }

                    if ((TotalWH - TotalBlock - TotalBook - TotalDuration) >= 0)
                    {
                        return GetOpenHourWithStaff(BusinessID, Token, date, item.UserID, LocationID, TotalDuration);
                    }
                }
                return Json(new { Result = true, store_open = false, open = "0", close = "0" }, JsonRequestBehavior.AllowGet);

                //string dayofweek = date.DayOfWeek.ToString();
                //string code1 = "store_open_" + dayofweek;
                //string code2 = "store_open_" + dayofweek + "_close";
                //string code3 = "store_open_" + dayofweek + "_open";

                //BusinessSetting store_open = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == code1).FirstOrDefault();
                //BusinessSetting close = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == code2).FirstOrDefault();
                //BusinessSetting open = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == code3).FirstOrDefault();
                //if (current <= date.AddSeconds(Convert.ToInt32(open.Value)))
                //{
                //    return Json(new { Result = true, store_open = store_open.Value == "1", open = open.Value, close = Convert.ToInt32(close.Value) - (60 * 60) }, JsonRequestBehavior.AllowGet);
                //}
                //else
                //{
                //    if (current.Date == date.AddSeconds(Convert.ToInt32(open.Value)).Date)//cung ngay thi moi lay gio hien tai
                //    {
                //        return Json(new { Result = true, store_open = store_open.Value == "1", open = t1, close = Convert.ToInt32(close.Value) - (60 * 60) }, JsonRequestBehavior.AllowGet);
                //    }
                //    else
                //    {
                //        return Json(new { Result = true, store_open = false, open = 0, close = 0 }, JsonRequestBehavior.AllowGet);
                //    }
                //}
            }
            return Json(new { Result = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveAppointment(Client Client, Appointment Appointment, List<AppointmentService> AppointmentServices)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                Business b = ExcuteData_Main<Business>.GetById(Appointment.BusinessID);
                Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
                string sTargetTimeZone = ExcuteData_Main<Country>.Find(n => n.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(sTargetTimeZone);

                //check exist old client by email and phone number
                Client client = ExcuteData_Main<Client>.Find(n => n.BusinessID == Client.BusinessID && (n.Email == Client.Email || (n.MobileNumberDialCode == Client.MobileNumberDialCode && n.MobileNumber == Client.MobileNumber))).FirstOrDefault();
                if (client != null)
                {

                }
                else
                {
                    Client.AcceptMarketingNotifications = false;
                    Client.Gender = nameof(Resources.Enum.gender_unknown);
                    Client.AppointmentNotificationType = nameof(Resources.Enum.marketing_both);
                    Client.AcceptMarketingNotifications = true;
                    Client.DisplayOnAllBookings = true;
                    Client.TotalSales = 0;
                    Client.Outstanding = 0;
                    Client.UserCreate = 0;
                    Client.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    ExcuteData_Main<Client>.Insert(Client);
                    client = Client;
                }

                #region Appointment
                Appointment.BookingType = nameof(Resources.Enum.booking_type_online);
                Appointment.Status = "New";
                Appointment.ReasonCancel = "";
                Appointment.DatetimeCancel = null;
                Appointment.UserCreate = 0;
                Appointment.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                Appointment.UserModify = null;
                Appointment.ModifyDate = null;
                Appointment.ClientID = client.ClientID;
                Appointment.ClientName = client.FirstName + " " + (client.LastName == null ? "" : client.LastName);
                Appointment.FrequencyType = "no-repeat";
                ExcuteData_Main<Appointment>.Insert(Appointment);
                #endregion

                #region AppointmentService
                //kiem tra neu chua co staff thi lay owner
                long StaffID = 0;
                if (AppointmentServices[0].StaffID == 0)
                {
                    User us = ExcuteData_Main<User>.Find(n => n.BusinessID == Client.BusinessID && n.RoleID == 5).FirstOrDefault();
                    if (us != null)
                    {
                        StaffID = us.UserID;
                    }
                }
                else
                {
                    StaffID = AppointmentServices[0].StaffID;
                }
                int i = 0;
                AppointmentServices.ForEach(n =>
                {
                    n.AppointmentID = Appointment.AppointmentID;
                    n.RefNo = Path.GetRandomFileName().Replace(".", "").Remove(10).ToUpper();
                    n.SortOrder = i;
                    n.StaffID = StaffID;
                    i++;
                });
                ExcuteData_Main<AppointmentService>.Insert(AppointmentServices);
                #endregion
                //send email
                ExcuteData_Message.SendEmailAppointment(Appointment.BusinessID, Appointment.AppointmentID, nameof(Resources.Enum.email_confirmation_booking_client));
                scope.Complete();
                //send email owner and staff
                new System.Threading.Thread(() =>
                {
                    ExcuteData_Message.SendEmailConfirmOnlineAppointment(Appointment.BusinessID, Appointment.AppointmentID);
                }).Start();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion
    }
}