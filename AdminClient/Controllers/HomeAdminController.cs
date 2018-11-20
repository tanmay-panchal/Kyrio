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
    public class HomeAdminController : BaseController<Object, Object, Object>
    {
        #region Load Page
        [CheckPermision]
        public override ActionResult Index()
        {
            return View("/Views/Home/IndexAdmin.cshtml");
        }

        #endregion

        #region Ajax
        [HttpPost]
        public JsonResult GetDataChartUpcomingAppointmentAdmin(long BusinessID, DateTime Start, DateTime End)
        {
            long LocationID = 0;
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
                show = ExcuteData_Main<Appointment>.Count() > 0
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataChartRecentSalesAdmin(long BusinessID, DateTime Start, DateTime End)
        {
            long LocationID = 0;
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
                show = ExcuteData_Main<Appointment>.Count() > 0
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataDashboardAdmin(long BusinessID)
        {
            return Json(ExcuteData_Main<User>.ExecuteStoreQuery("pr_DashboardAdmin", n => new
            {
                Total = n.Field<Object>("Total"),
                Today = n.Field<Object>("Today"),
                TodayPer = n.Field<Object>("TodayPer"),
                ThisWeek = n.Field<Object>("ThisWeek"),
                ThisWeekPer = n.Field<Object>("ThisWeekPer"),
                ThisMonth = n.Field<Object>("ThisMonth"),
                ThisMonthPer = n.Field<Object>("ThisMonthPer"),
                BTotal = n.Field<Object>("BTotal"),
                BNew = n.Field<Object>("BNew"),
                BTrial = n.Field<Object>("BTrial"),
                BPaid = n.Field<Object>("BPaid"),
                BExpired = n.Field<Object>("BExpired"),
                ABTotal = n.Field<Object>("ABTotal"),
                ABNew = n.Field<Object>("ABNew"),
                ABConfirmed = n.Field<Object>("ABConfirmed"),
                ABArrived = n.Field<Object>("ABArrived"),
                ABStarted = n.Field<Object>("ABStarted"),
                ABFinished = n.Field<Object>("ABFinished"),
                EmailSent = n.Field<Object>("EmailSent"),
                EmailBounced = n.Field<Object>("EmailBounced"),
                SMSSent = n.Field<Object>("SMSSent"),
                SMSBounced = n.Field<Object>("SMSBounced"),
                TotalStaff = n.Field<Object>("TotalStaff"),
                TotalService = n.Field<Object>("TotalService"),
                TotalClient = n.Field<Object>("TotalClient"),
            }, null, true, new List<SqlParameter>() { new SqlParameter("BusinessID", BusinessID) }.ToArray()), JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}