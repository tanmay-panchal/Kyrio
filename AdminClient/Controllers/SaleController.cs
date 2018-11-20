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

namespace AdminClient.Controllers
{
    public class SaleController : Controller
    {
        #region Load Page

        #region Index
        [CheckPermision]
        public ActionResult Index()
        {
            return View();
        }
        #endregion

        #region Sale
        [CheckPermision]
        public ActionResult NewSale()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            ViewBag.UserID = u.UserID;
            ViewBag.AppointmentID = 0;
            string view = "~/Views/Calendar/Sale/AddSale.cshtml";
            int t = Request.Browser.ScreenPixelsWidth;
            //if ( > 720)
            return View(view);
        }

        [CheckPermision]
        public ActionResult CheckOut(long AppointmentID)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            ViewBag.UserID = u.UserID;
            ViewBag.AppointmentID = AppointmentID;
            string view = "~/Views/Calendar/Sale/AddSale.cshtml";
            return View(view);
        }

        [CheckPermision]
        public ActionResult Invoices(long id)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            ViewBag.InvoiceID = id;
            string view = "~/Views/Calendar/Sale/ViewSale.cshtml";
            return View(view);
        }

        [CheckPermision]
        public ActionResult Pay(long id)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            ViewBag.UserID = u.UserID;
            ViewBag.InvoiceID = id;
            ViewBag.IsPay = 1;
            string view = "~/Views/Calendar/Sale/ViewSale.cshtml";
            return View(view);
        }

        [CheckPermision]
        public ActionResult Refund(long id)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            ViewBag.UserID = u.UserID;
            ViewBag.InvoiceID = id;
            ViewBag.IsRefund = 1;
            string view = "~/Views/Calendar/Sale/AddSale.cshtml";
            return View(view);
        }
        #endregion

        #endregion

        #region Ajax

        #region Sale
        [HttpPost]
        public JsonResult GetCategory()
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new { Results = ExcuteData_Main<Category>.Find(n => n.BusinessID == BusinessID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetServiceGroup()
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new { Results = ExcuteData_Main<ServiceGroup>.Find(n => n.BusinessID == BusinessID) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SearchProduct(string Search, long CategoryID, long LocationID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new
            {
                Results = ExcuteData_Main<V_PRODUCT>.Find(n => n.BusinessID == BusinessID && n.LocationID == LocationID && (n.ProductName.Contains(Search) || n.SKU.Contains(Search) || n.Barcode.Contains(Search))
                 && (CategoryID == 0 || CategoryID == n.CategoryID))
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SearchService(string Search, long ServiceGroupID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new { Results = ExcuteData_Main<V_SERVICE>.Find(n => n.BusinessID == BusinessID && n.ServiceName.Contains(Search) && (ServiceGroupID == 0 || n.ServiceGroupID == ServiceGroupID)) }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SearchServiceBaseFlowEnableVoucherSales(String Search, long ServiceGroupID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new { Results = ExcuteData_Main<V_SERVICE>.Find(n => n.BusinessID == BusinessID && n.EnableVoucherSales && n.ServiceName.Contains(Search) && (ServiceGroupID == 0 || n.ServiceGroupID == ServiceGroupID)) }, JsonRequestBehavior.AllowGet);
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
            User user = (User)Session["AccountLogin"];
            ModelEntity excute = new ModelEntity();
            List<User> result = (from l in excute.UserLocations
                                 join u in excute.Users on l.UserID equals u.UserID into lsU
                                 from u in lsU.DefaultIfEmpty()
                                 where (l.LocationID == LocationId && u.BusinessID == user.BusinessID && l.BusinessID == user.BusinessID
                                 && (u.FirstName.Contains(searchTerm) || u.LastName.Contains(searchTerm) || u.Email.Contains(searchTerm) || u.MobileNumber.Contains(searchTerm)))
                                 select u).OrderBy(n => n.UserID).Skip(pageSize * pageNum).Take(pageSize).ToList<User>();
            if (result.Exists(n => n.UserID == user.UserID) == false)
            {
                result.Add(user);
            }
            return Json(new
            {
                Results = result
                .Select(n => new { id = n.UserID, text = n.FirstName + " " + n.LastName }),
                Total = result.Count
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveInvoice(Invoice entity, List<InvoiceDetail> InvoiceDetails, List<InvoicePayment> InvoicePayments, List<InvoiceTip> InvoiceTips, Boolean isUpdate)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                Business b = (Business)System.Web.HttpContext.Current.Session["Business"];
                Currency currency = ExcuteData_Main<Currency>.Single(n => n.CurrencyCode == b.CurrencyCode);
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                if (isUpdate)
                {
                    using (TransactionScope scope = new TransactionScope())
                    {


                        scope.Complete();
                    }
                }
                else
                {
                    using (TransactionScope scope = new TransactionScope())
                    {
                        entity.BusinessID = u.BusinessID;
                        entity.InvoiceDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        entity.DueDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone).Date;
                        entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        entity.UserCreate = u.UserID;
                        entity.HasRefund = false;
                        Location l = ExcuteData_Main<Location>.GetById(entity.LocationID);
                        entity.InvoiceNo = l.InvoiceNoPrefix + l.NextInvoiceNumber.ToString();
                        if (entity.ClientID != null && entity.ClientID != 0)
                        {
                            Client c = ExcuteData_Main<Client>.GetById(entity.ClientID);
                            entity.ClientName = c == null ? "" : c.FirstName + " " + (c.LastName == null ? "" : c.LastName);
                        }
                        else
                        {
                            entity.ClientName = "Walk-In";
                        }

                        ExcuteData_Main<Invoice>.Insert(entity);
                        long oldInvoiceDetailID = 0;
                        foreach (var item in InvoiceDetails)
                        {
                            //update lai price appointment
                            //if (entity.InvoiceType == nameof(Resources.Enum.invoice_type_sale) && entity.AppointmentID != null && item.AppointmentServiceID != null)
                            //{
                            //    AppointmentService old = ExcuteData_Main<AppointmentService>.GetById(item.AppointmentServiceID);
                            //    if (old != null)
                            //    {
                            //        old.Price = item.Price;
                            //        old.SpecialPrice = item.SpecialPrice;
                            //        old.RetailPrice = item.RetailPrice;
                            //        ExcuteData_Main<AppointmentService>.Update(old);
                            //    }
                            //}

                            oldInvoiceDetailID = item.InvoiceDetailID;
                            item.InvoiceID = entity.InvoiceID;
                            item.BusinessID = u.BusinessID;
                            item.CostPrice = 0;
                            if (item.EnableCommission)
                            {
                                User us = ExcuteData_Main<User>.GetById(item.StaffID);
                                if (us != null)
                                {
                                    if (item.ItemType == nameof(Resources.Enum.item_type_product))
                                    {
                                        item.CommissionRate = us.ProductCommission;
                                    }
                                    else if (item.ItemType == nameof(Resources.Enum.item_type_service))
                                    {
                                        item.CommissionRate = us.ServiceCommission;
                                    }
                                    else
                                    {
                                        item.CommissionRate = us.VoucherSalesCommission;
                                    }
                                }
                            }
                            if (item.ItemType == nameof(Resources.Enum.item_type_product))
                            {
                                //xu ly stock out
                                Product pro = ExcuteData_Main<Product>.GetById(item.ItemID);
                                if (pro.EnableStockControl)
                                {
                                    if (item.Quantity > 0)
                                    {
                                        var sumQuantity = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.LocationID == entity.LocationID && n.ProductID == item.ItemID).Sum(n => n.Adjustment);
                                        var sumCost = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.LocationID == entity.LocationID && n.ProductID == item.ItemID).Sum(n => n.AdjustmentCost);
                                        if (sumQuantity == 0 || sumCost == 0)
                                        {
                                            item.CostPrice = 0;
                                        }
                                        else
                                        {
                                            item.CostPrice = Math.Round((sumCost / sumQuantity), currency.NumberDecimal);
                                        }
                                    }
                                    else if (item.Quantity < 0)//refund
                                    {
                                        //find old 
                                        InvoiceDetail ivd = ExcuteData_Main<InvoiceDetail>.GetById(oldInvoiceDetailID);
                                        if (ivd != null)
                                        {
                                            item.CostPrice = ivd.CostPrice;
                                        }
                                    }
                                }
                            }
                            item.InvoiceDetailID = 0;
                            ExcuteData_Main<InvoiceDetail>.Insert(item);
                            //refund
                            if (item.Quantity < 0 && entity.RefundInvoiceID != null)
                            {
                                if (item.ItemType == nameof(Resources.Enum.item_type_product))
                                {
                                    Product pro = ExcuteData_Main<Product>.GetById(item.ItemID);
                                    if (pro.EnableStockControl)
                                    {
                                        //return 
                                        ProductStockMovement psm = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.InvoiceDetailID == oldInvoiceDetailID).FirstOrDefault();
                                        if (psm != null)
                                        {
                                            var oldOnHand = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == item.ItemID).Sum(n => n.Adjustment);
                                            var oldOnHandCost = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == item.ItemID).Sum(n => n.AdjustmentCost);
                                            psm.ProductStockMovementID = 0;
                                            psm.TransactionTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                                            psm.UserCreate = u.UserID;
                                            psm.Action = nameof(Resources.Enum.stock_invoice_refund);
                                            psm.CostPrice = psm.CostPrice;
                                            psm.AdjustmentCost = Math.Abs(psm.AdjustmentCost);
                                            psm.OnHand = oldOnHand + Math.Abs(item.Quantity);
                                            psm.OnHandCost = oldOnHandCost + psm.AdjustmentCost;
                                            psm.Adjustment = Math.Abs(item.Quantity);
                                            psm.StockType = "I";
                                            psm.InvoiceID = entity.InvoiceID;
                                            psm.InvoiceDetailID = item.InvoiceDetailID;//da tao moi id
                                            psm.RefNo = entity.InvoiceNo;
                                            ExcuteData_Main<ProductStockMovement>.Insert(psm);
                                        }
                                    }
                                }
                                else if (item.ItemType == nameof(Resources.Enum.item_type_gift_voucher) || item.ItemType == nameof(Resources.Enum.item_type_service_voucher))
                                {
                                    Voucher v = ExcuteData_Main<Voucher>.Find(n => n.BusinessID == u.BusinessID && n.InvoiceDetailID == oldInvoiceDetailID).FirstOrDefault();
                                    if (v != null)
                                    {
                                        v.OldInvoiceID = v.InvoiceID;//gan de giu lai de phong void
                                        v.OldInvoiceDetailID = v.InvoiceDetailID;//gan de giu lai de phong void
                                        v.InvoiceID = entity.InvoiceID;
                                        v.InvoiceDetailID = item.InvoiceDetailID;
                                        v.VoucherStatus = nameof(Resources.Enum.voucher_status_refunded_invoice);
                                        ExcuteData_Main<Voucher>.Update(v);
                                    }
                                }
                            }
                        }

                        if (InvoicePayments != null && InvoicePayments.Count > 0)
                        {
                            foreach (var item in InvoicePayments)
                            {
                                item.InvoiceID = entity.InvoiceID;
                                item.BusinessID = u.BusinessID;
                                item.PaymentDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                                //xu ly redeem voucher
                                if (item.VoucherID != 0)
                                {
                                    Voucher vc = ExcuteData_Main<Voucher>.Find(n => n.BusinessID == u.BusinessID && n.VoucherID == item.VoucherID).FirstOrDefault();
                                    if (vc != null)
                                    {
                                        vc.Redeemed = vc.Redeemed + item.PaymentAmount;
                                        vc.Remaining = vc.Total - vc.Redeemed;
                                        if (vc.Remaining == 0)
                                        {
                                            vc.VoucherStatus = nameof(Resources.Enum.voucher_status_redeemed);
                                            vc.RedeemedDate = DateTime.Today;
                                            vc.RedeemedInvoiceID = entity.InvoiceID;
                                        }
                                        ExcuteData_Main<Voucher>.Update(vc);
                                    }
                                }
                            }
                            ExcuteData_Main<InvoicePayment>.Insert(InvoicePayments);
                        }

                        if (InvoiceTips != null && InvoiceTips.Count > 0)
                        {
                            foreach (var item in InvoiceTips)
                            {
                                item.InvoiceID = entity.InvoiceID;
                                item.BusinessID = u.BusinessID;
                            }
                            ExcuteData_Main<InvoiceTip>.Insert(InvoiceTips);
                        }
                        //tang invoice number
                        l.NextInvoiceNumber = l.NextInvoiceNumber + 1;
                        ExcuteData_Main<Location>.Update(l);

                        //update status appointment
                        if (entity.AppointmentID != null && entity.AppointmentID > 0)
                        {
                            Appointment ap = ExcuteData_Main<Appointment>.Find(n => n.BusinessID == u.BusinessID && n.AppointmentID == entity.AppointmentID).FirstOrDefault();
                            if (ap != null)
                            {
                                TimeSpan ts = ap.ScheduledDate.Date - entity.InvoiceDate.Date;
                                if (ts.Days <= 0)
                                {
                                    ap.Status = Library.Enum.APPOINTMENT_STATUS_COMPLETED;
                                }
                                ap.InvoiceID = entity.InvoiceID;
                                ap.UserModify = u.UserID;
                                ap.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                                ap.ClientID = entity.ClientID;
                                ap.ClientName = entity.ClientName;
                                ExcuteData_Main<Appointment>.Update(ap);
                                if (ap.BookingType == nameof(Resources.Enum.booking_type_online))
                                {
                                    entity.Channel = nameof(Resources.Enum.channel_online);
                                    //update lai invoice do da insert roi
                                    ExcuteData_Main<Invoice>.Update(entity);
                                }
                                //send email confirm
                                if (ap.Status == Library.Enum.APPOINTMENT_STATUS_COMPLETED)
                                {
                                    ExcuteData_Message.SendEmailAppointment(ap.BusinessID, ap.AppointmentID, nameof(Resources.Enum.email_thank_you_booking_client));
                                }
                            }
                        }

                        foreach (var item in InvoiceDetails)
                        {
                            if (item.ItemType == nameof(Resources.Enum.item_type_product) && item.Quantity > 0)
                            {
                                //xu ly stock out
                                Product pro = ExcuteData_Main<Product>.GetById(item.ItemID);
                                if (pro.EnableStockControl)
                                {
                                    ProductStockMovement psm = new ProductStockMovement();
                                    psm.BusinessID = u.BusinessID;
                                    psm.ProductID = Convert.ToInt64(item.ItemID);
                                    psm.TransactionTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                                    psm.UserCreate = u.UserID;
                                    psm.Action = nameof(Resources.Enum.stock_invoice);
                                    psm.InvoiceID = entity.InvoiceID;
                                    psm.InvoiceDetailID = item.InvoiceDetailID;
                                    var oldOnHand = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == item.ItemID).Sum(n => n.Adjustment);
                                    var oldOnHandCost = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == item.ItemID).Sum(n => n.AdjustmentCost);
                                    var sumQuantity = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.LocationID == entity.LocationID && n.ProductID == item.ItemID).Sum(n => n.Adjustment);
                                    var sumCost = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.LocationID == entity.LocationID && n.ProductID == item.ItemID).Sum(n => n.AdjustmentCost);
                                    if (sumQuantity == 0 || sumCost == 0)
                                    {
                                        psm.CostPrice = 0;
                                        psm.AdjustmentCost = 0;
                                    }
                                    else
                                    {
                                        psm.CostPrice = Math.Round((sumCost / sumQuantity), currency.NumberDecimal);
                                        psm.AdjustmentCost = -item.Quantity * Math.Round((sumCost / sumQuantity), currency.NumberDecimal);
                                    }
                                    psm.OnHand = oldOnHand - item.Quantity;
                                    psm.OnHandCost = oldOnHandCost + psm.AdjustmentCost; //+ vi da tru

                                    psm.LocationID = entity.LocationID;
                                    psm.Adjustment = -item.Quantity;
                                    psm.StockType = "O";
                                    psm.RefNo = entity.InvoiceNo;
                                    ExcuteData_Main<ProductStockMovement>.Insert(psm);
                                }
                            }
                            else if (item.ItemType == nameof(Resources.Enum.item_type_gift_voucher) && item.Quantity > 0)
                            {
                                for (int i = 0; i < item.Quantity; i++)
                                {
                                    Voucher v = new Voucher
                                    {
                                        BusinessID = u.BusinessID,
                                        ClientID = entity.ClientID,
                                        ClientName = entity.ClientName,
                                        CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone),
                                        Duration = 0,
                                        ExpireDate = item.VoucherExpiryDate,
                                        InvoiceID = entity.InvoiceID,
                                        IssueDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone).Date,
                                        Redeemed = 0,
                                        Remaining = item.Price,
                                        Total = item.Price,
                                        UserCreate = u.UserID,
                                        VoucherCode = "V" + RandomString(7),
                                        VoucherStatus = (entity.InvoiceStatus == nameof(Resources.Enum.invoice_status_unpaid) || entity.InvoiceStatus == nameof(Resources.Enum.invoice_status_part_paid)) ? nameof(Resources.Enum.voucher_status_unpaid) : nameof(Resources.Enum.voucher_status_valid),
                                        VoucherType = nameof(Resources.Enum.voucher_type_gift_voucher),
                                        InvoiceDetailID = item.InvoiceDetailID
                                    };
                                    ExcuteData_Main<Voucher>.Insert(v);
                                }
                            }
                            else if (item.ItemType == nameof(Resources.Enum.item_type_service_voucher) && item.Quantity > 0)
                            {
                                //xu ly create service voucher
                                for (int i = 0; i < item.Quantity; i++)
                                {
                                    Service s = ExcuteData_Main<Service>.GetById(item.ItemID);
                                    if (s != null)
                                    {
                                        if (s.VoucherExpiryPeriod == nameof(Resources.Enum.months_1))
                                        {
                                            item.VoucherExpiryDate = DateTime.Today.AddMonths(1);
                                        }
                                        else if (s.VoucherExpiryPeriod == nameof(Resources.Enum.months_2))
                                        {
                                            item.VoucherExpiryDate = DateTime.Today.AddMonths(2);
                                        }
                                        else if (s.VoucherExpiryPeriod == nameof(Resources.Enum.months_3))
                                        {
                                            item.VoucherExpiryDate = DateTime.Today.AddMonths(3);
                                        }
                                        else if (s.VoucherExpiryPeriod == nameof(Resources.Enum.months_6))
                                        {
                                            item.VoucherExpiryDate = DateTime.Today.AddMonths(6);
                                        }
                                        else if (s.VoucherExpiryPeriod == nameof(Resources.Enum.years_1))
                                        {
                                            item.VoucherExpiryDate = DateTime.Today.AddMonths(12);
                                        }
                                        Voucher v = new Voucher
                                        {
                                            BusinessID = u.BusinessID,
                                            ClientID = entity.ClientID,
                                            ClientName = entity.ClientName,
                                            CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone),
                                            Duration = item.Duration,
                                            ServiceID = item.ItemID,
                                            ExpireDate = item.VoucherExpiryDate,
                                            InvoiceID = entity.InvoiceID,
                                            IssueDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone).Date,
                                            Redeemed = 0,
                                            Remaining = item.Price,
                                            Total = item.Price,
                                            UserCreate = u.UserID,
                                            VoucherCode = "V" + RandomString(7),
                                            VoucherStatus = (entity.InvoiceStatus == nameof(Resources.Enum.invoice_status_unpaid) || entity.InvoiceStatus == nameof(Resources.Enum.invoice_status_part_paid)) ? nameof(Resources.Enum.voucher_status_unpaid) : nameof(Resources.Enum.voucher_status_valid),
                                            VoucherType = nameof(Resources.Enum.voucher_type_service_voucher),
                                            InvoiceDetailID = item.InvoiceDetailID
                                        };
                                        ExcuteData_Main<Voucher>.Insert(v);
                                    }
                                }
                            }
                        }
                        //refund
                        //update has refund org invoice
                        if (entity.RefundInvoiceID != null)
                        {
                            Invoice orgIV = ExcuteData_Main<Invoice>.GetById(entity.RefundInvoiceID);
                            if (orgIV != null)
                            {
                                orgIV.HasRefund = true;
                                orgIV.RefInvoiceID = entity.InvoiceID;
                                ExcuteData_Main<Invoice>.Update(orgIV);
                            }
                        }
                        scope.Complete();
                    }
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully.", InvoiceID = entity.InvoiceID }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult Pay(List<InvoicePayment> InvoicePayments, long InvoiceID, string InvoiceStatus)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                Business b = (Business)System.Web.HttpContext.Current.Session["Business"];
                Currency currency = ExcuteData_Main<Currency>.Single(n => n.CurrencyCode == b.CurrencyCode);
                Invoice entity = ExcuteData_Main<Invoice>.Find(n => n.BusinessID == u.BusinessID && n.InvoiceID == InvoiceID).FirstOrDefault();
                if (entity != null)
                {
                    using (TransactionScope scope = new TransactionScope())
                    {
                        TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                        decimal TotalPayment = 0;
                        if (InvoicePayments != null && InvoicePayments.Count > 0)
                        {
                            foreach (var item in InvoicePayments)
                            {
                                item.InvoiceID = entity.InvoiceID;
                                item.BusinessID = u.BusinessID;
                                item.PaymentDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                                TotalPayment = TotalPayment + item.PaymentAmount;
                                //xu ly redeem voucher
                                if (item.VoucherID != 0)
                                {
                                    Voucher vc = ExcuteData_Main<Voucher>.Find(n => n.BusinessID == u.BusinessID && n.VoucherID == item.VoucherID).FirstOrDefault();
                                    if (vc != null)
                                    {
                                        vc.Redeemed = vc.Redeemed + item.PaymentAmount;
                                        vc.Remaining = vc.Total - vc.Redeemed;
                                        if (vc.Remaining == 0)
                                        {
                                            vc.VoucherStatus = nameof(Resources.Enum.voucher_status_redeemed);
                                            vc.RedeemedDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone).Date;
                                            vc.RedeemedInvoiceID = entity.InvoiceID;
                                        }
                                        ExcuteData_Main<Voucher>.Update(vc);
                                    }
                                }
                            }
                            ExcuteData_Main<InvoicePayment>.Insert(InvoicePayments);
                        }
                        entity.InvoiceStatus = InvoiceStatus;
                        entity.UserModify = u.UserID;
                        entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        entity.TotalPayment = entity.TotalPayment + TotalPayment;
                        entity.Balance = (entity.TotalWithTip - entity.TotalPayment) < 0 ? 0 : (entity.TotalWithTip - entity.TotalPayment);
                        entity.Change = (entity.TotalWithTip - entity.TotalPayment) < 0 ? -(entity.TotalWithTip - entity.TotalPayment) : 0;
                        ExcuteData_Main<Invoice>.Update(entity);
                        scope.Complete();
                    }
                    return Json(new { Result = true, ErrorMessage = "Data saved successfully.", InvoiceID = entity.InvoiceID }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { Result = false, ErrorMessage = "Not found invoice" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }


        private static Random random = new Random();
        public string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        [HttpPost]
        public JsonResult GetAppointmentBaseId(long AppointmentID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            Appointment a = ExcuteData_Appointment.Find(n => n.BusinessID == BusinessID && n.AppointmentID == AppointmentID).FirstOrDefault();
            return Json(new
            {
                Appointment = new { Id = a.AppointmentID, ScheduledDate = a.ScheduledDate.ToString("yyyy-MM-dd"), a.ClientID, a.ClientName, a.LocationID, a.TotalAmount, a.TotalTimeInMinutes, a.Status, a.FrequencyType, a.RepeatCount, a.EndRepeat, a.Notes },
                Client = a.ClientID != null ? ExcuteData_Client.GetById(a.ClientID) : null,
                AppointmentServices = ExcuteData_Main<V_APPOINTMENT_SERVICE>.Find(n => n.AppointmentID == AppointmentID).ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetInvoiceBaseId(long InvoiceID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            V_INVOICE i = ExcuteData_Main<V_INVOICE>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == InvoiceID).FirstOrDefault();
            List<V_INVOICE_DETAIL> lst = ExcuteData_Main<V_INVOICE_DETAIL>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == InvoiceID).ToList();
            List<V_INVOICE_PAYMENT> lstP = ExcuteData_Main<V_INVOICE_PAYMENT>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == InvoiceID).ToList();
            V_CLIENT c = ExcuteData_Main<V_CLIENT>.Find(n => n.BusinessID == BusinessID && n.ClientID == i.ClientID).FirstOrDefault();
            Location l = ExcuteData_Main<Location>.Find(n => n.BusinessID == BusinessID && n.LocationID == i.LocationID).FirstOrDefault();
            V_INVOICE refund = null;
            V_INVOICE orgInvoice = null;
            if (i.RefInvoiceID != null)
            {
                refund = ExcuteData_Main<V_INVOICE>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == i.RefInvoiceID).FirstOrDefault();
            }
            if (i.RefundInvoiceID != null)
            {
                orgInvoice = ExcuteData_Main<V_INVOICE>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == i.RefundInvoiceID).FirstOrDefault();
            }
            return Json(new
            {
                Invoice = i,
                InvoiceDetail = lst,
                InvoicePayment = lstP,
                Client = c,
                Refund = refund,
                OrgInvoice = orgInvoice,
                Location = l
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult VoidInvoice(long InvoiceID)
        {
            try
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    User u = (User)Session["AccountLogin"] ?? new Models.User();
                    long BusinessID = ((Business)Session["Business"]).BusinessID;
                    Invoice i = ExcuteData_Main<Invoice>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == InvoiceID).FirstOrDefault();
                    List<InvoiceDetail> lst = ExcuteData_Main<InvoiceDetail>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == InvoiceID).ToList();
                    List<InvoicePayment> lstP = ExcuteData_Main<InvoicePayment>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == InvoiceID).ToList();
                    List<InvoiceTip> lstTip = ExcuteData_Main<InvoiceTip>.Find(n => n.BusinessID == BusinessID && n.InvoiceID == InvoiceID).ToList();
                    TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                    //delete invoice detail
                    foreach (var item in lst)
                    {
                        if (item.ItemType == nameof(Resources.Enum.item_type_product))
                        {
                            //xu ly stock in
                            Product pro = ExcuteData_Main<Product>.GetById(item.ItemID);
                            if (pro.EnableStockControl)
                            {
                                ProductStockMovement psm = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.InvoiceID == i.InvoiceID && n.InvoiceDetailID == item.InvoiceDetailID).FirstOrDefault();
                                if (psm != null)
                                {
                                    //update lai null khong co link voi invoice
                                    psm.InvoiceID = null;
                                    psm.InvoiceDetailID = null;
                                    ExcuteData_Main<ProductStockMovement>.Update(psm);

                                    var oldOnHand = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == item.ItemID).Sum(n => n.Adjustment);
                                    var oldOnHandCost = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == item.ItemID).Sum(n => n.AdjustmentCost);
                                    if (i.InvoiceType == nameof(Resources.Enum.invoice_type_sale))
                                    {
                                        psm.ProductStockMovementID = 0;
                                        psm.TransactionTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                                        psm.UserCreate = u.UserID;
                                        psm.Action = nameof(Resources.Enum.stock_return);
                                        psm.CostPrice = psm.CostPrice;
                                        psm.AdjustmentCost = Math.Abs(psm.AdjustmentCost);
                                        psm.OnHand = oldOnHand + item.Quantity;
                                        psm.OnHandCost = oldOnHandCost + psm.AdjustmentCost;
                                        psm.Adjustment = item.Quantity;
                                        psm.StockType = "I";
                                    }
                                    else
                                    {
                                        psm.ProductStockMovementID = 0;
                                        psm.TransactionTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                                        psm.UserCreate = u.UserID;
                                        psm.Action = nameof(Resources.Enum.stock_return);
                                        psm.CostPrice = Math.Abs(psm.CostPrice);
                                        psm.AdjustmentCost = -Math.Abs(psm.AdjustmentCost);
                                        psm.OnHand = oldOnHand - Math.Abs(item.Quantity);
                                        psm.OnHandCost = oldOnHandCost - Math.Abs(psm.AdjustmentCost);
                                        psm.Adjustment = -Math.Abs(item.Quantity);
                                        psm.StockType = "O";
                                    }
                                    psm.RefNo = i.InvoiceNo;
                                    ExcuteData_Main<ProductStockMovement>.Insert(psm);
                                }
                            }
                        }
                        //xu ly neu co voucher
                        List<Voucher> lstv = ExcuteData_Main<Voucher>.Find(n => n.BusinessID == u.BusinessID && n.InvoiceID == i.InvoiceID && n.InvoiceDetailID == item.InvoiceDetailID).ToList();
                        if (lstv != null)
                        {
                            foreach (var item1 in lstv)
                            {
                                if (i.InvoiceType == nameof(Resources.Enum.invoice_type_sale))
                                {
                                    ExcuteData_Main<Voucher>.Delete(item1);
                                }
                                else
                                {
                                    //khong delete ma update lai invoice id
                                    item1.InvoiceID = Convert.ToInt64(item1.OldInvoiceID);
                                    item1.InvoiceDetailID = item1.OldInvoiceDetailID;
                                    item1.OldInvoiceID = null;
                                    item1.OldInvoiceDetailID = null;
                                    item1.VoucherStatus = nameof(Resources.Enum.voucher_status_valid);
                                    ExcuteData_Main<Voucher>.Update(item1);
                                }
                            }
                        }
                        //delete detail
                        ExcuteData_Main<InvoiceDetail>.Delete(item);
                    }
                    //delete invoice payment
                    foreach (var item in lstP)
                    {
                        ExcuteData_Main<InvoicePayment>.Delete(item);
                    }

                    //delete invoice tip
                    foreach (var item in lstTip)
                    {
                        ExcuteData_Main<InvoiceTip>.Delete(item);
                    }
                    //revert invoice org
                    //refund
                    //update has refund org invoice
                    if (i.RefundInvoiceID != null)
                    {
                        Invoice orgIV = ExcuteData_Main<Invoice>.GetById(i.RefundInvoiceID);
                        if (orgIV != null)
                        {
                            orgIV.HasRefund = false;
                            orgIV.RefInvoiceID = null;
                            ExcuteData_Main<Invoice>.Update(orgIV);
                        }
                    }

                    //update appointment neu co
                    if (i.AppointmentID != null && i.AppointmentID != 0)
                    {
                        Appointment ap = ExcuteData_Main<Appointment>.GetById(i.AppointmentID);
                        if(ap != null)
                        {
                            ap.InvoiceID = 0;
                            ap.Status = "New";
                            ExcuteData_Main<Appointment>.Update(ap);
                        }
                    }

                    //delete invoice
                    ExcuteData_Main<Invoice>.Delete(i);
                    scope.Complete();
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult SearchVoucherCode(string Search)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            return Json(new { Results = ExcuteData_Main<V_VOUCHER>.Find(n => n.BusinessID == BusinessID && n.VoucherCode == Search) }, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #endregion
    }
}