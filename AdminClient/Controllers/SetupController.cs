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
using System.Threading.Tasks;

namespace AdminClient.Controllers
{
    public class SetupController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Index()
        {
            return View();
        }
        [CheckPermision]
        public ActionResult CompanyDetails()
        {
            User u = (User)Session["AccountLogin"];
            Business bus = ExcuteData_Main<Business>.GetById(u.BusinessID);
            SYS_PACKAGE pk = ExcuteData_Main<SYS_PACKAGE>.GetById(bus.PackageID);
            BusinessSetting bs = ExcuteData_Main<BusinessSetting>.Single(n => n.BusinessID == u.BusinessID && n.SettingCode == "BSExpiry");
            ViewBag.PackageName = pk == null ? "" : pk.PackageName;
            ViewBag.BSExpiry = bs == null ? "" : bs.Value;
            ViewBag.CountryCode = ExcuteData_Country.GetEntityBaseUserId(u.UserID).CountryCode;
            return View(ExcuteData_Main<Business>.GetById(u.BusinessID));
        }
        [CheckPermision]
        public ActionResult CalendarSettings()
        {
            return View();
        }
        [CheckPermision]
        public ActionResult OnlineBookingSettings()
        {
            return View();
        }
        [CheckPermision]
        public ActionResult StaffNotifications()
        {
            return View();
        }
        [CheckPermision]
        public ActionResult ClientNotifications()
        {
            return View();
        }
        [CheckPermision]
        public ActionResult ReferralSources()
        {
            return View();
        }
        [CheckPermision]
        public ActionResult CancellationReasons()
        {
            return View();
        }
        [CheckPermision]
        public ActionResult Locations()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            return View(ExcuteData_Country.GetEntityBaseUserId(u.UserID));
        }
        [CheckPermision]
        public ActionResult Resources()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            Location loc = ExcuteData_Main<Location>.Find(n => n.BusinessID == u.BusinessID).FirstOrDefault();
            ViewBag.LocationID = loc.LocationID;
            ViewBag.LocationName = loc.LocationName;
            return View();
        }

        [CheckPermision]
        public ActionResult PaymentTypes()
        {
            return View();
        }

        [CheckPermision]
        public ActionResult Taxes()
        {
            return View();
        }

        [CheckPermision]
        public ActionResult Discounts()
        {
            return View();
        }

        [CheckPermision]
        public ActionResult SalesSettings()
        {
            return View();
        }

        [CheckPermision]
        public ActionResult InvoicesReceipts()
        {
            return View();
        }

        #endregion

        #region Ajax

        #region CompanyDetails
        [HttpPost]
        public JsonResult SaveCompanyDetails(Business business)
        {
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            User u = (User)Session["AccountLogin"];
            Business oldBusiness = ExcuteData_Main<Business>.GetById(u.BusinessID);
            business.BusinessID = oldBusiness.BusinessID;
            business.CurrencyCode = oldBusiness.CurrencyCode;
            business.CountryID = oldBusiness.CountryID;
            business.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            business.PackageID = oldBusiness.PackageID;
            business.CreateDate = oldBusiness.CreateDate;
            business.Language = oldBusiness.Language;
            ExcuteData_Main<Business>.Update(business);
            Session["Business"] = business;
            LoginController l = new LoginController();
            l.LoadDefaultData();
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataTableModalOpeningHour()
        {
            Business b = (Business)Session["Business"];
            Expression<Func<BusinessSetting, Boolean>> query = n => n.BusinessID == b.BusinessID && n.SettingGroup == "Store working";
            List<BusinessSetting> data = new List<BusinessSetting>();
            if (ExcuteData_Main<BusinessSetting>.Any(query))
                data = ExcuteData_Main<BusinessSetting>.Find(query);
            else
            {
                data = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == 0 && n.SettingGroup == "Store working");
                data.ForEach(n => n.BusinessID = b.BusinessID);
                ExcuteData_Main<BusinessSetting>.Insert(data);
            }
            data = data.OrderBy(n => n.Description.Split('-')[0]).ToList();
            return Json(new { data = data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveModalOpeningHour(List<BusinessSetting> data)
        {
            Business b = (Business)Session["Business"];
            List<BusinessSetting> dataOld = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == b.BusinessID && n.SettingGroup == "Store working");
            data.ForEach(n =>
            {
                BusinessSetting itemOld = dataOld.FirstOrDefault(m => m.SettingCode == n.SettingCode) ?? new BusinessSetting();
                n.BusinessID = b.BusinessID;
                n.Description = itemOld.Description;
                n.SettingGroup = "Store working";
            });
            ExcuteData_Main<BusinessSetting>.Update(data);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Location
        [HttpPost]
        public JsonResult GetDataTableLocation()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            var search = Request.Form["search[value]"];

            Expression<Func<Location, bool>> queryWhere = n => n.BusinessID == u.BusinessID && (n.LocationName.Contains(search) || n.StreetAddress.Contains(search) || n.APT.Contains(search) || n.City.Contains(search) || n.State.Contains(search) || n.ZipCode.Contains(search));
            long countData = ExcuteData_Main<Location>.Count(queryWhere);
            return Json(new { data = ExcuteData_Main<Location>.Find(queryWhere).OrderBy(n => n.SortOrder).ToList(), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteLocation(long id)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            Location entityOld = ExcuteData_Main<Location>.GetById(id);
            if (entityOld.IsDefault)
                return Json(new { Result = false, ErrorMessage = "Can’t delete default location", ErrorStyle = 1 }, JsonRequestBehavior.AllowGet);
            if (entityOld.NextInvoiceNumber > 1)
                return Json(new { Result = false, ErrorMessage = "Location is using, can't delete", ErrorStyle = 2 }, JsonRequestBehavior.AllowGet);

            using (TransactionScope scope = new TransactionScope())
            {
                //update lai sort order cac loacation con lai
                List<Location> lstL = ExcuteData_Main<Location>.Find(n => n.BusinessID == entityOld.BusinessID && n.SortOrder > entityOld.SortOrder);
                foreach (var item in lstL)
                {
                    item.SortOrder = item.SortOrder - 1;
                    ExcuteData_Main<Location>.Update(item);
                }
                //delete TBL_USER_LOCATION
                ExcuteData_Main<UserLocation>.ExecuteSqlCommand("Delete from TBL_USER_LOCATION where BusinessID = " + u.BusinessID.ToString() + " and LocationID = " + id.ToString(), new object[] { });
                //delete TBL_PRODUCT_LOCATION
                ExcuteData_Main<ProductLocation>.ExecuteSqlCommand("Delete from TBL_PRODUCT_LOCATION where BusinessID = " + u.BusinessID.ToString() + " and LocationID = " + id.ToString(), new object[] { });
                //TBL_TAX_LOCATION
                ExcuteData_Main<TaxLocation>.ExecuteSqlCommand("Delete from TBL_TAX_LOCATION where BusinessID = " + u.BusinessID.ToString() + " and LocationID = " + id.ToString(), new object[] { });
                //delete location
                ExcuteData_Main<Location>.Delete(id);
                scope.Complete();
            }

            return Json(new { Result = true, ErrorMessage = "", ErrorStyle = 0 }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<JsonResult> UpdateSortOrderLocation(long LocationID, int SortOrderNew)
        {
            Location entity = ExcuteData_Main<Location>.GetById(LocationID);
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            if (entity.BusinessID != u.BusinessID)
                throw new Exception("User không có quyền được sửa dữ liệu của người khác");
            entity.SortOrder = SortOrderNew;
            ExcuteData_Main<Location>.Update(entity);
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult AddOrUpdateLocation(Location entity, Boolean isUpdate)
        {
            try
            {
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                if (isUpdate)
                {
                    Location entityOld = ExcuteData_Main<Location>.GetById(entity.LocationID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.InvoiceNoPrefix = entityOld.InvoiceNoPrefix;
                    entity.NextInvoiceNumber = entityOld.NextInvoiceNumber;
                    entity.IsDefault = entityOld.IsDefault;
                    entity.BusinessID = entityOld.BusinessID;
                    entity.SortOrder = entityOld.SortOrder;

                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<Location>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    List<Location> ls = ExcuteData_Main<Location>.Find(n => n.BusinessID == u.BusinessID);
                    entity.SortOrder = ls.Count() == 0 ? 1 : ls.Max(n => n.SortOrder) + 1;
                    entity.NextInvoiceNumber = 1;
                    ExcuteData_Main<Location>.Insert(entity);

                    //insert TBL_PRODUCT_LOCATION
                    List<Product> lst = ExcuteData_Main<Product>.Find(n => n.BusinessID == u.BusinessID && n.EnableStockControl == true).ToList();
                    List<ProductLocation> lstPL = new List<ProductLocation>();
                    foreach (var item in lst)
                    {
                        lstPL.Add(new ProductLocation { BusinessID = u.BusinessID, LocationID = entity.LocationID, ProductID = item.ProductID, InitialStock = 0, ReorderPoint = 0, ReorderQty = 0 });
                    }
                    ExcuteData_Main<ProductLocation>.Insert(lstPL);
                }
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult SaveChangeSequencing(long LocationID, string InvoiceNoPrefix, long NextInvoiceNumber)
        {
            Location entity = ExcuteData_Main<Location>.GetById(LocationID);
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            if (entity.BusinessID != u.BusinessID)
                throw new Exception("User không có quyền được sửa dữ liệu của người khác");
            entity.InvoiceNoPrefix = InvoiceNoPrefix;
            entity.NextInvoiceNumber = NextInvoiceNumber;
            ExcuteData_Main<Location>.Update(entity);
            return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Resource
        [HttpPost]
        public JsonResult GetDataTableResource()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();

                int LocationID = 0;
                if (Request.Form.GetValues("LocationID")[0] != null)
                {
                    if (Request.Form.GetValues("LocationID")[0] != "")
                    {
                        LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                    }
                }

                //var draw = Request.Form.GetValues("draw").FirstOrDefault();
                //int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
                //int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
                //int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
                //var sortColumn = Request.Form.GetValues("columns[" + (orderColumn == 0 ? 1 : orderColumn) + "][name]").FirstOrDefault();
                //var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
                var search = Request.Form["search[value]"];
                Expression<Func<Resource, bool>> queryWhere = n => n.BusinessID == u.BusinessID && n.LocationID == LocationID && (n.ResourceName.Contains(search));
                long countData = ExcuteData_Main<Resource>.Count(queryWhere);

                return Json(new { data = ExcuteData_Main<Resource>.Find(queryWhere).OrderBy(n => n.SortOrder), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AddOrUpdateResource(Resource entity, Boolean isUpdate)
        {
            try
            {
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                if (isUpdate)
                {
                    Resource entityOld = ExcuteData_Main<Resource>.GetById(entity.ResourceID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.BusinessID = entityOld.BusinessID;
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.SortOrder = entityOld.SortOrder;
                    entity.UserModify = u.UserID;
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    ExcuteData_Main<Resource>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    List<Resource> ls = ExcuteData_Main<Resource>.Find(n => n.BusinessID == u.BusinessID && n.LocationID == entity.LocationID);
                    entity.SortOrder = ls.Count() == 0 ? 1 : ls.Max(n => n.SortOrder) + 1;

                    ExcuteData_Main<Resource>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        public JsonResult DeleteResource(long id)
        {
            int errorStyle = 0;
            try
            {
                Resource entityOld = ExcuteData_Main<Resource>.GetById(id);
                //update lai sort order cac loacation con lai
                List<Resource> lst = ExcuteData_Main<Resource>.Find(n => n.BusinessID == entityOld.BusinessID && n.LocationID == entityOld.LocationID && n.SortOrder > entityOld.SortOrder);
                foreach (var item in lst)
                {
                    item.SortOrder = item.SortOrder - 1;
                    ExcuteData_Main<Resource>.Update(item);
                }
                //delete
                ExcuteData_Main<Resource>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult UpdateSortOrderResource(long ResourceID, int SortOrderNew)
        {
            Resource entity = ExcuteData_Main<Resource>.GetById(ResourceID);
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            if (entity.BusinessID != u.BusinessID)
                throw new Exception("User không có quyền được sửa dữ liệu của người khác");
            entity.SortOrder = SortOrderNew;
            ExcuteData_Main<Resource>.Update(entity);
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetServiceByResource(long ResourceID, long LocationID)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                Expression<Func<ServiceResource, bool>> queryWhere = n => n.BusinessID == u.BusinessID && n.ResourceID == ResourceID && n.LocationID == LocationID;
                List<ServiceResource> ls = ExcuteData_Main<ServiceResource>.Find(queryWhere).ToList();
                List<Service> lsS = new List<Service>();
                foreach (var item in ls)
                {
                    Service sv = ExcuteData_Main<Service>.GetById(item.ServiceID);
                    lsS.Add(sv);
                }
                return Json(new { data = lsS, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region calendar settings
        [HttpPost]
        public JsonResult GetBusinessSetting(string SettingGroup)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                List<BusinessSetting> olds = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == u.BusinessID && n.SettingGroup == SettingGroup);
                LoginController l = new LoginController();
                l.LoadDefaultData();
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
                    else
                    {
                        BusinessSetting itemnew = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == 0 && n.SettingCode == item.SettingCode).FirstOrDefault();
                        itemnew.Value = item.Value == null ? "" : item.Value;
                        itemnew.BusinessID = u.BusinessID;
                        ExcuteData_Main<BusinessSetting>.Insert(itemnew);
                    }
                }
                LoginController l = new LoginController();
                l.LoadDefaultData();
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region client notification
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
                Client c = ExcuteData_Main<Client>.Find(n => n.BusinessID == u.BusinessID).FirstOrDefault();
                ret = ret.Replace("CLIENT_FIRST_NAME", c == null ? "John" : c.FirstName);
                ret = ret.Replace("CLIENT_LAST_NAME", c == null ? "John" : c.LastName);
                ret = ret.Replace("STAFF_FIRST_NAME", u.FirstName);
                ret = ret.Replace("STAFF_LAST_NAME", u.LastName);
                ret = ret.Replace("BOOKING_DATE_TIME", "Saturday, 14 Jul 2018 at 8:00");
                ret = ret.Replace("BOOKING_DATE", "Saturday, 14 Jul 2018");
                ret = ret.Replace("BOOKING_TIME", "08:00");
                ret = ret.Replace("BOOKING_REFERENCE", "03301EDC9F");
                Service s = ExcuteData_Main<Service>.Find(n => n.BusinessID == u.BusinessID).FirstOrDefault();
                ret = ret.Replace("SERVICE_NAME", s == null ? "Haircut" : s.ServiceName);
                Business b = ExcuteData_Main<Business>.GetById(u.BusinessID);
                ret = ret.Replace("BUSINESS_NAME", b.CompanyName);
                Location l = ExcuteData_Main<Location>.Find(n => n.BusinessID == u.BusinessID).FirstOrDefault();
                ret = ret.Replace("LOCATION_NAME", l.LocationName);
                ret = ret.Replace("LOCATION_PHONE", l.ContactNumber);
                LoginController def = new LoginController();
                def.LoadDefaultData();
                return Json(new { data = ret, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = "", ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult ResetTemplateNotification(string SettingCode)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                BusinessSetting bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == 0 && n.SettingCode == SettingCode).FirstOrDefault();
                return Json(new { data = bs.Value == null ? "" : bs.Value, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = "", ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Referral Source
        [HttpPost]
        public JsonResult GetDataTableReferralSources()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                //var draw = Request.Form.GetValues("draw").FirstOrDefault();
                //int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
                //int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
                //int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
                //var sortColumn = Request.Form.GetValues("columns[" + (orderColumn == 0 ? 1 : orderColumn) + "][name]").FirstOrDefault();
                //var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
                //var search = Request.Form["search[value]"];
                Expression<Func<ReferralSource, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
                long countData = ExcuteData_Main<ReferralSource>.Count(queryWhere);
                return Json(new { data = ExcuteData_Main<ReferralSource>.Find(queryWhere).OrderBy(n => n.SortOrder), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult DeleteReferralSource(long id)
        {
            int errorStyle = 0;
            try
            {
                ReferralSource entityOld = ExcuteData_Main<ReferralSource>.GetById(id);
                if (entityOld.IsDefault)
                {
                    errorStyle = 1;
                    throw new Exception("Can’t delete default referral source");
                }

                //update lai sort order cac item con lai
                List<ReferralSource> lst = ExcuteData_Main<ReferralSource>.Find(n => n.BusinessID == entityOld.BusinessID && n.SortOrder > entityOld.SortOrder);
                foreach (var item in lst)
                {
                    item.SortOrder = item.SortOrder - 1;
                    ExcuteData_Main<ReferralSource>.Update(item);
                }

                ExcuteData_Main<ReferralSource>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult AddOrUpdateReferralSource(ReferralSource entity, Boolean isUpdate)
        {
            try
            {
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                if (isUpdate)
                {
                    ReferralSource entityOld = ExcuteData_Main<ReferralSource>.GetById(entity.ReferralSourceID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.IsDefault = entityOld.IsDefault;
                    entity.BusinessID = entityOld.BusinessID;

                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<ReferralSource>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.IsDefault = false;
                    List<ReferralSource> ls = ExcuteData_Main<ReferralSource>.Find(n => n.BusinessID == u.BusinessID);
                    entity.SortOrder = ls.Count() == 0 ? 1 : ls.Max(n => n.SortOrder) + 1;

                    ExcuteData_Main<ReferralSource>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult UpdateSortOrderReferralSource(long ID, int SortOrderNew)
        {
            ReferralSource entity = ExcuteData_Main<ReferralSource>.GetById(ID);
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            if (entity.BusinessID != u.BusinessID)
                throw new Exception("User không có quyền được sửa dữ liệu của người khác");
            entity.SortOrder = SortOrderNew;
            ExcuteData_Main<ReferralSource>.Update(entity);
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Cancellation Reason
        [HttpPost]
        public JsonResult GetDataTableCancellationReasons()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                //var draw = Request.Form.GetValues("draw").FirstOrDefault();
                //int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
                //int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
                //int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
                //var sortColumn = Request.Form.GetValues("columns[" + (orderColumn == 0 ? 1 : orderColumn) + "][name]").FirstOrDefault();
                //var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
                //var search = Request.Form["search[value]"];
                Expression<Func<CancellationReason, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
                long countData = ExcuteData_Main<CancellationReason>.Count(queryWhere);
                return Json(new { data = ExcuteData_Main<CancellationReason>.Find(queryWhere).OrderBy(n => n.SortOrder), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult DeleteCancellationReason(long id)
        {
            int errorStyle = 0;
            try
            {
                CancellationReason entityOld = ExcuteData_Main<CancellationReason>.GetById(id);
                if (entityOld.IsDefault)
                {
                    errorStyle = 1;
                    throw new Exception("Can’t delete default cancellation reason");
                }

                //update lai sort order cac item con lai
                List<CancellationReason> lst = ExcuteData_Main<CancellationReason>.Find(n => n.BusinessID == entityOld.BusinessID && n.SortOrder > entityOld.SortOrder);
                foreach (var item in lst)
                {
                    item.SortOrder = item.SortOrder - 1;
                    ExcuteData_Main<CancellationReason>.Update(item);
                }

                ExcuteData_Main<CancellationReason>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult AddOrUpdateCancellationReason(CancellationReason entity, Boolean isUpdate)
        {
            try
            {
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                if (isUpdate)
                {
                    CancellationReason entityOld = ExcuteData_Main<CancellationReason>.GetById(entity.CancellationReasonID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.IsDefault = entityOld.IsDefault;
                    entity.BusinessID = entityOld.BusinessID;

                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<CancellationReason>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.IsDefault = false;
                    List<CancellationReason> ls = ExcuteData_Main<CancellationReason>.Find(n => n.BusinessID == u.BusinessID);
                    entity.SortOrder = ls.Count() == 0 ? 1 : ls.Max(n => n.SortOrder) + 1;

                    ExcuteData_Main<CancellationReason>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult UpdateSortOrderCancellationReason(long ID, int SortOrderNew)
        {
            CancellationReason entity = ExcuteData_Main<CancellationReason>.GetById(ID);
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            if (entity.BusinessID != u.BusinessID)
                throw new Exception("User không có quyền được sửa dữ liệu của người khác");
            entity.SortOrder = SortOrderNew;
            ExcuteData_Main<CancellationReason>.Update(entity);
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Payment Type
        [HttpPost]
        public JsonResult GetDataTablePaymentTypes()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                //var draw = Request.Form.GetValues("draw").FirstOrDefault();
                //int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
                //int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
                //int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
                //var sortColumn = Request.Form.GetValues("columns[" + (orderColumn == 0 ? 1 : orderColumn) + "][name]").FirstOrDefault();
                //var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
                //var search = Request.Form["search[value]"];
                Expression<Func<PaymentType, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
                long countData = ExcuteData_Main<PaymentType>.Count(queryWhere);
                return Json(new { data = ExcuteData_Main<PaymentType>.Find(queryWhere).OrderBy(n => n.SortOrder), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult DeletePaymentType(long id)
        {
            int errorStyle = 0;
            try
            {
                PaymentType entityOld = ExcuteData_Main<PaymentType>.GetById(id);
                if (entityOld.IsDefault)
                {
                    errorStyle = 1;
                    throw new Exception("Can’t delete default payment type");
                }

                //update lai sort order cac item con lai
                List<PaymentType> lst = ExcuteData_Main<PaymentType>.Find(n => n.BusinessID == entityOld.BusinessID && n.SortOrder > entityOld.SortOrder);
                foreach (var item in lst)
                {
                    item.SortOrder = item.SortOrder - 1;
                    ExcuteData_Main<PaymentType>.Update(item);
                }

                ExcuteData_Main<PaymentType>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult AddOrUpdatePaymentType(PaymentType entity, Boolean isUpdate)
        {
            try
            {
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                if (isUpdate)
                {
                    PaymentType entityOld = ExcuteData_Main<PaymentType>.GetById(entity.PaymentTypeID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.IsDefault = entityOld.IsDefault;
                    entity.BusinessID = entityOld.BusinessID;

                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<PaymentType>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.IsDefault = false;
                    List<PaymentType> ls = ExcuteData_Main<PaymentType>.Find(n => n.BusinessID == u.BusinessID);
                    entity.SortOrder = ls.Count() == 0 ? 1 : ls.Max(n => n.SortOrder) + 1;

                    ExcuteData_Main<PaymentType>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult UpdateSortOrderPaymentType(long ID, int SortOrderNew)
        {
            PaymentType entity = ExcuteData_Main<PaymentType>.GetById(ID);
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            if (entity.BusinessID != u.BusinessID)
                throw new Exception("User không có quyền được sửa dữ liệu của người khác");
            entity.SortOrder = SortOrderNew;
            ExcuteData_Main<PaymentType>.Update(entity);
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Taxes
        [HttpPost]
        public JsonResult GetDataTableTaxes()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                Expression<Func<Tax, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
                long countData = ExcuteData_Main<Tax>.Count(queryWhere);
                return Json(new { data = ExcuteData_Main<Tax>.Find(queryWhere).OrderBy(n => n.TaxName), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AddOrUpdateTax(Tax entity, Boolean isUpdate)
        {
            try
            {
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                if (isUpdate)
                {
                    Tax entityOld = ExcuteData_Main<Tax>.GetById(entity.TaxID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.BusinessID = entityOld.BusinessID;
                    entity.ApplyToAll = entityOld.ApplyToAll;

                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<Tax>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.ApplyToAll = true;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);

                    ExcuteData_Main<Tax>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult DeleteTax(long id)
        {
            int errorStyle = 0;
            try
            {
                ExcuteData_Main<Tax>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        #endregion

        #region Discounts
        [HttpPost]
        public JsonResult GetDataTableDiscounts()
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                Expression<Func<Discount, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
                long countData = ExcuteData_Main<Discount>.Count(queryWhere);
                return Json(new { data = ExcuteData_Main<Discount>.Find(queryWhere).OrderBy(n => n.DiscountName), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult DeleteDiscount(long id)
        {
            int errorStyle = 0;
            try
            {
                ExcuteData_Main<Discount>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "Delete data successfully", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult AddOrUpdateDiscount(Discount entity, Boolean isUpdate)
        {
            try
            {
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                if (isUpdate)
                {
                    Discount entityOld = ExcuteData_Main<Discount>.GetById(entity.DiscountID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.BusinessID = entityOld.BusinessID;

                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<Discount>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);

                    ExcuteData_Main<Discount>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        #endregion
        #endregion
    }
}
