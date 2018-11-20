using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;
using Newtonsoft.Json.Linq;
using System.Text;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_Message : EntityHelp<Message>
    {
        public static void SendEmailAppointment(long BusinessID, long AppointmentID, string MessageType)
        {
            string code1 = "";
            string code2 = "";
            string code3 = "";

            string FormatDateWithDayOfWeekCS = "ddd, dd MMM yyyy";
            string FormatTimeCS = "HH:mm";
            string FormatDateCS = "dd/MM/yyyy";
            //
            BusinessSetting bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "config_communications_enabled").FirstOrDefault();
            if (bs != null && bs.Value == "1")
            {
                if (MessageType == nameof(Resources.Enum.email_confirmation_booking_client))
                {
                    code1 = "config_confirmation_notification_enabled";
                    code2 = "config_confirmation_email_title";
                    code3 = "config_confirmation_email_template";

                }
                else if (MessageType == nameof(Resources.Enum.email_cancellation_booking_client))
                {
                    code1 = "config_cancellation_notification_enabled";
                    code2 = "config_cancellation_email_title";
                    code3 = "config_cancellation_email_template";
                }
                else if (MessageType == nameof(Resources.Enum.email_reminder_booking_client))
                {
                    code1 = "config_reminder_notification_enabled";
                    code2 = "config_reminder_email_title";
                    code3 = "config_reminder_email_template";
                }
                else if (MessageType == nameof(Resources.Enum.email_rescheduling_booking_client))
                {
                    code1 = "config_rescheduling_notification_enabled";
                    code2 = "config_rescheduling_email_title";
                    code3 = "config_rescheduling_email_template";

                }
                else if (MessageType == nameof(Resources.Enum.email_thank_you_booking_client))
                {
                    code1 = "config_thank_you_notification_enabled";
                    code2 = "config_thank_you_email_title";
                    code3 = "config_thank_you_email_template";
                }
                Appointment a = ExcuteData_Main<Appointment>.GetById(AppointmentID);
                List<AppointmentService> lst = ExcuteData_Main<AppointmentService>.Find(n => n.AppointmentID == AppointmentID).ToList();
                Client c = ExcuteData_Main<Client>.GetById(a.ClientID);
                BusinessSetting bs1 = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == code1).FirstOrDefault();
                BusinessSetting bs2 = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == code2).FirstOrDefault();
                BusinessSetting bs3 = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == code3).FirstOrDefault();
                User user = ExcuteData_Main<User>.GetById(lst[0].StaffID);
                Business b = ExcuteData_Main<Business>.GetById(a.BusinessID);
                Location l = ExcuteData_Main<Location>.GetById(a.LocationID);
                Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
                string sTargetTimeZone = ExcuteData_Main<Country>.Find(n => n.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(sTargetTimeZone);

                if (bs1 != null && bs1.Value == "1" && c != null && c.Email != null && c.Email != "" && c.AcceptMarketingNotifications == true && (c.AppointmentNotificationType == nameof(Resources.Enum.marketing_email) || c.AppointmentNotificationType == nameof(Resources.Enum.marketing_both)))
                {
                    string MessageBody = bs3.Value == null ? "" : bs3.Value;
                    string MessageSubject = bs2.Value == null ? "" : bs2.Value;

                    string CLIENT_FIRST_NAME = c.FirstName;
                    string CLIENT_LAST_NAME = c.LastName == null ? "" : c.LastName;
                    string STAFF_FIRST_NAME = user != null ? user.FirstName : "";
                    string STAFF_LAST_NAME = user != null ? user.LastName : "";
                    string BOOKING_DATE_TIME = lst[0].StartTime.ToString(FormatDateWithDayOfWeekCS) + " at " + lst[0].StartTime.ToString(FormatTimeCS);
                    string BOOKING_DATE = lst[0].StartTime.ToString(FormatDateCS);
                    string BOOKING_TIME = lst[0].StartTime.ToString(FormatTimeCS);
                    string BOOKING_REFERENCE = lst[0].RefNo;
                    string SERVICE_NAME = "";
                    foreach (var item in lst)
                    {
                        SERVICE_NAME = SERVICE_NAME + item.ServiceName + ", ";
                    }
                    if (SERVICE_NAME.Length > 0)
                    {
                        SERVICE_NAME = SERVICE_NAME.Substring(0, SERVICE_NAME.Length - 2);
                    }
                    string BUSINESS_NAME = b.CompanyName;
                    string LOCATION_NAME = l.LocationName;
                    string LOCATION_PHONE = l.ContactNumber == null ? "" : l.ContactNumber;
                    string LOCATION_ADDRESS = l.StreetAddress;
                    string LOCATION_CITY = l.City;

                    //Subject
                    MessageSubject = MessageSubject.Replace("CLIENT_FIRST_NAME", CLIENT_FIRST_NAME);
                    MessageSubject = MessageSubject.Replace("CLIENT_LAST_NAME", CLIENT_LAST_NAME);
                    MessageSubject = MessageSubject.Replace("STAFF_FIRST_NAME", STAFF_FIRST_NAME);
                    MessageSubject = MessageSubject.Replace("STAFF_LAST_NAME", STAFF_LAST_NAME);
                    MessageSubject = MessageSubject.Replace("BOOKING_DATE_TIME", BOOKING_DATE_TIME);
                    MessageSubject = MessageSubject.Replace("BOOKING_DATE", BOOKING_DATE);
                    MessageSubject = MessageSubject.Replace("BOOKING_TIME", BOOKING_TIME);
                    MessageSubject = MessageSubject.Replace("BOOKING_REFERENCE", BOOKING_REFERENCE);
                    MessageSubject = MessageSubject.Replace("SERVICE_NAME", SERVICE_NAME);
                    MessageSubject = MessageSubject.Replace("BUSINESS_NAME", BUSINESS_NAME);
                    MessageSubject = MessageSubject.Replace("LOCATION_NAME", LOCATION_NAME);
                    MessageSubject = MessageSubject.Replace("LOCATION_PHONE", LOCATION_PHONE);
                    //body
                    MessageBody = MessageBody.Replace("CLIENT_FIRST_NAME", CLIENT_FIRST_NAME);
                    MessageBody = MessageBody.Replace("CLIENT_LAST_NAME", CLIENT_LAST_NAME);
                    MessageBody = MessageBody.Replace("STAFF_FIRST_NAME", STAFF_FIRST_NAME);
                    MessageBody = MessageBody.Replace("STAFF_LAST_NAME", STAFF_LAST_NAME);
                    MessageBody = MessageBody.Replace("BOOKING_DATE_TIME", BOOKING_DATE_TIME);
                    MessageBody = MessageBody.Replace("BOOKING_DATE", BOOKING_DATE);
                    MessageBody = MessageBody.Replace("BOOKING_TIME", BOOKING_TIME);
                    MessageBody = MessageBody.Replace("BOOKING_REFERENCE", BOOKING_REFERENCE);
                    MessageBody = MessageBody.Replace("SERVICE_NAME", SERVICE_NAME);
                    MessageBody = MessageBody.Replace("BUSINESS_NAME", BUSINESS_NAME);
                    MessageBody = MessageBody.Replace("LOCATION_NAME", LOCATION_NAME);
                    MessageBody = MessageBody.Replace("LOCATION_PHONE", LOCATION_PHONE);
                    MessageBody = MessageBody.Replace("LOCATION_ADDRESS", LOCATION_ADDRESS);
                    MessageBody = MessageBody.Replace("LOCATION_CITY", LOCATION_CITY);
                    Message entity = new Message
                    {
                        AppointmentID = AppointmentID,
                        AppointmentNo = lst[0].RefNo,
                        ClientName = a.ClientName,
                        Destination = c.Email,
                        ClientID = a.ClientID,
                        MessageSubject = MessageSubject,
                        TimeSent = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone),
                        MessageType = Resources.Enum.ResourceManager.GetString(MessageType),
                        MessageStatus = nameof(Resources.Enum.message_status_sending),
                        UserCreate = 0,
                        BusinessID = BusinessID,
                        CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone),
                        MessageBody = MessageBody
                    };
                    ExcuteData_Main<Message>.Insert(entity);
                }
            }

        }

        public static void SendEmailConfirmOnlineAppointment(long BusinessID, long AppointmentID)
        {
            string FormatDateWithDayOfWeekCS = "ddd, dd MMM yyyy";
            string FormatTimeCS = "HH:mm";
            string FormatDateCS = "dd/MM/yyyy";
            //
            BusinessSetting bs = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "config_sn_enabled").FirstOrDefault();
            if (bs != null && bs.Value == "1")
            {
                Appointment a = ExcuteData_Main<Appointment>.GetById(AppointmentID);
                List<AppointmentService> lst = ExcuteData_Main<AppointmentService>.Find(n => n.AppointmentID == AppointmentID).ToList();
                Client c = ExcuteData_Main<Client>.GetById(a.ClientID);

                List<Config> Configs = ExcuteData_Main<Config>.GetAll();

                Config bs2 = Configs.SingleOrDefault(n => n.ConfigID == "SubjectEmailAppointmentConfirm");
                Config bs3 = Configs.SingleOrDefault(n => n.ConfigID == "BodyEmailAppointmentConfirm");

                User user = ExcuteData_Main<User>.GetById(lst[0].StaffID);
                Business b = ExcuteData_Main<Business>.GetById(a.BusinessID);
                Location l = ExcuteData_Main<Location>.GetById(a.LocationID);
                Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
                string sTargetTimeZone = ExcuteData_Main<Country>.Find(n => n.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(sTargetTimeZone);

                string MessageSubject = bs2.Value == null ? "" : bs2.Value;
                string MessageBody = bs3.Value == null ? "" : bs3.Value;

                string CLIENT_FIRST_NAME = c.FirstName;
                string CLIENT_LAST_NAME = c.LastName == null ? "" : c.LastName;
                string CLIENT_MOBILE = "+" + c.MobileNumberDialCode + c.MobileNumber;
                string CLIENT_EMAIL = c.Email;

                string STAFF_FIRST_NAME = user != null ? user.FirstName : "";
                string STAFF_LAST_NAME = user != null ? user.LastName : "";
                string BOOKING_DATE_TIME = lst[0].StartTime.ToString(FormatDateWithDayOfWeekCS) + " at " + lst[0].StartTime.ToString(FormatTimeCS);
                string BOOKING_DATE = lst[0].StartTime.ToString(FormatDateCS);
                string BOOKING_TIME = lst[0].StartTime.ToString(FormatTimeCS);
                string BOOKING_REFERENCE = lst[0].RefNo;
                string SERVICE_NAME = "";
                foreach (var item in lst)
                {
                    SERVICE_NAME = SERVICE_NAME + item.ServiceName + ", ";
                }
                if (SERVICE_NAME.Length > 0)
                {
                    SERVICE_NAME = SERVICE_NAME.Substring(0, SERVICE_NAME.Length - 2);
                }
                string BUSINESS_NAME = b.CompanyName;
                string LOCATION_NAME = l.LocationName;
                string LOCATION_PHONE = l.ContactNumber == null ? "" : l.ContactNumber;
                string LOCATION_ADDRESS = l.StreetAddress;
                string LOCATION_CITY = l.City;

                //body
                MessageBody = MessageBody.Replace("CLIENT_FIRST_NAME", CLIENT_FIRST_NAME);
                MessageBody = MessageBody.Replace("CLIENT_LAST_NAME", CLIENT_LAST_NAME);
                MessageBody = MessageBody.Replace("CLIENT_EMAIL", CLIENT_EMAIL);
                MessageBody = MessageBody.Replace("CLIENT_MOBILE", CLIENT_MOBILE);

                MessageBody = MessageBody.Replace("STAFF_FIRST_NAME", STAFF_FIRST_NAME);
                MessageBody = MessageBody.Replace("STAFF_LAST_NAME", STAFF_LAST_NAME);
                MessageBody = MessageBody.Replace("BOOKING_DATE_TIME", BOOKING_DATE_TIME);
                MessageBody = MessageBody.Replace("BOOKING_DATE", BOOKING_DATE);
                MessageBody = MessageBody.Replace("BOOKING_TIME", BOOKING_TIME);
                MessageBody = MessageBody.Replace("BOOKING_REFERENCE", BOOKING_REFERENCE);
                MessageBody = MessageBody.Replace("SERVICE_NAME", SERVICE_NAME);

                MessageBody = MessageBody.Replace("BUSINESS_NAME", BUSINESS_NAME);

                MessageBody = MessageBody.Replace("LOCATION_NAME", LOCATION_NAME);
                MessageBody = MessageBody.Replace("LOCATION_PHONE", LOCATION_PHONE);
                MessageBody = MessageBody.Replace("LOCATION_ADDRESS", LOCATION_ADDRESS);
                MessageBody = MessageBody.Replace("LOCATION_CITY", LOCATION_CITY);

                //email config

                Config useSES = Configs.SingleOrDefault(n => n.ConfigID == "UseSES");
                Config EmailServer = Configs.SingleOrDefault(n => n.ConfigID == "EmailServer");
                Config PasswordServer = Configs.SingleOrDefault(n => n.ConfigID == "Password");
                Config ServerName = Configs.SingleOrDefault(n => n.ConfigID == "ServerName");
                Config SMTP = Configs.SingleOrDefault(n => n.ConfigID == "SMTP");
                Config UseSSLAdmin = Configs.SingleOrDefault(n => n.ConfigID == "UseSSLAdmin");
                Config BrandName = Configs.SingleOrDefault(n => n.ConfigID == "BrandName");
                Config SiteEmail = Configs.SingleOrDefault(n => n.ConfigID == "SiteEmail");
                string TemplateBodyEmail = Configs.FirstOrDefault(n => n.ConfigID == "TemplateBodyEmail").Value;

                string error = "";
                //send email owner
                BusinessSetting bs4 = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "config_sn_custom_enabled").FirstOrDefault();
                BusinessSetting bs5 = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "config_sn_custom_emails").FirstOrDefault();
                if (bs4 != null && bs4.Value == "1" && bs5 != null && bs5.Value != "")
                {
                    User owner = ExcuteData_Main<User>.Find(n => n.BusinessID == BusinessID && n.RoleID == 5).FirstOrDefault();
                    string body = MessageBody.Replace("USER_FIRST_NAME", owner.FirstName);
                    body = body.Replace("USER_LAST_NAME", owner.LastName == null ? "" : owner.LastName);
                    if (useSES != null && useSES.Value == "1")
                    {
                        Library.Email.SendEmailSES(SiteEmail.Value, BrandName.Value, bs5.Value, EmailServer.Value, PasswordServer.Value, ServerName.Value, Convert.ToInt32(SMTP.Value), MessageSubject, Email.ConvertStringToHtml(body, TemplateBodyEmail), UseSSLAdmin.Value == "1", "");
                    }
                    else
                    {
                        Library.Email.SendMail(ServerName.Value, EmailServer.Value, PasswordServer.Value, SMTP.Value, bs5.Value, "", "", MessageSubject, Email.ConvertStringToHtml(body, TemplateBodyEmail), UseSSLAdmin.Value == "1", ref error, new string[0]);
                    }
                }
                //send email staff
                BusinessSetting bs6 = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "config_sn_members_enabled").FirstOrDefault();
                if (bs6 != null && bs6.Value == "1")
                {
                    if (user != null && user.Email != "")
                    {
                        string body = MessageBody.Replace("USER_FIRST_NAME", user.FirstName);
                        body = body.Replace("USER_LAST_NAME", user.LastName == null ? "" : user.LastName);
                        if (useSES != null && useSES.Value == "1")
                        {
                            Library.Email.SendEmailSES(SiteEmail.Value, BrandName.Value, user.Email, EmailServer.Value, PasswordServer.Value, ServerName.Value, Convert.ToInt32(SMTP.Value), MessageSubject, Email.ConvertStringToHtml(body, TemplateBodyEmail), UseSSLAdmin.Value == "1", "");
                        }
                        else
                        {
                            Library.Email.SendMail(ServerName.Value, EmailServer.Value, PasswordServer.Value, SMTP.Value, user.Email, "", "", MessageSubject, Email.ConvertStringToHtml(body, TemplateBodyEmail), UseSSLAdmin.Value == "1", ref error, new string[0]);
                        }
                    }
                }
            }

        }

        public static string GenerateSMSAppointment(long BusinessID, long AppointmentID)
        {
            string body = "";
            Appointment a = ExcuteData_Main<Appointment>.GetById(AppointmentID);
            List<AppointmentService> lst = ExcuteData_Main<AppointmentService>.Find(n => n.AppointmentID == AppointmentID).ToList();
            Client c = ExcuteData_Main<Client>.GetById(a.ClientID);
            User user = ExcuteData_Main<User>.GetById(lst[0].StaffID);
            Business b = ExcuteData_Main<Business>.GetById(a.BusinessID);
            Location l = ExcuteData_Main<Location>.GetById(a.LocationID);

            string FormatDateWithDayOfWeekCS = "ddd, dd MMM yyyy";
            string FormatTimeCS = "HH:mm";
            string FormatDateCS = "dd/MM/yyyy";

            BusinessSetting bs1 = ExcuteData_Main<BusinessSetting>.Find(n => n.BusinessID == BusinessID && n.SettingCode == "config_reminder_sms_template").FirstOrDefault();
            if (bs1 != null && bs1.Value != null && bs1.Value != "")
            {
                string MessageBody = bs1.Value == null ? "" : bs1.Value;

                string CLIENT_FIRST_NAME = c.FirstName;
                string CLIENT_LAST_NAME = c.LastName == null ? "" : c.LastName;
                string STAFF_FIRST_NAME = user != null ? user.FirstName : "";
                string STAFF_LAST_NAME = user != null ? user.LastName : "";

                string BOOKING_DATE_TIME = lst[0].StartTime.ToString(FormatDateWithDayOfWeekCS) + " at " + lst[0].StartTime.ToString(FormatTimeCS);
                string BOOKING_DATE = lst[0].StartTime.ToString(FormatDateCS);
                string BOOKING_TIME = lst[0].StartTime.ToString(FormatTimeCS);
                string BOOKING_REFERENCE = lst[0].RefNo;
                string SERVICE_NAME = "";
                foreach (var item in lst)
                {
                    SERVICE_NAME = SERVICE_NAME + item.ServiceName + ", ";
                }
                if (SERVICE_NAME.Length > 0)
                {
                    SERVICE_NAME = SERVICE_NAME.Substring(0, SERVICE_NAME.Length - 2);
                }
                string BUSINESS_NAME = b.CompanyName;
                string LOCATION_NAME = l.LocationName;
                string LOCATION_PHONE = l.ContactNumber == null ? "" : l.ContactNumber;

                //body
                MessageBody = MessageBody.Replace("CLIENT_FIRST_NAME", CLIENT_FIRST_NAME);
                MessageBody = MessageBody.Replace("CLIENT_LAST_NAME", CLIENT_LAST_NAME);
                MessageBody = MessageBody.Replace("STAFF_FIRST_NAME", STAFF_FIRST_NAME);
                MessageBody = MessageBody.Replace("STAFF_LAST_NAME", STAFF_LAST_NAME);
                MessageBody = MessageBody.Replace("BOOKING_DATE_TIME", BOOKING_DATE_TIME);
                MessageBody = MessageBody.Replace("BOOKING_DATE", BOOKING_DATE);
                MessageBody = MessageBody.Replace("BOOKING_TIME", BOOKING_TIME);
                MessageBody = MessageBody.Replace("BOOKING_REFERENCE", BOOKING_REFERENCE);
                MessageBody = MessageBody.Replace("SERVICE_NAME", SERVICE_NAME);
                MessageBody = MessageBody.Replace("BUSINESS_NAME", BUSINESS_NAME);
                MessageBody = MessageBody.Replace("LOCATION_NAME", LOCATION_NAME);
                MessageBody = MessageBody.Replace("LOCATION_PHONE", LOCATION_PHONE);

                var inputBytes = Encoding.UTF8.GetBytes(MessageBody);
                var outputBytes = Encoding.Convert(Encoding.UTF8, Encoding.ASCII, inputBytes);

                var output = Encoding.ASCII.GetString(outputBytes);
                body = output;
            }

            return body;
        }
    }
}