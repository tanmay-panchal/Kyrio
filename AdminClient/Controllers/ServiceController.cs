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

namespace AdminClient.Controllers
{
    public class ServiceController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Index()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.services)))
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

        #region Get Data
        [HttpPost]
        public JsonResult GetDataTableIndex()
        {
            try
            {
                string search = Request.Form["search[value]"] ?? "";
                User u = (User)Session["AccountLogin"];
                return Json(new { data = ExcuteData_Service.GetDataTableIndex(search, u.BusinessID), CurrencySymbol = ExcuteData_Currency.GetCurrencyBaseBusinessID(u.BusinessID), ErrorMessage = "", Error = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Group Service
        [HttpPost]
        public JsonResult DeleteGroupService(long id)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    User u = (User)Session["AccountLogin"] ?? new Models.User();
                    ServiceGroup entityOld = ExcuteData_Main<ServiceGroup>.GetById(id);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");
                    ExcuteData_Main<ServiceGroup>.Delete(id);
                    ExcuteData_Main<Service>.Find(n => n.ServiceGroupID == id).ForEach(n =>
                    {
                        ExcuteData_Main<ServiceDuration>.Find(m => m.ServiceID == n.ServiceID).ForEach(m => ExcuteData_Main<ServiceDuration>.Delete(m.ServiceDurationID));
                        ExcuteData_Main<ServiceResource>.Find(m => m.ServiceID == n.ServiceID).ForEach(m => ExcuteData_Main<ServiceResource>.Delete(m.ServiceResourceID));
                        ExcuteData_Main<ServiceStaff>.Find(m => m.ServiceID == n.ServiceID).ForEach(m => ExcuteData_Main<ServiceStaff>.Delete(m.ServiceStaffID));
                        ExcuteData_Main<Service>.Delete(n.ServiceID);
                    });
                    scope.Complete();
                    return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult AddOrUpdateGroupService(ServiceGroup entity, Boolean isUpdate)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                if (isUpdate)
                {
                    ServiceGroup entityOld = ExcuteData_Main<ServiceGroup>.GetById(entity.ServiceGroupID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.BusinessID = entityOld.BusinessID;
                    entity.SortOrder = entityOld.SortOrder;

                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<ServiceGroup>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    List<ServiceGroup> ls = ExcuteData_Main<ServiceGroup>.Find(n => n.BusinessID == u.BusinessID);
                    entity.SortOrder = ls.Count() == 0 ? 1 : ls.Max(n => n.SortOrder) + 1;

                    ExcuteData_Main<ServiceGroup>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        #endregion

        #region Service
        [HttpPost]
        public JsonResult GetStaff()
        {
            User u = (User)Session["AccountLogin"];
            return Json(new { Result = ExcuteData_Main<User>.Find(n => n.BusinessID == u.BusinessID && n.Status == 1), ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetResource()
        {
            User u = (User)Session["AccountLogin"];
            return Json(new { Result = ExcuteData_Resource.GetEntityBaseBusinessIDGroupLocation(u.BusinessID), ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetEntityService(int ServiceID)
        {
            return Json(new { Result = ExcuteData_Service.GetEntityAttachDurationBaseId(ServiceID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteService(long id)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                Service entityOld = ExcuteData_Main<Service>.GetById(id);
                if (entityOld.BusinessID != u.BusinessID)
                    throw new Exception("User không có quyền được sửa dữ liệu của người khác");
                ExcuteData_Main<Service>.Delete(id);
                ExcuteData_Main<ServiceDuration>.Find(m => m.ServiceID == id).ForEach(m => ExcuteData_Main<ServiceDuration>.Delete(m.ServiceDurationID));
                ExcuteData_Main<ServiceResource>.Find(m => m.ServiceID == id).ForEach(m => ExcuteData_Main<ServiceResource>.Delete(m.ServiceResourceID));
                ExcuteData_Main<ServiceStaff>.Find(m => m.ServiceID == id).ForEach(m => ExcuteData_Main<ServiceStaff>.Delete(m.ServiceStaffID));
                scope.Complete();
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult AddOrUpdateService(Service entity, List<ServiceDuration> ServiceDurations, List<ServiceStaff> ServiceStaffs, List<ServiceResource> ServiceResources, Boolean isUpdate)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    User u = (User)Session["AccountLogin"];
                    TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                    if (entity.TaxID != 0 && entity.TaxID != null)
                        entity.TaxRate = ExcuteData_Main<Tax>.GetById(entity.TaxID).TaxRate;
                    ServiceStaffs = ServiceStaffs == null ? new List<ServiceStaff>() : ServiceStaffs;
                    ServiceDurations = ServiceDurations == null ? new List<ServiceDuration>() : ServiceDurations;
                    ServiceResources = ServiceResources == null ? new List<ServiceResource>() : ServiceResources;
                    if (isUpdate)
                    {
                        #region Entity
                        Service entityOld = ExcuteData_Main<Service>.GetById(entity.ServiceID);
                        if (entityOld.BusinessID != u.BusinessID)
                            throw new Exception("User không có quyền được sửa dữ liệu của người khác");
                        entity.BusinessID = entityOld.BusinessID;
                        entity.CreateDate = entityOld.CreateDate;
                        entity.UserCreate = entityOld.UserCreate;
                        entity.SortOrder = entityOld.SortOrder;
                        entity.UserModify = u.UserID;
                        entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        ExcuteData_Main<Service>.Update(entity);
                        #endregion

                        #region ServiceDuration
                        ServiceDurations.ForEach(n => { n.BusinessID = u.BusinessID; n.ServiceID = entity.ServiceID; });
                        List<ServiceDuration> lsServiceDurationOld = ExcuteData_Main<ServiceDuration>.Find(n => n.ServiceID == entity.ServiceID);
                        List<ServiceDuration> lsServiceDurationUpdate = ServiceDurations.Where(n => n.ServiceDurationID != 0).ToList();
                        lsServiceDurationUpdate.ForEach(n =>
                        {
                            ServiceDuration e = lsServiceDurationOld.SingleOrDefault(m => m.ServiceDurationID == n.ServiceDurationID);
                            n.UserCreate = e.UserCreate;
                            n.CreateDate = e.CreateDate;
                            n.UserModify = u.UserID;
                            n.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        });
                        List<ServiceDuration> lsServiceDurationInsert = ServiceDurations.Where(n => n.ServiceDurationID == 0).ToList();
                        lsServiceDurationInsert.ForEach(n => { n.UserCreate = u.UserID; n.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone); });
                        ExcuteData_Main<ServiceDuration>.Insert(lsServiceDurationInsert);
                        ExcuteData_Main<ServiceDuration>.Update(lsServiceDurationUpdate);
                        lsServiceDurationOld.Where(n => !lsServiceDurationUpdate.Any(m => m.ServiceDurationID == n.ServiceDurationID)).ToList().ForEach(n => ExcuteData_Main<ServiceDuration>.Delete(n.ServiceDurationID));
                        #endregion

                        #region ServiceStaff
                        ServiceStaffs.ForEach(n => { n.BusinessID = u.BusinessID; n.ServiceID = entity.ServiceID; });
                        List<ServiceStaff> lsServiceStaffOld = ExcuteData_Main<ServiceStaff>.Find(n => n.ServiceID == entity.ServiceID);
                        List<ServiceStaff> lsServiceStaffUpdate = ServiceStaffs.Where(n => n.ServiceStaffID != 0).ToList();
                        lsServiceStaffUpdate.ForEach(n =>
                        {
                            ServiceStaff e = lsServiceStaffOld.SingleOrDefault(m => m.ServiceStaffID == n.ServiceStaffID);
                            n.UserCreate = e.UserCreate;
                            n.CreateDate = e.CreateDate;
                            n.UserModify = u.UserID;
                            n.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        });
                        List<ServiceStaff> lsServiceStaffInsert = ServiceStaffs.Where(n => n.ServiceStaffID == 0).ToList();
                        lsServiceStaffInsert.ForEach(n => { n.UserCreate = u.UserID; n.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone); });
                        ExcuteData_Main<ServiceStaff>.Insert(lsServiceStaffInsert);
                        ExcuteData_Main<ServiceStaff>.Update(lsServiceStaffUpdate);
                        lsServiceStaffOld.Where(n => !lsServiceStaffUpdate.Any(m => m.ServiceStaffID == n.ServiceStaffID)).ToList().ForEach(n => ExcuteData_Main<ServiceStaff>.Delete(n.ServiceStaffID));
                        #endregion

                        #region ServiceResource
                        ServiceResources.ForEach(n => { n.BusinessID = u.BusinessID; n.ServiceID = entity.ServiceID; });
                        List<ServiceResource> lsServiceResourceOld = ExcuteData_Main<ServiceResource>.Find(n => n.ServiceID == entity.ServiceID);
                        List<ServiceResource> lsServiceResourceUpdate = ServiceResources.Where(n => n.ServiceResourceID != 0).ToList();
                        lsServiceResourceUpdate.ForEach(n =>
                        {
                            ServiceResource e = lsServiceResourceOld.SingleOrDefault(m => m.ServiceResourceID == n.ServiceResourceID);
                            n.UserCreate = e.UserCreate;
                            n.CreateDate = e.CreateDate;
                            n.UserModify = u.UserID;
                            n.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        });
                        List<ServiceResource> lsServiceResourceInsert = ServiceResources.Where(n => n.ServiceResourceID == 0).ToList();
                        lsServiceResourceInsert.ForEach(n => { n.UserCreate = u.UserID; n.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone); });
                        ExcuteData_Main<ServiceResource>.Insert(lsServiceResourceInsert);
                        ExcuteData_Main<ServiceResource>.Update(lsServiceResourceUpdate);
                        lsServiceResourceOld.Where(n => !lsServiceResourceUpdate.Any(m => m.ServiceResourceID == n.ServiceResourceID)).ToList().ForEach(n => ExcuteData_Main<ServiceResource>.Delete(n.ServiceResourceID));
                        #endregion
                    }
                    else
                    {
                        entity.BusinessID = u.BusinessID;
                        entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        entity.UserCreate = u.UserID;
                        List<Service> ls = ExcuteData_Main<Service>.Find(n => n.BusinessID == u.BusinessID);
                        entity.SortOrder = ls.Count() == 0 ? 1 : ls.Max(n => n.SortOrder) + 1;
                        ExcuteData_Main<Service>.Insert(entity);
                        ServiceDurations.ForEach(n =>
                        {
                            n.BusinessID = u.BusinessID; n.ServiceID = entity.ServiceID; n.UserCreate = u.UserID;
                            n.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        });
                        ServiceStaffs.ForEach(n => { n.BusinessID = u.BusinessID; n.ServiceID = entity.ServiceID; n.UserCreate = u.UserID;
                            n.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone); });
                        ServiceResources.ForEach(n => { n.BusinessID = u.BusinessID; n.ServiceID = entity.ServiceID; n.UserCreate = u.UserID;
                            n.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone); });
                        ExcuteData_Main<ServiceDuration>.Insert(ServiceDurations);
                        ExcuteData_Main<ServiceStaff>.Insert(ServiceStaffs);
                        ExcuteData_Main<ServiceResource>.Insert(ServiceResources);
                    }
                    scope.Complete();
                    return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        [HttpPost]
        public JsonResult UpdateSortOrderAfterDrop(long ServiceIDDrag, long ServiceIDBelow, long ServiceGroupIDTo)
        {
            return Json(new { Result = true, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #endregion
    }
}