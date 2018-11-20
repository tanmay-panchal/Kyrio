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
    public class ClientsController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Index()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.clients)))
            {
                return View();
            }
            else
            {
                return View("NotFound");
            }

        }

        [CheckPermision]
        public ActionResult Clients(long id)
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.clients)))
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                V_CLIENT c = ExcuteData_Main<V_CLIENT>.Find(n => n.BusinessID == u.BusinessID && n.ClientID == id).FirstOrDefault();
                if (c == null)
                    return View("/Views/Clients/Index.cshtml");
                else
                {
                    return View("/Views/Clients/View.cshtml", c);
                }
            }
            else
            {
                return View("NotFound");
            }

        }
        #endregion

        #region Ajax
        [HttpPost]
        public JsonResult GetDataTable()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            var sortColumn = Request.Form.GetValues("columns[" + (orderColumn == 0 ? 1 : orderColumn) + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];

            Expression<Func<Client, bool>> queryWhere = n => n.BusinessID == u.BusinessID && (n.FirstName.Contains(search) || n.LastName.Contains(search) || n.Email.Contains(search) || n.MobileNumber.Contains(search));
            long countData = ExcuteData_Main<Client>.Count(queryWhere);
            List<Client> lst = ExcuteData_Main<Client>.SelectWithPaging(queryWhere, start, length, sortColumn, (sortColumnDir.ToLower() != "asc"));
            return Json(new { data = lst, recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetClientByID(long ID)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            return Json(new { data = ExcuteData_Main<Client>.Find(n => n.BusinessID == u.BusinessID && n.ClientID == ID).FirstOrDefault(), ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddOrUpdate(Client entity, Boolean isUpdate)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                if (isUpdate)
                {
                    Client entityOld = ExcuteData_Main<Client>.GetById(entity.ClientID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.BusinessID = entityOld.BusinessID;
                    entity.Appointments = entityOld.Appointments;
                    entity.NoShows = entityOld.NoShows;
                    entity.TotalSales = entityOld.TotalSales;
                    entity.Outstanding = entityOld.Outstanding;
                    entity.LastLocation = entityOld.LastLocation;
                    entity.LastAppointment = entityOld.LastAppointment;

                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<Client>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.Appointments = 0;
                    entity.NoShows = 0;
                    entity.TotalSales = 0;
                    entity.Outstanding = 0;
                    entity.LastLocation = "";

                    ExcuteData_Main<Client>.Insert(entity);
                }
                return Json(new { Result = true, Client = entity, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult Delete(long id)
        {
            //delete Client
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            ExcuteData_Main<Client>.ExecuteSqlCommand("Update TBL_APPOINTMENT set CLientID = null where BusinessID = " + u.BusinessID.ToString() + " and ClientID = " + id.ToString(), new object[] { });
            ExcuteData_Main<Client>.Delete(id);
            return Json(new { Result = true, ErrorMessage = "Delete data successfully", ErrorStyle = 0 }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetAll()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            List<Client> lst = ExcuteData_Main<Client>.Find(n => n.BusinessID == u.BusinessID).OrderBy(n => n.FirstName).ToList();
            return Json(new { data = lst, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}