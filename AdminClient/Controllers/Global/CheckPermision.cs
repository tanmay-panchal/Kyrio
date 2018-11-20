using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using AdminClient.Library;
using AdminClient.Models;
using AdminClient.Models.ExcuteData;

namespace AdminClient.Controllers.Global
{
    public class CheckPermision : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Session.Contents["AccountLogin"] == null)
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Login", action = "Index" }));
            }
            base.OnActionExecuting(filterContext);
        }

        public static bool CheckPermissionFunction(string FormCode)
        {
            User u = (User)System.Web.HttpContext.Current.Session["AccountLogin"];
            if (u != null)
            {
                PermissionLevel pl = ExcuteData_Main<PermissionLevel>.Find(n => n.BusinessID == u.BusinessID && n.FormCode == FormCode).FirstOrDefault();
                if (pl != null)
                {
                    if (u.RoleID == 2)
                    {
                        return pl.Low;
                    }
                    else if (u.RoleID == 3)
                    {
                        return pl.Medium;
                    }
                    else if (u.RoleID == 4)
                    {
                        return pl.High;
                    }
                    else if (u.RoleID == 5)
                    {
                        return pl.Owner;
                    }
                }
                else
                {
                    if(u.BusinessID == 0)
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}