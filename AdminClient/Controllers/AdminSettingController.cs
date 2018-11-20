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
    public class AdminSettingController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Index()
        {
            return View("/Views/Admin/AdminSetting/Index.cshtml");
        }

        public ActionResult SiteSetup()
        {
            List<Config> olds = ExcuteData_Main<Config>.GetAll();
            return View("/Views/Admin/AdminSetting/SiteSetup.cshtml", olds);
        }

        public ActionResult ClientNotifications()
        {
            return View("/Views/Admin/AdminSetting/ClientNotifications.cshtml");
        }

        public ActionResult Package()
        {
            return View("/Views/Admin/AdminSetting/Package.cshtml");
        }

        #endregion

        #region Ajax
        #region SiteSetup
        [HttpPost]
        public JsonResult SaveConfig(List<Config> EntityConfigs)
        {
            try
            {
                foreach (var item in EntityConfigs)
                {
                    if(item.Value == null)
                    {
                        item.Value = "";
                    }
                    ExcuteData_Main<Config>.Update(item);
                }
                
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        #endregion

        #region ClientNotifications
        [HttpPost]
        public JsonResult GetBusinessSetting(string SettingGroup)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                List<BusinessSetting> olds = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == u.BusinessID && n.SettingGroup == SettingGroup);
                return Json(new { data = olds, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SaveBusinessSettings(List<BusinessSetting> businessSettings)
        {
            try
            {
                User u = (User)Session["AccountLogin"];
                foreach (var item in businessSettings)
                {
                    BusinessSetting itemold = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == u.BusinessID && n.SettingCode == item.SettingCode).FirstOrDefault();
                    if (itemold != null)
                    {
                        itemold.Value = item.Value == null ? "" : item.Value;
                        ExcuteData_Main<BusinessSetting>.Update(itemold);
                    }
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult PreviewTemplateNotification(string template)
        {
            try
            {
                string ret = "";
                string[] lstr = template.Split(new string[] { "\n\n" }, StringSplitOptions.None);
                foreach (string item in lstr)
                {
                    ret = ret + "<p>" + item.Replace("\n", "<br>") + "</p>";
                }

                User u = (User)Session["AccountLogin"] ?? new Models.User();

                ret = ret.Replace("CLIENT_FIRST_NAME", "Kevin");
                ret = ret.Replace("CLIENT_LAST_NAME", "Doan");
                ret = ret.Replace("STAFF_FIRST_NAME", u.FirstName);
                ret = ret.Replace("STAFF_LAST_NAME", u.LastName);
                ret = ret.Replace("BOOKING_DATE_TIME", "Saturday, 14 Jul 2018 at 8:00");
                ret = ret.Replace("BOOKING_DATE", "Saturday, 14 Jul 2018");
                ret = ret.Replace("BOOKING_TIME", "08:00");
                ret = ret.Replace("BOOKING_REFERENCE", "03301EDC9F");

                ret = ret.Replace("SERVICE_NAME", "Haircut");

                ret = ret.Replace("BUSINESS_NAME", "KYRIO");

                ret = ret.Replace("LOCATION_NAME", "SINGAPORE");
                ret = ret.Replace("LOCATION_PHONE", "09090909");

                return Json(new { data = ret, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = "", ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Package
        [HttpPost]
        public JsonResult GetDataTablePackage()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                Expression<Func<SYS_PACKAGE, bool>> queryWhere = n => n.PackageID == n.PackageID;
                long countData = ExcuteData_Main<SYS_PACKAGE>.Count(queryWhere);
                return Json(new { data = ExcuteData_Main<SYS_PACKAGE>.Find(queryWhere), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DeletePackage(long id)
        {
            int errorStyle = 0;
            try
            {
                ExcuteData_Main<SYS_PACKAGE>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult AddOrUpdatePackage(SYS_PACKAGE entity, Boolean isUpdate)
        {
            try
            {
                if (isUpdate)
                {
                    ExcuteData_Main<SYS_PACKAGE>.Update(entity);
                }
                else
                {
                    ExcuteData_Main<SYS_PACKAGE>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        #endregion

        #endregion
    }
}