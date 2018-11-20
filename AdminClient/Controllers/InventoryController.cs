using AdminClient.Models;
using AdminClient.Models.ExcuteData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Linq.Expressions;
using System.Transactions;

namespace AdminClient.Controllers.Global
{
    public class InventoryController : Controller
    {
        #region Load Page
        [CheckPermision]
        public ActionResult Inventory()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                return View("/Views/Inventory/Inventory.cshtml", 1);
            }
            return View("NotFound");
        }

        [CheckPermision]
        public ActionResult Products(long id)
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                Product p = ExcuteData_Main<Product>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == id).FirstOrDefault();
                if (p == null)
                    return View("/Views/Inventory/Inventory.cshtml", 1);
                else
                {
                    ViewBag.ProductID = p.ProductID;
                    ViewBag.ProductName = p.ProductName;
                    ViewBag.Barcode = p.Barcode;
                    ViewBag.SKU = p.SKU;
                    ViewBag.Brand = "";
                    Brand b = ExcuteData_Main<Brand>.Find(n => n.BusinessID == u.BusinessID && n.BrandID == p.BrandID).FirstOrDefault();
                    if (b != null)
                    {
                        ViewBag.Brand = b.BrandName;
                    }
                    ViewBag.Category = "";
                    Category c = ExcuteData_Main<Category>.Find(n => n.BusinessID == u.BusinessID && n.CategoryID == p.CategoryID).FirstOrDefault();
                    if (c != null)
                    {
                        ViewBag.Category = c.CategoryName;
                    }
                    ViewBag.Supplier = "";
                    Supplier s = ExcuteData_Main<Supplier>.Find(n => n.BusinessID == u.BusinessID && n.SupplierID == p.SupplierID).FirstOrDefault();
                    if (s != null)
                    {
                        ViewBag.Supplier = s.SupplierName;
                    }
                    ViewBag.RetailPrice = p.RetailPrice;
                    ViewBag.SpecialPrice = p.SpecialPrice;
                    ViewBag.SupplyPrice = p.SupplyPrice;
                    ViewBag.TotalOnHand = 0;
                    ViewBag.TotalStockCost = 0;
                    ViewBag.AvgStockCost = 0;
                    ProductStockMovement psm = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == p.ProductID).OrderByDescending(n => n.TransactionTime).FirstOrDefault();
                    if (psm != null)
                    {
                        ViewBag.TotalOnHand = psm.OnHand;
                        ViewBag.TotalStockCost = psm.OnHandCost;
                        ViewBag.AvgStockCost = (psm.OnHand == 0 || psm.OnHandCost == 0) ? 0 : psm.OnHandCost / psm.OnHand;
                    }
                    return View("/Views/Inventory/Inventory.cshtml", 6);
                }
            }
            else
            {
                return View("NotFound");
            }
        }

        [CheckPermision]
        public ActionResult Orders()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                return View("/Views/Inventory/Inventory.cshtml", 2);
            }
            else
                return View("NotFound");
        }

        [CheckPermision]
        public ActionResult NewOrder()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                return View("/Views/Inventory/AddOrder.cshtml");
            }
            else
                return View("NotFound");
        }

        [CheckPermision]
        public ActionResult NewTransfer()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                return View("/Views/Inventory/AddTransfer.cshtml");
            }
            else
            {
                return View("NotFound");
            }
        }

        [CheckPermision]
        public ActionResult ViewOrder(long id)
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                V_ORDER order = ExcuteData_Main<V_ORDER>.Find(n => n.BusinessID == u.BusinessID && n.OrderID == id).FirstOrDefault();
                if (order != null)
                {
                    ViewBag.OrderID = id;
                    if (order.OrderType == nameof(Resources.Enum.order_type_order))
                    {
                        return View("/Views/Inventory/AddOrder.cshtml");
                    }
                    else
                    {
                        return View("/Views/Inventory/AddTransfer.cshtml");
                    }
                }
                else
                {
                    ViewBag.OrderID = 0;
                    return View("/Views/Inventory/Orders.cshtml");
                }
            }
            else
            {
                return View("NotFound");
            }
        }

        [CheckPermision]
        public ActionResult Brands()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                return View("/Views/Inventory/Inventory.cshtml", 3);
            }
            else
            {
                return View("NotFound");
            }
        }

        [CheckPermision]
        public ActionResult Categories()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                return View("/Views/Inventory/Inventory.cshtml", 4);
            }
            else
            {
                return View("NoutFound");
            }
        }

        [CheckPermision]
        public ActionResult Suppliers()
        {
            if (CheckPermision.CheckPermissionFunction(nameof(Resources.Function.products)))
            {
                return View("/Views/Inventory/Inventory.cshtml", 5);
            }
            else
            {
                return View("NoutFound");
            }
        }
        #endregion

        #region Ajax
        #region Product
        [HttpPost]
        public JsonResult GetDataTableProduct()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            var sortColumn = Request.Form.GetValues("columns[" + (orderColumn == 0 ? 1 : orderColumn) + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];

            int CategoryID = 0;
            if (Request.Form.GetValues("CategoryID")[0] != null)
            {
                if (Request.Form.GetValues("CategoryID")[0] != "")
                {
                    CategoryID = Convert.ToInt32(Request.Form.GetValues("CategoryID")[0]);
                }
            }
            int BrandID = 0;
            if (Request.Form.GetValues("BrandID")[0] != null)
            {
                if (Request.Form.GetValues("BrandID")[0] != "")
                {
                    BrandID = Convert.ToInt32(Request.Form.GetValues("BrandID")[0]);
                }
            }
            int SupplierID = 0;
            if (Request.Form.GetValues("SupplierID")[0] != null)
            {
                if (Request.Form.GetValues("SupplierID")[0] != "")
                {
                    SupplierID = Convert.ToInt32(Request.Form.GetValues("SupplierID")[0]);
                }
            }

            Expression<Func<V_PRODUCT_BUSINESS, bool>> queryWhere = n => n.BusinessID == u.BusinessID && (n.BrandID == (BrandID == 0 ? n.BrandID : BrandID)) && (n.CategoryID == (CategoryID == 0 ? n.CategoryID : CategoryID)) && (n.SupplierID == (SupplierID == 0 ? n.SupplierID : SupplierID)) && (n.ProductName.Contains(search) || n.Barcode.Contains(search) || n.SKU.Contains(search));
            long countData = ExcuteData_Main<V_PRODUCT_BUSINESS>.Count(queryWhere);
            List<V_PRODUCT_BUSINESS> lst = ExcuteData_Main<V_PRODUCT_BUSINESS>.SelectWithPaging(queryWhere, start, length, sortColumn, (sortColumnDir.ToLower() != "asc"));
            return Json(new { data = lst, recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveProduct(Product entity, List<ProductLocation> ProductLocations, Boolean isUpdate)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));

                if (entity.TaxID != 0 && entity.TaxID != null)
                    entity.TaxRate = ExcuteData_Main<Tax>.GetById(entity.TaxID).TaxRate;
                if (isUpdate)
                {
                    using (TransactionScope scope = new TransactionScope())
                    {
                        Product entityOld = ExcuteData_Main<Product>.GetById(entity.ProductID);
                        if (entityOld.BusinessID != u.BusinessID)
                            throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                        //update data from entity old
                        entity.UserCreate = entityOld.UserCreate;
                        entity.CreateDate = entityOld.CreateDate;
                        entity.BusinessID = entityOld.BusinessID;
                        //create datetime and user modify
                        entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        entity.UserModify = u.UserID;

                        ExcuteData_Main<Product>.Update(entity);
                        if (entity.EnableStockControl)
                        {
                            foreach (var item in ProductLocations)
                            {
                                item.BusinessID = u.BusinessID;
                                item.ProductID = entity.ProductID;
                            }
                            //xoa truoc khi them vao
                            ExcuteData_Main<ProductLocation>.ExecuteSqlCommand("Delete from TBL_PRODUCT_LOCATION where BusinessID = " + u.BusinessID.ToString() + " and ProductID = " + entity.ProductID.ToString(), new object[] { });
                            //them vao lai
                            ExcuteData_Main<ProductLocation>.Insert(ProductLocations);
                        }
                        else
                        {
                            //xoa di vi khong control stock
                            ExcuteData_Main<ProductLocation>.ExecuteSqlCommand("Delete from TBL_PRODUCT_LOCATION where BusinessID = " + u.BusinessID.ToString() + " and ProductID = " + entity.ProductID.ToString(), new object[] { });
                        }

                        scope.Complete();
                    }
                }
                else
                {
                    using (TransactionScope scope = new TransactionScope())
                    {
                        entity.UserCreate = u.UserID;
                        entity.BusinessID = u.BusinessID;
                        entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        ExcuteData_Main<Product>.Insert(entity);
                        if (entity.EnableStockControl)
                        {
                            foreach (var item in ProductLocations)
                            {
                                item.BusinessID = u.BusinessID;
                                item.ProductID = entity.ProductID;
                            }
                            ExcuteData_Main<ProductLocation>.Insert(ProductLocations);
                            //insert InitialStock
                            int onhand = 0;
                            foreach (var item in ProductLocations)
                            {
                                if (item.InitialStock > 0)
                                {
                                    onhand = onhand + item.InitialStock;
                                    ProductStockMovement psm = new ProductStockMovement
                                    {
                                        Action = nameof(Resources.Enum.stock_new_stock),
                                        Adjustment = item.InitialStock,
                                        AdjustmentCost = 0,
                                        BusinessID = u.BusinessID,
                                        CostPrice = 0,
                                        LocationID = item.LocationID,
                                        OnHand = onhand,
                                        OnHandCost = 0,
                                        ProductID = item.ProductID,
                                        StockType = Library.Enum.STOCK_TYPE_IN,
                                        TransactionTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone),
                                        UserCreate = u.UserID
                                    };
                                    ExcuteData_Main<ProductStockMovement>.Insert(psm);
                                }
                            }
                        }

                        scope.Complete();
                    }
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult DeleteProduct(long id)
        {
            int errorStyle = 0;
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                List<OrderProduct> lst = ExcuteData_Main<OrderProduct>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == id).ToList();
                if (lst.Count > 0)
                {
                    errorStyle = 1;
                    throw new Exception("Can’t delete this product, because it using in order.");
                }

                List<InvoiceDetail> lst1 = ExcuteData_Main<InvoiceDetail>.Find(n => n.BusinessID == u.BusinessID && n.ItemID == id && n.ItemType == nameof(Resources.Enum.item_type_product)).ToList();
                if (lst1.Count > 0)
                {
                    errorStyle = 1;
                    throw new Exception("Can’t delete this product, because it using in invoice.");
                }
                using (TransactionScope scope = new TransactionScope())
                {
                    //delete product location
                    ExcuteData_Main<ProductLocation>.ExecuteSqlCommand("Delete from TBL_PRODUCT_LOCATION where BusinessID = " + u.BusinessID.ToString() + " and ProductID = " + id.ToString(), new object[] { });
                    ExcuteData_Main<Product>.Delete(id);
                    scope.Complete();
                }

                return Json(new { Result = true, ErrorMessage = "Delete data successfully", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult GetDataTableStockHistory(long ProductID)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            Expression<Func<V_PRODUCT_STOCK_MOVEMENT, bool>> queryWhere = n => n.BusinessID == u.BusinessID && n.ProductID == ProductID;
            List<V_PRODUCT_STOCK_MOVEMENT> lst = ExcuteData_Main<V_PRODUCT_STOCK_MOVEMENT>.SelectWithPaging(queryWhere, start, length, "TransactionTime", true);
            long countData = ExcuteData_Main<V_PRODUCT_STOCK_MOVEMENT>.Count(queryWhere);
            return Json(new { data = lst, recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetProductByID(long ID)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            return Json(new { data = ExcuteData_Main<Product>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == ID).FirstOrDefault(), ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetAllProduct()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            List<V_PRODUCT_BUSINESS> lst = ExcuteData_Main<V_PRODUCT_BUSINESS>.Find(n => n.BusinessID == u.BusinessID).OrderBy(n => n.ProductName).ToList();
            return Json(new { data = lst, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetProductLocationByProductID(long ProductID)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            return Json(new { data = ExcuteData_Main<V_PRODUCT>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == ProductID).ToList(), ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveStockMovement(long ProductID, long LocationID, int Quantity, string Action, string StockType, decimal SupplierPrice, Boolean SavePriceToNextTime)
        {
            int errorStyle = 0;
            try
            {
                using (TransactionScope scope = new TransactionScope())
                {
                    User u = (User)Session["AccountLogin"] ?? new Models.User();
                    Business b = (Business)System.Web.HttpContext.Current.Session["Business"];
                    Currency currency = ExcuteData_Main<Currency>.Single(n => n.CurrencyCode == b.CurrencyCode);
                    TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));

                    ProductStockMovement psm = new ProductStockMovement();
                    psm.BusinessID = u.BusinessID;
                    psm.ProductID = ProductID;
                    psm.TransactionTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    psm.LocationID = LocationID;
                    psm.UserCreate = u.UserID;
                    psm.StockType = StockType;
                    psm.Action = Action;
                    var oldOnHand = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == ProductID).Sum(n => n.Adjustment);
                    var oldOnHandCost = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == ProductID).Sum(n => n.AdjustmentCost);
                    if (StockType == "O")
                    {
                        psm.Adjustment = -Quantity;
                        //tinh cost price out
                        var sumQuantity = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.LocationID == LocationID && n.ProductID == ProductID).Sum(n => n.Adjustment);
                        var sumCost = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.LocationID == LocationID && n.ProductID == ProductID).Sum(n => n.AdjustmentCost);
                        if (sumQuantity == 0 || sumCost == 0)
                        {
                            psm.CostPrice = 0;
                            psm.AdjustmentCost = 0;
                        }
                        else
                        {
                            psm.CostPrice = Math.Round((sumCost / sumQuantity), currency.NumberDecimal);
                            psm.AdjustmentCost = -Quantity * psm.CostPrice;
                        }
                        psm.OnHand = oldOnHand - Quantity;
                        psm.OnHandCost = oldOnHandCost + psm.AdjustmentCost; //+ vi da tru
                    }
                    else
                    {
                        psm.Adjustment = Quantity;
                        psm.CostPrice = SupplierPrice;
                        psm.AdjustmentCost = Quantity * SupplierPrice;
                        psm.OnHand = oldOnHand + Quantity;
                        psm.OnHandCost = oldOnHandCost + psm.AdjustmentCost;
                    }
                    ExcuteData_Main<ProductStockMovement>.Insert(psm);
                    if (SavePriceToNextTime)
                    {
                        Product p = ExcuteData_Main<Product>.GetById(ProductID);
                        if (p != null)
                        {
                            p.SupplyPrice = SupplierPrice;
                            ExcuteData_Main<Product>.Update(p);
                        }
                    }
                    scope.Complete();
                    return Json(new { Result = true, ErrorMessage = "Save data successfully", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult GetAllStockMovement(long ProductID)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            List<V_PRODUCT_STOCK_MOVEMENT> lst = ExcuteData_Main<V_PRODUCT_STOCK_MOVEMENT>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == ProductID).OrderByDescending(n => n.TransactionTime).ToList();
            return Json(new { data = lst, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetProductStockLocationByProductID(long ProductID)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();

            List<Location> lstL = ExcuteData_Main<Location>.Find(n => n.BusinessID == u.BusinessID).ToList();
            List<ProductLocation> lst = ExcuteData_Main<ProductLocation>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == ProductID).ToList();

            if (lst == null || lst.Count == 0)
            {
                foreach (var item in lstL)
                {
                    lst.Add(new ProductLocation { BusinessID = u.BusinessID, InitialStock = 0, LocationID = item.LocationID, ProductID = ProductID, ReorderPoint = 0, ReorderQty = 0 });
                }
            }
            var joined =
                (from a in lst
                 join b in lstL
                 on a.LocationID equals b.LocationID
                 select new { a.InitialStock, a.BusinessID, a.LocationID, a.ProductID, a.ReorderPoint, a.ReorderQty, b.LocationName }).ToList();
            return Json(new { data = joined, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Order
        [HttpPost]
        public JsonResult GetDataTableOrder()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            var search = Request.Form["search[value]"];

            int LocationID = 0;
            if (Request.Form.GetValues("LocationID")[0] != null)
            {
                if (Request.Form.GetValues("LocationID")[0] != "")
                {
                    LocationID = Convert.ToInt32(Request.Form.GetValues("LocationID")[0]);
                }
            }
            int SupplierID = 0;
            if (Request.Form.GetValues("SupplierID")[0] != null)
            {
                if (Request.Form.GetValues("SupplierID")[0] != "")
                {
                    SupplierID = Convert.ToInt32(Request.Form.GetValues("SupplierID")[0]);
                }
            }
            string OrderStatus = "";
            if (Request.Form.GetValues("OrderStatus")[0] != null)
            {
                if (Request.Form.GetValues("OrderStatus")[0] != "")
                {
                    OrderStatus = Convert.ToString(Request.Form.GetValues("OrderStatus")[0]);
                }
            }

            Expression<Func<V_ORDER, bool>> queryWhere = n => n.BusinessID == u.BusinessID && (n.LocationID == (LocationID == 0 ? n.LocationID : LocationID) || n.FromLocationID == (LocationID == 0 ? n.FromLocationID : LocationID)) && n.SupplierID == (SupplierID == 0 ? n.SupplierID : SupplierID) && n.OrderStatus == (OrderStatus == "" ? n.OrderStatus : OrderStatus) && (n.OrderNo.Contains(search));
            long countData = ExcuteData_Main<V_ORDER>.Count(queryWhere);
            List<V_ORDER> lst = ExcuteData_Main<V_ORDER>.SelectWithPaging(queryWhere, start, length, "CreateDate", true);

            return Json(new { data = lst, recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetAllOrder()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            List<V_ORDER> lst = ExcuteData_Main<V_ORDER>.Find(n => n.BusinessID == u.BusinessID).OrderByDescending(n => n.CreateDate).ToList();
            return Json(new { data = lst, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetProductBaseCategoryAndLocation(long CategoryID, long LocationID, string search)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            Expression<Func<V_PRODUCT, bool>> queryWhere = n => n.BusinessID == BusinessID && n.EnableStockControl == true && n.LocationID == LocationID && (n.CategoryID == (CategoryID == 0 ? n.CategoryID : CategoryID)) && (n.Barcode.Contains(search) || n.SKU.Contains(search) || n.ProductName.Contains(search) || n.Description.Contains(search));
            return Json(new { Result = ExcuteData_Main<V_PRODUCT>.Find(queryWhere) }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveOrder(Order entity, List<OrderProduct> OrderProducts, Boolean isUpdate)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                if (isUpdate)
                {
                    using (TransactionScope scope = new TransactionScope())
                    {
                        Order entityOld = ExcuteData_Main<Order>.GetById(entity.OrderID);
                        if (entityOld.BusinessID != u.BusinessID)
                            throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                        //update data from entity old
                        entity.UserCreate = entityOld.UserCreate;
                        entity.CreateDate = entityOld.CreateDate;
                        entity.BusinessID = entityOld.BusinessID;
                        //create datetime and user modify
                        entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        entity.UserModify = u.UserID;

                        ExcuteData_Main<Order>.Update(entity);
                        //xoa truoc khi them vao
                        ExcuteData_Main<OrderProduct>.ExecuteSqlCommand("Delete from TBL_ORDER_PRODUCT where BusinessID = " + u.BusinessID.ToString() + " and OrderID = " + entity.OrderID.ToString(), new object[] { });
                        //them vao lai
                        ExcuteData_Main<OrderProduct>.Insert(OrderProducts);

                        scope.Complete();
                    }
                }
                else
                {
                    using (TransactionScope scope = new TransactionScope())
                    {
                        int cout = ExcuteData_Main<Order>.Count(n => n.BusinessID == u.BusinessID && n.OrderType == entity.OrderType);

                        entity.UserCreate = u.UserID;
                        entity.BusinessID = u.BusinessID;
                        entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                        entity.OrderNo = (entity.OrderType == nameof(Resources.Enum.order_type_order) ? "P" : "T") + (cout + 1).ToString();
                        ExcuteData_Main<Order>.Insert(entity);
                        foreach (var item in OrderProducts)
                        {
                            item.BusinessID = u.BusinessID;
                            item.OrderID = entity.OrderID;
                        }
                        ExcuteData_Main<OrderProduct>.Insert(OrderProducts);

                        scope.Complete();
                    }
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully.", OrderID = entity.OrderID }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult ReceiveOrder(long OrderID, List<OrderProduct> OrderProducts)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
                using (TransactionScope scope = new TransactionScope())
                {
                    Order entityOld = ExcuteData_Main<Order>.GetById(OrderID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //create datetime and user modify
                    entityOld.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entityOld.UserModify = u.UserID;
                    entityOld.UserReceive = u.UserID;
                    entityOld.ReceiveDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entityOld.OrderStatus = nameof(Resources.Enum.order_status_received);
                    decimal TotalCost = 0;
                    foreach (var item in OrderProducts)
                    {
                        item.BusinessID = u.BusinessID;
                        TotalCost += item.TotalCost;
                        //Insert into ProductStockMovement
                        Product pro = ExcuteData_Main<Product>.GetById(item.ProductID);
                        if (pro != null && pro.EnableStockControl && item.ReceivedQuantity > 0)
                        {
                            ProductStockMovement psm = new ProductStockMovement();
                            psm.BusinessID = u.BusinessID;
                            psm.ProductID = item.ProductID;
                            psm.TransactionTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                            psm.UserCreate = u.UserID;
                            psm.OrderID = entityOld.OrderID;
                            var oldOnHand = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == item.ProductID).Sum(n => n.Adjustment);
                            var oldOnHandCost = ExcuteData_Main<ProductStockMovement>.Find(n => n.BusinessID == u.BusinessID && n.ProductID == item.ProductID).Sum(n => n.AdjustmentCost);
                            //out then in
                            if (entityOld.OrderType == nameof(Resources.Enum.order_type_transfer))
                            {
                                psm.Action = nameof(Resources.Enum.stock_transfer_decrease);
                                psm.LocationID = Convert.ToInt64(entityOld.FromLocationID);
                                psm.Adjustment = -item.ReceivedQuantity;
                                psm.CostPrice = item.SupplyPrice;
                                psm.AdjustmentCost = -item.TotalCost;
                                psm.OnHand = oldOnHand - item.ReceivedQuantity;
                                psm.OnHandCost = oldOnHandCost - item.TotalCost;
                                psm.StockType = "O";
                                ExcuteData_Main<ProductStockMovement>.Insert(psm);
                                psm.ProductStockMovementID = 0;
                                psm.TransactionTime = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                            }
                            psm.Action = nameof(Resources.Enum.stock_transfer);
                            psm.LocationID = entityOld.LocationID;
                            psm.StockType = "I";
                            psm.Adjustment = item.ReceivedQuantity;
                            psm.CostPrice = item.SupplyPrice;
                            psm.AdjustmentCost = item.ReceivedQuantity * item.SupplyPrice;
                            if (entityOld.OrderType == nameof(Resources.Enum.order_type_transfer))
                            {
                                psm.OnHand = oldOnHand;//ko cong lai vi giu nguyen
                                psm.OnHandCost = oldOnHandCost;
                            }
                            else
                            {
                                psm.OnHand = oldOnHand + item.ReceivedQuantity;
                                psm.OnHandCost = oldOnHandCost + psm.AdjustmentCost;
                            }

                            ExcuteData_Main<ProductStockMovement>.Insert(psm);
                        }
                    }
                    entityOld.TotalCost = TotalCost;
                    ExcuteData_Main<Order>.Update(entityOld);
                    ExcuteData_Main<OrderProduct>.Update(OrderProducts);

                    scope.Complete();
                }

                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }


        [HttpPost]
        public JsonResult GetOrderByOrderID(long OrderID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            V_ORDER order = ExcuteData_Main<V_ORDER>.Find(n => n.BusinessID == BusinessID && n.OrderID == OrderID).FirstOrDefault();
            return Json(new { Result = order }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetOrderDetailByOrderID(long OrderID)
        {
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            List<OrderProduct> lst = ExcuteData_Main<OrderProduct>.Find(n => n.BusinessID == BusinessID && n.OrderID == OrderID).ToList();
            List<Product> lstP = ExcuteData_Main<Product>.Find(n => n.BusinessID == BusinessID).ToList();
            var joined =
                (from a in lst
                 join b in lstP
                 on a.ProductID equals b.ProductID
                 select new { a.OrderProductID, a.OrderID, a.BusinessID, a.ProductID, a.Quantity, a.ReceivedQuantity, a.SupplyPrice, a.TotalCost, b.ProductName }).ToList();
            return Json(new { Result = joined }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CancelOrder(long OrderID)
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            long BusinessID = ((Business)Session["Business"]).BusinessID;
            Order o = ExcuteData_Main<Order>.Find(n => n.BusinessID == BusinessID && n.OrderID == OrderID).FirstOrDefault();
            TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));
            if (o != null)
            {
                o.OrderStatus = nameof(Resources.Enum.order_status_canceled);
                o.UserCancel = u.UserID;
                o.CancelDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                o.UserModify = u.UserID;
                o.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                ExcuteData_Main<Order>.Update(o);
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { Result = false, ErrorMessage = "Not found order." }, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

        #region Brand
        [HttpPost]
        public JsonResult GetDataTableBrand()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            var sortColumn = Request.Form.GetValues("columns[" + orderColumn + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];

            Expression<Func<Brand, bool>> queryWhere = n => n.BusinessID == u.BusinessID && (n.BrandName.Contains(search));
            long countData = ExcuteData_Main<Brand>.Count(queryWhere);
            List<Brand> lst = ExcuteData_Main<Brand>.SelectWithPaging(queryWhere, start, length, sortColumn, (sortColumnDir.ToLower() != "asc"));
            foreach (var item in lst)
            {
                item.ProductAssigned = ExcuteData_Main<Product>.Find(n => n.BusinessID == u.BusinessID && n.BrandID == item.BrandID).Count;
            }
            return Json(new { data = lst, recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveBrand(Brand entity, Boolean isUpdate)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));

                entity.ProductAssigned = 0;
                if (isUpdate)
                {
                    Brand entityOld = ExcuteData_Main<Brand>.GetById(entity.BrandID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.BusinessID = entityOld.BusinessID;
                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<Brand>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    ExcuteData_Main<Brand>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult DeleteBrand(long id)
        {
            int errorStyle = 0;
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                List<Product> lst = ExcuteData_Main<Product>.Find(n => n.BusinessID == u.BusinessID && n.BrandID == id).ToList();
                foreach (var item in lst)
                {
                    item.BrandID = null;
                }
                ExcuteData_Main<Product>.Update(lst);
                ExcuteData_Main<Brand>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "Delete data successfully", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        #endregion

        #region Category
        [HttpPost]
        public JsonResult GetDataTableCategory()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            var sortColumn = Request.Form.GetValues("columns[" + orderColumn + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];

            Expression<Func<Category, bool>> queryWhere = n => n.BusinessID == u.BusinessID && (n.CategoryName.Contains(search));
            long countData = ExcuteData_Main<Category>.Count(queryWhere);
            List<Category> lst = ExcuteData_Main<Category>.SelectWithPaging(queryWhere, start, length, sortColumn, (sortColumnDir.ToLower() != "asc"));
            foreach (var item in lst)
            {
                item.ProductAssigned = ExcuteData_Main<Product>.Find(n => n.BusinessID == u.BusinessID && n.CategoryID == item.CategoryID).Count;
            }
            return Json(new { data = lst, recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveCategory(Category entity, Boolean isUpdate)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));

                entity.ProductAssigned = 0;
                if (isUpdate)
                {
                    Category entityOld = ExcuteData_Main<Category>.GetById(entity.CategoryID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.BusinessID = entityOld.BusinessID;
                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<Category>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    ExcuteData_Main<Category>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult DeleteCategory(long id)
        {
            int errorStyle = 0;
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                List<Product> lst = ExcuteData_Main<Product>.Find(n => n.BusinessID == u.BusinessID && n.CategoryID == id).ToList();
                foreach (var item in lst)
                {
                    item.CategoryID = null;
                }
                ExcuteData_Main<Product>.Update(lst);

                ExcuteData_Main<Category>.Delete(id);
                return Json(new { Result = true, ErrorMessage = "Delete data successfully", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        #endregion

        #region Supplier
        [HttpPost]
        public JsonResult GetDataTableSupplier()
        {
            User u = (User)Session["AccountLogin"] ?? new Models.User();
            var draw = Request.Form.GetValues("draw").FirstOrDefault();
            int start = Convert.ToInt32(Request.Form.GetValues("start").FirstOrDefault() ?? "0");
            int length = Convert.ToInt32(Request.Form.GetValues("length").FirstOrDefault() ?? "0");
            int orderColumn = Convert.ToInt32(Request.Form.GetValues("order[0][column]").FirstOrDefault());
            var sortColumn = Request.Form.GetValues("columns[" + orderColumn + "][name]").FirstOrDefault();
            var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
            var search = Request.Form["search[value]"];

            Expression<Func<Supplier, bool>> queryWhere = n => n.BusinessID == u.BusinessID && (n.SupplierName.Contains(search));
            long countData = ExcuteData_Main<Supplier>.Count(queryWhere);
            List<Supplier> lst = ExcuteData_Main<Supplier>.SelectWithPaging(queryWhere, start, length, sortColumn, (sortColumnDir.ToLower() != "asc"));
            foreach (var item in lst)
            {
                item.ProductAssigned = ExcuteData_Main<Product>.Find(n => n.BusinessID == u.BusinessID && n.SupplierID == item.SupplierID).Count;
            }
            return Json(new { data = lst, recordsFiltered = countData, recordsTotal = countData, ErrorMessage = "", Error = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveSupplier(Supplier entity, Boolean isUpdate)
        {
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                TimeZoneInfo TargetTimeZone = TimeZoneInfo.FindSystemTimeZoneById(Convert.ToString(Session["TargetTimeZone"]));

                entity.ProductAssigned = 0;
                if (entity.SameAsPostalAddress)
                {
                    entity.PStreet = entity.Street;
                    entity.PSuburb = entity.Suburb;
                    entity.PCity = entity.City;
                    entity.PState = entity.State;
                    entity.PCountryID = entity.CountryID;
                }
                if (isUpdate)
                {
                    Supplier entityOld = ExcuteData_Main<Supplier>.GetById(entity.SupplierID);
                    if (entityOld.BusinessID != u.BusinessID)
                        throw new Exception("User không có quyền được sửa dữ liệu của người khác");

                    //update data from entity old
                    entity.UserCreate = entityOld.UserCreate;
                    entity.CreateDate = entityOld.CreateDate;
                    entity.BusinessID = entityOld.BusinessID;
                    //create datetime and user modify
                    entity.ModifyDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    entity.UserModify = u.UserID;

                    ExcuteData_Main<Supplier>.Update(entity);
                }
                else
                {
                    entity.UserCreate = u.UserID;
                    entity.BusinessID = u.BusinessID;
                    entity.CreateDate = TimeZoneInfo.ConvertTimeFromUtc(Convert.ToDateTime(DateTime.UtcNow), TargetTimeZone);
                    ExcuteData_Main<Supplier>.Insert(entity);
                }
                return Json(new { Result = true, ErrorMessage = "Data saved successfully." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message }, JsonRequestBehavior.AllowGet); }
        }

        [HttpPost]
        public JsonResult DeleteSupplier(long id)
        {
            int errorStyle = 0;
            try
            {
                User u = (User)Session["AccountLogin"] ?? new Models.User();
                List<Order> lst = ExcuteData_Main<Order>.Find(n => n.BusinessID == u.BusinessID && n.SupplierID == id && n.OrderStatus == nameof(Resources.Enum.order_status_ordered)).ToList();
                if (lst.Count > 0)
                {
                    errorStyle = 1;
                    throw new Exception("Can’t delete this supplier, because it using in order.");
                }
                else
                {
                    Supplier s = ExcuteData_Main<Supplier>.GetById(id);
                    s.IsDelete = true;
                    ExcuteData_Main<Supplier>.Update(s);
                }
                return Json(new { Result = true, ErrorMessage = "Delete data successfully", ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { return Json(new { Result = false, ErrorMessage = ex.Message, ErrorStyle = errorStyle }, JsonRequestBehavior.AllowGet); }
        }
        #endregion
        #endregion
    }
}