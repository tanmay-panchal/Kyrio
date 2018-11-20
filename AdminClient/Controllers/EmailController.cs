using AdminClient.Controllers.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using System.Data.SqlClient;
using System.Data;
using System.Data.Entity;
using AdminClient.Library;

namespace AdminClient.Controllers
{
    public class EmailController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult SendEmail()
        {
            List<Config> configs = ExcuteData_Main<Config>.GetAll();
            Config useSES = configs.SingleOrDefault(n => n.ConfigID == "UseSES");
            Config BrandName = configs.SingleOrDefault(n => n.ConfigID == "BrandName");
            Config SiteEmail = configs.SingleOrDefault(n => n.ConfigID == "SiteEmail");
            string serverName = (configs.FirstOrDefault(n => n.ConfigID == "ServerName") ?? new Config()).Value;
            string password = (configs.FirstOrDefault(n => n.ConfigID == "Password") ?? new Config()).Value;
            string emailServer = (configs.FirstOrDefault(n => n.ConfigID == "EmailServer") ?? new Config()).Value;
            string sMTP = (configs.FirstOrDefault(n => n.ConfigID == "SMTP") ?? new Config()).Value;
            Boolean useSSLAdmin = (configs.FirstOrDefault(n => n.ConfigID == "UseSSLAdmin") ?? new Config()).Value == "1";
            string TemplateBodyEmail = configs.FirstOrDefault(n => n.ConfigID == "TemplateBodyEmail").Value;

            //kiem tra send email chua gui
            List<Message> listSend = ExcuteData_Main<Message>.Find(n => (n.MessageStatus == nameof(Resources.Enum.message_status_sending)) || (n.MessageStatus == nameof(Resources.Enum.message_status_bounced) && n.Retry < 3));
            int TotalEmail = listSend.Count;
            int EmailOK = 0;
            int TotalSMS = 0;
            int SMSOK = 0;
            if (listSend.Count > 0)
            {
                listSend.ForEach(n =>
                {
                    string error = "";
                    Business b = ExcuteData_Main<Business>.GetById(n.BusinessID);
                    Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
                    string sTargetTimeZone = ExcuteData_Main<Country>.Find(m => m.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
                    TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(sTargetTimeZone);

                    if (useSES != null && useSES.Value == "1")
                    {
                        if (Library.Email.SendEmailSES(SiteEmail.Value, BrandName.Value, n.Destination, emailServer, password, serverName, Convert.ToInt32(sMTP), n.MessageSubject, n.MessageSubject == "Invoice copy" ? n.MessageBody : Email.ConvertStringToHtml(n.MessageBody, TemplateBodyEmail), useSSLAdmin, ""))
                        {
                            n.MessageStatus = nameof(Resources.Enum.message_status_sent);
                            n.TimeSent = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                            EmailOK++;
                        }
                        else
                        {
                            n.MessageStatus = nameof(Resources.Enum.message_status_bounced);
                        }
                    }
                    else
                    {
                        if (Email.SendMail(serverName, emailServer, password, sMTP, n.Destination, "", "", n.MessageSubject, n.MessageSubject == "Invoice copy" ? n.MessageBody : Email.ConvertStringToHtml(n.MessageBody, TemplateBodyEmail), useSSLAdmin, ref error))
                        {
                            n.MessageStatus = nameof(Resources.Enum.message_status_sent);
                            n.TimeSent = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                            EmailOK++;
                        }
                        else
                        {
                            n.MessageStatus = nameof(Resources.Enum.message_status_bounced);
                            n.Retry = n.Retry + 1;
                        }

                    }

                });
                ExcuteData_Main<Message>.Update(listSend);
            }
            //kiem tra va gui sms
            string SMSAccessKeyID = "";
            string SMSSecretAccessKeyID = "";
            string SMSSenderID = "";

            Config cf = ExcuteData_Main<Config>.GetById("SMSAccessKeyID");
            if (cf != null)
            {
                SMSAccessKeyID = cf.Value == null ? "" : cf.Value;
            }
            cf = ExcuteData_Main<Config>.GetById("SMSSecretAccessKeyID");
            if (cf != null)
            {
                SMSSecretAccessKeyID = cf.Value == null ? "" : cf.Value;
            }
            cf = ExcuteData_Main<Config>.GetById("SMSSenderID");
            if (cf != null)
            {
                SMSSenderID = cf.Value == null ? "" : cf.Value;
            }
            List<TBL_SMS> lstSMS = ExcuteData_Main<TBL_SMS>.Find(n => n.IsSent == false && n.Retry < 3);
            TotalSMS = lstSMS.Count;
            if (lstSMS != null && lstSMS.Count > 0 && SMSAccessKeyID != "" && SMSSecretAccessKeyID != "")
            {
                string MessageId = "";
                bool IsSend = false;
                foreach (TBL_SMS item in lstSMS)
                {
                    Business b = ExcuteData_Main<Business>.GetById(item.BusinessID);
                    Models.TimeZone tz = ExcuteData_Main<Models.TimeZone>.GetById(b.TimeZoneID);
                    string sTargetTimeZone = ExcuteData_Main<Country>.Find(n => n.TimeZone == tz.TimeZoneCode).FirstOrDefault().TimeZoneMS;
                    TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(sTargetTimeZone);

                    IsSend = SMS.sendSMS(item.Body, item.PhoneNumber, SMSAccessKeyID, SMSSecretAccessKeyID, SMSSenderID, ref MessageId);
                    if (IsSend)
                    {
                        SMSOK++;
                    }
                    item.IsSent = IsSend;
                    item.MessageId = MessageId;
                    item.SentTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    item.Retry = item.Retry + 1;
                    ExcuteData_Main<TBL_SMS>.Update(item);
                    Appointment ap = ExcuteData_Main<Appointment>.GetById(item.AppointmentID);
                    //insert vao message

                    Message nms = ExcuteData_Main<Message>.Find(n => n.BusinessID == item.BusinessID && n.AppointmentID == item.AppointmentID).FirstOrDefault();
                    if (nms == null)
                    {
                        nms = new Message
                        {
                            AppointmentID = item.AppointmentID,
                            AppointmentNo = (ExcuteData_Main<AppointmentService>.Find(n => n.AppointmentID == item.AppointmentID).OrderBy(n => n.StartTime).FirstOrDefault().RefNo),
                            BusinessID = item.BusinessID,
                            ClientID = ap.ClientID,
                            ClientName = ap.ClientName,
                            CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone),
                            Destination = item.PhoneNumber,
                            MessageBody = item.Body,
                            MessageStatus = IsSend == true ? nameof(Resources.Enum.message_status_sent) : nameof(Resources.Enum.message_status_bounced),
                            MessageSubject = "Reminder about your appointment",
                            MessageType = "Reminder SMS",
                            SendFrom = "",
                            TimeSent = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone),
                            UserCreate = 0,
                            Retry = 1
                        };
                        ExcuteData_Main<Message>.Insert(nms);
                    }
                    else
                    {
                        nms.TimeSent = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        nms.MessageStatus = IsSend == true ? nameof(Resources.Enum.message_status_sent) : nameof(Resources.Enum.message_status_bounced);
                        nms.Retry = nms.Retry + 1;
                        ExcuteData_Main<Message>.Update(nms);
                    }
                }
            }

            //kiem tra Appointment chua luu reminder
            List<V_APPOINTMENT_REMINDER> lstr = ExcuteData_Main<V_APPOINTMENT_REMINDER>.GetAll();
            lstr.ForEach(n =>
            {
                if (n.Status != Library.Enum.APPOINTMENT_STATUS_CANCELLED)
                {
                    TBL_APPOINTMENT_REMINDER r = new TBL_APPOINTMENT_REMINDER
                    {
                        AppointmentID = n.AppointmentID,
                        BusinessID = n.BusinessID
                    };
                    ExcuteData_Main<TBL_APPOINTMENT_REMINDER>.Insert(r);
                    //luu sms hoac message
                    if (n.config_reminders_send_by == nameof(Resources.Enum.marketing_email))
                    {
                        ExcuteData_Message.SendEmailAppointment(n.BusinessID, n.AppointmentID, nameof(Resources.Enum.email_reminder_booking_client));
                    }
                    else if (n.config_reminders_send_by == nameof(Resources.Enum.marketing_sms))
                    {
                        //insert sms
                        if (n.MobileNumber != null && n.MobileNumberDialCode != null && n.MobileNumber != "" && n.MobileNumberDialCode != "")
                        {
                            TBL_SMS sms = new TBL_SMS
                            {
                                AppointmentID = n.AppointmentID,
                                BusinessID = n.BusinessID,
                                IsSent = false,
                                PhoneNumber = n.MobileNumberDialCode + n.MobileNumber,
                                Body = ExcuteData_Message.GenerateSMSAppointment(n.BusinessID, n.AppointmentID)
                            };
                            ExcuteData_Main<TBL_SMS>.Insert(sms);
                        }
                    }
                    else
                    {
                        ExcuteData_Message.SendEmailAppointment(n.BusinessID, n.AppointmentID, nameof(Resources.Enum.email_reminder_booking_client));
                        //insert sms
                        if (n.MobileNumber != null && n.MobileNumberDialCode != null && n.MobileNumber != "" && n.MobileNumberDialCode != "")
                        {
                            TBL_SMS sms = new TBL_SMS
                            {
                                AppointmentID = n.AppointmentID,
                                BusinessID = n.BusinessID,
                                IsSent = false,
                                PhoneNumber = "+" + n.MobileNumberDialCode + n.MobileNumber,
                                Body = ExcuteData_Message.GenerateSMSAppointment(n.BusinessID, n.AppointmentID)
                            };
                            ExcuteData_Main<TBL_SMS>.Insert(sms);
                        }
                    }
                }
            });
            //lay cac appointemnt remider chua gui di gui

            //xu ly update voucher expire
            List<V_VOUCHER> vc = ExcuteData_Main<V_VOUCHER>.Find(n => n.ExpireDate != null && n.VoucherStatus != nameof(Resources.Enum.voucher_stattus_expired) && n.RemainTime <= 0).ToList();
            if (vc != null && vc.Count > 0)
            {
                foreach (var item in vc)
                {
                    Voucher vci = ExcuteData_Main<Voucher>.GetById(item.VoucherID);
                    if (vci != null)
                    {
                        vci.VoucherStatus = nameof(Resources.Enum.voucher_stattus_expired);
                        ExcuteData_Main<Voucher>.Update(vci);
                    }
                }
            }

            return Json(new
            {
                TotalEmail = TotalEmail,
                EmailOK = EmailOK,
                EmailFail = TotalEmail - EmailOK,
                TotalSMS = TotalSMS,
                SMSOK = SMSOK,
                SMSFail = TotalSMS - SMSOK
            }, JsonRequestBehavior.AllowGet);
        }
    }
}