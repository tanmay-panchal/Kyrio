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
    public class UpdateHistoryController : Controller
    {
        [CheckPermision]
        public ActionResult Index()
        {
            return View("/Views/Admin/UpdateHistory/Index.cshtml");
        }

        [HttpPost]
        public JsonResult GetDataTable()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();

            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            var sortColumn = Request.Form.GetValues("columns[" + orderColumn + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];

            
            List<UpdateHistory> lst = ExcuteData_Main<UpdateHistory>.SelectWithPaging(null, start, length, sortColumn, (sortColumnDir.ToLower() != "asc"));

            return Json(new { data = lst, recordsFiltered = lst.Count, recordsTotal = lst.Count, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult AddOrUpdate(UpdateHistory entity, Boolean isUpdate)
        {
            try
            {
                if (isUpdate)
                {
                    ExcuteData_Main<UpdateHistory>.Update(entity);
                }
                else
                {
                    ExcuteData_Main<UpdateHistory>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult DeleteMulti(List<long> UpdateIDs)
        {
            UpdateIDs.ForEach(n => ExcuteData_Main<Business>.Delete(n));
            new System.Threading.Thread(() =>
            {
                UpdateIDs.ForEach(n =>
                {
                    ExcuteData_Main<UpdateHistory>.ExecuteSqlQuery("DELETE FROM TBL_UPDATE_HISTORY WHERE UpdateID = " + n.ToString());
                });
            }).Start();
            return Json(true, JsonRequestBehavior.AllowGet);
        }
    }
}