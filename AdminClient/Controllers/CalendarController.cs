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
using System.IO;
using System.Data;

namespace AdminClient.Controllers
{
    public class CalendarController : Controller
    {
        #region Load Page

        #region Index
        [CheckPermision]
        public ActionResult Index()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.own_calendar)))
            {
                return View();
            }
            else
            {
                return View("/Views/Home/Index_Empty.cshtml");
            }
        }
        #endregion

        #endregion

        #region Ajax

        #region Appointment
        [HttpPost]
        public JsonResult GetClientBaseIdForAppointment(long ClientId)
        {
            User u = ((User)Session["AccountLogin"]);
            V_CLIENT client = ExcuteData_Main<V_CLIENT>.Find(n => n.BusinessID == u.BusinessID && n.ClientID == ClientId).FirstOrDefault();
            List<V_APPOINTMENT_SERVICE> lstAP = ExcuteData_Main<V_APPOINTMENT_SERVICE>.Find(n => n.BusinessID == u.BusinessID && n.ClientID == ClientId).OrderByDescending(n => n.ScheduledDate).ThenBy(n => n.AppointmentID).ThenByDescending(n => n.StartTime).ToList();
            List<V_INVOICE_DETAIL> lstIVP = ExcuteData_Main<V_INVOICE_DETAIL>.Find(n => n.BusinessID == u.BusinessID && n.ClientID == ClientId && n.ItemType == nameof(Resources.Enum.item_type_product)).OrderByDescending(n => n.InvoiceDate).ToList();
            List<V_INVOICE> lstIV = ExcuteData_Main<V_INVOICE>.Find(n => n.BusinessID == u.BusinessID && n.ClientID == ClientId).OrderByDescending(n => n.InvoiceDate).ToList();
            return Json(new
            {
                Client = client,
                Appointments = lstAP,
                Products = lstIVP,
                Invoices = lstIV
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetComboboxServiceAppointment(String search)
        {
            return Json(new { Result = ExcuteData_Service.GetComboboxServiceAppointment(search, ((Business)Session["Business"]).BusinessID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetAppointmentBaseId(long AppointmentID)
        {
            User u = ((User)Session["AccountLogin"]);
            Appointment a = ExcuteData_Appointment.GetById(AppointmentID);
            if (a == null)
                throw new Exception("Không tồn tại appointment " + AppointmentID.ToString());
            Object AppointmentResult = new
            {
                Id = a.AppointmentID,
                ScheduledDate = a.ScheduledDate.ToString("yyyy/MM/dd"),
                a.ClientID,
                a.ClientName,
                a.LocationID,
                a.TotalAmount,
                a.TotalTimeInMinutes,
                a.Status,
                a.FrequencyType,
                a.RepeatCount,
                EndRepeat = a.EndRepeat != null ? ((DateTime)a.EndRepeat).ToString("yyyy/MM/dd") : null,
                a.Notes,
                a.DatetimeCancel,
                a.BookingType,
                a.RepeatOrder
            };
            Object AppointmentParentResult = AppointmentResult;
            long ParentAppointmentID = a.RepeatOrder == 0 || a.RepeatOrder == null ? a.AppointmentID : (a.ParentAppointmentID ?? 0);
            if (a.RepeatOrder != 0 && a.RepeatOrder != null)
            {
                Appointment parent = ExcuteData_Appointment.GetById(ParentAppointmentID);
                AppointmentParentResult = new
                {
                    Id = parent.AppointmentID,
                    ScheduledDate = parent.ScheduledDate.ToString("yyyy/MM/dd"),
                    parent.ClientID,
                    parent.ClientName,
                    parent.LocationID,
                    parent.TotalAmount,
                    parent.TotalTimeInMinutes,
                    parent.Status,
                    parent.FrequencyType,
                    parent.RepeatCount,
                    EndRepeat = parent.EndRepeat != null ? ((DateTime)parent.EndRepeat).ToString("yyyy/MM/dd") : null,
                    parent.Notes,
                    parent.DatetimeCancel,
                    parent.BookingType,
                    parent.RepeatOrder
                };
            }
            string statusCancel = Library.Enum.APPOINTMENT_STATUS_CANCELLED;
            return Json(new
            {
                AppointmentRepeatCountCancel = ExcuteData_Appointment.Count(n => (n.AppointmentID == ParentAppointmentID || n.ParentAppointmentID == ParentAppointmentID) && n.Status != statusCancel),
                AppointmentParent = AppointmentParentResult,
                Appointment = AppointmentResult,
                Client = a.ClientID != null ? ExcuteData_Client.GetById(a.ClientID) : null,
                AppointmentServices = ExcuteData_AppointmentService.GetDataBaseAppointmentId(AppointmentID),
                CreateDate = a.CreateDate.ToString("yyyy/MM/dd HH:mm:ss"),
                UserCreate = ExcuteData_Main<User>.GetById(a.UserCreate),
                UserCancel = a.UserCancel != null ? ExcuteData_Main<User>.GetById(a.UserCancel) : null,
                Invoice = a.InvoiceID != null ? ExcuteData_Main<V_INVOICE>.Find(n => n.BusinessID == u.BusinessID && n.InvoiceID == a.InvoiceID).FirstOrDefault() : null,
                Message = ExcuteData_Main<V_MESSAGE>.Find(n => n.BusinessID == u.BusinessID && n.AppointmentID == a.AppointmentID && n.MessageStatus == "message_status_sent").OrderByDescending(n => n.TimeSent).ToList()
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult CompleteAppointment(long AppointmentID)
        {
            Appointment a = ExcuteData_Appointment.GetById(AppointmentID);
            if (a == null)
                throw new Exception("Không tồn tại appointment " + AppointmentID.ToString());
            a.Status = Library.Enum.APPOINTMENT_STATUS_COMPLETED;
            ExcuteData_Main<Appointment>.Update(a);
            ExcuteData_Message.SendEmailAppointment(a.BusinessID, a.AppointmentID, nameof(Resources.Enum.email_thank_you_booking_client));
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetComboboxResourceAppointment()
        {
            #region get paramter method post
            string searchTerm = (Request.Form.GetValues("searchTerm").FirstOrDefault() ?? "").ToString();
            int pageSize = Convert.ToInt32(Request.Form.GetValues("pageSize").FirstOrDefault() ?? "0");
            int pageNum = Convert.ToInt32(Request.Form.GetValues("pageNum").FirstOrDefault() ?? "0");
            int ServiceID = Convert.ToInt32(Request.Form.GetValues("ServiceID").FirstOrDefault() ?? "0");
            int LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID").FirstOrDefault() ?? "0");
            #endregion
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new
            {
                Results = ExcuteData_Resource.GetEntityBaseLocationService(BusinessID, LocationID, ServiceID, searchTerm, pageNum * pageSize, pageSize).Select(n => new
                {
                    id = n.ResourceID,
                    text = n.ResourceName
                }),
                Total = ExcuteData_Resource.CountEntityBaseLocationService(BusinessID, LocationID, ServiceID, searchTerm)
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetComboboxResourceNotPagging(long LocationID, long ServiceID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(ExcuteData_Resource.GetEntityBaseLocationServiceNotPagging(BusinessID, LocationID, ServiceID), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpdateStatusAppointment(long AppointmentID, string Status)
        {
            User u = ((User)Session["AccountLogin"]);
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            Appointment a = ExcuteData_Appointment.GetById(AppointmentID);
            if (a == null)
                throw new Exception("Không tồn tại AppointmentID" + AppointmentID);
            a.Status = Status;
            a.UserModify = u.UserID;
            a.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            ExcuteData_Appointment.Update(a);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpadateStatusNoShowAppointment(long AppointmentID)
        {
            User u = ((User)Session["AccountLogin"]);
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            Appointment a = ExcuteData_Appointment.GetById(AppointmentID);
            if (a == null)
                throw new Exception("Không tồn tại AppointmentID" + AppointmentID);
            a.Status = Library.Enum.APPOINTMENT_STATUS_NOSHOW;
            a.UserModify = u.UserID;
            a.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            ExcuteData_Appointment.Update(a);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpadateStatusUndoNoShowAppointment(long AppointmentID)
        {
            User u = ((User)Session["AccountLogin"]);
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            Appointment a = ExcuteData_Appointment.GetById(AppointmentID);
            if (a == null)
                throw new Exception("Không tồn tại AppointmentID" + AppointmentID);
            a.Status = Library.Enum.APPOINTMENT_STATUS_NEW;
            a.UserModify = u.UserID;
            a.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            ExcuteData_Appointment.Update(a);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpdateNoteAppointment(long AppointmentID, string Note)
        {
            User u = ((User)Session["AccountLogin"]);
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            Appointment a = ExcuteData_Appointment.GetById(AppointmentID);
            if (a == null)
                throw new Exception("Không tồn tại AppointmentID " + AppointmentID);
            a.Notes = Note;
            a.UserModify = u.UserID;
            a.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            ExcuteData_Appointment.Update(a);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpadateStatusCancelAppointment(long AppointmentID, String ReasonCancel, DateTime DatetimeCancel, Boolean IsUpdateOnly)
        {
            User u = ((User)Session["AccountLogin"]);
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            Appointment a = ExcuteData_Appointment.GetById(AppointmentID);
            if (a == null)
                throw new Exception("Không tồn tại AppointmentID " + AppointmentID);
            if (IsUpdateOnly)
                UpadateStatusCancelAppointmentEntity(a, ReasonCancel, DatetimeCancel, TargetTimeZone, u, a.AppointmentID == AppointmentID);
            else
            {
                long ParentAppointmentID = a.RepeatOrder == 0 || a.RepeatOrder == null ? a.AppointmentID : (a.ParentAppointmentID ?? 0);
                string statusCancel = Library.Enum.APPOINTMENT_STATUS_CANCELLED;
                List<Appointment> lsOld = ExcuteData_Appointment.Find(n => (n.AppointmentID == ParentAppointmentID || n.ParentAppointmentID == ParentAppointmentID) && n.Status != statusCancel).Where(n => (n.RepeatOrder ?? 0) >= (a.RepeatOrder ?? 0)).ToList();
                lsOld.ForEach(entity => UpadateStatusCancelAppointmentEntity(entity, ReasonCancel, DatetimeCancel, TargetTimeZone, u, entity.AppointmentID == AppointmentID));
            }
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveCreateAppointment(Appointment Appointment, List<AppointmentService> AppointmentServices, int StartTime, List<DateTime> lsScheduledDate)
        {
            User u = ((User)Session["AccountLogin"]);
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            lsScheduledDate = lsScheduledDate.OrderBy(n => n).ToList();
            using (TransactionScope scope = new TransactionScope())
            {
                if (lsScheduledDate.Count > 0)
                {
                    long ParentAppointmentID = 0;
                    int RepeatOrder = 0;
                    DateTime SchedulDateParent = lsScheduledDate.FirstOrDefault();
                    SaveCreateAppointmentEntity(new DateTime(SchedulDateParent.Year, SchedulDateParent.Month, SchedulDateParent.Day), Appointment, AppointmentServices, u, TargetTimeZone, StartTime);
                    ParentAppointmentID = Appointment.AppointmentID;
                    ++RepeatOrder;

                    lsScheduledDate.RemoveAt(0);
                    new System.Threading.Thread(() =>
                    {
                        lsScheduledDate.ForEach(n =>
                        {
                            Appointment.ParentAppointmentID = ParentAppointmentID;
                            Appointment.RepeatOrder = RepeatOrder;
                            SaveCreateAppointmentEntity(new DateTime(n.Year, n.Month, n.Day), Appointment, AppointmentServices, u, TargetTimeZone, StartTime);
                            ++RepeatOrder;
                        });
                    }).Start();
                }
                scope.Complete();
            }
            return Json(new { Result = true, AppointmentID = Appointment.AppointmentID }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetUserByLocationBooking(long LocationID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(ExcuteData_User.GetUserByLocationBooking(LocationID, BusinessID), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveEditAppointment(Appointment Appointment, List<AppointmentService> AppointmentServices, int StartTime, List<DateTime> lsScheduledDate, Boolean isUpdateOnly)
        {
            User u = ((User)Session["AccountLogin"]);
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            lsScheduledDate = lsScheduledDate.OrderBy(n => n).ToList();
            using (TransactionScope scope = new TransactionScope())
            {
                if (lsScheduledDate.Count > 0)
                {
                    if (isUpdateOnly)
                    {
                        List<AppointmentService> AppointmentServicesOld = ExcuteData_Main<AppointmentService>.Find(n => n.AppointmentID == Appointment.AppointmentID);
                        Appointment AppointmentOld = ExcuteData_Appointment.GetById(Appointment.AppointmentID);
                        Appointment.RepeatOrder = AppointmentOld.RepeatOrder;
                        Appointment.ParentAppointmentID = AppointmentOld.ParentAppointmentID;
                        SaveEditAppointmentEntity(new DateTime(Appointment.ScheduledDate.Year, Appointment.ScheduledDate.Month, Appointment.ScheduledDate.Day), AppointmentOld, Appointment, AppointmentServices, AppointmentServicesOld, u, TargetTimeZone, StartTime);
                    }
                    else
                    {
                        Appointment entityOld = ExcuteData_Appointment.GetById(Appointment.AppointmentID);
                        long ParentAppointmentID = entityOld.RepeatOrder == 0 || entityOld.RepeatOrder == null ? entityOld.AppointmentID : (entityOld.ParentAppointmentID ?? 0);
                        List<Appointment> lsOld = ExcuteData_Appointment.Find(n => (n.AppointmentID == ParentAppointmentID || n.ParentAppointmentID == ParentAppointmentID) && n.BusinessID == u.BusinessID).OrderBy(n => n.RepeatOrder ?? 0).ToList();

                        if (entityOld.RepeatOrder == 0 || entityOld.RepeatOrder == null)
                        {
                            List<long> lsDelete = lsOld.Where(n => !lsScheduledDate.Any(m => DateTime.Compare(m, n.ScheduledDate) == 0)).Select(n => n.AppointmentID).ToList();
                            new System.Threading.Thread(() =>
                            {
                                lsDelete.ForEach(n => ExcuteData_Appointment.Delete(n));
                                if (lsDelete.Count > 0)
                                {
                                    List<AppointmentService> AppointmentServicesDelete = ExcuteData_AppointmentService.Find(n => lsDelete.Any(m => m == n.AppointmentID)).ToList();
                                    AppointmentServicesDelete.ForEach(n => ExcuteData_AppointmentService.Delete(n.AppointmentServiceID));
                                }
                            }).Start();

                            long parentAppointmentID = 0;
                            int repeatOrder = 0;
                            DateTime SchedulDateParent = lsScheduledDate.FirstOrDefault();
                            Appointment.ParentAppointmentID = parentAppointmentID;
                            Appointment.RepeatOrder = repeatOrder;
                            SaveEditAppointmentEntityAll(SchedulDateParent, lsOld, Appointment, AppointmentServices, u, TargetTimeZone, StartTime);
                            //send email confirm
                            if (Appointment.Status != "Completed")
                                ExcuteData_Message.SendEmailAppointment(Appointment.BusinessID, Appointment.AppointmentID, nameof(Resources.Enum.email_rescheduling_booking_client));
                            parentAppointmentID = Appointment.AppointmentID;
                            ++repeatOrder;

                            new System.Threading.Thread(() =>
                            {
                                lsScheduledDate.RemoveAt(0);
                                lsScheduledDate.ForEach(date =>
                                {
                                    DateTime scheduledDate = new DateTime(date.Year, date.Month, date.Day);
                                    Appointment.ParentAppointmentID = parentAppointmentID;
                                    Appointment.RepeatOrder = repeatOrder;
                                    SaveEditAppointmentEntityAll(scheduledDate, lsOld, Appointment, AppointmentServices, u, TargetTimeZone, StartTime);
                                    ++repeatOrder;
                                });
                            }).Start();
                        }
                        else
                        {
                            List<long> lsDelete = lsOld.Where(n => n.RepeatOrder >= entityOld.RepeatOrder).Select(n => n.AppointmentID).ToList();
                            new System.Threading.Thread(() =>
                            {
                                lsDelete.ForEach(n => ExcuteData_Appointment.Delete(n));
                                if (lsDelete.Count > 0)
                                {
                                    List<AppointmentService> AppointmentServicesDelete = ExcuteData_AppointmentService.Find(n => lsDelete.Any(m => m == n.AppointmentID)).ToList();
                                    AppointmentServicesDelete.ForEach(n => ExcuteData_AppointmentService.Delete(n.AppointmentServiceID));
                                }
                            }).Start();
                            new System.Threading.Thread(() =>
                            {
                                List<Appointment> lsUpdate = lsOld.Where(n => !lsDelete.Any(m => m == n.AppointmentID)).ToList();
                                DateTime dateEndRepeat = lsUpdate.Last().ScheduledDate;
                                lsUpdate.ForEach(entity =>
                                {
                                    entity.RepeatCount = "date";
                                    entity.EndRepeat = dateEndRepeat;
                                });
                                ExcuteData_Appointment.Update(lsUpdate);
                            }).Start();

                            long parentAppointmentID = 0;
                            int RepeatOrder = 0;
                            DateTime SchedulDateParent = lsScheduledDate.FirstOrDefault();
                            SaveCreateAppointmentEntity(new DateTime(SchedulDateParent.Year, SchedulDateParent.Month, SchedulDateParent.Day), Appointment, AppointmentServices, u, TargetTimeZone, StartTime);
                            parentAppointmentID = Appointment.AppointmentID;
                            ++RepeatOrder;

                            lsScheduledDate.RemoveAt(0);
                            new System.Threading.Thread(() =>
                            {
                                lsScheduledDate.ForEach(n =>
                                {
                                    Appointment.ParentAppointmentID = parentAppointmentID;
                                    Appointment.RepeatOrder = RepeatOrder;
                                    SaveCreateAppointmentEntity(new DateTime(n.Year, n.Month, n.Day), Appointment, AppointmentServices, u, TargetTimeZone, StartTime);
                                    ++RepeatOrder;
                                });
                            }).Start();
                        }
                    }
                }
                scope.Complete();
            }
            return Json(new { Result = true, AppointmentID = Appointment.AppointmentID }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult CheckDateWorkingUserExist(long UserID, DateTime StartTimeWorkingHour, DateTime EndTimeWorkingHour, DateTime DateWorkingHour, DateTime StartTimeBlockTime, DateTime EndTimeBlockTime, DateTime DateBlockTime, long LocationID)
        {
            DateWorkingHour = DateWorkingHour.Date;
            DateBlockTime = DateBlockTime.Date;
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new
            {
                CheckWorkingHour = ExcuteData_Main<UserWorkingHour>.Any(n => n.LocationID == LocationID && n.BusinessID == BusinessID && n.UserID == UserID && n.DateWorking == DateWorkingHour && ((n.Shift1Start <= StartTimeWorkingHour && EndTimeWorkingHour <= n.Shift1End) || (n.Shift2Start <= StartTimeWorkingHour && EndTimeWorkingHour <= n.Shift2End))),
                CheckBlockTime = !ExcuteData_Main<BlockTime>.Any(n => n.LocationID == LocationID && n.BusinessID == BusinessID && n.StaffID == UserID && n.DateWorking == DateBlockTime && (n.StartTime <= StartTimeBlockTime && n.EndTime >= EndTimeBlockTime)),
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UpdateAppointment(long AppointmentServiceID, long AppointmentID, DateTime ScheduledDate, long UserID, long? ResourceID, Boolean IsEmployee, DateTime StartTime, DateTime EndTime, int Duration, int Start)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                Appointment a = ExcuteData_Appointment.GetById(AppointmentID);
                AppointmentService a_s = ExcuteData_Main<AppointmentService>.GetById(AppointmentServiceID);
                if (a == null || a_s == null)
                    throw new Exception("Không tồn tại dữ liệu AppointmentID = " + AppointmentID + " và AppointmentServiceID = " + AppointmentServiceID);
                ScheduledDate = ScheduledDate.Date;
                a_s.StartTime = ScheduledDate.Date.AddSeconds(Start);
                a_s.EndTime = ScheduledDate.Date.AddSeconds(Start).AddSeconds(Duration);
                a_s.Duration = Duration;
                if (IsEmployee)
                    a_s.StaffID = UserID;
                else
                    a_s.ResourceID = ResourceID;
                if (ScheduledDate.Date != a.ScheduledDate)
                {
                    a.ScheduledDate = ScheduledDate;
                    if (ExcuteData_Main<AppointmentService>.Count(n => n.AppointmentID == AppointmentID) > 1)
                    {
                        //tach ra 1 appointment khac
                        a.AppointmentID = 0;
                        ExcuteData_Main<AppointmentService>.Delete(a_s);
                        a.TotalAmount = a_s.Price;
                        a.TotalTimeInMinutes = a_s.Duration;
                        ExcuteData_Appointment.Insert(a);
                        a_s.AppointmentID = a.AppointmentID;
                        a_s.AppointmentServiceID = 0;
                        a_s.SortOrder = 0;
                        ExcuteData_Main<AppointmentService>.Insert(a_s);
                    }
                    else
                    {
                        ExcuteData_Appointment.Update(a);
                        ExcuteData_Main<AppointmentService>.Update(a_s);
                    }
                }
                else
                    ExcuteData_Main<AppointmentService>.Update(a_s);

                //sau khi tach phai tinh lai amount va totaltime
                List<AppointmentService> lst = ExcuteData_Main<AppointmentService>.Find(n => n.AppointmentID == AppointmentID);
                a = ExcuteData_Appointment.GetById(AppointmentID);
                decimal totalAmount = 0;
                int totaltime = 0;
                foreach (var item in lst)
                {
                    totalAmount = totalAmount + item.Price;
                    totaltime = totaltime + item.Duration;
                }
                a.TotalAmount = totalAmount;
                a.TotalTimeInMinutes = totaltime;
                ExcuteData_Appointment.Update(a);

                if (a.Status != "Completed")
                    ExcuteData_Message.SendEmailAppointment(a.BusinessID, a.AppointmentID, nameof(Resources.Enum.email_rescheduling_booking_client));

                scope.Complete();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Index
        [HttpPost]
        public JsonResult LoadDataComboboxLocation()
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new { Results = ExcuteData_Location.GetDataComboboxSchelude(BusinessID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult LoadDataComboboxResourceStaff(int LocationId)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            bool check = CheckPermision.CheckPermissionFunction("other_staff_calendars");
            return Json(new
            {
                Results = new
                {
                    IsHide = !check,
                    Staffs = check ? ExcuteData_User.GetDataComboboxUser(BusinessID, LocationId) : new List<User>() { (User)Session["AccountLogin"] },
                    Resources = check ? ExcuteData_Resource.Find(n => n.LocationID == LocationId && n.BusinessID == BusinessID) : new List<Resource>()
                }
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetLocationBaseId(int id)
        {
            Location item = ExcuteData_Location.GetById(id);
            return Json(new { Id = item.LocationID, Text = item.LocationName }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetStartTimeCalendar(DateTime FromDate, DateTime ToDate, string ModeView, int LocationID, int StaffID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            List<SqlParameter> para = new List<SqlParameter>();
            para.Add(new SqlParameter("BusinessID", BusinessID));
            para.Add(new SqlParameter("LocationID", LocationID));
            para.Add(new SqlParameter("FromDate", FromDate));
            para.Add(new SqlParameter("ToDaTe", ToDate));
            para.Add(new SqlParameter("ModeView", ModeView ?? ""));
            para.Add(new SqlParameter("StaffID", StaffID));

            DataTable dt = ExcuteData_Main<Object>.ExecuteStore("pr_GetStartTimeCalendar", para.ToArray());
            DateTime starttime = new DateTime(2000, 1, 1, 9, 0, 0);
            if (dt != null && dt.Rows.Count == 1)
            {
                starttime = Convert.ToDateTime(dt.Rows[0][0]);
                return Json(new { Hour = starttime.Hour, Minute = starttime.Minute }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { Hour = starttime.Hour, Minute = starttime.Minute }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetDataScheul(DateTime DateFrom, DateTime DateTo, long LocationID, List<long> EmployeeIDs, List<long> ResourceIDs)
        {
            //DateFrom = DateFrom.Date;
            //DateTo = DateTo.Date;
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(ExcuteData_Appointment.GetDataCalendarScheul(DateFrom, DateTo, BusinessID, LocationID, EmployeeIDs, ResourceIDs), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult CheckShowScheulBaseUser()
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(ExcuteData_Main<User>.Any(n => n.BusinessID == BusinessID && n.EnableAppointmentBooking), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetResourceChooseWokingStaff(DateTime Date, int LocationId)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(ExcuteData_User.GetDataComboboxChooseWokingStaff_V2(BusinessID, Date, LocationId).Select(n => new { n.UserID, UserName = n.FirstName + " " + (n.LastName == null ? "" : n.LastName) }), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetUserWorkingHour(DateTime Start, DateTime End, List<long> StaffId, long LocationID)
        {
            Start = Start.Date;
            End = End.Date;
            return Json(ExcuteData_UserWorkingHour.GetUserWorkingHour(((Business)Session["Business"]).BusinessID, Start, End, StaffId, LocationID).Select(n => new
            {
                DateWorking = n.DateWorking.ToString("yyyy-MM-dd"),
                //n.DateWorking,
                n.Shift1End,
                n.Shift1Start,
                StartTime1InSecond = n.Shift1Start.Minute * 60 + n.Shift1Start.Hour * 3600,
                EndTime1InSecond = n.Shift1End.Minute * 60 + n.Shift1End.Hour * 3600,
                n.Shift2End,
                n.Shift2Start,
                StartTime2InSecond = n.Shift2Start == null ? 0 : ((n.Shift2Start).Value.Minute * 60 + (n.Shift2Start).Value.Hour * 3600),
                EndTime2InSecond = n.Shift2End == null ? 0 : ((n.Shift2End).Value.Minute * 60 + (n.Shift2End).Value.Hour * 3600),
                StaffId = n.UserID
            }), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult CheckTimeForScheulReschedule(DateTime StartTime, long StaffId, long LocationID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            DateTime DateWorkingUserWorking = StartTime.Date;
            DateTime StartTimeUserWorking = new DateTime(2000, 1, 1, StartTime.Hour, StartTime.Minute, StartTime.Second);
            return Json(new
            {
                CheckAppointmentService = !ExcuteData_AppointmentService.CheckTimeForScheulReschedule(StartTime, BusinessID, StaffId, LocationID),
                CheckBlockTime = !ExcuteData_Main<BlockTime>.Any(n => n.BusinessID == BusinessID && n.StaffID == StaffId && n.StartTime <= StartTime && StartTime < n.EndTime && n.LocationID == LocationID),
                CheckUserWorking = ExcuteData_Main<UserWorkingHour>.Any(n => n.BusinessID == BusinessID && n.UserID == StaffId && n.DateWorking == DateWorkingUserWorking && n.LocationID == LocationID &&
                                 ((n.Shift1Start <= StartTimeUserWorking && StartTimeUserWorking < n.Shift1End) || (n.Shift2Start <= StartTimeUserWorking && StartTimeUserWorking < n.Shift2End)))
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SaveForScheulCopyOrCut(DateTime StartTime, long AppointmentID, long StaffId, long LocationID, Boolean IsCut, int Start)
        {
            User u = ((User)Session["AccountLogin"]);
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));

            using (TransactionScope scope = new TransactionScope())
            {
                long BusinessID = ((Business)Session["Business"]).BusinessID;
                Appointment appointment = ExcuteData_Main<Appointment>.GetById(AppointmentID);
                if (appointment == null)
                    throw new Exception("Không tồn tại phần tử " + appointment.AppointmentID);
                appointment.ScheduledDate = StartTime.Date;
                appointment.LocationID = LocationID;
                List<AppointmentService> lsAppointmentServices = ExcuteData_Main<AppointmentService>.Find(n => n.BusinessID == BusinessID && n.AppointmentID == appointment.AppointmentID).OrderBy(n => n.StartTime).ToList();
                AppointmentService AppointmentServiceFirst = lsAppointmentServices.FirstOrDefault();
                DateTime startTimeFirst = StartTime.Date.AddSeconds(Start);

                lsAppointmentServices.ForEach(item =>
                {
                    item.StartTime = startTimeFirst;
                    item.EndTime = startTimeFirst.AddSeconds(item.Duration);
                    item.StaffID = StaffId;
                    startTimeFirst = startTimeFirst.AddSeconds(item.Duration);
                });
                if (IsCut)
                {
                    ExcuteData_Main<Appointment>.Update(appointment);
                    ExcuteData_Main<AppointmentService>.Update(lsAppointmentServices);
                    //send emails
                    ExcuteData_Message.SendEmailAppointment(appointment.BusinessID, appointment.AppointmentID, nameof(Resources.Enum.email_rescheduling_booking_client));
                }
                else
                {
                    appointment.Status = appointment.Status == Library.Enum.APPOINTMENT_STATUS_COMPLETED ? Library.Enum.APPOINTMENT_STATUS_NEW : appointment.Status;
                    appointment.InvoiceID = 0;
                    appointment.AppointmentID = 0;
                    appointment.UserCreate = u.UserID;
                    appointment.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    appointment.ModifyDate = null;
                    appointment.UserModify = 0;
                    appointment.BookingType = nameof(Resources.Enum.booking_type_calendar);
                    appointment.DatetimeCancel = null;
                    appointment.UserCancel = 0;

                    ExcuteData_Main<Appointment>.Insert(appointment);
                    lsAppointmentServices.ForEach(n => { n.AppointmentID = appointment.AppointmentID; n.AppointmentServiceID = 0; });
                    ExcuteData_Main<AppointmentService>.Insert(lsAppointmentServices);
                    //send emails
                    ExcuteData_Message.SendEmailAppointment(appointment.BusinessID, appointment.AppointmentID, nameof(Resources.Enum.email_confirmation_booking_client));
                }
                scope.Complete();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Block Time
        [HttpPost]
        public JsonResult SaveBlockTime(BlockTime entity, Boolean isUpdate, int Start, int End)
        {
            entity.BusinessID = ((Business)Session["Business"]).BusinessID;
            entity.DateWorking = entity.DateWorking.Date;
            entity.StartTime = entity.DateWorking.Date.AddSeconds(Start);
            entity.EndTime = entity.DateWorking.Date.AddSeconds(End);
            if (isUpdate)
            {
                BlockTime entityOld = ExcuteData_Main<BlockTime>.GetById(entity.BlockTimeID);
                if (entityOld == null)
                    throw new Exception("Không tồn tại phần tử " + entity.BlockTimeID.ToString());
                if (entityOld.BusinessID != entity.BusinessID)
                    throw new Exception("không có quyền sửa dữ liệu của business id " + entity.BusinessID);
                entity.LocationID = entityOld.LocationID;
                ExcuteData_Main<BlockTime>.Update(entity);
            }
            else
            {
                ExcuteData_Main<BlockTime>.Insert(entity);
            }

            return Json(true, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult DeleteBlockTime(long id)
        {
            BlockTime entity = ExcuteData_Main<BlockTime>.GetById(id);
            if (entity == null)
                throw new Exception("Không tồn tại phần tử " + id);
            ExcuteData_Main<BlockTime>.Delete(entity);
            return Json(true, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Method Support
        public DateTime CalcFromSubtracDateTime(DateTime t1, DateTime t2, DateTime t)
        {
            t = t.AddHours(t2.Hour - t1.Hour);
            t = t.AddMinutes(t2.Minute - t1.Minute);
            t = t.AddSeconds(t2.Second - t1.Second);
            return t;
        }
        public void UpadateStatusCancelAppointmentEntity(Appointment a, String ReasonCancel, DateTime DatetimeCancel, TimeZoneInfo TargetTimeZone, User u, bool SendEmail)
        {
            a.ReasonCancel = ReasonCancel;
            a.UserCancel = u.UserID;
            a.DatetimeCancel = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            a.Status = Library.Enum.APPOINTMENT_STATUS_CANCELLED;
            a.UserModify = u.UserID;
            a.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            ExcuteData_Appointment.Update(a);

            //send emails
            if (SendEmail)
                ExcuteData_Message.SendEmailAppointment(a.BusinessID, a.AppointmentID, nameof(Resources.Enum.email_cancellation_booking_client));
        }
        private void SaveCreateAppointmentEntity(DateTime ScheduledDate, Appointment Appointment, List<AppointmentService> AppointmentServices, User u, TimeZoneInfo TargetTimeZone, int StartTime)
        {
            #region Appointment
            Appointment.AppointmentID = 0;
            Appointment.ScheduledDate = ScheduledDate;
            Appointment.BusinessID = u.BusinessID;
            Appointment.BookingType = nameof(Resources.Enum.booking_type_calendar);
            Appointment.Status = Library.Enum.APPOINTMENT_STATUS_NEW;
            Appointment.ReasonCancel = "";
            Appointment.DatetimeCancel = null;
            Appointment.UserCreate = u.UserID;
            Appointment.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            Appointment.UserModify = null;
            Appointment.ModifyDate = null;
            Appointment.ClientName = "Walk-In";
            if (Appointment.ClientID != null)
            {
                Client c = ExcuteData_Main<Client>.GetById(Appointment.ClientID);
                if (c != null)
                    Appointment.ClientName = c.FirstName + " " + c.LastName;
            }
            ExcuteData_Main<Appointment>.Insert(Appointment);
            #endregion

            #region AppointmentService
            int sort = 0;
            AppointmentServices.ForEach(n =>
            {
                Service s = ExcuteData_Main<Service>.GetById(n.ServiceID);
                n.AppointmentID = Appointment.AppointmentID;
                n.BusinessID = u.BusinessID;
                n.StartTime = ScheduledDate.AddSeconds(StartTime);
                n.EndTime = n.StartTime.AddSeconds(n.Duration);
                n.RefNo = Path.GetRandomFileName().Replace(".", "").Remove(10).ToUpper();
                n.ServiceName = s.ServiceName;
                n.Price = n.SpecialPrice > 0 ? n.SpecialPrice : n.RetailPrice;
                n.SortOrder = sort;
                StartTime = StartTime + n.Duration;
                ++sort;
            });
            ExcuteData_Main<AppointmentService>.Insert(AppointmentServices);
            #endregion

            if (Appointment.RepeatOrder == 0 || Appointment.RepeatOrder == null)
                ExcuteData_Message.SendEmailAppointment(Appointment.BusinessID, Appointment.AppointmentID, nameof(Resources.Enum.email_confirmation_booking_client));
        }
        private void SaveEditAppointmentEntityAll(DateTime ScheduledDate, List<Appointment> lsOld, Appointment Appointment, List<AppointmentService> AppointmentServices, User u, TimeZoneInfo TargetTimeZone, int StartTime)
        {
            Appointment itemOld = lsOld.FirstOrDefault(m => m.ScheduledDate == ScheduledDate);
            if (itemOld != null)
            {
                Appointment.AppointmentID = itemOld.AppointmentID;
                List<AppointmentService> AppointmentServicesOld = ExcuteData_Main<AppointmentService>.Find(m => m.AppointmentID == Appointment.AppointmentID);
                int sort = 0;
                AppointmentServices.ForEach(item =>
                {
                    AppointmentService old = AppointmentServicesOld.FirstOrDefault(n => n.SortOrder == sort);
                    if (old != null)
                        item.AppointmentServiceID = old.AppointmentServiceID;
                    else
                        item.AppointmentServiceID = 0;
                    ++sort;
                });
                SaveEditAppointmentEntity(ScheduledDate, itemOld, Appointment, AppointmentServices, AppointmentServicesOld, u, TargetTimeZone, StartTime);
            }
            else
                SaveCreateAppointmentEntity(ScheduledDate, Appointment, AppointmentServices, u, TargetTimeZone, StartTime);
        }
        private void SaveEditAppointmentEntity(DateTime ScheduledDate, Appointment AppointmentOld, Appointment Appointment, List<AppointmentService> AppointmentServices, List<AppointmentService> AppointmentServicesOld, User u, TimeZoneInfo TargetTimeZone, int StartTime)
        {
            if (AppointmentOld == null)
                throw new Exception("Không tồn tại AppointmentID " + Appointment.AppointmentID);

            #region Appointment
            Appointment.BusinessID = u.BusinessID;
            Appointment.ScheduledDate = ScheduledDate;
            Appointment.BookingType = AppointmentOld.BookingType;
            Appointment.Status = AppointmentOld.Status;
            Appointment.ReasonCancel = AppointmentOld.ReasonCancel;
            Appointment.DatetimeCancel = AppointmentOld.DatetimeCancel;
            Appointment.UserCreate = AppointmentOld.UserCreate;
            Appointment.CreateDate = AppointmentOld.CreateDate;
            Appointment.UserModify = u.UserID;
            Appointment.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
            Appointment.ClientName = "Walk-In";
            if (Appointment.ClientID != null)
            {
                Client c = ExcuteData_Main<Client>.GetById(Appointment.ClientID);
                if (c != null)
                    Appointment.ClientName = c.FirstName + " " + c.LastName;
            }
            ExcuteData_Main<Appointment>.Update(Appointment);
            #endregion

            #region AppointmentService
            int sort = 0;
            AppointmentServices.ForEach(n =>
            {
                Service s = ExcuteData_Main<Service>.GetById(n.ServiceID);
                n.AppointmentID = Appointment.AppointmentID;
                n.BusinessID = u.BusinessID;
                n.StartTime = Appointment.ScheduledDate.AddSeconds(StartTime);
                n.EndTime = n.StartTime.AddSeconds(n.Duration);
                n.RefNo = Path.GetRandomFileName().Replace(".", "").Remove(10).ToUpper();
                n.ServiceName = s.ServiceName;
                n.Price = n.SpecialPrice > 0 ? n.SpecialPrice : n.RetailPrice;
                n.SortOrder = sort;
                ++sort;
                StartTime = StartTime + n.Duration;
            });
            List<AppointmentService> AppointmentServiceInsert = AppointmentServices.Where(n => n.AppointmentServiceID == 0).ToList();
            List<AppointmentService> AppointmentServiceUpdate = AppointmentServices.Where(n => n.AppointmentServiceID != 0).Select(n =>
            {
                AppointmentService itemOld = AppointmentServicesOld.SingleOrDefault(m => m.AppointmentServiceID == n.AppointmentServiceID);
                if (itemOld == null)
                    throw new Exception("Không tồn tại AppointmentServiceID " + n.AppointmentServiceID);
                n.RefNo = itemOld.RefNo;
                return n;
            }).ToList();
            List<AppointmentService> AppointmentServiceDelete = AppointmentServicesOld.Where(n => !AppointmentServices.Any(m => m.AppointmentServiceID == n.AppointmentServiceID)).ToList();
            ExcuteData_Main<AppointmentService>.Insert(AppointmentServiceInsert);
            ExcuteData_Main<AppointmentService>.Update(AppointmentServiceUpdate);
            AppointmentServiceDelete.ForEach(n => ExcuteData_Main<AppointmentService>.Delete(n.AppointmentServiceID));
            #endregion

        }
        #endregion

        #endregion
    }
}