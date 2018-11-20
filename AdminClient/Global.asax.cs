using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using AdminClient.Models.ExcuteData;
using AdminClient.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using AdminClient.Library;

namespace AdminClient
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
        protected void Application_Error(object sender, EventArgs e)
        {
            var context = new HttpContextWrapper(Context);
            Exception ex = Server.GetLastError();
            var httpException = ex as HttpException;
            if (context.Session.Contents["AccountLogin"] == null)
            {
                Response.RedirectToRoute(new RouteValueDictionary { { "Controller", "Error" }, { "Action", "Error500" }, });
                return;
            }
            User u = (User)context.Session.Contents["AccountLogin"] ?? new Models.User();
            Business b = (Business)context.Session.Contents["Business"] ?? new Models.Business();
            b.Language = String.IsNullOrWhiteSpace(b.Language) ? "en" : b.Language;
            int statusCode = httpException == null ? 0 : httpException.GetHttpCode();
            //Những lỗi cần phải xử lý
            if (context.Request.IsAjaxRequest() || (!context.Request.IsAjaxRequest() && statusCode == 0))
            {
                ExcuteData_Main<LogException>.Insert(new LogException()
                {
                    BusinessID = b.BusinessID,
                    UserID = u.UserID,
                    ExceptionTime = DateTime.Now,
                    ExceptionDetail = context.Error.Message,
                    URL = context.Request.Url.PathAndQuery,
                    FunctioName = RouteTable.Routes.GetRouteData(context).GetRequiredString("controller"),
                });
                if (context.Request.IsAjaxRequest())
                {
                    Response.StatusCode = 500;
                    Response.ContentType = "application/json";
                    Response.Write(JsonConvert.SerializeObject(new
                    {
                        ContentError = (ExcuteData_Main<LangString>.Single(n => n.LangKeyID == "NotifyClientErrorAjax" && n.Language == b.Language) ?? new LangString()).Value,
                        TitleError = (ExcuteData_Main<LangString>.Single(n => n.LangKeyID == "TitleClientErrorAjax" && n.Language == b.Language) ?? new LangString()).Value
                    }));
                }
                else
                    Response.RedirectToRoute(new RouteValueDictionary { { "Controller", "Error" }, { "Action", "Error500" }, });
            }
            //những lỗi ko cần phải xử lý chỉ cần chuyển trang và thông báo
            else
            {
                if (statusCode == 404)
                    Response.RedirectToRoute(new RouteValueDictionary { { "Controller", "Error" }, { "Action", "Error404" } });
            }
            Server.ClearError();
        }
        protected void Session_End(object sender, EventArgs e)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            Business b = (Business)Session["Business"] ?? new Models.Business();
            string path = Path.Combine(XML.FolderLanguagePath, XML.GetNameFileLanguage(u.UserID, b.Language));
            if (File.Exists(path))
                File.Delete(path);
        }
    }
}
