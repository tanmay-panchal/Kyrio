using AdminClient.Controllers.Global;
using AdminClient.Library;
using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AdminClient.Controllers
{
    public class UserController : BaseController<User, Object, Object>
    {
        #region Load Page
        [CheckPermision]
        public ActionResult MySetting()
        {
            return View((User)Session["AccountLogin"]);
        }
        #endregion

        #region Construct
        public UserController()
        {

        }
        #endregion

        #region Ajax

        #region Change My Setting
        [HttpPost]
        public JsonResult ChangeMySetting(string FirstName, string LastName, string MobileNumber, string Email, string OldPassword, string NewPassword, string DialCode)
        {
            int ErrorStyle = 0;
            User userOld = ExcuteData_Main<User>.GetById(((User)Session["AccountLogin"]).UserID);
            OldPassword = String.IsNullOrWhiteSpace(OldPassword) ? OldPassword : CryptorEngine.Encrypt(OldPassword, true);
            NewPassword = String.IsNullOrWhiteSpace(NewPassword) ? NewPassword : CryptorEngine.Encrypt(NewPassword, true);

            #region Check Email
            if (ExcuteData_Main<User>.Any(n => n.UserID != userOld.UserID && n.Email == Email))
                return Json(new { Result = false, ErrorMessage = "Email has already been taken", ErrorStyle = 1 }, JsonRequestBehavior.AllowGet);
            #endregion

            #region Check old password
            if ((OldPassword != userOld.Password) && !(String.IsNullOrWhiteSpace(OldPassword) && String.IsNullOrWhiteSpace(NewPassword)))
                return Json(new { Result = false, ErrorMessage = "Current password is required", ErrorStyle = 2 }, JsonRequestBehavior.AllowGet);
            #endregion

            #region User Update
            User userNew = userOld;
            userNew.Password = String.IsNullOrWhiteSpace(OldPassword) && String.IsNullOrWhiteSpace(NewPassword) ? userOld.Password : NewPassword;
            userNew.FirstName = FirstName;
            userNew.LastName = LastName;
            userNew.MobileNumber = MobileNumber;
            userNew.ModifyDate = DateTime.Now;
            userNew.Email = Email;
            userNew.DialCode = DialCode;
            userNew.UserModify = userOld.UserID;
            ExcuteData_Main<User>.Update(userNew);
            #endregion

            #region Send Email
            new System.Threading.Thread(() =>
            {
                if (userNew.Email != userOld.Email)
                {
                    List<Config> Configs = ExcuteData_Main<Config>.GetAll();
                    Config useSES = Configs.SingleOrDefault(n => n.ConfigID == "UseSES");
                    Config BrandName = Configs.SingleOrDefault(n => n.ConfigID == "BrandName");
                    Config SiteEmail = Configs.SingleOrDefault(n => n.ConfigID == "SiteEmail");
                    Config Body = Configs.SingleOrDefault(n => n.ConfigID == "BodyEmailWhenChangeEmail");
                    Config EmailServer = Configs.SingleOrDefault(n => n.ConfigID == "EmailServer");
                    Config PasswordServer = Configs.SingleOrDefault(n => n.ConfigID == "Password");
                    Config ServerName = Configs.SingleOrDefault(n => n.ConfigID == "ServerName");
                    Config SMTP = Configs.SingleOrDefault(n => n.ConfigID == "SMTP");
                    Config Subject = Configs.SingleOrDefault(n => n.ConfigID == "SubjectEmailWhenChangeEmail");
                    Config UseSSLAdmin = Configs.SingleOrDefault(n => n.ConfigID == "UseSSLAdmin");
                    string TemplateBodyEmail = Configs.SingleOrDefault(n => n.ConfigID == "TemplateBodyEmail").Value;
                    string error = "";
                    Subject.Value = Subject.Value.Replace("@FirstName", FirstName)
                        .Replace("@LastName", LastName)
                        .Replace("@OldEmail", userOld.Email)
                        .Replace("@NewEmail", userNew.Email);
                    Body.Value = Body.Value.Replace("@FirstName", FirstName)
                        .Replace("@LastName", LastName)
                        .Replace("@OldEmail", userOld.Email)
                        .Replace("@NewEmail", userNew.Email);

                    if (useSES != null && useSES.Value == "1")
                    {
                        Library.Email.SendEmailSES(SiteEmail.Value, BrandName.Value, Email, EmailServer.Value, PasswordServer.Value, ServerName.Value, Convert.ToInt32(SMTP.Value), Subject.Value, Library.Email.ConvertStringToHtml(Body.Value, TemplateBodyEmail), UseSSLAdmin.Value == "1", "");
                    }
                    else
                    {
                        if (!Library.Email.SendMail(ServerName.Value, EmailServer.Value, PasswordServer.Value, SMTP.Value, Email, "", "", Subject.Value, Library.Email.ConvertStringToHtml(Body.Value, TemplateBodyEmail), UseSSLAdmin.Value == "1", ref error, new string[0]))
                            throw new Exception("Gởi email thất bại. Lỗi: " + error);
                    }
                }
            }).Start();
            #endregion

            Session["AccountLogin"] = userNew;
            return Json(new { Result = true, ErrorMessage = "", ErrorStyle = ErrorStyle }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Validate
        [HttpPost]
        public JsonResult ValidatePasswordMySetting()
        {
            string Password = Request.Form.GetValues("Password").FirstOrDefault() ?? "";
            User userOld = ExcuteData_Main<User>.GetById(((User)Session["AccountLogin"]).UserID);
            Password = String.IsNullOrWhiteSpace(Password) ? Password : CryptorEngine.Encrypt(Password, true);
            return Json(userOld.Password == Password, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult ValidateEmailMySetting()
        {
            string Email = Request.Form.GetValues("Email").FirstOrDefault() ?? "";
            User userOld = ExcuteData_Main<User>.GetById(((User)Session["AccountLogin"]).UserID);
            return Json(!ExcuteData_Main<User>.Any(n => n.UserID != userOld.UserID && n.Email == Email), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #endregion
    }
}