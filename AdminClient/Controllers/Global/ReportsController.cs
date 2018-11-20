using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;

namespace AdminClient.Controllers.Global
{
    public class ReportsController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Sales()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.daily_sales)))
            {
                return View("/Views/Reports/Sales.cshtml", 1);
            }
            else if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.appointments)))
            {
                return View("/Views/Reports/Sales.cshtml", 2);
            }
            else if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.invoices)))
            {
                return View("/Views/Reports/Sales.cshtml", 3);
            }
            else if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.vouchers)))
            {
                return View("/Views/Reports/Sales.cshtml", 4);
            }
            else
            {
                return View("");
            }
        }
        [CheckPermision]
        public ActionResult DailySales()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.daily_sales)))
            {
                return View("/Views/Reports/Sales.cshtml", 1);
            }
            else
            {
                return View("NotFound");
            }
        }

        [CheckPermision]
        public ActionResult Appointments()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.appointments)))
            {
                return View("/Views/Reports/Sales.cshtml", 2);
            }
            else
            {
                return View("NotFound");
            }
        }

        [CheckPermision]
        public ActionResult Invoices()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.invoices)))
            {
                return View("/Views/Reports/Sales.cshtml", 3);
            }
            else
            {
                return View("NotFound");
            }
        }

        [CheckPermision]
        public ActionResult Vouchers()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.vouchers)))
            {
                return View("/Views/Reports/Sales.cshtml", 4);
            }
            else
            {
                return View("NotFound");
            }
        }

        [CheckPermision]
        public ActionResult Analytics()
        {
            ViewBag.Tab = 1;
            ViewBag.URL = "/Views/Reports/Analytics/Dashboard.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult Dashboard()
        {
            ViewBag.Tab = 1;
            ViewBag.URL = "/Views/Reports/Analytics/Dashboard.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult Reports()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/Reports.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByItem()
        {
            ViewBag.Tab = 2;
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_item);
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByType()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_type);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByService()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_service);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByProduct()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_product);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByLocation()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_location);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByChannel()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_channel);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByClient()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_client);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByStaff()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_staff);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByHour()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_hour);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByDay()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_day);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByMonth()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_month);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByQuarter()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_quarter);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByYear()
        {
            ViewBag.ReportType = nameof(Resources.Enum.report_sale_by_year);
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesBy.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByStaffBreakdown()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/StaffBreakdown.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesByHoursofDay()
        {

            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/HoursofDay.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult SalesLog()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/SalesLog.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult StockonHand()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/StockonHand.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult ProductSalesPerformance()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/ProductSales.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult StockMovementLog()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/StockMovementLog.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult StockMovementSummary()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/StockMovementSummary.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult ProductConsumption()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/ProductConsumption.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult PaymentsSummary()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/PaymentsSummary.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult PaymentsLog()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/PaymentsLog.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult TaxesSummary()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/TaxesSummary.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult TipsCollected()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/TipsCollected.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult DiscountSummary()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/DiscountSummary.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult OutstandingInvoices()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/OutstandingInvoices.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult AppointmentsSummary()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/AppointmentsSummary.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult AppointmentCancel()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/AppointmentCancel.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult ClientList()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/ClientList.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult ClientRetention()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/ClientRetention.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult VouchersOutstanding()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/VouchersOutstanding.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult VouchersSales()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/VouchersSales.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult VoucherRedemptions()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/VoucherRedemptions.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult StaffWorkingHours()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/StaffWorkingHours.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult TipsByStaff()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/TipsByStaff.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult CommissionStaffSummary()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/CommissionStaffSummary.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult CommissionStaffDetailed()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/CommissionStaffDetailed.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }

        [CheckPermision]
        public ActionResult FinancesSummary()
        {
            ViewBag.Tab = 2;
            ViewBag.URL = "/Views/Reports/Analytics/FinancesSummary.cshtml";
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.all_reports)))
            {
                return View("/Views/Reports/Analytics/Analytics.cshtml");
            }
            else
            {
                return View("");
            }
        }


        #endregion

        #region Ajax

        #region Sales
        [HttpPost]
        public JsonResult GetDataTableTransactionSummary()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                DateTime date = DateTime.Today;
                if (Request.Form.GetValues("date")[0] != null)
                {
                    if (Request.Form.GetValues("date")[0] != "")
                    {
                        date = Convert.ToDateTime(Request.Form.GetValues("date")[0] ?? DateTime.Now.ToString());
                    }
                }
                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", u.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("date", date));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_DailySales_TransactionSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapTransactionSummary).ToList();

                return Json(new
                {
                    data = ret
                });

            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }

        private Object MapTransactionSummary(DataRow row)
        {
            Object result = new
            {
                ItemType = row.Field<String>("ItemType"),
                SalesQty = row.Field<Object>("SalesQty"),
                RefundQty = row.Field<Object>("RefundQty"),
                GrossTotal = row.Field<Object>("GrossTotal"),
                Bold = row.Field<Object>("Bold"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableCashMovementSummary()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                DateTime date = DateTime.Today;
                if (Request.Form.GetValues("date")[0] != null)
                {
                    if (Request.Form.GetValues("date")[0] != "")
                    {
                        date = Convert.ToDateTime(Request.Form.GetValues("date")[0] ?? DateTime.Now.ToString());
                    }
                }
                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", u.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("date", date));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_DailySales_CashMovementSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapCashMovementSummary).ToList();

                return Json(new
                {
                    data = ret
                });

            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }

        private Object MapCashMovementSummary(DataRow row)
        {
            Object result = new
            {
                PaymentTypeName = row.Field<String>("PaymentTypeName"),
                PaymentsCollected = row.Field<Object>("PaymentsCollected"),
                RefundsPaid = row.Field<Object>("RefundsPaid"),
                Bold = row.Field<Object>("Bold"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableAppointments()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
                int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
                int LocationID = 0;
                int StaffID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);
                var search = Request.Form["search[value]"];
                //-----------------------
                Expression<Func<V_APPOINTMENT_SERVICE, bool>> queryWhere = n => n.BusinessID == user.BusinessID && n.ScheduledDate >= fromdate && n.ScheduledDate <= todate
                && n.LocationID == (LocationID == 0 ? n.LocationID : LocationID)
                && n.StaffID == (StaffID == 0 ? n.StaffID : StaffID)
                && (n.ClientName.Contains(search) || n.RefNo.Contains(search));
                long countData = ExcuteData_Main<V_APPOINTMENT_SERVICE>.Count(queryWhere);
                List<V_APPOINTMENT_SERVICE> lst = ExcuteData_Main<V_APPOINTMENT_SERVICE>.SelectWithPaging(queryWhere, start, length, "ScheduledDate", true);

                return Json(new
                {
                    data = lst,
                    recordsFiltered = countData,
                    recordsTotal = countData,
                    ErrorMessage = ""
                });

            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult GetDataTableInvoices()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
                int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");

                int LocationID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);
                var search = Request.Form["search[value]"];
                //-----------------------
                Expression<Func<V_INVOICE, bool>> queryWhere = n => n.BusinessID == user.BusinessID && n.InvoiceDate >= fromdate && n.InvoiceDate <= todate
                && n.LocationID == (LocationID == 0 ? n.LocationID : LocationID)
                && (n.ClientName.Contains(search) || n.InvoiceNo.Contains(search));
                long countData = ExcuteData_Main<V_INVOICE>.Count(queryWhere);
                List<V_INVOICE> lst = ExcuteData_Main<V_INVOICE>.SelectWithPaging(queryWhere, start, length, "InvoiceDate", true);

                return Json(new
                {
                    data = lst,
                    recordsFiltered = countData,
                    recordsTotal = countData,
                    ErrorMessage = ""
                });

            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult GetDataTableVouchers()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
                int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
                string status = "";
                if (Request.Form.GetValues("status")[0] != null)
                {
                    if (Request.Form.GetValues("status")[0] != "")
                    {
                        status = Request.Form.GetValues("status")[0];
                    }
                }
                var search = Request.Form["search[value]"];
                //-----------------------
                Expression<Func<V_VOUCHER, bool>> queryWhere = n => n.BusinessID == user.BusinessID
                && (n.ClientName.Contains(search) || n.VoucherCode.Contains(search)) && (n.VoucherStatus == (status == "" ? n.VoucherStatus : status));

                long countData = ExcuteData_Main<V_VOUCHER>.Count(queryWhere);
                List<V_VOUCHER> lst = ExcuteData_Main<V_VOUCHER>.SelectWithPaging(queryWhere, start, length, "IssueDate", true);
                return Json(new
                {
                    data = lst,
                    recordsFiltered = countData,
                    recordsTotal = countData,
                    ErrorMessage = ""
                });

            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }

        #endregion

        #region Reports Finances

        [HttpPost]
        public JsonResult GetDataTablePaymentsSummary()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }


                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_PaymentsSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapPaymentsSummary).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapPaymentsSummary(DataRow row)
        {
            Object result = new
            {
                PaymentTypeID = row.Field<Object>("PaymentTypeID"),
                PaymentTypeName = row.Field<String>("PaymentTypeName"),
                Transactions = row.Field<Object>("Transactions"),
                GrossPayments = row.Field<Object>("GrossPayments"),
                Refunds = row.Field<Object>("Refunds"),
                NetPayments = row.Field<Object>("NetPayments"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTablePaymentsLog()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string IncludeVoucher = "";
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("IncludeVoucher")[0] != null)
                {
                    if (Request.Form.GetValues("IncludeVoucher")[0] != "")
                    {
                        IncludeVoucher = Request.Form.GetValues("IncludeVoucher")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("IncludeVoucher", IncludeVoucher));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_PaymentsLog", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapPaymentsLog).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapPaymentsLog(DataRow row)
        {
            Object result = new
            {
                PaymentDate = row.Field<Object>("PaymentDate"),
                PaymentNo = row.Field<Object>("PaymentNo"),
                LocationName = row.Field<String>("LocationName"),
                InvoiceDate = row.Field<Object>("InvoiceDate"),
                InvoiceNo = row.Field<Object>("InvoiceNo"),
                ClientName = row.Field<String>("ClientName"),
                ClientID = row.Field<Object>("ClientID"),
                Staff = row.Field<String>("Staff"),
                InvoiceType = row.Field<String>("InvoiceType"),
                PaymentTypeName = row.Field<String>("PaymentTypeName"),
                PaymentAmount = row.Field<Object>("PaymentAmount"),
                InvoiceID = row.Field<Object>("InvoiceID"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableTaxesSummary()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_TaxesSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapTaxesSummary).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapTaxesSummary(DataRow row)
        {
            Object result = new
            {
                TaxID = row.Field<Object>("TaxID"),
                TaxName = row.Field<String>("TaxName"),
                LocationID = row.Field<Object>("LocationID"),
                LocationName = row.Field<String>("LocationName"),
                ItemSales = row.Field<Object>("ItemSales"),
                TaxRate = row.Field<Object>("TaxRate"),
                TotalTax = row.Field<Object>("ToTalTax"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableTipsCollected()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_TipsCollected", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapTipsCollected).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapTipsCollected(DataRow row)
        {
            Object result = new
            {
                InvoiceDate = row.Field<Object>("InvoiceDate"),
                InvoiceNo = row.Field<String>("InvoiceNo"),
                LocationName = row.Field<String>("LocationName"),
                StaffName = row.Field<String>("StaffName"),
                TipAmount = row.Field<Object>("TipAmount"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableDiscountSummary()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string ByType = "";

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }


                if (Request.Form.GetValues("ByType")[0] != null)
                {
                    if (Request.Form.GetValues("ByType")[0] != "")
                    {
                        ByType = Request.Form.GetValues("ByType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("ByType", ByType));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_DiscountsSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapDiscountSummary).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapDiscountSummary(DataRow row)
        {
            Object result = new
            {
                Name = row.Field<String>("Name"),
                ItemsDiscounted = row.Field<Object>("ItemsDiscounted"),
                ItemsValue = row.Field<Object>("ItemsValue"),
                DiscountAmount = row.Field<Object>("DiscountAmount"),
                DiscountRefunds = row.Field<Object>("DiscountRefunds"),
                NetDiscounts = row.Field<Object>("NetDiscounts"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableOutstandingInvoices()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }


                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_OutstandingInvoices", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapOutstandingInvoices).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapOutstandingInvoices(DataRow row)
        {
            Object result = new
            {
                InvoiceNo = row.Field<String>("InvoiceNo"),
                LocationName = row.Field<String>("LocationName"),
                InvoiceStatus = row.Field<String>("InvoiceStatus"),
                InvoiceDate = row.Field<Object>("InvoiceDate"),
                DueDate = row.Field<Object>("DueDate"),
                OverDue = row.Field<String>("OverDue"),
                ClientName = row.Field<String>("ClientName"),
                TotalWithTip = row.Field<Object>("TotalWithTip"),
                AmountDue = row.Field<Object>("AmountDue"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableSalesSummaryPayments(long LocationID, DateTime fromdate, DateTime todate)
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_SalesSummary_Payments", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapSalesSummaryPayments).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapSalesSummaryPayments(DataRow row)
        {
            Object result = new
            {
                PaymentTypeName = row.Field<Object>("PaymentTypeName"),
                PaymentAmount = row.Field<Object>("PaymentAmount"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableFinancesSummary(long LocationID, DateTime fromdate, DateTime todate)
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_SalesSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapFinancesSummary).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapFinancesSummary(DataRow row)
        {
            Object result = new
            {
                GrossSales = row.Field<Object>("GrossSales"),
                Discounts = row.Field<Object>("Discounts"),
                Refunds = row.Field<Object>("Refunds"),
                NetSales = row.Field<Object>("NetSales"),
                Taxes = row.Field<Object>("Taxes"),
                TotalSales = row.Field<Object>("TotalSales"),
                VoucherSales = row.Field<Object>("VoucherSales"),
                VoucherRedemptions = row.Field<Object>("VoucherRedemptions"),
                VoucherOutstandingBalance = row.Field<Object>("VoucherOutstandingBalance"),
                TotalPayments = row.Field<Object>("TotalPayments"),
                TipsCollected = row.Field<Object>("TipsCollected"),
            };
            return result;
        }

        #endregion

        #region Reports Inventory

        [HttpPost]
        public JsonResult GetDataTableStockonHand()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int BrandID = 0;
                int CategoryID = 0;
                int SupplierID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("BrandID")[0] != null)
                {
                    if (Request.Form.GetValues("BrandID")[0] != "")
                    {
                        BrandID = Convert.ToInt32(Request.Form.GetValues("BrandID")[0]);
                    }
                }

                if (Request.Form.GetValues("CategoryID")[0] != null)
                {
                    if (Request.Form.GetValues("CategoryID")[0] != "")
                    {
                        CategoryID = Convert.ToInt32(Request.Form.GetValues("CategoryID")[0]);
                    }
                }

                if (Request.Form.GetValues("SupplierID")[0] != null)
                {
                    if (Request.Form.GetValues("SupplierID")[0] != "")
                    {
                        SupplierID = Convert.ToInt32(Request.Form.GetValues("SupplierID")[0]);
                    }
                }


                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("SupplierID", SupplierID));
                para.Add(new SqlParameter("BrandID", BrandID));
                para.Add(new SqlParameter("CategoryID", CategoryID));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_StockOnhand", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapStockonHand).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapStockonHand(DataRow row)
        {
            Object result = new
            {
                ProductName = row.Field<String>("ProductName"),
                LocationName = row.Field<String>("LocationName"),
                OnHand = row.Field<Object>("OnHand"),
                OnHandCost = row.Field<Object>("OnHandCost"),
                AVGCost = row.Field<Object>("AVGCost"),
                TotalRetailValue = row.Field<Object>("TotalRetailValue"),
                RetailPrice = row.Field<Object>("RetailPrice"),
                ReorderPoint = row.Field<Object>("ReorderPoint"),
                ReorderQty = row.Field<Object>("ReorderQty"),
                Barcode = row.Field<Object>("Barcode"),
                SKU = row.Field<Object>("SKU"),
                SupplierName = row.Field<String>("SupplierName"),
                CategoryName = row.Field<String>("CategoryName"),
                BrandName = row.Field<String>("BrandName"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableProductSales()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                int BrandID = 0;
                int CategoryID = 0;
                int SupplierID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("BrandID")[0] != null)
                {
                    if (Request.Form.GetValues("BrandID")[0] != "")
                    {
                        BrandID = Convert.ToInt32(Request.Form.GetValues("BrandID")[0]);
                    }
                }

                if (Request.Form.GetValues("CategoryID")[0] != null)
                {
                    if (Request.Form.GetValues("CategoryID")[0] != "")
                    {
                        CategoryID = Convert.ToInt32(Request.Form.GetValues("CategoryID")[0]);
                    }
                }

                if (Request.Form.GetValues("SupplierID")[0] != null)
                {
                    if (Request.Form.GetValues("SupplierID")[0] != "")
                    {
                        SupplierID = Convert.ToInt32(Request.Form.GetValues("SupplierID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("SupplierID", SupplierID));
                para.Add(new SqlParameter("BrandID", BrandID));
                para.Add(new SqlParameter("CategoryID", CategoryID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_ProductSalesPerformance", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapProductSales).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapProductSales(DataRow row)
        {
            Object result = new
            {
                ItemName = row.Field<String>("ItemName"),
                StockOnHand = row.Field<Object>("StockOnHand"),
                QtySold = row.Field<Object>("QtySold"),
                CostGoodSold = row.Field<Object>("CostGoodSold"),
                NetSale = row.Field<Object>("NetSale"),
                AVGNetSale = row.Field<Object>("AVGNetSale"),
                Margin = row.Field<Object>("Margin"),
                TotalMargin = row.Field<Object>("TotalMargin"),
                Barcode = row.Field<String>("Barcode"),
                SKU = row.Field<String>("SKU"),
                SupplierName = row.Field<String>("SupplierName"),
                CategoryName = row.Field<String>("CategoryName"),
                BrandName = row.Field<String>("BrandName"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableStockMovementLog()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_StockMovementLog", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapStockMovementLog).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapStockMovementLog(DataRow row)
        {
            Object result = new
            {
                TransactionTime = row.Field<Object>("TransactionTime"),
                ProductName = row.Field<String>("ProductName"),
                SKU = row.Field<Object>("SKU"),
                Barcode = row.Field<Object>("Barcode"),
                CategoryName = row.Field<String>("CategoryName"),
                BrandName = row.Field<String>("BrandName"),
                SupplierName = row.Field<String>("SupplierName"),
                LocationName = row.Field<String>("LocationName"),
                StaffName = row.Field<String>("StaffName"),
                Action = row.Field<String>("Action"),
                OrderNo = row.Field<String>("OrderNo"),
                InvoiceNo = row.Field<String>("InvoiceNo"),
                Adjustment = row.Field<Object>("Adjustment"),
                CostPrice = row.Field<Object>("CostPrice"),
                AdjustmentCost = row.Field<Object>("AdjustmentCost"),
                StockOnHand = row.Field<Object>("StockOnHand"),
                StockOnHandCost = row.Field<Object>("StockOnHandCost"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableStockMovementSummary()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_StockMovementSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapStockMovementSummary).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapStockMovementSummary(DataRow row)
        {
            Object result = new
            {
                ProductID = row.Field<Object>("ProductID"),
                ProductName = row.Field<String>("ProductName"),
                Barcode = row.Field<String>("Barcode"),
                SKU = row.Field<Object>("SKU"),
                CategoryName = row.Field<String>("CategoryName"),
                BrandName = row.Field<String>("BrandName"),
                SupplierName = row.Field<String>("SupplierName"),
                StartStock = row.Field<Object>("StartStock"),
                StartStockValue = row.Field<Object>("StartStockValue"),
                Received = row.Field<Object>("Received"),
                Deducted = row.Field<Object>("Deducted"),
                OrdersReceived = row.Field<Object>("OrdersReceived"),
                DeletedInvoice = row.Field<Object>("DeletedInvoice"),
                NewStock = row.Field<Object>("NewStock"),
                Returned = row.Field<Object>("Returned"),
                Sold = row.Field<Object>("Sold"),
                InternalUse = row.Field<Object>("InternalUse"),
                Damaged = row.Field<Object>("Damaged"),
                OutOfDate = row.Field<Object>("OutOfDate"),
                Transfers = row.Field<Object>("Transfers"),
                Adjustments = row.Field<Object>("Adjustments"),
                Others = row.Field<Object>("Others"),
                EndStock = row.Field<Object>("EndStock"),
                EndStockValue = row.Field<Object>("EndStockValue"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDateTableProductConsumption()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }
                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_ProductConsumptionSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapProductConsumption).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapProductConsumption(DataRow row)
        {
            Object result = new
            {
                StockTypeName = row.Field<String>("StockTypeName"),
                Value = row.Field<Object>("Value"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDateTableProductConsumptionDetail()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }
                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                string StockType = "";
                if (Request.Form.GetValues("StockType")[0] != null)
                {
                    if (Request.Form.GetValues("StockType")[0] != "")
                    {
                        StockType = Request.Form.GetValues("StockType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));
                para.Add(new SqlParameter("StockType", StockType));


                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_ProductConsumptionDetail", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapProductConsumptionDetail).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapProductConsumptionDetail(DataRow row)
        {
            Object result = new
            {
                ProductID = row.Field<Object>("ProductID"),
                ProductName = row.Field<String>("ProductName"),
                Barcode = row.Field<Object>("Barcode"),
                SKU = row.Field<Object>("SKU"),
                QuantityUsed = row.Field<Object>("QuantityUsed"),
                TotalCost = row.Field<Object>("TotalCost"),
                AVGCostPrice = row.Field<Object>("AVGCostPrice"),
            };
            return result;
        }

        #endregion

        #region Reports Appointments

        [HttpPost]
        public JsonResult GetDataTableAppointmentsSummary()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string ByType = "";

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("ByType")[0] != null)
                {
                    if (Request.Form.GetValues("ByType")[0] != "")
                    {
                        ByType = Request.Form.GetValues("ByType")[0].ToString();
                    }
                }


                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("ByType", ByType));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));


                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_AppointmentsSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapAppointmentsSummary).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapAppointmentsSummary(DataRow row)
        {
            Object result = new
            {
                Name = row.Field<String>("Name"),
                Appointments = row.Field<Object>("Appointments"),
                TotalValue = row.Field<Object>("TotalValue"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableAppointmentCancel()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string ByType = "";

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("ByType")[0] != null)
                {
                    if (Request.Form.GetValues("ByType")[0] != "")
                    {
                        ByType = Request.Form.GetValues("ByType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("ByType", ByType));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));


                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_AppointmentsCancellations", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapAppointmentCancel).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapAppointmentCancel(DataRow row)
        {
            Object result = new
            {
                RefNo = row.Field<String>("RefNo"),
                ClientName = row.Field<String>("ClientName"),
                ServiceName = row.Field<String>("ServiceName"),
                ScheduledDate = row.Field<Object>("ScheduledDate"),
                DateTimeCancel = row.Field<Object>("DateTimeCancel"),
                CancelBy = row.Field<String>("CancelBy"),
                ReasonCancel = row.Field<String>("ReasonCancel"),
                Price = row.Field<Object>("Price"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableReasonCancel()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string ByType = "";

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("ByType")[0] != null)
                {
                    if (Request.Form.GetValues("ByType")[0] != "")
                    {
                        ByType = Request.Form.GetValues("ByType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("ByType", ByType));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));


                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_AppointmentsCancellations", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapReasonCancel).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapReasonCancel(DataRow row)
        {
            Object result = new
            {
                ReasonCancel = row.Field<String>("ReasonCancel"),
                Appointments = row.Field<Object>("Appointments"),
            };
            return result;
        }
        #endregion

        #region Reports Clients

        [HttpPost]
        public JsonResult GetDataTableClientList()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));


                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_ClientList", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapClientList).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapClientList(DataRow row)
        {
            Object result = new
            {
                ClientID = row.Field<Object>("ClientID"),
                ClientName = row.Field<String>("ClientName"),
                FirstName = row.Field<String>("FirstName"),
                LastName = row.Field<String>("LastName"),
                MobileNumberDialCode = row.Field<String>("MobileNumberDialCode"),
                MobileNumber = row.Field<String>("MobileNumber"),
                TelephoneDialCode = row.Field<String>("TelephoneDialCode"),
                Telephone = row.Field<String>("Telephone"),
                Email = row.Field<String>("Email"),
                AcceptMarketingNotifications = row.Field<Object>("AcceptMarketingNotifications"),
                Gender = row.Field<String>("Gender"),
                Appointments = row.Field<Object>("Appointments"),
                NoShows = row.Field<Object>("NoShows"),
                TotalSales = row.Field<Object>("TotalSales"),
                Outstanding = row.Field<Object>("Outstanding"),
                Address = row.Field<String>("Address"),
                Suburb = row.Field<String>("Suburb"),
                City = row.Field<String>("City"),
                State = row.Field<String>("State"),
                PostCode = row.Field<String>("PostCode"),
                DateOfBirth = row.Field<Object>("DateOfBirth"),
                LastLocation = row.Field<String>("LastLocation"),
                CreateDate = row.Field<Object>("CreateDate"),
                LastAppointment = row.Field<Object>("LastAppointment"),
                ClientNotes = row.Field<String>("ClientNotes"),
                ReferralSourceName = row.Field<String>("ReferralSourceName"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableClientRetention()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));


                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_ClientRetention", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapClientRetention).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapClientRetention(DataRow row)
        {
            Object result = new
            {
                ClientName = row.Field<Object>("ClientName"),
                MobileNumber = row.Field<Object>("MobileNumber"),
                Email = row.Field<Object>("Email"),
                LastAppointment = row.Field<Object>("LastAppointment"),
                DaysAbsent = row.Field<Object>("DaysAbsent"),
                StaffName = row.Field<Object>("StaffName"),
                LastVisitSales = row.Field<Object>("LastVisitSales"),
                TotalSales = row.Field<Object>("TotalSales"),
                TotalAppointments = row.Field<Object>("TotalAppointments"),
                NoShows = row.Field<Object>("NoShows"),
                Outstanding = row.Field<Object>("Outstanding"),
                LastLocation = row.Field<Object>("LastLocation"),
            };
            return result;
        }

        #endregion

        #region Reports Sales

        [HttpPost]
        public JsonResult GetDataTableSalesBy()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string Channel = "all";

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("Channel")[0] != null)
                {
                    if (Request.Form.GetValues("Channel")[0] != "all")
                    {
                        Channel = Request.Form.GetValues("Channel")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);
                string ReportType = "";
                if (Request.Form.GetValues("ReportType")[0] != null)
                {
                    if (Request.Form.GetValues("ReportType")[0] != "")
                    {
                        ReportType = Request.Form.GetValues("ReportType")[0].ToString();
                    }
                }
                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("Channel", Channel));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDate", todate));
                para.Add(new SqlParameter("ByType", ReportType));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_SalesBy", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapSalesBy).ToList();
                return Json(new
                {
                    data = ret
                });
            }

            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapSalesBy(DataRow row)
        {
            Object result = new
            {
                ItemName = row.Field<String>("ItemName"),
                ItemsSold = row.Field<Object>("ItemsSold"),
                GrossSales = row.Field<Object>("GrossSales"),
                Discounts = row.Field<Object>("Discounts"),
                Refunds = row.Field<Object>("Refunds"),
                NetSales = row.Field<Object>("NetSales"),
                Tax = row.Field<Object>("Tax"),
                TotalSales = row.Field<Object>("TotalSales"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableSalesByStaffBreak()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string Channel = "all";
                string ItemType = "all";
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("Channel")[0] != null)
                {
                    if (Request.Form.GetValues("Channel")[0] != "all")
                    {
                        Channel = Request.Form.GetValues("Channel")[0].ToString();
                    }
                }

                if (Request.Form.GetValues("ItemType")[0] != null)
                {
                    if (Request.Form.GetValues("ItemType")[0] != "all")
                    {
                        ItemType = Request.Form.GetValues("ItemType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("Channel", Channel));
                para.Add(new SqlParameter("ItemType", ItemType));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDate", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_SalesByStaffBreakdown", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapSalesByStaffBreak).ToList();
                return Json(new
                {
                    data = ret
                });
            }

            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapSalesByStaffBreak(DataRow row)
        {
            Object result = new
            {
                Staff = row.Field<String>("Staff"),
                Services = row.Field<Object>("Services"),
                Products = row.Field<Object>("Products"),
                TotalSales = row.Field<Object>("TotalSales"),
                Vouchers = row.Field<Object>("Vouchers"),
                Total = row.Field<Object>("Total"),
                PercentTotal = row.Field<Object>("PercentTotal"),
                ItemSold = row.Field<Object>("ItemSold"),
                AVGItemPrice = row.Field<Object>("AVGItemPrice"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableSalesByHoursofDay()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDate", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_SalesByHourOfDay", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapSalesHoursofDay).ToList();
                return Json(new
                {
                    data = ret
                });
            }

            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapSalesHoursofDay(DataRow row)
        {
            Object result = new
            {
                HourDisplay = row.Field<String>("HourDisplay"),
                SalesQuantity = row.Field<Object>("SalesQuantity"),
                NetSales = row.Field<Object>("NetSales"),
                AVSale = row.Field<Object>("AVSale"),
                PercentSale = row.Field<Object>("PercentSale"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableSalesLog()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string IncludeVoucher = "";

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }
                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }

                if (Request.Form.GetValues("IncludeVoucher")[0] != null)
                {
                    if (Request.Form.GetValues("IncludeVoucher")[0] != "")
                    {
                        IncludeVoucher = Request.Form.GetValues("IncludeVoucher")[0].ToString();
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("IncludeVoucher", IncludeVoucher));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDate", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_SalesLog", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapSalesLog).ToList();
                return Json(new
                {
                    data = ret
                });
            }

            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapSalesLog(DataRow row)
        {
            Object result = new
            {
                InvoiceDate = row.Field<Object>("InvoiceDate"),
                LocationName = row.Field<String>("LocationName"),
                InvoiceNo = row.Field<String>("InvoiceNo"),
                ItemName = row.Field<String>("ItemName"),
                Quantity = row.Field<Object>("Quantity"),
                GrossSales = row.Field<Object>("GrossSales"),
                DiscountAmount = row.Field<Object>("DiscountAmount"),
                Refunds = row.Field<Object>("Refunds"),
                NetSales = row.Field<Object>("NetSales"),
                TaxAmount = row.Field<Object>("TaxAmount"),
                TotalSales = row.Field<Object>("TotalSales"),
                InvoiceStatus = row.Field<String>("InvoiceStatus"),
                ClientName = row.Field<String>("ClientName"),
                MobileNumber = row.Field<String>("MobileNumber"),
                Channel = row.Field<String>("Channel"),
                InvoiceType = row.Field<String>("InvoiceType"),
                Staff = row.Field<String>("Staff"),
                ItemType = row.Field<String>("ItemType"),
                Barcode = row.Field<String>("Barcode"),
                SKU = row.Field<String>("SKU"),
                CategoryName = row.Field<String>("CategoryName"),
                BrandName = row.Field<String>("BrandName"),
                CostPrice = row.Field<Object>("CostPrice"),
                DiscountType = row.Field<String>("DiscountType"),
                PaymentTypeName = row.Field<String>("PaymentTypeName"),
            };
            return result;
        }



        #endregion

        #region Reports Vouchers

        [HttpPost]
        public JsonResult GetDataTableVouchersOutstanding()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));


                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_VouchersOutstandingBalance", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapVouchersOutstanding).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapVouchersOutstanding(DataRow row)
        {
            Object result = new
            {
                Date = row.Field<Object>("Date"),
                OpeningBalance = row.Field<Object>("OpeningBalance"),
                IssuedValue = row.Field<Object>("IssuedValue"),
                SoldValue = row.Field<Object>("SoldValue"),
                ExpiredValue = row.Field<Object>("ExpiredValue"),
                RedeemedValue = row.Field<Object>("RedeemedValue"),
                RefundedValue = row.Field<Object>("RefundedValue"),
                ClosingBalance = row.Field<Object>("ClosingBalance"),
                NetChange = row.Field<Object>("NetChange"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableVouchersSales()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_VoucherSales", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapVouchersSales).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapVouchersSales(DataRow row)
        {
            Object result = new
            {
                InvoiceDate = row.Field<Object>("InvoiceDate"),
                InvoiceNo = row.Field<Object>("InvoiceNo"),
                ClientName = row.Field<Object>("ClientName"),
                IssuedValue = row.Field<Object>("IssuedValue"),
                Discount = row.Field<Object>("Discount"),
                TotalSales = row.Field<Object>("TotalSales"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableVoucherRedemptions()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_VoucherRedemptions", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapVoucherRedemptions).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapVoucherRedemptions(DataRow row)
        {
            Object result = new
            {
                PaymentDate = row.Field<Object>("PaymentDate"),
                InvoiceNo = row.Field<Object>("InvoiceNo"),
                ClientName = row.Field<Object>("ClientName"),
                RedeemedValue = row.Field<Object>("RedeemedValue"),
            };
            return result;
        }

        #endregion

        #region Reports Staff

        [HttpPost]
        public JsonResult GetDataTableStaffWorkingHours()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_StaffWorkingHours", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapStaffWorkingHours).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapStaffWorkingHours(DataRow row)
        {
            Object result = new
            {
                FullName = row.Field<Object>("FullName"),
                Date = row.Field<Object>("Date"),
                StartTime = row.Field<Object>("StartTime"),
                EndTime = row.Field<Object>("EndTime"),
                Duration = row.Field<Object>("Duration"),
                WorkMinute = row.Field<Object>("WorkMinute"),
                TotalWorkMinute = row.Field<Object>("TotalWorkMinute"),
                Bold = row.Field<Object>("Bold"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableTipsByStaff()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_StaffTips", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapTipsByStaff).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapTipsByStaff(DataRow row)
        {
            Object result = new
            {
                Staff = row.Field<Object>("Staff"),
                CollectedTips = row.Field<Object>("CollectedTips"),
                RefundedTips = row.Field<Object>("RefundedTips"),
                TotalTips = row.Field<Object>("TotalTips"),
                AverageTip = row.Field<Object>("AverageTip"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableCommissionStaff()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string ByType = "";
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("ByType")[0] != null)
                {
                    if (Request.Form.GetValues("ByType")[0] != "")
                    {
                        ByType = Request.Form.GetValues("ByType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("ByType", ByType));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_CommissionSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapCommissionStaff).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapCommissionStaff(DataRow row)
        {
            Object result = new
            {
                StaffMember = row.Field<Object>("StaffMember"),
                ServiceSalesTotal = row.Field<Object>("ServiceSalesTotal"),
                ServiceCommission = row.Field<Object>("ServiceCommission"),
                ProductSalesTotal = row.Field<Object>("ProductSalesTotal"),
                ProductCommission = row.Field<Object>("ProductCommission"),
                VoucherSaleTotal = row.Field<Object>("VoucherSaleTotal"),
                VoucherCommission = row.Field<Object>("VoucherCommission"),
                CommissionTotal = row.Field<Object>("CommissionTotal"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableCommissionService()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string ByType = "";
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("ByType")[0] != null)
                {
                    if (Request.Form.GetValues("ByType")[0] != "")
                    {
                        ByType = Request.Form.GetValues("ByType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("ByType", ByType));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_CommissionSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapCommissionService).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapCommissionService(DataRow row)
        {
            Object result = new
            {
                ServiceName = row.Field<Object>("ServiceName"),
                Qty = row.Field<Object>("Qty"),
                SalesAmount = row.Field<Object>("SalesAmount"),
                RefundAmount = row.Field<Object>("RefundAmount"),
                SalesTotal = row.Field<Object>("SalesTotal"),
                AVGSalesPrice = row.Field<Object>("AVGSalesPrice"),
                CommissionTotal = row.Field<Object>("CommissionTotal"),
                AVGCommission = row.Field<Object>("AVGCommission"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableCommissionProduct()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string ByType = "";
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("ByType")[0] != null)
                {
                    if (Request.Form.GetValues("ByType")[0] != "")
                    {
                        ByType = Request.Form.GetValues("ByType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("ByType", ByType));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_CommissionSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapCommissionProduct).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapCommissionProduct(DataRow row)
        {
            Object result = new
            {
                ProductName = row.Field<Object>("ProductName"),
                Qty = row.Field<Object>("Qty"),
                SalesAmount = row.Field<Object>("SalesAmount"),
                RefundAmount = row.Field<Object>("RefundAmount"),
                SalesTotal = row.Field<Object>("SalesTotal"),
                AVGSalesPrice = row.Field<Object>("AVGSalesPrice"),
                CommissionTotal = row.Field<Object>("CommissionTotal"),
                AVGCommission = row.Field<Object>("AVGCommission"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableCommissionVoucher()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;
                string ByType = "";
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                if (Request.Form.GetValues("ByType")[0] != null)
                {
                    if (Request.Form.GetValues("ByType")[0] != "")
                    {
                        ByType = Request.Form.GetValues("ByType")[0].ToString();
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("ByType", ByType));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_CommissionSummary", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapCommissionVoucher).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapCommissionVoucher(DataRow row)
        {
            Object result = new
            {
                VoucherName = row.Field<Object>("VoucherName"),
                Qty = row.Field<Object>("Qty"),
                SalesAmount = row.Field<Object>("SalesAmount"),
                RefundAmount = row.Field<Object>("RefundAmount"),
                SalesTotal = row.Field<Object>("SalesTotal"),
                AVGSalesPrice = row.Field<Object>("AVGSalesPrice"),
                CommissionTotal = row.Field<Object>("CommissionTotal"),
                AVGCommission = row.Field<Object>("AVGCommission"),
            };
            return result;
        }

        [HttpPost]
        public JsonResult GetDataTableCommissionStaffDetailed()
        {
            try
            {
                User user = (User)Session["AccountLogin"] ?? new Models.User();
                int LocationID = 0;
                int StaffID = 0;

                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                if (Request.Form.GetValues("StaffID")[0] != null)
                {
                    if (Request.Form.GetValues("StaffID")[0] != "")
                    {
                        StaffID = Convert.ToInt32(Request.Form.GetValues("StaffID")[0]);
                    }
                }

                DateTime fromdate = DateTime.Today;
                if (Request.Form.GetValues("fromdate")[0] != null)
                {
                    if (Request.Form.GetValues("fromdate")[0] != "")
                    {
                        fromdate = Convert.ToDateTime(Request.Form.GetValues("fromdate")[0] ?? DateTime.Now.ToString());
                    }
                }

                DateTime todate = DateTime.Today;
                if (Request.Form.GetValues("todate")[0] != null)
                {
                    if (Request.Form.GetValues("todate")[0] != "")
                    {
                        todate = Convert.ToDateTime(Request.Form.GetValues("todate")[0] ?? DateTime.Now.ToString());
                    }
                }
                todate = todate.AddHours(23).AddMinutes(59);

                List<SqlParameter> para = new List<SqlParameter>();
                para.Add(new SqlParameter("BusinessID", user.BusinessID));
                para.Add(new SqlParameter("LocationID", LocationID));
                para.Add(new SqlParameter("StaffID", StaffID));
                para.Add(new SqlParameter("FromDate", fromdate));
                para.Add(new SqlParameter("ToDaTe", todate));

                DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_Report_CommissionDetailed", para.ToArray());

                List<Object> ret = dt.AsEnumerable().Select(MapStaffDetailed).ToList();
                return Json(new
                {
                    data = ret
                });
            }
            catch (Exception ex) { return Json(new { data = new List<Object>() }, JsonRequestBehavior.AllowGet); }
        }
        private Object MapStaffDetailed(DataRow row)
        {
            Object result = new
            {
                InvoiceDate = row.Field<Object>("InvoiceDate"),
                InvoiceNo = row.Field<Object>("InvoiceNo"),
                StaffIV = row.Field<Object>("StaffIV"),
                ItemName = row.Field<Object>("ItemName"),
                Quantity = row.Field<Object>("Quantity"),
                SaleValue = row.Field<Object>("SaleValue"),
                CommissionRate = row.Field<Object>("CommissionRate"),
                CommissionAmount = row.Field<Object>("CommissionAmount"),
            };
            return result;
        }

        #endregion

        #region Dashboard Analytics
        [HttpPost]
        public JsonResult GetDataAnalyticsDashBoard(long LocationID, long StaffID, DateTime Date, int Mode)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(ExcuteData_Main<User>.ExecuteStoreQuery("pr_Report_Dashboard", null, dset =>
            {
                Object item = new
                {
                    Title = dset.Tables[0].AsEnumerable().Select(row => new
                    {
                        TotalAppointments = row.Field<Object>("TotalAppointments"),
                        AppointmentsPre = row.Field<Object>("AppointmentsPre"),

                        AppointmentsComplete = row.Field<Object>("AppointmentsComplete"),
                        AppointmentsCompletePercent = row.Field<Object>("AppointmentsCompletePercent"),
                        AppointmentsNotCompleted = row.Field<Object>("AppointmentsNotCompleted"),
                        AppointmentsNotCompletedPercent = row.Field<Object>("AppointmentsNotCompletedPercent"),
                        AppointmentsCanceled = row.Field<Object>("AppointmentsCanceled"),
                        AppointmentsCanceledPercent = row.Field<Object>("AppointmentsCanceledPercent"),
                        AppointmentsNoShow = row.Field<Object>("AppointmentsNoShow"),
                        AppointmentsNoShowPercent = row.Field<Object>("AppointmentsNoShowPercent"),
                        TotalOnlineAppointments = row.Field<Object>("TotalOnlineAppointments"),
                        OnlineAppointmentsPercent = row.Field<Object>("OnlineAppointmentsPercent"),
                        OnlineAppointmentsPre = row.Field<Object>("OnlineAppointmentsPre"),
                        OnlineAppointmentsComplete = row.Field<Object>("OnlineAppointmentsComplete"),
                        OnlineAppointmentsCompletePercent = row.Field<Object>("OnlineAppointmentsCompletePercent"),
                        OnlineAppointmentsNotCompleted = row.Field<Object>("OnlineAppointmentsNotCompleted"),
                        OnlineAppointmentsNotCompletedPercent = row.Field<Object>("OnlineAppointmentsNotCompletedPercent"),
                        OnlineAppointmentsCanceled = row.Field<Object>("OnlineAppointmentsCanceled"),
                        OnlineAppointmentsCanceledPercent = row.Field<Object>("OnlineAppointmentsCanceledPercent"),
                        OnlineAppointmentsNoShow = row.Field<Object>("OnlineAppointmentsNoShow"),
                        OnlineAppointmentsNoShowPercent = row.Field<Object>("OnlineAppointmentsNoShowPercent"),
                        OccupancyPercent = row.Field<Object>("OccupancyPercent"),
                        OccupancyPre = row.Field<Object>("OccupancyPre"),
                        WorkingHours = row.Field<Object>("WorkingHours"),
                        BookedHours = row.Field<Object>("BookedHours"),
                        BookedHoursPercent = row.Field<Object>("BookedHoursPercent"),
                        BlockedHours = row.Field<Object>("BlockedHours"),

                        BlockedHoursPercent = row.Field<Object>("BlockedHoursPercent"),
                        UnbookedHours = row.Field<Object>("UnbookedHours"),
                        UnbookedHoursPercent = row.Field<Object>("UnbookedHoursPercent"),
                        TotalSales = row.Field<Object>("TotalSales"),
                        TotalSalesPre = row.Field<Object>("TotalSalesPre"),
                        Services = row.Field<Object>("Services"),
                        ServicesPercent = row.Field<Object>("ServicesPercent"),
                        Products = row.Field<Object>("Products"),
                        ProductsPercent = row.Field<Object>("ProductsPercent"),
                        AverageSale = row.Field<Object>("AverageSale"),
                        AverageSalePre = row.Field<Object>("AverageSalePre"),
                        SalesCount = row.Field<Object>("SalesCount"),
                        AvServiceSale = row.Field<Object>("AvServiceSale"),
                        AvProductSale = row.Field<Object>("AvProductSale"),
                        ClientRetention = row.Field<Object>("ClientRetention"),
                        ClientRetentionPre = row.Field<Object>("ClientRetentionPre"),
                        Returning = row.Field<Object>("Returning"),
                        ReturningPercent = row.Field<Object>("ReturningPercent"),
                        New = row.Field<Object>("New"),
                        NewPercent = row.Field<Object>("NewPercent"),
                        WalkIn = row.Field<Object>("WalkIn"),
                        WalkInPercent = row.Field<Object>("WalkInPercent"),

                    }).ToList(),
                    ChartAppointment = dset.Tables[1].AsEnumerable().Select(row =>
                    new
                    {
                        ID = row.Field<Object>("ID"),
                        Name = row.Field<String>("Name"),
                        Item1 = row.Field<Object>("TotalAppointments"),
                        Item2 = row.Field<Object>("OnlineBookings"),
                    }).ToList(),
                    ChartSale = dset.Tables[2].AsEnumerable().Select(row =>
                    new
                    {
                        ID = row.Field<Object>("ID"),
                        Name = row.Field<String>("Name"),
                        Item1 = row.Field<Object>("Services"),
                        Item2 = row.Field<Object>("Products"),
                    }).ToList(),
                };
                return item;
            }, false, new List<SqlParameter>() { new SqlParameter("BusinessID", BusinessID), new SqlParameter("LocationID", LocationID), new SqlParameter("StaffID", StaffID), new SqlParameter("Date", Date), new SqlParameter("Mode", Mode) }.ToArray()), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #endregion
    }
}
