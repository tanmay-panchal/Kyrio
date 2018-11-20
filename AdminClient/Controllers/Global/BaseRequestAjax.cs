using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using AdminClient.Models.ExcuteData;
using AdminClient.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AdminClient.Controllers.Global
{
    public class BaseRequestAjax : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                string jsonString = JsonConvert.SerializeObject(filterContext.ActionParameters, Formatting.Indented, new JsonSerializerSettings
                {
                    DateTimeZoneHandling = DateTimeZoneHandling.Local
                });
                //TimeZoneInfo.ClearCachedData
                TimeSpan t = TimeZoneInfo.Local.BaseUtcOffset;
                DateTime.Now.Add(t);
                filterContext.ActionParameters = JObject.FromObject(JsonConvert.DeserializeObject(jsonString)).ToObject<Dictionary<string, Object>>();
            }
        }
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                var jsonresult = (System.Web.Mvc.JsonResult)filterContext.Result;
                string jsonString = JsonConvert.SerializeObject(JObject.FromObject(jsonresult.Data), Formatting.Indented, new JsonSerializerSettings
                {
                    DateTimeZoneHandling = DateTimeZoneHandling.Unspecified
                });
                jsonresult.Data = JsonConvert.SerializeObject(JsonConvert.DeserializeObject(jsonString));
                filterContext.Result = jsonresult;
            }
            base.OnActionExecuted(filterContext);
        }
    }
}