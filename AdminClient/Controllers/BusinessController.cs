using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using System.Linq.Expressions;

namespace AdminClient.Controllers.Global
{
    public class BusinessController : Controller
    {
        [CheckPermision]
        public ActionResult Index()
        {
            return View("/Views/Admin/Business/Index.cshtml");
        }

        [HttpPost]
        public JsonResult GetDataTableBusiness()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();

            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            var sortColumn = Request.Form.GetValues("columns[" + orderColumn + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];

            Expression<Func<V_BUSINESS, bool>> queryWhere = n => n.BusinessID == n.BusinessID && (n.CompanyName.Contains(search) || n.Address.Contains(search) || n.ContactNumber.Contains(search) || n.CountryName.Contains(search) || n.Email.Contains(search) || n.FirstName.Contains(search) || n.LastName.Contains(search) || n.PackageName.Contains(search) || n.Website.Contains(search) || n.Description.Contains(search));
            long countData = ExcuteData_Main<V_BUSINESS>.Count(queryWhere);
            List<V_BUSINESS> lst = ExcuteData_Main<V_BUSINESS>.SelectWithPaging(queryWhere, start, length, sortColumn, (sortColumnDir.ToLower() != "asc"));

            return Json(new { data = lst, recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataTableUser()
        {
            long BussinessID = Convert.ToInt64(Request.Form.GetValues("BussinessID").FirstOrDefault() ?? "0");
            int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            var sortColumn = Request.Form.GetValues("columns[" + orderColumn + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];
            List<Object> data = ExcuteData_User.GetUserBaseBussines(search, BussinessID, sortColumn, sortColumnDir);
            return Json(new { data = data, recordsFiltered = data.Count, recordsTotal = data.Count, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveCompanyDetails(Business business, DateTime ExpireDate)
        {
            Business oldBusiness = ExcuteData_Main<Business>.GetById(business.BusinessID);
            business.ModifyDate = DateTime.Now;
            business.CreateDate = oldBusiness.CreateDate;
            business.Language = oldBusiness.Language;
            ExcuteData_Main<Business>.Update(business);
            if (ExpireDate != null)
            {
                BusinessSetting bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == business.BusinessID && n.SettingCode == "BSExpiry").FirstOrDefault();
                if (bs != null)
                {
                    bs.Value = ExpireDate.Year.ToString() + "/" + ExpireDate.Month.ToString() + "/" + ExpireDate.Day.ToString();
                    ExcuteData_Main<BusinessSetting>.Update(bs);
                }
                else
                {
                    bs = new BusinessSetting
                    {
                        BusinessID = business.BusinessID,
                        SettingCode = "BSExpiry",
                        Value = ExpireDate.Year.ToString() + "/" + ExpireDate.Month.ToString() + "/" + ExpireDate.Day.ToString(),
                        SettingGroup = "Business Settings"
                    };
                    ExcuteData_Main<BusinessSetting>.Insert(bs);
                }
            }
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteMulitiBussines(List<long> BusinessIDs)
        {
            BusinessIDs.ForEach(n => ExcuteData_Main<Business>.Delete(n));
            new System.Threading.Thread(() =>
            {
                BusinessIDs.ForEach(n =>
                {
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_VOUCHER WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_USER_WORKING_HOUR WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_USER_LOCATION WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_USER WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_TAX_LOCATION WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_TAX WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_SUPPLIER WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_SMS WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_SERVICE_STAFF WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_SERVICE_RESOURCE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_SERVICE_GROUP WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_SERVICE_DURATION WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_SERVICE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_RESOURCE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_REFERRAL_SOURCE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_PRODUCT_STOCK_MOVEMENT WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_PRODUCT_LOCATION WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_PRODUCT WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_PERMISSION_LEVEL WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_PAYMENT_TYPE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_ORDER_PRODUCT WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_ORDER WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_MESSAGE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_LOCATION WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_INVOICE_TIP WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_INVOICE_PAYMENT WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_INVOICE_DETAIL WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_INVOICE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_DISCOUNT WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_CLOSED_DATE_LOCATION WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_CLOSED_DATE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_CLIENT WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_CATEGORY WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_CANCELLATION_REASON WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_BUSINESS_SETTING WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_BRAND WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_BLOCK_TIME WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_APPOINTMENT_SERVICE WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_APPOINTMENT_REMINDER WHERE BusinessID = " + n.ToString());
                    ExcuteData_Main<Business>.ExecuteSqlQuery("DELETE FROM TBL_APPOINTMENT WHERE BusinessID = " + n.ToString());

                });
            }).Start();
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetLocationByBusiness(long BusinessID)
        {
            try
            {
                List<Location> ls = ExcuteData_Main<Location>.Find(n => n.BusinessID == BusinessID).OrderBy(n => n.SortOrder).ToList();
                return Json(new { data = ls, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = "", ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}