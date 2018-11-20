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

namespace AdminClient.Controllers
{
    public class StaffController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Index()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.working_hours)))
            {
                return View("/Views/Staff/Index.cshtml", 1);
            }
            else if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.closed_dates)))
            {
                return View("/Views/Staff/Index.cshtml", 2);
            }
            else if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.staff_members)))
            {
                return View("/Views/Staff/Index.cshtml", 3);
            }
            else if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.permission_levels)))
            {
                return View("/Views/Staff/Index.cshtml", 4);
            }
            else
            {
                return View("");
            }
        }
        [CheckPermision]
        public ActionResult WorkingHours()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.working_hours)))
            {
                return View("/Views/Staff/Index.cshtml", 1);
            }
            else
                return View("NotFound");
        }
        [CheckPermision]
        public ActionResult CloseDate()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.closed_dates)))
            {
                return View("/Views/Staff/Index.cshtml", 2);
            }
            else
                return View("NotFound");
        }
        [CheckPermision]
        public ActionResult StaffMember()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.staff_members)))
            {
                return View("/Views/Staff/Index.cshtml", 3);
            }
            else
                return View("NotFound");
        }
        [CheckPermision]
        public ActionResult Permissions()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.permission_levels)))
            {
                return View("/Views/Staff/Index.cshtml", 4);
            }
            else
                return View("NotFound");
        }
        #endregion

        #region Ajax

        [HttpPost]
        public JsonResult GetLocation(long? UserID)
        {
            long BusinessID = 0;
            if (UserID == null || UserID == 0)
                BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            else
                BusinessID = ExcuteData_User.GetById(UserID).BusinessID;
            return Json(new { Result = ExcuteData_Main<Location>.Find(n => n.BusinessID == BusinessID), Error = false, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
        }

        #region Working Hours
        [BaseRequestAjax]
        [HttpPost]
        public JsonResult GetDataTableWorkingHour(int LocationID, int UserID, DateTime DateFrom, DateTime DateTo)
        {
            User u = (User)Session["AccountLogin"];
            //check user location
            List<UserLocation> lstul = ExcuteData_Main<UserLocation>.Find(n => n.BusinessID == u.BusinessID && n.LocationID == LocationID).ToList();
            return Json(new
            {
                Result = ExcuteData_User.GetUserGroupUserWorking(LocationID, u.BusinessID, UserID, DateFrom, DateTo),
                NoLocation = lstul.Count == 0,
                TimeFormat = ExcuteData_Main<Business>.GetById(u.BusinessID).TimeFormat,
                RangerCloseDate = ExcuteData_CloseDay.GetDataCloseDateBaseLocationId(LocationID, u.BusinessID) ?? new List<ClosedDate>(),
                ErrorMessage = "",
                Error = false
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetUserByLocation(int LocationID)
        {
            return Json(new { Result = ExcuteData_User.GetUserByLocation(LocationID, ((User)Session["AccountLogin"]).BusinessID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetChangeStaff(int LocationID)
        {
            return Json(new { Result = ExcuteData_User.GetUserCheckUserLocation(LocationID, ((User)Session["AccountLogin"]).BusinessID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveDialogChangeStaff(List<UserLocation> UserLocations, long LocationID)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                UserLocations = UserLocations == null ? new List<UserLocation>() : UserLocations;
                User u = (User)Session["AccountLogin"];
                //phai gan bien location de truong hop list userlocation khong co van co locationid de delete
                ExcuteData_Main<UserLocation>.ExecuteSqlQuery("DELETE FROM TBL_USER_LOCATION WHERE LocationID = " + LocationID.ToString() + " AND BusinessID =" + u.BusinessID.ToString());
                if (UserLocations.Count() > 0)
                {
                    UserLocations.ForEach(n => n.BusinessID = u.BusinessID);
                    ExcuteData_Main<UserLocation>.Insert(UserLocations);
                }
                scope.Complete();
                return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult SaveWorkingHours(long LocationID, long UserID, DateTime DateWorking, DateTime Shift1Start, DateTime Shift1End,
             DateTime? Shift2Start, DateTime? Shift2End, bool IsRepeat, string RepeatType, DateTime? EndRepeat, int IsUpdateThisShift)
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;

            new System.Threading.Thread(() =>
            {
                try
                {
                    ExcuteData_Main<UserWorkingHour>.ExecuteStoreCommand("pr_Staff_UpdateWorkingHours", new List<SqlParameter>()
                {
                    new SqlParameter("BusinessID", BusinessID), new SqlParameter("LocationID", LocationID),
                    new SqlParameter("UserID",UserID), new SqlParameter("DateWorking", DateWorking),
                    new SqlParameter("Shift1Start", Shift1Start), new SqlParameter("Shift1End", Shift1End),
                    new SqlParameter("Shift2Start", (Object)Shift2Start ?? DBNull.Value), new SqlParameter("Shift2End", (Object)Shift2End ?? DBNull.Value ),
                    new SqlParameter("IsRepeat", IsRepeat), new SqlParameter("RepeatType", RepeatType),
                    new SqlParameter("EndRepeat", (Object)EndRepeat ?? DBNull.Value), new SqlParameter("IsUpdateThisShift", IsUpdateThisShift)
                }.ToArray());
                }
                catch (Exception ex) { }
            }).Start();

            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteWorkingHours(long LocationID, long UserID, DateTime DateWorking, int IsUpdateThisShift)
        {
            long BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            ExcuteData_Main<UserWorkingHour>.ExecuteStoreCommand("pr_Staff_DeleteWorkingHours", new List<SqlParameter>()
                {
                    new SqlParameter("BusinessID", BusinessID), new SqlParameter("LocationID", LocationID),
                    new SqlParameter("UserID", UserID), new SqlParameter("DateWorking", DateWorking),
                    new SqlParameter("IsUpdateThisShift", IsUpdateThisShift),
                }.ToArray());
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult CheckWorkingHours(int LocationID, int UserID, int DayOfWeek, DateTime DateWorking)
        {
            User u = (User)Session["AccountLogin"];
            return Json(new
            {
                Result = ExcuteData_Main<UserWorkingHour>.Any(n =>
                        n.LocationID == LocationID && n.BusinessID == u.BusinessID &&
                        n.UserID == UserID && n.DayOfWeek == DayOfWeek && n.DateWorking > DateWorking),
                Error = false,
                ErrorMessage = ""
            }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Close Day
        [HttpPost]
        public JsonResult GetDataTableCloseDay()
        {
            User u = (User)Session["AccountLogin"];
            return Json(new { data = ExcuteData_CloseDay.GetDataCloseDate(u.BusinessID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveCloseDate(ClosedDate entity, List<ClosedDate_Location> CloseLocations, Boolean isUpdate)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                CloseLocations = CloseLocations ?? new List<ClosedDate_Location>();
                User u = (User)Session["AccountLogin"];
                entity.NoOfDays = Convert.ToInt32((entity.EndDate.Subtract(entity.StartDate)).TotalDays);
                if (isUpdate)
                {
                    #region Check
                    ClosedDate entityOld = ExcuteData_Main<ClosedDate>.GetById(entity.ClosedDateID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");
                    #endregion

                    #region ClosedDate
                    entity.BusinessID = entityOld.BusinessID;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.UserCreate = entityOld.UserCreate;
                    entity.UserModify = u.UserID;
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    ExcuteData_Main<ClosedDate>.Update(entity);
                    #endregion

                    #region ClosedDate_Location
                    CloseLocations.ForEach(n => { n.BusinessID = entity.BusinessID; n.ClosedDateID = entity.ClosedDateID; });
                    ExcuteData_Main<ClosedDate_Location>.ExecuteSqlQuery("DELETE FROM TBL_CLOSED_DATE_LOCATION WHERE ClosedDateID = " + entity.ClosedDateID + " AND BusinessID =" + entity.BusinessID);
                    ExcuteData_Main<ClosedDate_Location>.Insert(CloseLocations);
                    #endregion

                }
                else
                {
                    entity.BusinessID = u.BusinessID;
                    entity.UserCreate = u.UserID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    ExcuteData_Main<ClosedDate>.Insert(entity);
                    CloseLocations.ForEach(n => { n.BusinessID = entity.BusinessID; n.ClosedDateID = entity.ClosedDateID; });
                    ExcuteData_Main<ClosedDate_Location>.Insert(CloseLocations);
                }
                scope.Complete();
                return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult DeleteCloseDate(long id)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                ClosedDate entity = ExcuteData_Main<ClosedDate>.GetById(id);
                if (entity.BusinessID != u.BusinessID)
                    throw new Exception("User không có quyền được sửa dữ liệu của người khác");
                ExcuteData_Main<ClosedDate>.Delete(id);
                ExcuteData_Main<ClosedDate_Location>.ExecuteSqlQuery("DELETE FROM TBL_CLOSED_DATE_LOCATION WHERE ClosedDateID = " + entity.ClosedDateID + " AND BusinessID =" + entity.BusinessID);
                scope.Complete();
                return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Staff Member
        [HttpPost]
        public JsonResult GetService(long? UserID)
        {
            long BusinessID = 0;
            if (UserID == null || UserID == 0)
                BusinessID = ((User)Session["AccountLogin"]).BusinessID;
            else
                BusinessID = ExcuteData_User.GetById(UserID).BusinessID;
            return Json(new { Result = ExcuteData_Main<Service>.Find(n => n.BusinessID == BusinessID), Error = false, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetDataWhenCreateStaff()
        {
            User u = ((User)Session["AccountLogin"]);
            return Json(new { Result = new { DialCode = ExcuteData_DialCode.GetEntityBaseUserId(u.UserID), Role = ExcuteData_Main<Role>.Single(n => n.RoleName == "No Access") } }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataWhenEditStaff(long UserID)
        {
            return Json(new { Result = ExcuteData_User.GetDataEditStaffMember(UserID), Error = false, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataTableStaffMemeber()
        {
            User u = (User)Session["AccountLogin"];
            return Json(new { data = ExcuteData_User.GetDataTableStaffMember(u.BusinessID), ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpdateSortOrderUser(long UserID, int SortOrderNew)
        {
            User entity = ExcuteData_Main<User>.GetById(UserID);
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            if (entity.BusinessID != u.BusinessID)
                throw new Exception("User không có quyền được sửa dữ liệu của người khác");
            entity.SortOrder = SortOrderNew;
            ExcuteData_Main<User>.Update(entity);
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult ValidateEmail()
        {
            string Email = Request.Form.GetValues("Email").FirstOrDefault() ?? "";
            long userId = Convert.ToInt64(Request.Form.GetValues("UserId").FirstOrDefault() ?? "0");
            return Json(!ExcuteData_Main<User>.Any(n => n.UserID != userId && n.Email == Email && n.Status == 1), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveStaffMember(User Entity, List<UserLocation> UserLocations, List<ServiceStaff> ServiceStaffs, bool isUpdate)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                TimeZoneInfo TargetTimeZone = Session["TargetTimeZone"] == null ? TimeZoneInfo.Local : TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                User u = ((User)Session["AccountLogin"]);
                
                UserLocations = UserLocations ?? new List<UserLocation>();
                ServiceStaffs = ServiceStaffs ?? new List<ServiceStaff>();
                string emailOld = "";
                if (isUpdate)
                {
                    User entityOld = ExcuteData_Main<User>.GetById(Entity.UserID);

                    #region Check
                    if (entityOld.BusinessID != u.BusinessID && u.BusinessID != 0)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");
                    #endregion

                    #region User
                    Entity.Password = entityOld.Password;
                    Entity.UserCreate = entityOld.UserCreate;
                    Entity.CreateDate = entityOld.CreateDate;
                    Entity.UserModify = u.UserID;
                    Entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    Entity.Status = entityOld.Status;
                    Entity.BusinessID = entityOld.BusinessID;
                    Entity.FirstLogin = entityOld.FirstLogin;
                    Entity.SortOrder = entityOld.SortOrder;
                    emailOld = entityOld.Email;
                    ExcuteData_Main<User>.Update(Entity);
                    #endregion

                    #region User Location
                    UserLocations.ForEach(n => { n.BusinessID = Entity.BusinessID; n.UserID = Entity.UserID; });
                    ExcuteData_Main<UserLocation>.Find(n => n.BusinessID == Entity.BusinessID && n.UserID == Entity.UserID).ForEach(n => ExcuteData_Main<UserLocation>.Delete(n));
                    ExcuteData_Main<UserLocation>.Insert(UserLocations);
                    #endregion

                    #region Service Staff
                    ServiceStaffs.ForEach(n =>
                    {
                        n.BusinessID = Entity.BusinessID; n.UserID = Entity.UserID; n.UserCreate = u.UserID;
                        n.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    });
                    List<ServiceStaff> serviceStaffOld = ExcuteData_Main<ServiceStaff>.Find(n => n.BusinessID == Entity.BusinessID && n.UserID == Entity.UserID);
                    List<ServiceStaff> serviceStaffUpadate = ServiceStaffs.Where(n => n.ServiceStaffID != 0).ToList();
                    ExcuteData_Main<ServiceStaff>.Insert(ServiceStaffs.Where(n => n.ServiceStaffID == 0).ToList());
                    serviceStaffUpadate.ForEach(n =>
                    {
                        ServiceStaff s = serviceStaffOld.SingleOrDefault(m => m.ServiceStaffID == n.ServiceStaffID);
                        if (s != null)
                        {
                            n.CreateDate = s.CreateDate;
                            n.UserCreate = s.UserCreate;
                            n.UserModify = Entity.UserID;
                            n.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        }
                    });
                    ExcuteData_Main<ServiceStaff>.Update(serviceStaffUpadate);
                    serviceStaffOld.Where(n => !serviceStaffUpadate.Any(m => m.ServiceStaffID == n.ServiceStaffID)).ToList().ForEach(n => ExcuteData_Main<ServiceStaff>.Delete(n.ServiceStaffID));
                    #endregion

                }
                else
                {
                    #region User
                    Entity.Password = CryptorEngine.Encrypt("", true);
                    Entity.UserCreate = u.UserID;
                    Entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    Entity.Status = 1;
                    Entity.BusinessID = u.BusinessID;
                    Entity.FirstLogin = false;
                    Entity.SortOrder = ExcuteData_Main<User>.Find(n => n.BusinessID == u.BusinessID).Max(n => n.SortOrder) + 1;
                    ExcuteData_Main<User>.Insert(Entity);
                    #endregion

                    #region User Location
                    UserLocations.ForEach(n => { n.BusinessID = Entity.BusinessID; n.UserID = Entity.UserID; });
                    ExcuteData_Main<UserLocation>.Insert(UserLocations);
                    #endregion

                    #region Service Staff
                    ServiceStaffs.ForEach(n =>
                    {
                        n.BusinessID = Entity.BusinessID; n.UserID = Entity.UserID; n.UserCreate = u.UserID;
                        n.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    });
                    ExcuteData_Main<ServiceStaff>.Insert(ServiceStaffs);
                    #endregion
                }
                scope.Complete();

                #region Send Email
                new System.Threading.Thread(() =>
                {
                    if (Entity.Email != null && Entity.Email != "" && (!isUpdate || Entity.Email != emailOld))
                    {
                        List<Config> Configs = ExcuteData_Main<Config>.GetAll();
                        Config Body = Configs.SingleOrDefault(n => n.ConfigID == "BodyEmailWhenCreateStaff");
                        Config EmailServer = Configs.SingleOrDefault(n => n.ConfigID == "EmailServer");
                        Config PasswordServer = Configs.SingleOrDefault(n => n.ConfigID == "Password");
                        Config ServerName = Configs.SingleOrDefault(n => n.ConfigID == "ServerName");
                        Config SMTP = Configs.SingleOrDefault(n => n.ConfigID == "SMTP");
                        Config Subject = Configs.SingleOrDefault(n => n.ConfigID == "SubjectEmailWhenCreateStaff");
                        Config UseSSLAdmin = Configs.SingleOrDefault(n => n.ConfigID == "UseSSLAdmin");
                        Config SiteName = Configs.SingleOrDefault(n => n.ConfigID == "SiteName");
                        string TemplateBodyEmail = Configs.SingleOrDefault(n => n.ConfigID == "TemplateBodyEmail").Value;
                        ResetPassword r = new ResetPassword()
                        {
                            ResetID = Guid.NewGuid(),
                            UserID = Entity.UserID,
                            RequestDate = DateTime.Now,
                            ExpriredDate = DateTime.Now.AddDays(7),
                            IsUsed = false
                        };
                        ExcuteData_Main<ResetPassword>.Insert(r);
                        string link = string.Format("http://{0}/Login/Index?reset_password_token={1}#changepassword", SiteName.Value, r.ResetID);
                        Business b = ExcuteData_Main<Business>.GetById(Entity.BusinessID);
                        Body.Value = Body.Value.Replace("@FirstName", Entity.FirstName ?? "").Replace("@LastName", Entity.LastName ?? "").Replace("@CompanyName", b.CompanyName ?? "").Replace("@Link", link);
                        string error = "";
                        
                        if (!Library.Email.SendMail(ServerName.Value, EmailServer.Value, PasswordServer.Value, SMTP.Value, Entity.Email, "", "", Subject.Value, Library.Email.ConvertStringToHtml(Body.Value, TemplateBodyEmail), UseSSLAdmin.Value == "1", ref error, new string[0]))
                            throw new Exception(error);
                    }
                }).Start();
                #endregion

                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult DeleteStaffMember(long id)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                User entity = ExcuteData_Main<User>.GetById(id);
                if (entity.BusinessID != u.BusinessID && u.BusinessID != 0)
                    throw new Exception("User không có quyền được sửa dữ liệu của người khác");
                entity.Status = 0;
                ExcuteData_Main<User>.Update(entity);
                ExcuteData_Main<UserLocation>.Find(n => n.BusinessID == entity.BusinessID && n.UserID == entity.UserID).ForEach(n => ExcuteData_Main<UserLocation>.Delete(n));
                ExcuteData_Main<ServiceStaff>.Find(n => n.BusinessID == entity.BusinessID && n.UserID == entity.UserID).ForEach(n => ExcuteData_Main<ServiceStaff>.Delete(n));
                scope.Complete();
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult CheckDeleteStaffMember(long id)
        {
            TimeZoneInfo TargetTimeZone = Session["TargetTimeZone"] == null ? TimeZoneInfo.Local : TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            DateTime now = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            User u = (User)Session["AccountLogin"];

            User user = ExcuteData_Main<User>.Find(n => n.BusinessID == u.BusinessID && n.UserID == id).FirstOrDefault();
            if (user != null && user.RoleID == 5)
            {
                return Json(new { Result = false, ErrorMessage = "This user is owner, you can't delete it." }, JsonRequestBehavior.AllowGet);
            }

            List<V_APPOINTMENT_SERVICE> lst = ExcuteData_Main<V_APPOINTMENT_SERVICE>.Find(n => n.BusinessID == u.BusinessID && n.StaffID == id && (n.Status == Library.Enum.APPOINTMENT_STATUS_NEW || n.Status == Library.Enum.APPOINTMENT_STATUS_ARRIVED || n.Status == Library.Enum.APPOINTMENT_STATUS_CONFIRMED || n.Status == Library.Enum.APPOINTMENT_STATUS_STARTED) && n.StartTime > now).ToList();
            if (lst.Count > 0)
                return Json(new { Result = false, ErrorMessage = "This staff member has future appointments and cannot be deleted until these appointments are canceled or assigned to another member" }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult ResetPassword(string Email, long UserID)
        {
            User u = ExcuteData_Main<User>.GetById(UserID);

            #region Insert ResetPassword
            ResetPassword r = new ResetPassword()
            {
                ResetID = Guid.NewGuid(),
                UserID = u.UserID,
                RequestDate = DateTime.Now,
                ExpriredDate = DateTime.Now.AddDays(1),
                IsUsed = false
            };
            ExcuteData_Main<ResetPassword>.Insert(r);
            #endregion

            #region Send Email
            List<Config> Configs = ExcuteData_Main<Config>.GetAll();
            Config useSES = Configs.SingleOrDefault(n => n.ConfigID == "UseSES");
            Config BrandName = Configs.SingleOrDefault(n => n.ConfigID == "BrandName");
            Config SiteEmail = Configs.SingleOrDefault(n => n.ConfigID == "SiteEmail");
            Config Body = Configs.SingleOrDefault(n => n.ConfigID == "BodyEmailWhenResetPassword");
            Config EmailServer = Configs.SingleOrDefault(n => n.ConfigID == "EmailServer");
            Config PasswordServer = Configs.SingleOrDefault(n => n.ConfigID == "Password");
            Config ServerName = Configs.SingleOrDefault(n => n.ConfigID == "ServerName");
            Config SMTP = Configs.SingleOrDefault(n => n.ConfigID == "SMTP");
            Config Subject = Configs.SingleOrDefault(n => n.ConfigID == "SubjectEmailWhenResetPassword");
            Config UseSSLAdmin = Configs.SingleOrDefault(n => n.ConfigID == "UseSSLAdmin");
            Config SiteName = Configs.SingleOrDefault(n => n.ConfigID == "SiteName");
            string TemplateBodyEmail = Configs.SingleOrDefault(n => n.ConfigID == "TemplateBodyEmail").Value;

            string link = string.Format("http://{0}/Login/Index?reset_password_token={1}#changepassword", SiteName.Value.Replace("http://", ""), r.ResetID);
            string error = "";
            Subject.Value = Subject.Value.Replace("@FirstName", u.FirstName)
                .Replace("@LastName", u.LastName)
                .Replace("@Email", Email);
            Body.Value = Body.Value.Replace("@FirstName", u.FirstName)
                .Replace("@LastName", u.LastName)
                .Replace("@Email", Email).Replace("@Link", link);

            if (useSES != null && useSES.Value == "1")
            {
                Library.Email.SendEmailSES(SiteEmail.Value, BrandName.Value, Email, EmailServer.Value, PasswordServer.Value, ServerName.Value, Convert.ToInt32(SMTP.Value), Subject.Value, Library.Email.ConvertStringToHtml(Body.Value, TemplateBodyEmail), UseSSLAdmin.Value == "1", "");
            }
            else
            {
                if (!Library.Email.SendMail(ServerName.Value, EmailServer.Value, PasswordServer.Value, SMTP.Value, Email, "", "", Subject.Value, Library.Email.ConvertStringToHtml(Body.Value, TemplateBodyEmail), UseSSLAdmin.Value == "1", ref error, new string[0]))
                    throw new Exception("Gởi email thất bại. Lỗi: " + error);
            }

            #endregion

            return Json(new { Result = true, ErrorMessage = "", ErrorStyle = 0 }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Permission
        [HttpPost]
        public JsonResult GetDataTablePermission()
        {
            try
            {
                User u = (User)Session["AccountLogin"];
                ModelEntity excute = new ModelEntity();

                //kiem tra truoc ko co thi insert
                List<PermissionLevel> olds = ExcuteData_Main<PermissionLevel>.Find(n => n.BusinessID == u.BusinessID);
                //neu khong phai la admin va chua co default thi insert
                if (u.BusinessID != 0 && olds.Count == 0)
                {
                    List<PermissionLevel> defaults = ExcuteData_Main<PermissionLevel>.Find(n => n.BusinessID == 0);
                    defaults.ForEach(o =>
                    {
                        o.BusinessID = u.BusinessID;
                    });
                    ExcuteData_Main<PermissionLevel>.Insert(defaults);
                }

                List<Object> result = (from us in excute.Functions.Select(n => new { n.FormCode, n.FormName, n.SortOrder, n.AllowChangeRole, n.FunctionGroup })
                                       join s in excute.PermissionLevels on us.FormCode equals s.FormCode into lsS

                                       from s in lsS.DefaultIfEmpty().Select(n => new { n.BusinessID, n.FormCode, n.Low, n.Medium, n.High, n.Owner })
                                       where s.BusinessID == u.BusinessID

                                       select new { us.FormCode, us.FormName, us.FunctionGroup, us.AllowChangeRole, us.SortOrder, s.BusinessID, s.Low, s.Medium, s.High, s.Owner }).OrderBy(n => n.SortOrder).ToList<Object>();

                return Json(new { data = result, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { data = new List<Object>(), ErrorMessage = ex.Message, Error = true }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UpdatePermissionLevel(List<PermissionLevel> PermissionLevels)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();

                List<PermissionLevel> olds = ExcuteData_Main<PermissionLevel>.Find(n => n.BusinessID == u.BusinessID);
                if (olds != null)
                {
                    olds.ForEach(o =>
                    {
                        o.Low = false;
                        o.Medium = false;
                        o.High = false;
                        o.Owner = false;
                        PermissionLevels.ForEach(n =>
                        {
                            if (o.FormCode == n.FormCode)
                            {
                                if (n.Low)
                                {
                                    o.Low = true;
                                }
                                if (n.Medium)
                                {
                                    o.Medium = true;
                                }
                                if (n.High)
                                {
                                    o.High = true;
                                }
                                if (n.Owner)
                                {
                                    o.Owner = true;
                                }
                            }
                        });
                    });
                }

                ExcuteData_Main<PermissionLevel>.Update(olds);

                return Json(new { Result = true, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }
        #endregion

        #endregion
    }
}