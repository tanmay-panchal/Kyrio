using AdminClient.Controllers.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using System.Data.SqlClient;
using System.Data;
using System.Globalization;

namespace AdminClient.Controllers
{
    public class HomeController : BaseController<Object, Object, Object>
    {
        #region Load Page
        [CheckPermision]
        public override ActionResult Index()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            if (u.BusinessID != 0)
            {
                if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.home)))
                {
                    return View("/Views/Home/Index.cshtml");
                }
                else
                {
                    return View("/Views/Home/Index_Empty.cshtml");
                }
            }
            else
            {
                return View("/Views/Home/Index_Empty.cshtml");
            }
        }
        [CheckPermision]
        public ActionResult Edit(long id)
        {
            return View("/Home/Index");
        }
        [CheckPermision]
        public ActionResult Create()
        {
            return View("/Home/Index");
        }
        #endregion

        #region ajax
        [HttpPost]
        public JsonResult Logout()
        {
            Session["AccountLogin"] = null;
            return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataTableTopStaff()
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new
            {
                data = ExcuteData_Main<User>.ExecuteStoreQuery("pr_Dashboard_TopStaff", n => new
                {
                    StaffID = n.Field<long>("StaffID"),
                    StaffName = n.Field<String>("StaffName"),
                    ThisMonth = n.Field<Object>("ThisMonth"),
                    LastMonth = n.Field<Object>("LastMonth"),
                }, null, true, new List<SqlParameter>() { new SqlParameter("BusinessID", BusinessID) }.ToArray())
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataTableTopService()
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new
            {
                data = ExcuteData_Main<User>.ExecuteStoreQuery("pr_Dashboard_TopService", n => new
                {
                    ServiceID = n.Field<long>("ServiceID"),
                    ServiceName = n.Field<String>("ServiceName"),
                    ThisMonth = n.Field<Object>("ThisMonth"),
                    LastMonth = n.Field<Object>("LastMonth"),
                }, null, true, new List<SqlParameter>() { new SqlParameter("BusinessID", BusinessID) }.ToArray())
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataTodayNextAppointment(DateTime date)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            date = date.Date;
            return Json(ExcuteData_Main<User>.ExecuteStoreQuery("pr_Dashboard_TodayNextAppointment", n => new
            {
                StartTime = n.Field<Object>("StartTime"),
                StartTimeInSecond = n.Field<DateTime>("StartTime").Minute * 60 + n.Field<DateTime>("StartTime").Hour * 3600,
                AppointmentID = n.Field<Object>("AppointmentID"),
                ServiceName = n.Field<String>("ServiceName"),
                DurationInMinute = n.Field<Object>("DurationInMinute"),
                StaffName = n.Field<String>("StaffName"),
                LocationName = n.Field<String>("LocationName"),
            }, null, true, new List<SqlParameter>() { new SqlParameter("BusinessID", BusinessID), new SqlParameter("Today", date) }.ToArray()), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataAppointmentActivity(int PageIndex, int PageSize)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new { data = ExcuteData_AppointmentService.GetItemAllowPagging(BusinessID, PageIndex, PageSize), total = ExcuteData_AppointmentService.Count(n => n.BusinessID == BusinessID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataChartUpcomingAppointment(long LocationID, DateTime Start, DateTime End)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            Start = Start.Date;
            End = End.Date;
            return Json(new
            {
                data = ExcuteData_Main<User>.ExecuteStoreQuery("pr_Dashboard_UpcomingAppointments", n => new
                {
                    Date = n.Field<DateTime>("Date"),
                    Confirmed = n.Field<Object>("Confirmed"),
                    Cancelled = n.Field<Object>("Cancelled"),
                    SumAppointmentsBooked = n.Field<Object>("SumAppointmentsBooked"),
                    SumConfirmed = n.Field<Object>("SumConfirmed"),
                    SumCancelled = n.Field<Object>("SumCancelled"),
                }, null, true, new List<SqlParameter>() { new SqlParameter("BusinessID", BusinessID), new SqlParameter("LocationID", LocationID), new SqlParameter("FromDate", Start), new SqlParameter("ToDate", End) }.ToArray()),
                show = ExcuteData_Main<Appointment>.Any(n => n.BusinessID == BusinessID || BusinessID == 0)
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataChartRecentSales(long LocationID, DateTime Start, DateTime End)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            Start = Start.Date;
            End = End.Date;
            return Json(new
            {
                data = ExcuteData_Main<User>.ExecuteStoreQuery("pr_Dashboard_RecentSales", n => new
                {
                    Date = n.Field<DateTime>("Date"),
                    Sales = n.Field<Object>("Sales"),
                    Appointments = n.Field<Object>("Appointments"),
                    SumAppointments = n.Field<Object>("SumAppointments"),
                    SumAppointmentsValue = n.Field<Object>("SumAppointmentsValue"),
                    SumSalesValue = n.Field<Object>("SumSalesValue"),
                }, null, true, new List<SqlParameter>() { new SqlParameter("BusinessID", BusinessID), new SqlParameter("LocationID", LocationID), new SqlParameter("FromDate", Start), new SqlParameter("ToDate", End) }.ToArray()),
                show = ExcuteData_Main<Invoice>.Any(n => n.BusinessID == BusinessID || BusinessID == 0)
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult WellcomeScheul()
        {
            User acount = ((User)Session["AccountLogin"]);
            User u = ExcuteData_Main<User>.GetById(acount.UserID);
            u.FirstLogin = false;
            ExcuteData_Main<User>.Update(u);
            Session["AccountLogin"] = u;
            User userRol = ExcuteData_Main<User>.Find(n => n.RoleID == 5 && n.BusinessID == acount.BusinessID).FirstOrDefault();
            return Json(new { FirstLogin = acount.FirstLogin, FirstName = userRol.FirstName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SearchScheul(string search)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new
            {
                Clients = ExcuteData_Main<Client>.Find(n => n.BusinessID == BusinessID && (n.FirstName.Contains(search) || n.LastName.Contains(search) || n.MobileNumber.Contains(search))),
                AppointmentServices = ExcuteData_AppointmentService.GetDataSearchScheul(search, BusinessID, DateTime.Now)
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GenerateWorkingHours()
        {
            #region Insert working hour
            User acount = ((User)Session["AccountLogin"]);
            List<User> lst = ExcuteData_Main<User>.Find(n => n.BusinessID == acount.BusinessID).ToList();
            foreach (var item in lst)
            {
                try
                {
                    ExcuteData_Main<UserWorkingHour>.ExecuteStoreCommand("pr_Staff_Generate_WorkingHours", new List<SqlParameter>()
                {
                    new SqlParameter("BusinessID", acount.BusinessID),
                    new SqlParameter("UserID", item.UserID),
                    new SqlParameter("IsRepeat", false)
                }.ToArray());
                }
                catch (Exception ex) { }
            }

            foreach (var item in lst)
            {
                new System.Threading.Thread(() =>
                {
                    try
                    {
                        ExcuteData_Main<UserWorkingHour>.ExecuteStoreCommand("pr_Staff_Generate_WorkingHours", new List<SqlParameter>()
                {
                    new SqlParameter("BusinessID", acount.BusinessID),
                    new SqlParameter("UserID", item.UserID),
                    new SqlParameter("IsRepeat", true)
                }.ToArray());
                    }
                    catch (Exception ex) { }
                }).Start();
            }

            #endregion
            return Json(new { Result = true, ErrorMessage = "", ErrorStyle = 0 }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult CheckDateExpiry()
        {
            if (Session["Business"] == null)
                return Json(new { Result = true, Message = "" }, JsonRequestBehavior.AllowGet);
            else
            {
                List<Config> Configs = ExcuteData_Main<Config>.GetAll();
                Config MessageAlertWhenExpire = Configs.SingleOrDefault(n => n.ConfigID == "MessageAlertWhenExpire");
                Config EmailSale = Configs.SingleOrDefault(n => n.ConfigID == "EmailSale");

                long BusinessID = ((Business)Session["Business"]).BusinessID;
                BusinessSetting bs = ExcuteData_Main<BusinessSetting>.Single(n => n.BusinessID == BusinessID && n.SettingCode == "BSExpiry");
                Business bus = ExcuteData_Main<Business>.GetById(BusinessID);
                SYS_PACKAGE pk = ExcuteData_Main<SYS_PACKAGE>.GetById(bus.PackageID);
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                if (bus != null)
                {
                    DateTime now = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    DateTime dateExpriry = Convert.ToDateTime(bs.Value);
                    TimeSpan subtract = dateExpriry.Date - now.Date;
                    int dayleft = subtract.Days < 0 ? 0 : subtract.Days;
                    string PackageName = pk == null ? "" : pk.PackageName;
                    string message = "";
                    if (MessageAlertWhenExpire != null)
                    {
                        message = MessageAlertWhenExpire.Value;
                        message = message.Replace("PACKAGENAME", PackageName).Replace("EMAILSALE", EmailSale == null ? "" : EmailSale.Value).Replace("DAYLEFT", dayleft.ToString());
                    }
                    return Json(new { Result = dayleft > 30, Message = message }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { Result = true, Message = "" }, JsonRequestBehavior.AllowGet);
                }
            }
        }
        [HttpPost]
        public JsonResult GetMessage()
        {
            return Json(ExcuteData_Main<UpdateHistory>.Find(n => n.IsShow).OrderByDescending(n => n.DateUpdate).Select(n => new
            {
                DateUpdate = n.DateUpdate.ToString("dd/MM/yyyy"),
                n.Subject,
                n.Detail,
                n.Link
            }), JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}