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
    public class OnlineBookingSettingController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Index()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.online_booking)))
            {
                ViewBag.code_button_booking = ExcuteData_Main<Config>.Single(n => n.ConfigID == "code_button_booking").Value;
                ViewBag.code_embed_booking_widget = ExcuteData_Main<Config>.Single(n => n.ConfigID == "code_embed_booking_widget").Value;
                return View();
            }
            else
            {
                return View("NotFound");
            }
        }
        #endregion

        #region Ajax

        #endregion
    }
}