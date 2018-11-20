var table;
var sumCols = {};
$(function () {
    CreateBreadcrumb([{ href: "/Reports/Reports", title: "Reports" }])
    $("#searchDate").daterangepicker({
        startDate: moment().tz(Window.TimeZone).startOf('month'),
        endDate: moment().tz(Window.TimeZone),
        ranges: {
            'Today': [moment().tz(Window.TimeZone), moment().tz(Window.TimeZone)],
            'Yesterday': [moment().tz(Window.TimeZone).subtract(1, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last 7 Days': [moment().tz(Window.TimeZone).subtract(7, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last 30 Days': [moment().tz(Window.TimeZone).subtract(30, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last 90 Days': [moment().tz(Window.TimeZone).subtract(90, 'days'), moment().tz(Window.TimeZone).subtract(1, 'days')],
            'Last Month': [moment().tz(Window.TimeZone).subtract(1, 'month').startOf('month'), moment().tz(Window.TimeZone).subtract(1, 'month').endOf('month')],
            'Last Year': [moment().tz(Window.TimeZone).subtract(1, 'years').startOf('years'), moment().tz(Window.TimeZone).subtract(1, 'years').endOf('years')],
            'Week to date': [moment().tz(Window.TimeZone).startOf('weeks'), moment().tz(Window.TimeZone)],
            'Month to date': [moment().tz(Window.TimeZone).startOf('month'), moment().tz(Window.TimeZone)],
            'Quarter to date': [moment().tz(Window.TimeZone).startOf('quarters'), moment().tz(Window.TimeZone)],
            'Year to date': [moment().tz(Window.TimeZone).startOf('years'), moment().tz(Window.TimeZone)],
            'All time': [moment('2018-01-01'), moment().tz(Window.TimeZone)]
        },
        locale: {
            "format": Window.FormatDateJS
        }
    });
    $("#formReport #LocationID").InStallSelect2('/Home/LoadSelect2ForLocation', 100, 'All Location', null, null, null, null, null, null, null, false);
    $("#formReport #StaffID").InStallSelect2('/Home/LoadSelect2ForUser', 100, 'All Staff', null, null, null, null, null, null, null, false);
    var loadTable = function () {
        table = $("#table").InStallDatatable({
            "LocationID": $("#formReport #LocationID").val(),
            "StaffID": $("#formReport #StaffID").val(),
            "IncludeVoucher": $("#formReport #IncludeVoucher").val(),
            "fromdate": $("#formReport #searchDate").data('daterangepicker').startDate.format("YYYY/MM/DD"),
            "todate": $("#formReport #searchDate").data('daterangepicker').endDate.format("YYYY/MM/DD"),
        }, "/Reports/GetDataTableSalesLog", [
       {
           "data": "InvoiceDate", "name": "InvoiceDate", "class": "text-left", "width": "30%", "render": function (data, type, row) {
               return moment(data).format(Window.FormatDateWithTimeJS);
       }
       },
       {
           "data": "LocationName", "name": "LocationName", "width": "30%", "class": "text-left"
       },
       {
           "data": "InvoiceNo", "name": "InvoiceNo", "width": "5%", "class": "text-left"
       },
       {
           "data": "ItemName", "name": "ItemName", "width": "20%", "class": "text-left"
       },
       {
           "data": "Quantity", "name": "Quantity", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return ($.number(data, 0, '.', ','));;
            }
       },
        {
            "data": "GrossSales", "name": "GrossSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
            }
        },
         {
             "data": "DiscountAmount", "name": "DiscountAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                 return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
             }
         },
          {
              "data": "Refunds", "name": "Refunds", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                  return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
              }
          },
           {
               "data": "NetSales", "name": "NetSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                   return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
               }
           },
            {
                "data": "TaxAmount", "name": "TaxAmount", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                    return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
                }
            },
             {
                 "data": "TotalSales", "name": "TotalSales", "class": "text-right", "width": "10%", "render": function (data, type, row) {
                     return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));;
                 }
             },
  
        ], true, false, false, false, null, true, null, function (setting) {
            var api = this.api();
            if (api.rows().data().count() > 0) {
                var length = api.columns()[0].length;
                var html = "<tr><td colspan='4' class='text-center'><strong>Total</strong></td>";
                for (i = 4; i < length; ++i) {
                    var sum = this.api().column(i).data().sum();
                    sumCols[i] = sum;
                    if (i == 4) {
                        html += "<td class='text-right'><strong>" + ($.number(sum, 0, '.', ',')) + "</strong></td>";
                    }
                    else {
                        html += "<td class='text-right'><strong>" + Window.CurrencySymbol + ($.number(sum, Window.NumberDecimal, '.', ',')) + "</strong></td>";
                    }
                }
               html += "</tr>";
               $(html).insertAfter($(this[0]).find("tr:last"));
               
            }
        });

        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Sales log",
            title: null,
            filename: "Sales log",
            ArrayColWidth: [25],
            exportOptions: {
                columns: [1],
                modifier: {
                    page: 'current'
                },
                orthogonal: "export",
                trim: false
            },
            methodCustomeAll: function (data, functions, rels, rowPos) {
                var arrayColWidth = [20, 20, 10, 20, 10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];
                //#region fill data header

                rowPos = functions.AddRow(["Invoice Date", "Location", "Invoice No", "Invoice Status", "Client Name ", "Mobile Number","Channel","Staff","Invoice Type","Item","Item Type","Bardcode","SKU","Category","Brand","Cost Price","Gross Sales", "Discounts","Discount Type", "Refunds", "Net Sales","Total Sales","Payment Method"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion
                //#region fill data to excel
             
                $.each(table.rows().data(), function () {
                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithTimeJS);
                    var LocationName = this.LocationName;
                    var InvoiceNo = this.InvoiceNo;
                    var InvoiceStatus = (Window.ResourcesEnum[this.InvoiceStatus]);
                    var ClientName = this.ClientName;
                    var MobileNumber = this.MobileNumber;
                    var Channel = (Window.ResourcesEnum[this.Channel]);
                    var Staff = this.Staff;
                    var InvoiceType = (Window.ResourcesEnum[this.InvoiceType]);
                    var ItemName = this.ItemName;
                    var ItemType = (Window.ResourcesEnum[this.ItemType]);
                    var Barcode = this.Barcode;
                    var SKU = this.SKU;
                    var CategoryName = this.CategoryName;
                    var BrandName = this.BrandName;
                    var CostPrice = $.number(this.CostPrice, Window.NumberDecimal, '.', ',');;
                    var GrossSales = $.number(this.GrossSales, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountType = this.DiscountType;
                    var Refunds = $.number(this.Refunds, Window.NumberDecimal, '.', ',');
                    var NetSales = $.number(this.NetSales, Window.NumberDecimal, '.', ',');
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');
                    var PaymentTypeName = this.PaymentTypeName;
                    
                    rowPos = functions.AddRow([InvoiceDate,LocationName,InvoiceNo,InvoiceStatus,ClientName,MobileNumber,Channel,Staff,InvoiceType,ItemName,ItemType,Barcode,SKU,CategoryName,BrandName,CostPrice,GrossSales,DiscountAmount,DiscountType,Refunds,NetSales,TotalSales,PaymentTypeName], rowPos);
                })
               
                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 23 ; i < ien ; i++) {
                    cols.appendChild(functions.CreateCellPos(rels, 'col', {
                        attr: {
                            min: i + 1,
                            max: i + 1,
                            width: arrayColWidth[i],
                            customWidth: 1,
                        }
                    }));
                }

            },
        }, '#buttonExcel');
        table.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Sales Log",
            customize: function (output, config) {
                output = ' Invoice Date, Location, Invoice No, Invoice Status, Client Name, Mobile Number, Channel, Staff, Invoice Type, Item, Item Type, Bardcode, SKU, Category, Brand, Cost Price, Gross Sales, Discounts, Discount Type, Refunds, Net Sales, Total Sales, Payment Method\n';

                $.each(table.rows().data(), function () {

                    var InvoiceDate = moment(this.InvoiceDate).format(Window.FormatDateWithTimeJS);
                    var LocationName = this.LocationName;
                    var InvoiceNo = this.InvoiceNo;
                    var InvoiceStatus = (Window.ResourcesEnum[this.InvoiceStatus]);
                    var ClientName = this.ClientName;
                    var MobileNumber = this.MobileNumber;
                    var Channel = (Window.ResourcesEnum[this.Channel]);
                    var Staff = this.Staff;
                    var InvoiceType = (Window.ResourcesEnum[this.InvoiceType]);
                    var ItemName = this.ItemName;
                    var ItemType = (Window.ResourcesEnum[this.ItemType]);
                    var Barcode = this.Barcode;
                    var SKU = this.SKU;
                    var CategoryName = this.CategoryName;
                    var BrandName = this.BrandName;
                    var CostPrice = $.number(this.CostPrice, Window.NumberDecimal, '.', ',');;
                    var GrossSales = $.number(this.GrossSales, Window.NumberDecimal, '.', ',');
                    var DiscountAmount = $.number(this.DiscountAmount, Window.NumberDecimal, '.', ',');
                    var DiscountType = this.DiscountType;
                    var Refunds = $.number(this.Refunds, Window.NumberDecimal, '.', ',');
                    var NetSales = $.number(this.NetSales, Window.NumberDecimal, '.', ',');
                    var TotalSales = $.number(this.TotalSales, Window.NumberDecimal, '.', ',');
                    var PaymentTypeName = this.PaymentTypeName;


                    output += '"' + InvoiceDate + '",'
                            + '"' + LocationName + '",'
                            + '"' + InvoiceNo + '",'
                            + '"' + InvoiceStatus + '",'
                            + '"' + ClientName + '",'
                            + '"' + MobileNumber + '",'
                            + '"' + Channel + '",'
                            + '"' + Staff+ '",'
                            + '"' + InvoiceType + '",'
                            + '"' + ItemName + '",'
                            + '"' + ItemType + '",'
                            + '"' + Barcode + '",'
                            + '"' + SKU + '",'
                            + '"' + CategoryName + '",'
                            + '"' + BrandName + '",'
                            + '"' + CostPrice + '",'
                            + '"' + GrossSales + '",'
                            + '"' + DiscountAmount + '",'
                            + '"' + DiscountType + '",'
                            + '"' + Refunds + '",'
                            + '"' + NetSales + '",'
                            + '"' + TotalSales + '",'
                            + '"' + PaymentTypeName + '"\n';
                })
               

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');
       
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table'))
            table.destroy();
        loadTable();
    }
    loaddata();
    $("#formReport #btnView").click(function () {
        loaddata();
    })
})