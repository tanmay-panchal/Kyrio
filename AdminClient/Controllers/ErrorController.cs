using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using AdminClient.Library;
using System.Transactions;

namespace AdminClient.Controllers
{
    public class ErrorController : Controller
    {
        #region Load Page
        public ActionResult Error404()
        {
            Business b = (Business)Session["Business"] ?? new Business();
            b.Language = String.IsNullOrWhiteSpace(b.Language ?? "") ? "en" : b.Language;
            return View(new
            {
                TitleWeb = ExcuteData_Main<LangString>.Single(n => n.Language == b.Language && n.LangKeyID == "TitleWebError404").Value,
                ContentError = ExcuteData_Main<LangString>.Single(n => n.Language == b.Language && n.LangKeyID == "ContentError404").Value
            });
        }
        public ActionResult Error500()
        {
            Business b = (Business)Session["Business"] ?? new Business();
            b.Language = String.IsNullOrWhiteSpace(b.Language ?? "") ? "en" : b.Language;
            return View(new
            {
                TitleWeb = ExcuteData_Main<LangString>.Single(n => n.Language == b.Language && n.LangKeyID == "TitleWebError500").Value,
                ContentError = ExcuteData_Main<LangString>.Single(n => n.Language == b.Language && n.LangKeyID == "ContentError500").Value
            });
        }
        #endregion
    }
}