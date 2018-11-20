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
    public class MessagesController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Index()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.messages)))
            {
                return View();
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
            //int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            //var sortColumn = Request.Form.GetValues("columns[" + orderColumn + "][name]").FirstOrDefault();
            //var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];

            Expression<Func<Message, bool>> queryWhere = n => n.BusinessID == u.BusinessID && (n.ClientName.Contains(search) || n.AppointmentNo.Contains(search) || n.Destination.Contains(search));
            long countData = ExcuteData_Main<Message>.Count(queryWhere);

            return Json(new { data = ExcuteData_Main<Message>.SelectWithPaging(queryWhere, start, length, "TimeSent", true).Select(n => new { n.AppointmentID, n.AppointmentNo, n.BusinessID, n.ClientID, n.ClientName, n.Destination, n.MessageBody, n.MessageID, n.MessageStatus, n.MessageSubject, n.MessageType, n.SendFrom, TimeSent = n.TimeSent.ToString("yyyy-MM-dd HH:mm"), n.UserCreate }), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SendMessage(Message entity)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                Config SiteName = ExcuteData_Main<Config>.Single(n => n.ConfigID == "SiteName");
                entity.MessageBody = entity.MessageBody.Replace("@LinkFile", SiteName.Value);
                entity.TimeSent = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);

                if (entity.ClientID != null)
                {
                    Client c = ExcuteData_Main<Client>.Find(n => n.BusinessID == u.BusinessID && n.ClientID == entity.ClientID).FirstOrDefault();
                    if (c != null)
                    {
                        entity.ClientName = c.FirstName + (c.LastName == null ? "" : " " + c.LastName);
                    }
                }
                if (entity.AppointmentID != null)
                {
                    AppointmentService p = ExcuteData_Main<AppointmentService>.Find(n => n.BusinessID == u.BusinessID && n.AppointmentID == entity.AppointmentID).FirstOrDefault();
                    if (p != null)
                    {
                        entity.AppointmentNo = p.RefNo;
                    }
                }
                entity.MessageStatus = nameof(Resources.Enum.message_status_sending);
                entity.UserCreate = u.UserID;
                entity.BusinessID = u.BusinessID;
                entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);


                ExcuteData_Main<Message>.Insert(entity);
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        #endregion
    }
}