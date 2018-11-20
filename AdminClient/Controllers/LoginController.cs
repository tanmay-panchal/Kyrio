using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using AdminClient.Library;
using System.Transactions;
using System.Data.SqlClient;
using System.Web.Hosting;
using System.IO;

namespace AdminClient.Controllers
{
    public class LoginController : Controller
    {
        #region Load Page
        public ActionResult Index()
        {
            return View();
        }
        #endregion

        #region Ajax

        #region Login
        [HttpPost]
        public JsonResult ExcuteLogin(string Email, string Password)
        {
            try
            {
                Password = CryptorEngine.Encrypt(Password, true);
                User u = ExcuteData_Main<User>.Single(n => n.Email == Email && n.Password == Password && n.Status == 1);
                if (u == null)
                    return Json(new { Result = false, ErrorMessageStyle = "Invalid email or password " }, JsonRequestBehavior.AllowGet);
                else
                {
                    if (u.BusinessID != 0)
                    {
                        BusinessSetting bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == u.BusinessID && n.SettingCode == "BSExpiry").FirstOrDefault();
                        if (bs != null && bs.Value != null && bs.Value != "")
                        {
                            try
                            {
                                DateTime exp = Convert.ToDateTime(bs.Value);
                                if (exp < DateTime.Today)
                                {
                                    return Json(new { Result = false, ErrorMessageStyle = "This business has expired, please contact with admin then support. Thanks you. " }, JsonRequestBehavior.AllowGet);
                                }
                            }
                            catch (Exception)
                            {


                            }

                        }
                    }
                }
                Session["AccountLogin"] = u;
                Session["Business"] = null;//gan de xoa
                if (u.BusinessID != 0)
                {
                    Business b = ExcuteData_Main<Business>.GetById(u.BusinessID);
                    Session["Business"] = b;
                    LoadDefaultData();
                }

                return Json(new { Result = true, ErrorMessageStyle = "", IsAdmin = u.BusinessID == 0 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Result = false, ErrorMessageStyle = ex.Message }, JsonRequestBehavior.AllowGet);

            }

        }

        public void LoadDefaultData()
        {
            Business b = (Business)System.Web.HttpContext.Current.Session["Business"];
            User u = (User)System.Web.HttpContext.Current.Session["AccountLogin"];

            Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
            List<Config> configs = ExcuteData_Main<Config>.GetAll();
            System.Web.HttpContext.Current.Session["MainTimeZone"] = configs.SingleOrDefault(n => n.ConfigID == "MainTimeZone").Value;
            System.Web.HttpContext.Current.Session["TargetTimeZone"] = ExcuteData_Main<Country>.Find(n => n.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
            System.Web.HttpContext.Current.Session["CompanyName"] = b.CompanyName;

            List<BusinessSetting> bSettings = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == b.BusinessID);
            Currency currency = ExcuteData_Main<Currency>.Single(n => n.CurrencyCode == b.CurrencyCode);

            Country country = ExcuteData_Main<Country>.Single(n => n.CountryID == b.CountryID);
            User uMain = ExcuteData_Main<User>.Find(n => n.BusinessID == u.BusinessID && n.RoleID == 5).FirstOrDefault();

            b.Language = b.Language ?? "en";
            System.Web.HttpContext.Current.Session["VariableGlobalSrcipt"] = new
            {
                BusinessBeginningOfWeek = (bSettings.SingleOrDefault(n => n.SettingCode == "business_beginning_of_week") ?? new BusinessSetting() { Value = "0" }).Value,
                BusinessDefaultCalendarView = (bSettings.SingleOrDefault(n => n.SettingCode == "business_default_calendar_view") ?? new BusinessSetting() { Value = "day" }).Value,
                BusinessTimeSlotMinutes = (bSettings.SingleOrDefault(n => n.SettingCode == "business_time_slot_minutes") ?? new BusinessSetting() { Value = "15" }).Value,
                config_tax_calculation = (bSettings.SingleOrDefault(n => n.SettingCode == "config_tax_calculation") ?? new BusinessSetting() { Value = "include" }).Value,
                business_voucher_expiration_period = (bSettings.SingleOrDefault(n => n.SettingCode == "business_voucher_expiration_period") ?? new BusinessSetting() { Value = "" }).Value,
                BusinessAppointmentColorSource = (bSettings.SingleOrDefault(n => n.SettingCode == "business_appointment_color_source") ?? new BusinessSetting() { Value = "service_group" }).Value,
                customInvoiceTitle = bSettings.SingleOrDefault(n => n.SettingCode == "customInvoiceTitle").Value,
                printReceipts = bSettings.SingleOrDefault(n => n.SettingCode == "printReceipts").Value,
                receiptMessage = bSettings.SingleOrDefault(n => n.SettingCode == "receiptMessage").Value,
                saleCustomHeader1 = bSettings.SingleOrDefault(n => n.SettingCode == "saleCustomHeader1").Value,
                saleCustomHeader2 = bSettings.SingleOrDefault(n => n.SettingCode == "saleCustomHeader2").Value,
                saleShowCustomerAddress = bSettings.SingleOrDefault(n => n.SettingCode == "saleShowCustomerAddress").Value,
                saleShowCustomerInfo = bSettings.SingleOrDefault(n => n.SettingCode == "saleShowCustomerInfo").Value,
                TimeFormat = b.TimeFormat,
                CurrencyCode = b.CurrencyCode,
                CurrencySymbol = currency.CurrencySymbol,
                BookingPageLink = configs.SingleOrDefault(n => n.ConfigID == "booking_page_link").Value,
                SiteName = configs.SingleOrDefault(n => n.ConfigID == "SiteName").Value,
                BrandName = configs.SingleOrDefault(n => n.ConfigID == "BrandName").Value,
                FaceBookAppID = configs.SingleOrDefault(n => n.ConfigID == "FaceBookAppID").Value,
                CountryCode = country.CountryCode,
                CountryID = country.CountryID,
                Language = b.Language,
                FormatStringAmount = "#,##0.00",
                FormatDateJS = "DD/MM/YYYY",
                FormatDateMonthNameJS = "DD MMM YYYY",
                FormatDayAndMonthNameJS = "DD MMM",
                FormatDateWithDayOfWeekJS = "dddd, DD MMM YYYY",
                FormatDateWithDayOfWeekCS = "ddd, dd MMM yyyy",
                FormatDateWithTimeJS = b.TimeFormat == "24" ? "DD MMM YYYY, HH:mm" : "DD MMM YYYY, hh:mm A",
                FormatDateCS = "dd/MM/yyyy",
                FormatTimeJS = b.TimeFormat == "24" ? "HH:mm" : "hh:mm A",
                FormatTimeCS = "HH:mm",
                NumberDecimal = currency.NumberDecimal,
                TimeZone = tz.TimeZoneCode,
                BusinessEmail = uMain == null ? "" : uMain.Email,
                BusinessName = b.CompanyName,
                StatusScheul = new Object[] { new { Status = Library.Enum.APPOINTMENT_STATUS_NEW, Color = configs.FirstOrDefault(n=>n.ConfigID == "ColorAppointmentNew").Value },
                                              new { Status = Library.Enum.APPOINTMENT_STATUS_CANCELLED, Color = configs.FirstOrDefault(n=>n.ConfigID == "ColorAppointmentCancelled").Value },
                                              new { Status = Library.Enum.APPOINTMENT_STATUS_CONFIRMED, Color = configs.FirstOrDefault(n=>n.ConfigID == "ColorAppointmentConfirmed").Value },
                                              new { Status = Library.Enum.APPOINTMENT_STATUS_ARRIVED, Color = configs.FirstOrDefault(n=>n.ConfigID == "ColorAppointmentArrived").Value },
                                              new { Status = Library.Enum.APPOINTMENT_STATUS_STARTED, Color = configs.FirstOrDefault(n=>n.ConfigID == "ColorAppointmentStarted").Value },
                                              new { Status = Library.Enum.APPOINTMENT_STATUS_COMPLETED, Color = configs.FirstOrDefault(n=>n.ConfigID == "ColorAppointmentCompleted").Value },
                                              new { Status = Library.Enum.APPOINTMENT_STATUS_NOSHOW, Color = configs.FirstOrDefault(n=>n.ConfigID == "ColorAppointmentNoShow").Value }}
            };
        }
        #endregion

        #region Register 
        [HttpPost]
        public JsonResult ExcuteRegister(string FirstName, string LastName, string CompanyName, int BusinessTypeID, int CountryID, int TimeZoneID, string CurrencyCode, string Password, string Email)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                #region Check Email Exists
                if (ExcuteData_Main<User>.Any(n => n.Email == Email && n.Status == 1))
                    return Json(new { Result = false, ErrorStyle = 1, ErrorMessage = "Email already exists." }, JsonRequestBehavior.AllowGet);
                #endregion

                #region Get Country
                Country c = ExcuteData_Main<Country>.GetById(CountryID);
                if (c == null)
                    throw new Exception("Không tìm thấy country");
                #endregion

                #region Insert Business
                Business bus = new Business()
                {
                    CompanyName = CompanyName,
                    BusinessTypeID = BusinessTypeID,
                    CountryID = CountryID,
                    CurrencyCode = CurrencyCode,
                    TimeZoneID = TimeZoneID,
                    CreateDate = DateTime.Now,
                    PackageID = 1,
                    TimeFormat = "24",
                    ContactNumberDialCode = c.DialCode
                };
                ExcuteData_Main<Business>.Insert(bus);
                #endregion

                #region Insert Business Setting default
                List<BusinessSetting> defaults = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == 0);
                defaults.ForEach(o =>
                {
                    o.BusinessID = bus.BusinessID;
                });
                ExcuteData_Main<BusinessSetting>.Insert(defaults);
                //insert expire
                Config cf = ExcuteData_Main<Config>.GetById("DefauleDayExpire");
                DateTime ExpireDate = DateTime.Today;
                if (cf != null && cf.Value != null && cf.Value != "")
                {
                    ExpireDate = ExpireDate.AddDays(Convert.ToInt32(cf.Value));
                }
                else
                {
                    ExpireDate = ExpireDate.AddDays(30);
                }
                BusinessSetting bs = new BusinessSetting
                {
                    BusinessID = bus.BusinessID,
                    SettingCode = "BSExpiry",
                    Value = ExpireDate.Year.ToString() + "/" + ExpireDate.Month.ToString() + "/" + ExpireDate.Day.ToString(),
                    SettingGroup = "Business Settings"
                };
                ExcuteData_Main<BusinessSetting>.Insert(bs);
                #endregion

                #region Insert User
                User u = new Models.User()
                {
                    FirstName = FirstName,
                    LastName = LastName,
                    Email = Email,
                    Password = CryptorEngine.Encrypt(Password, true),
                    CreateDate = DateTime.Now,
                    Status = 1,
                    BusinessID = bus.BusinessID,
                    StartDate = DateTime.Now.Date,
                    RoleID = 5,
                    EnableAppointmentBooking = true,
                    AppointmentColor = "#007FC9",
                    DialCode = c.DialCode,
                    FirstLogin = true,
                    ServiceCommission = 0,
                    ProductCommission = 0,
                    VoucherSalesCommission = 0,
                    SortOrder = 1
                };
                ExcuteData_Main<User>.Insert(u);
                #endregion

                #region Create default location
                Location l = new Location
                {
                    BusinessID = bus.BusinessID,
                    LocationName = bus.CompanyName,
                    StreetAddress = "Default Address",
                    City = "Default City",
                    EnableOnlineBooking = true,
                    IsDefault = true,
                    SortOrder = 1,
                    UserCreate = u.UserID,
                    CreateDate = DateTime.Now,
                    InvoiceNoPrefix = "",
                    NextInvoiceNumber = 1
                };

                ExcuteData_Main<Location>.Insert(l);
                //insert user location
                UserLocation ul = new UserLocation
                {
                    BusinessID = bus.BusinessID,
                    LocationID = l.LocationID,
                    UserID = u.UserID
                };
                ExcuteData_Main<UserLocation>.Insert(ul);
                #endregion

                #region Insert User demo
                User udemo = new Models.User()
                {
                    FirstName = "Johnny",
                    LastName = "Depp",
                    Email = "",
                    Password = "",
                    CreateDate = DateTime.Now,
                    Status = 1,
                    BusinessID = bus.BusinessID,
                    StartDate = DateTime.Now.Date,
                    RoleID = 1,
                    EnableAppointmentBooking = true,
                    AppointmentColor = "#007FC9",
                    DialCode = c.DialCode,
                    FirstLogin = false,
                    ServiceCommission = 0,
                    ProductCommission = 0,
                    VoucherSalesCommission = 0,
                    SortOrder = 2
                };
                ExcuteData_Main<User>.Insert(udemo);

                //insert user location
                UserLocation uldemo = new UserLocation
                {
                    BusinessID = bus.BusinessID,
                    LocationID = l.LocationID,
                    UserID = udemo.UserID
                };
                ExcuteData_Main<UserLocation>.Insert(uldemo);
                #endregion

                #region Insert function permission
                List<PermissionLevel> pls = ExcuteData_Main<PermissionLevel>.Find(n => n.BusinessID == 0);
                pls.ForEach(o =>
                {
                    o.BusinessID = bus.BusinessID;
                });
                ExcuteData_Main<PermissionLevel>.Insert(pls);

                #endregion

                #region Insert demo service
                //insert service group
                ServiceGroup sg = new ServiceGroup
                {
                    AppointmentColor = "#007FC9",
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    ServiceGroupName = "Hair",
                    SortOrder = 1,
                    UserCreate = u.UserID,
                };
                ExcuteData_Main<ServiceGroup>.Insert(sg);
                //insert service 1
                Service s1 = new Service
                {
                    ServiceName = "Haircut",
                    SortOrder = 1,
                    AvailableFor = "everyone",
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    EnableCommission = true,
                    EnableOnlineBookings = true,
                    EnableVoucherSales = true,
                    PricingType = "single",
                    ResourceRequired = false,
                    ServiceGroupID = sg.ServiceGroupID,
                    TreatmentType = 115,
                    VoucherExpiryPeriod = nameof(Resources.Enum.months_6),
                    UserCreate = u.UserID,
                    TaxRate = 0
                };
                ExcuteData_Main<Service>.Insert(s1);
                ServiceDuration sd1 = new ServiceDuration
                {
                    BusinessID = bus.BusinessID,
                    Caption = "",
                    Duration = 2700,
                    CreateDate = DateTime.Now,
                    RetailPrice = 10,
                    SpecialPrice = 9,
                    ServiceID = s1.ServiceID,
                    UserCreate = u.UserID
                };
                ExcuteData_Main<ServiceDuration>.Insert(sd1);

                ServiceStaff ss1 = new ServiceStaff
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    ServiceID = s1.ServiceID,
                    UserCreate = u.UserID,
                    UserID = u.UserID,
                };
                ExcuteData_Main<ServiceStaff>.Insert(ss1);
                ServiceStaff ss2 = new ServiceStaff
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    ServiceID = s1.ServiceID,
                    UserCreate = u.UserID,
                    UserID = udemo.UserID,
                };
                ExcuteData_Main<ServiceStaff>.Insert(ss2);

                //insert service 2
                Service s2 = new Service
                {
                    ServiceName = "Blow Dry",
                    SortOrder = 2,
                    AvailableFor = "everyone",
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    EnableCommission = true,
                    EnableOnlineBookings = true,
                    EnableVoucherSales = true,
                    PricingType = "single",
                    ResourceRequired = false,
                    ServiceGroupID = sg.ServiceGroupID,
                    TreatmentType = 115,
                    VoucherExpiryPeriod = nameof(Resources.Enum.months_6),
                    UserCreate = u.UserID,
                    TaxRate = 0
                };
                ExcuteData_Main<Service>.Insert(s2);
                ServiceDuration sd2 = new ServiceDuration
                {
                    BusinessID = bus.BusinessID,
                    Caption = "",
                    Duration = 2700,
                    CreateDate = DateTime.Now,
                    RetailPrice = 20,
                    SpecialPrice = 19,
                    ServiceID = s2.ServiceID,
                    UserCreate = u.UserID
                };
                ExcuteData_Main<ServiceDuration>.Insert(sd2);

                ServiceStaff ss3 = new ServiceStaff
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    ServiceID = s2.ServiceID,
                    UserCreate = u.UserID,
                    UserID = u.UserID,
                };
                ExcuteData_Main<ServiceStaff>.Insert(ss3);
                ServiceStaff ss4 = new ServiceStaff
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    ServiceID = s2.ServiceID,
                    UserCreate = u.UserID,
                    UserID = udemo.UserID,
                };
                ExcuteData_Main<ServiceStaff>.Insert(ss4);

                #endregion

                #region Create default payment mode cash
                PaymentType pt = new PaymentType
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    IsDefault = true,
                    PaymentTypeName = "Cash",
                    SortOrder = 1,
                    UserCreate = u.UserID
                };
                ExcuteData_Main<PaymentType>.Insert(pt);
                #endregion

                #region Create default CancellationReason
                CancellationReason cr = new CancellationReason
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    IsDefault = true,
                    CancellationReasonName = "Appointment made by mistake",
                    SortOrder = 1,
                    UserCreate = u.UserID
                };
                ExcuteData_Main<CancellationReason>.Insert(cr);
                #endregion

                #region Create default Referral Source
                ReferralSource rs1 = new ReferralSource
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    IsDefault = true,
                    ReferralSourceName = "Walk-In",
                    SortOrder = 1,
                    UserCreate = u.UserID,
                    IsActive = true
                };
                ExcuteData_Main<ReferralSource>.Insert(rs1);

                ReferralSource rs2 = new ReferralSource
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    IsDefault = true,
                    ReferralSourceName = "Online Booking",
                    SortOrder = 2,
                    UserCreate = u.UserID,
                    IsActive = true
                };
                ExcuteData_Main<ReferralSource>.Insert(rs2);

                ReferralSource rs3 = new ReferralSource
                {
                    BusinessID = bus.BusinessID,
                    CreateDate = DateTime.Now,
                    IsDefault = true,
                    ReferralSourceName = "Facebook Booking",
                    SortOrder = 3,
                    UserCreate = u.UserID,
                    IsActive = true
                };
                ExcuteData_Main<ReferralSource>.Insert(rs3);
                #endregion

                scope.Complete();

                return Json(new { Result = true, ErrorStyle = 0, ErrorMessage = "" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult GetDataWhenChangeCoutryRegister(int coutryId)
        {
            Models.TimeZone timeZone = ExcuteData_TimeZone.GetTimeZoneBaseCountry(coutryId);
            Currency currency = ExcuteData_Currency.GetCurrencyBaseCountry(coutryId);
            return Json(new { timeZone, currency }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SendEmailExcuteRegister(string FirstName, string LastName, string CompanyName, string Password, string Email)
        {

            new System.Threading.Thread(() =>
            {
                List<Config> Configs = ExcuteData_Main<Config>.GetAll();
                Config useSES = Configs.SingleOrDefault(n => n.ConfigID == "UseSES");
                Config Body = Configs.SingleOrDefault(n => n.ConfigID == "BodyEmailWhenCreateAccount");
                Config EmailServer = Configs.SingleOrDefault(n => n.ConfigID == "EmailServer");
                Config PasswordServer = Configs.SingleOrDefault(n => n.ConfigID == "Password");
                Config ServerName = Configs.SingleOrDefault(n => n.ConfigID == "ServerName");
                Config SMTP = Configs.SingleOrDefault(n => n.ConfigID == "SMTP");
                Config Subject = Configs.SingleOrDefault(n => n.ConfigID == "SubjectEmailWhenCreateAccount");
                Config UseSSLAdmin = Configs.SingleOrDefault(n => n.ConfigID == "UseSSLAdmin");
                Config BrandName = Configs.SingleOrDefault(n => n.ConfigID == "BrandName");
                Config SiteEmail = Configs.SingleOrDefault(n => n.ConfigID == "SiteEmail");

                Config SendNewRegisterToEmail = Configs.SingleOrDefault(n => n.ConfigID == "SendNewRegisterToEmail");
                string TemplateBodyEmail = Configs.FirstOrDefault(n => n.ConfigID == "TemplateBodyEmail").Value;

                string error = "";
                Subject.Value = Subject.Value.Replace("@FirstName", FirstName)
                .Replace("@LastName", LastName)
                .Replace("@Email", Email)
                .Replace("@Password", Password)
                .Replace("@CompanyName", CompanyName);
                Body.Value = Body.Value.Replace("@FirstName", FirstName)
                .Replace("@LastName", LastName)
                .Replace("@Email", Email)
                .Replace("@Password", Password)
                .Replace("@CompanyName", CompanyName);
                if (useSES != null && useSES.Value == "1")
                {
                    Library.Email.SendEmailSES(SiteEmail.Value, BrandName.Value, Email, EmailServer.Value, PasswordServer.Value, ServerName.Value, Convert.ToInt32(SMTP.Value), Subject.Value, Library.Email.ConvertStringToHtml(Body.Value, TemplateBodyEmail), UseSSLAdmin.Value == "1", SendNewRegisterToEmail.Value);
                }
                else
                {
                    Library.Email.SendMail(ServerName.Value, EmailServer.Value, PasswordServer.Value, SMTP.Value, Email, "", SendNewRegisterToEmail.Value, Subject.Value, Library.Email.ConvertStringToHtml(Body.Value, TemplateBodyEmail), UseSSLAdmin.Value == "1", ref error, new string[0]);
                }
            }).Start();
            return Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Forgot Password
        [HttpPost]
        public JsonResult ExcuteForgotPassword(string Email)
        {
            #region Check Email Exists
            User u = ExcuteData_Main<User>.Single(n => n.Email == Email && n.Status == 1);
            if (u == null)
                return Json(new { Result = false, ErrorMessage = "Oops! That email address is not registered with Shedul, please try again.", ErrorStyle = 1 }, JsonRequestBehavior.AllowGet);
            #endregion

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
            string TemplateBodyEmail = Configs.FirstOrDefault(n => n.ConfigID == "TemplateBodyEmail").Value;

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

        #region Change Password
        [HttpPost]
        public JsonResult ExcuteChangePassword(string ResetID, string NewPassword, string RepeatPassword)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                #region Check NewPassword, RepeatPassword, ResetID
                if (NewPassword != RepeatPassword)
                    throw new Exception("Please enter the same password as above");
                if (string.IsNullOrWhiteSpace(ResetID))
                    throw new Exception("ResetID phải khác rỗng.");
                #endregion

                #region Check ResetID database
                Guid resetId = new Guid(ResetID);
                ResetPassword r = ExcuteData_Main<ResetPassword>.Single(n => n.ResetID == resetId && !n.IsUsed && n.ExpriredDate >= DateTime.Now);
                if (r == null)
                    return Json(new { Result = false, ErrorMessage = "Reset password token is invalid", ErrorStyle = 1 }, JsonRequestBehavior.AllowGet);
                #endregion

                #region Update ResetPassword
                r.IsUsed = true;
                ExcuteData_Main<ResetPassword>.Update(r);
                #endregion

                #region Update user
                User u = ExcuteData_Main<User>.Single(n => n.UserID == r.UserID);
                if (u == null)
                    throw new Exception("Không tồn tại user.");
                u.Password = CryptorEngine.Encrypt(NewPassword, true);
                ExcuteData_Main<User>.Update(u);
                #endregion

                scope.Complete();
                return Json(new { Result = true, ErrorMessage = "", ErrorStyle = 0 }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #endregion
    }
}