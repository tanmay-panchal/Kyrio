using AdminClient.Library;
using AdminClient.Models.ExcuteData;
using AdminClient.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Linq.Expressions;

namespace AdminClient.Controllers.Global
{
    public abstract class BaseController<ClassEntity, ClassFile, ClassEntitySupplemtary> : Controller where ClassEntity : class, new() where ClassFile : class, new() where ClassEntitySupplemtary : class, new()
    {
        #region variable
        public delegate Boolean TypeValidateDelete(long id, ref string error);
        public delegate Boolean TypeValidateAddOrUpdate(ClassEntity entity, Boolean isUpdate, ref string error);
        public Func<HttpRequestBase, string, int, int, string, string, List<Object>> GetEntityForDatableIndex { get; set; }
        public Func<HttpRequestBase, string, long> CountEntityForDatableIndex { get; set; }
        public Func<ClassEntity, Boolean, ClassEntity> SetEntityBeforeExcute { get; set; }
        public Func<ClassEntity, List<ClassFile>, Boolean, Boolean> ExcuteEntitiesFile { get; set; }
        public Func<long, Boolean> DeleteEntitieFile { get; set; }
        public Func<ClassEntity, List<ClassEntitySupplemtary>, Boolean, Boolean> ExcuteEntitiesSupplemtary { get; set; }
        public Func<long, Boolean> DeleteEntitieSupplemtary { get; set; }
        public Func<ClassEntity, ClassEntity> GetEntityOld { get; set; }
        public TypeValidateAddOrUpdate ValidateAddOrUpdate { get; set; }
        public TypeValidateDelete ValidateDelete { get; set; }
        public static string FolderImportName = "Files";
        public static string FolderImportPath = Path.Combine(new DirectoryInfo(string.Format("{0}", HostingEnvironment.MapPath(@"\"))).ToString(), FolderImportName);

        #endregion

        #region load page
        [CheckPermision]
        public virtual ActionResult Index()
        {
            return View();
        }
        [CheckPermision]
        public virtual ActionResult Edit(long id)
        {
            return View(ExcuteData_Main<ClassEntity>.GetById(id));
        }
        [CheckPermision]
        public virtual ActionResult Create()
        {
            return View();
        }
        #endregion

        #region ajax
        [HttpPost]
        public JsonResult GetDataTableIndex()
        {
            try
            {
                var draw = Request.Form.GetValues("draw").FirstOrDefault();
                int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
                int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
                int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
                var sortColumn = Request.Form.GetValues("columns[" + orderColumn + "][name]").FirstOrDefault();
                var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
                var search = Request.Form["search[value]"];
                if (GetEntityForDatableIndex == null)
                    throw new Exception("Chưa khởi tạo hàm lấy dữ liệu cho table");
                if (CountEntityForDatableIndex == null)
                    throw new Exception("Chưa khởi tạo hàm số phần tử cho table");
                long countData = CountEntityForDatableIndex(Request, search);
                return Json(new { data = GetEntityForDatableIndex(Request, search, start, length, sortColumn, sortColumnDir), recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult AddOrUpdate(ClassEntity entity, Boolean isUpdate)
        {
            int erroStyle = 0;
            try
            {
                if (ValidateAddOrUpdate != null)
                {
                    string error = "";
                    if (ValidateAddOrUpdate(entity, isUpdate, ref error))
                    {
                        erroStyle = 1;
                        throw new Exception(error);
                    }
                }
                if (SetEntityBeforeExcute != null)
                    entity = SetEntityBeforeExcute(entity, isUpdate);
                if (isUpdate)
                    ExcuteData_Main<ClassEntity>.Update(entity);
                else
                    ExcuteData_Main<ClassEntity>.Insert(entity);
                return Json(new { Result = true, ErrorMessage = "", ErrorStyle = erroStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = erroStyle }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult DeleteEntity(long id)
        {
            int errorStyle = 0;
            try
            {
                if (ValidateDelete != null)
                {
                    string error = "";
                    if (ValidateDelete(id, ref error))
                    {
                        errorStyle = 1;
                        throw new Exception(error);
                    }
                }
                ClassEntity entity = ExcuteData_Main<ClassEntity>.GetById(id);
                ExcuteData_Main<ClassEntity>.Delete(id);
                if (DeleteEntitieFile != null)
                    DeleteEntitieFile(id);
                if (DeleteEntitieSupplemtary != null)
                    DeleteEntitieSupplemtary(id);
                return Json(new { Result = true, ErrorMessage = "", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult DeleteEntities(List<long> ids)
        {
            int errorStyle = 0;
            try
            {
                using (var scope = new TransactionScope())
                {
                    ids.ForEach(n =>
                    {
                        if (ValidateDelete != null)
                        {
                            string error = "";
                            if (ValidateDelete(n, ref error))
                            {
                                errorStyle = 1;
                                throw new Exception(error);
                            }
                        }
                        ClassEntity entity = ExcuteData_Main<ClassEntity>.GetById(n);
                        ExcuteData_Main<ClassEntity>.Delete(n);
                        if (DeleteEntitieFile != null)
                            DeleteEntitieFile(n);
                        if (DeleteEntitieSupplemtary != null)
                            DeleteEntitieSupplemtary(n);
                    });
                    scope.Complete();
                    return Json(new { Result = true, ErrorMessage = "", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult AddOrUpdateBaseFormData()
        {
            int erroStyle = 0;
            try
            {
                using (var scope = new TransactionScope())
                {
                    ClassEntity entity = JsonConvert.DeserializeObject<ClassEntity>(Request.Form["entity"] ?? JsonConvert.SerializeObject(new ClassEntity()));
                    bool isUpdate = JsonConvert.DeserializeObject<bool>(Request.Form["isUpdate"] ?? "false");
                    List<ClassFile> entitiesFile = JsonConvert.DeserializeObject<List<ClassFile>>(Request.Form["entityFile"] ?? JsonConvert.SerializeObject(new List<ClassFile>()));
                    List<ClassEntitySupplemtary> entitieSupplement = JsonConvert.DeserializeObject<List<ClassEntitySupplemtary>>(Request.Form["entitieSupplement"] ?? JsonConvert.SerializeObject(new List<ClassEntitySupplemtary>()));
                    if (ValidateAddOrUpdate != null)
                    {
                        string error = "";
                        if (ValidateAddOrUpdate(entity, isUpdate, ref error))
                        {
                            erroStyle = 1;
                            throw new Exception(error);
                        }
                    }
                    if (SetEntityBeforeExcute != null)
                        entity = SetEntityBeforeExcute(entity, isUpdate);
                    if (isUpdate)
                        ExcuteData_Main<ClassEntity>.Update(entity);
                    else
                        ExcuteData_Main<ClassEntity>.Insert(entity);
                    if (ExcuteEntitiesFile != null && entitiesFile != null)
                    {
                        ExcuteEntitiesFile(entity, entitiesFile, isUpdate);
                        foreach (string fileName in Request.Files)
                        {
                            HttpPostedFileBase file = Request.Files[fileName];
                            ExcuteFile.SaveFileFolder(file, fileName, FolderImportPath);
                        }
                    }
                    if (ExcuteEntitiesSupplemtary != null && entitieSupplement != null)
                        ExcuteEntitiesSupplemtary(entity, entitieSupplement, isUpdate);
                    scope.Complete();
                    return Json(new { Result = true, ErrorMessage = "", ErrorStyle = erroStyle }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = erroStyle }, JsonRequestBehavior.AllowGet); }
        }

        #region load combobox select 2
        [HttpPost]
        public JsonResult LoadSelect2ForBusinessType()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<BusinessType, bool>> queryWhere = n => n.BusinessTypeName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<BusinessType>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "SortOrder", false).Select(n => new { id = n.BusinessTypeID, text = n.BusinessTypeName }), Total = ExcuteData_Main<BusinessType>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForCountry()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<Country, bool>> queryWhere = n => n.CountryName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<Country>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "SortOrder", false).Select(n => new { id = n.CountryID, text = n.CountryName }), Total = ExcuteData_Main<Country>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForTimeZone()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<Models.TimeZone, bool>> queryWhere = n => n.TimeZoneName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<Models.TimeZone>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "SortOrder", false).Select(n => new { id = n.TimeZoneID, text = n.TimeZoneName }), Total = ExcuteData_Main<Models.TimeZone>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForCurrency()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<Currency, bool>> queryWhere = n => n.CurrencyName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<Currency>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "CurrencyName", false).Select(n => new { id = n.CurrencyCode, text = n.CurrencyName }), Total = ExcuteData_Main<Currency>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForTimeFormat()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<TimeFormat, bool>> queryWhere = n => n.TimeFormatName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<TimeFormat>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "TimeFormatName", false).Select(n => new { id = n.TimeFormatID, text = n.TimeFormatName }), Total = ExcuteData_Main<TimeFormat>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForPricingType()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<PricingType, bool>> queryWhere = n => n.PricingTypeName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<PricingType>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "PricingTypeName", false).Select(n => new { id = n.PricingTypeID, text = n.PricingTypeName }), Total = ExcuteData_Main<PricingType>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForTreatmentType()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<TreatmentType, bool>> queryWhere = n => n.TreatmentTypeName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<TreatmentType>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "TreatmentTypeName", false).Select(n => new { id = n.TreatmentTypeID, text = n.TreatmentTypeName }), Total = ExcuteData_Main<TreatmentType>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForAvailableFor()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<AvailableFor, bool>> queryWhere = n => n.AvailableForName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<AvailableFor>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "AvailableForName", false).Select(n => new { id = n.AvailableForID, text = n.AvailableForName }), Total = ExcuteData_Main<AvailableFor>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForExtraTimeType()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<ExtraTimeType, bool>> queryWhere = n => n.ExtraTimeTypeName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<ExtraTimeType>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "ExtraTimeTypeName", false).Select(n => new { id = n.ExtraTimeTypeID, text = n.ExtraTimeTypeName }), Total = ExcuteData_Main<ExtraTimeType>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForDuration()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<Duration, bool>> queryWhere = n => n.DurationName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<Duration>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "DurationTime", false).Select(n => new { id = n.DurationTime, text = n.DurationName }), Total = ExcuteData_Main<Duration>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForTax()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            Expression<Func<Tax, bool>> queryWhere = n => n.TaxName.Contains(searchTerm) && n.BusinessID == u.BusinessID;
            return Json(new { Results = ExcuteData_Main<Tax>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "TaxName", false).Select(n => new { id = n.TaxID, text = n.TaxName }), Total = ExcuteData_Main<Tax>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForVoucherExpiryPeriod()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<VoucherExpiryPeriod, bool>> queryWhere = n => n.VoucherExpiryPeriodName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<VoucherExpiryPeriod>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "SortOrder", false).Select(n => new { id = n.VoucherExpiryPeriodID, text = n.VoucherExpiryPeriodName }), Total = ExcuteData_Main<VoucherExpiryPeriod>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForLocation()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            Expression<Func<Location, bool>> queryWhere = n => n.LocationName.Contains(searchTerm) && (n.BusinessID == BusinessID || BusinessID == 0);
            return Json(new { Results = ExcuteData_Main<Location>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "LocationName", false).Select(n => new { id = n.LocationID, text = n.LocationName }), Total = ExcuteData_Main<Location>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForRole()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            Expression<Func<Role, bool>> queryWhere = n => n.RoleName.Contains(searchTerm) && n.RoleID != 5;
            return Json(new { Results = ExcuteData_Main<Role>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "RoleID", false).Select(n => new { id = n.RoleID, text = n.RoleName }), Total = ExcuteData_Main<Role>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForUserLocation()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            int LocationId = Convert.ToInt32(Request.Form.GetValues("LocationId").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            return Json(new
            {
                Results = ExcuteData_User.GetUserByLocationPagging(searchTerm, LocationId, u.BusinessID, pageSize * pageNum, pageSize)
                .Select(n => new { id = n.UserID, text = n.FirstName + " " + n.LastName }),
                Total = ExcuteData_User.CountUserByLocationPagging(searchTerm, LocationId, u.BusinessID)
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForUserLocationTip()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            int LocationId = Convert.ToInt32(Request.Form.GetValues("LocationId").FirstOrDefault() ?? "0");
            string staff = Request.Form.GetValues("Staff").FirstOrDefault() ?? "";
            #endregion
            User u = (User)Session["AccountLogin"];
            List<User> lst = ExcuteData_User.GetUserByLocationPagging(searchTerm, LocationId, u.BusinessID, pageSize * pageNum, pageSize).ToList();
            if (staff != "")
            {
                string[] lstaff = staff.Split(';');
                foreach (string item in lstaff)
                {
                    long userid = Convert.ToInt64(item);
                    User user = lst.Find(n => n.UserID == userid);
                    if (user != null)
                    {
                        lst.Remove(user);
                    }
                }
            }
            return Json(new
            {
                Results = lst.Select(n => new { id = n.UserID, text = n.FirstName + " " + n.LastName }),
                Total = lst.Count
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForUserLocationBooking()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            int LocationId = Convert.ToInt32(Request.Form.GetValues("LocationId").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            return Json(new
            {
                Results = ExcuteData_User.GetUserByLocationBookingPagging(searchTerm, LocationId, u.BusinessID, pageSize * pageNum, pageSize)
                .Select(n => new { id = n.UserID, text = n.FirstName + " " + n.LastName }),
                Total = ExcuteData_User.CountUserByLocationBookingPagging(searchTerm, LocationId, u.BusinessID)
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForUser()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            Expression<Func<User, bool>> queryWhere = n => n.BusinessID == u.BusinessID && n.Status == 1;
            return Json(new
            {
                Results = ExcuteData_Main<User>.Find(queryWhere).OrderBy(n => n.FirstName).Select(n => new { id = n.UserID, text = (n.FirstName ?? "") + " " + (n.LastName ?? "") }),
                Total = ExcuteData_Main<User>.Count(queryWhere)
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForReferralSource()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            Expression<Func<ReferralSource, bool>> queryWhere = n => n.BusinessID == u.BusinessID && n.IsActive == true;
            return Json(new { Results = ExcuteData_Main<ReferralSource>.Find(queryWhere).OrderBy(n => n.SortOrder).Select(n => new { id = n.ReferralSourceID, text = n.ReferralSourceName }), Total = ExcuteData_Main<ReferralSource>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForCategory()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            Expression<Func<Category, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
            return Json(new { Results = ExcuteData_Main<Category>.Find(queryWhere).OrderBy(n => n.CategoryName).Select(n => new { id = n.CategoryID, text = n.CategoryName }), Total = ExcuteData_Main<Category>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForBrand()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            Expression<Func<Brand, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
            return Json(new { Results = ExcuteData_Main<Brand>.Find(queryWhere).OrderBy(n => n.BrandName).Select(n => new { id = n.BrandID, text = n.BrandName }), Total = ExcuteData_Main<Brand>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForCompany()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<Business, bool>> queryWhere = n => n.CompanyName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<Business>.Find(queryWhere).OrderBy(n => n.BusinessID).Select(n => new { id = n.BusinessID, text = n.CompanyName }), Total = ExcuteData_Main<Business>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForSupplier()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            Expression<Func<Supplier, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
            return Json(new { Results = ExcuteData_Main<Supplier>.Find(queryWhere).OrderBy(n => n.SupplierName).Select(n => new { id = n.SupplierID, text = n.SupplierName }), Total = ExcuteData_Main<Supplier>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadSelect2ForDiscount()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            Boolean CheckEnableForProductSales = Convert.ToBoolean(Request.Form.GetValues("CheckEnableForProductSales").FirstOrDefault() ?? "0");
            Boolean CheckEnableForServiceSales = Convert.ToBoolean(Request.Form.GetValues("CheckEnableForServiceSales").FirstOrDefault() ?? "0");
            Boolean CheckEnableForVoucherSales = Convert.ToBoolean(Request.Form.GetValues("CheckEnableForVoucherSales").FirstOrDefault() ?? "0");
            #endregion
            User u = (User)Session["AccountLogin"];
            Business b = (Business)System.Web.HttpContext.Current.Session["Business"];
            Currency currency = ExcuteData_Main<Currency>.Single(n => n.CurrencyCode == b.CurrencyCode);
            Expression<Func<Discount, bool>> queryWhere = n => n.BusinessID == u.BusinessID;
            if (CheckEnableForProductSales)
                queryWhere = n => n.BusinessID == u.BusinessID && n.EnableForProductSales;
            if (CheckEnableForServiceSales)
                queryWhere = n => n.BusinessID == u.BusinessID && n.EnableForServiceSales;
            if (CheckEnableForVoucherSales)
                queryWhere = n => n.BusinessID == u.BusinessID && n.EnableForVoucherSales;
            return Json(new { Results = ExcuteData_Main<Discount>.Find(queryWhere).OrderBy(n => n.DiscountID).Select(n => new { id = n.DiscountID, text = n.DiscountName + " " + (n.IsPercentage ? n.DiscountValue.ToString() + "% off" : currency.CurrencySymbol + Math.Round(n.DiscountValue, currency.NumberDecimal).ToString() + " off") }), Total = ExcuteData_Main<Discount>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult LoadSelect2ForPackage()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            #endregion
            Expression<Func<SYS_PACKAGE, bool>> queryWhere = n => n.PackageName.Contains(searchTerm);
            return Json(new { Results = ExcuteData_Main<SYS_PACKAGE>.SelectWithPaging(queryWhere, pageNum * pageSize, pageSize, "PackageName", false).Select(n => new { id = n.PackageID, text = n.PackageName }), Total = ExcuteData_Main<SYS_PACKAGE>.Count(queryWhere) }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region get entity for id
        [HttpPost]
        public JsonResult GetBusinessTypeBaseId(int id)
        {
            BusinessType item = ExcuteData_Main<BusinessType>.GetById(id);
            return Json(new { Id = item.BusinessTypeID, Text = item.BusinessTypeName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetCountryBaseId(int id)
        {
            Country item = ExcuteData_Main<Country>.GetById(id);
            return Json(new { Id = item.CountryID, Text = item.CountryName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetTimeZoneBaseId(int id)
        {
            Models.TimeZone item = ExcuteData_Main<Models.TimeZone>.GetById(id);
            return Json(new { Id = item.TimeZoneID, Text = item.TimeZoneName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetCurrencyBaseId(string id)
        {
            Currency item = ExcuteData_Main<Currency>.GetById(id);
            return Json(new { Id = item.CurrencyCode, Text = item.CurrencyName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetTimeFormatBaseId(int id)
        {
            TimeFormat item = ExcuteData_Main<TimeFormat>.GetById(id);
            return Json(new { Id = item.TimeFormatID, Text = item.TimeFormatName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetPricingTypeBaseId(String id)
        {
            PricingType item = ExcuteData_Main<PricingType>.GetById(id);
            return Json(new { Id = item.PricingTypeID, Text = item.PricingTypeName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetTreatmentTypeBaseId(int id)
        {
            TreatmentType item = ExcuteData_Main<TreatmentType>.GetById(id);
            return Json(new { Id = item.TreatmentTypeID, Text = item.TreatmentTypeName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetAvailableForBaseId(String id)
        {
            AvailableFor item = ExcuteData_Main<AvailableFor>.GetById(id);
            return Json(new { Id = item.AvailableForID, Text = item.AvailableForName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetExtraTimeTypeBaseId(string id)
        {
            ExtraTimeType item = ExcuteData_Main<ExtraTimeType>.GetById(id);
            return Json(new { Id = item.ExtraTimeTypeID, Text = item.ExtraTimeTypeName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetTaxBaseId(long id)
        {
            Tax item = ExcuteData_Main<Tax>.GetById(id);
            return Json(new { Id = item.TaxID, Text = item.TaxName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDurationBaseId(int id)
        {
            Duration item = ExcuteData_Main<Duration>.GetById(id);
            return Json(new { Id = item.DurationTime, Text = item.DurationName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetVoucherExpiryPeriodBaseId(String id)
        {
            VoucherExpiryPeriod item = ExcuteData_Main<VoucherExpiryPeriod>.GetById(id);
            if (item != null)
            {
                return Json(new { Id = item.VoucherExpiryPeriodID, Text = item.VoucherExpiryPeriodName }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { Id = "", Text = "" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult GetLocationBaseId(long id)
        {
            Location item = ExcuteData_Main<Location>.GetById(id);
            return Json(new { Id = item.LocationID, Text = item.LocationName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetRoleBaseId(long id)
        {
            Role item = ExcuteData_Main<Role>.GetById(id);
            return Json(new { Id = item.RoleID, Text = item.RoleName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetUserBaseId(long id)
        {
            User item = ExcuteData_Main<User>.GetById(id);
            if (item != null)
                return Json(new { Id = item.UserID, Text = (item.FirstName ?? "") + " " + (item.LastName ?? "") }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { Id = id, Text = "" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetResourceBaseId(long id)
        {
            Resource item = ExcuteData_Main<Resource>.GetById(id);
            return Json(new { Id = item.ResourceID, Text = item.ResourceName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetReferralSourceBaseId(long id)
        {
            ReferralSource item = ExcuteData_Main<ReferralSource>.GetById(id);
            return Json(new { Id = item.ReferralSourceID, Text = item.ReferralSourceName }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetCategoryBaseId(long id)
        {
            Category item = ExcuteData_Main<Category>.GetById(id);
            return Json(new { Id = item.CategoryID, Text = item.CategoryName }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetBrandBaseId(long id)
        {
            Brand item = ExcuteData_Main<Brand>.GetById(id);
            return Json(new { Id = item.BrandID, Text = item.BrandName }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetSupplierBaseId(long id)
        {
            Supplier item = ExcuteData_Main<Supplier>.GetById(id);
            return Json(new { Id = item.SupplierID, Text = item.SupplierName }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetPackageBaseId(int id)
        {
            SYS_PACKAGE item = ExcuteData_Main<SYS_PACKAGE>.GetById(id);
            if (item != null)
                return Json(new { Id = item.PackageID, Text = item.PackageName }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { Id = id, Text = "" }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        [HttpPost]
        public JsonResult GetTimeFormatBaseCountry(int coutryId)
        {
            try
            {
                Models.TimeZone item = ExcuteData_TimeZone.GetTimeZoneBaseCountry(coutryId);
                return Json(new { Result = item, Error = false, ErroMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = new Models.TimeZone(), Error = true, ErroMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult GetCurrencyBaseCountry(int coutryId)
        {
            try
            {
                Currency item = ExcuteData_Currency.GetCurrencyBaseCountry(coutryId);
                return Json(new { Result = item, Error = false, ErroMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = new Models.TimeZone(), Error = true, ErroMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult GetDiscountBaseID(long ID)
        {
            try
            {
                Discount item = ExcuteData_Main<Discount>.GetById(ID);
                return Json(new { Result = item, Error = false, ErroMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = new Models.TimeZone(), Error = true, ErroMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult GetDefaultColor()
        {
            return Json(new { Result = ExcuteData_Main<DefaultColor>.GetAll(), Error = false, ErroMessage = "" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetStartWeek()
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            return Json(new { Result = ExcuteData_Main<BusinessSetting>.Single(n => n.BusinessID == BusinessID && n.SettingCode == "business_beginning_of_week") }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetFormat24h()
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            return Json(new { Result = ExcuteData_Main<Business>.Single(n => n.BusinessID == BusinessID).TimeFormat }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataClientSearch(string search)
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            return Json(new { Result = ExcuteData_Main<Client>.Find(n => n.BusinessID == BusinessID && ((n.FirstName + " " + (n.LastName == null ? "" : n.LastName)).Contains(search) || n.FirstName.Contains(search) || n.LastName.Contains(search) || n.Email.Contains(search) || n.MobileNumber.Contains(search) || n.Telephone.Contains(search))).OrderBy(n => n.FirstName) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataCancelationReason()
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            return Json(new { Result = ExcuteData_Main<CancellationReason>.Find(n => n.BusinessID == BusinessID) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetDataAllLocation()
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            return Json(new { Result = ExcuteData_Main<Location>.Find(n => n.BusinessID == BusinessID).OrderBy(n => n.SortOrder) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetDataAllSupplier()
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            return Json(new { Result = ExcuteData_Main<Supplier>.Find(n => n.BusinessID == BusinessID).OrderBy(n => n.SupplierName) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataAllCategory()
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            return Json(new { Result = ExcuteData_Main<Category>.Find(n => n.BusinessID == BusinessID).OrderBy(n => n.CategoryName) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataAllPaymentType(Boolean IsAddVoucher)
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            List<PaymentType> lst = ExcuteData_Main<PaymentType>.Find(n => n.BusinessID == BusinessID).OrderBy(n => n.SortOrder).ToList();
            if (IsAddVoucher)
            {
                lst.Add(new PaymentType { BusinessID = BusinessID, SortOrder = 999, PaymentTypeID = 0, PaymentTypeName = "Voucher" });
            }
            return Json(new { Result = lst }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SavePDF()
        {
            foreach (string fileName in Request.Files)
            {
                HttpPostedFileBase file = Request.Files[fileName];
                ExcuteFile.SaveFileFolder(file, fileName, FolderImportPath);
            }
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }
    }
    #endregion
}