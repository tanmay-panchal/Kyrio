//#region Method Support
//#endregion
var table1;
$(function () {
    //#region Load data && setup control

    var loadTable1 = function () {
        table1 = $("#table1").InStallDatatable({
            "status": $("#formVouchers #status").val(),
        }, "/Reports/GetDataTableVouchers", [
            {
                "data": "IssueDateString", "name": "IssueDateString", "class": "text-left", "width": "10%", "render": function (data, type, row) {
                    return moment(data).format(Window.FormatDateWithDayOfWeekJS);
                }
            },
     {
         "data": "ExpireDateString", "name": "ExpireDateString", "width": "10%", "class": "text-left", "width": "10%", "render": function (data, type, row) {
             return moment(data).format(Window.FormatDateWithDayOfWeekJS);
         }
     },
            {
                "data": "InvoiceNo", "name": "InvoiceNo", "width": "10%", "class": "text-left", "render": function (data, type, row) {
                    return "<a id='linkInvoice' href='/Sale/Invoices?id=" + row.InvoiceID + "'>" + (data == null ? "" : data) + "</a>";
                }
            },
     {
         "data": "ClientName", "name": "ClientName", "width": "10%", "class": "text-left"
     },
     {
         "data": "VoucherType", "name": "VoucherType", "width": "10%", "class": "text-left", "render": function (data, type, row) {
             if (data == "voucher_type_gift_voucher") {
                 return Window.ResourcesEnum[data];
             }
             else {
                 return row.ServiceName + " (" + row.DurationName + ")"
             }

         }
     },
     {
         "data": "VoucherStatus", "name": "VoucherStatus", "width": "10%", "class": "text-left", "render": function (data, type, row) {
             var html = "";
             if (data == "voucher_status_unpaid") {
                 html = '<span class="badge badge-danger" style="width:90px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
             }
             else if (data == "voucher_status_valid") {
                 html = '<span class="badge badge-info" style="width:90px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
             }
             else if (data == "voucher_stattus_expired") {
                 html = '<span class="badge badge-warning" style="width:90px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
             }
             else {
                 html = '<span class="badge badge-light" style="width:90px">' + Window.ResourcesEnum[data].toUpperCase() + '</span>';
             }
             return html;
         }
     },
     {
         "data": "VoucherCode", "name": "VoucherCode", "width": "10%", "class": "text-left"
     },
      {
          "data": "Total", "name": "Total", "width": "10%", "class": "text-right", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
      {
          "data": "Redeemed", "name": "Redeemed", "width": "10%", "class": "text-right", "render": function (data, type, row) {
              return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
          }
      },
     {
         "data": "Remaining", "name": "Remaining", "width": "10%", "class": "text-right", "render": function (data, type, row) {
             return (Window.CurrencySymbol + $.number(data, Window.NumberDecimal, '.', ','));
         }
     },

        ], true, true, true, false, null, true, null, null, null, {
            language: {
                search: "",
                searchPlaceholder: "Code or Client",
                "info": "Displaying _START_ - _END_ of _TOTAL_ total voucher codes",
                "infoEmpty": "",
            }
        });

        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file-excel-o"></i>  Excel',
            extend: 'excelHtml5',
            isAutoWidth: false,
            isSTT: false,
            sheetName: "Vouchers",
            title: null,
            filename: "Vouchers",
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
                var arrayColWidth = [20, 20, 15, 20, 20, 15, 15, 15, 15, 15];
                //#region fill data header
                rowPos = functions.AddRow(["ISSUE DATE", "EXPIRY DATE", "INVOICE NO.", "CLIENT", "TYPE", "STATUS", "CODE", "TOTAL", "REDEEMED", "REMAINING"], rowPos);
                functions.MergeCells(rowPos, 0, 73);
                //#endregion

                //#region fill data to excel
                $.each(table1.rows().data(), function () {
                    var IssueDate = moment(this.IssueDate).format(Window.FormatDateWithDayOfWeekJS);
                    var ExpireDate = moment(this.ExpireDate).format(Window.FormatDateWithDayOfWeekJS);
                    var InvoiceNo = this.InvoiceNo;
                    var ClientName = this.ClientName;
                    var VoucherType = Window.ResourcesEnum[this.VoucherType];
                    var VoucherStatus = Window.ResourcesEnum[this.VoucherStatus];
                    var VoucherCode = this.VoucherCode;
                    var Total = $.number(this.Total, Window.NumberDecimal, '.', ',');
                    var Redeemed = $.number(this.Redeemed, Window.NumberDecimal, '.', ',');
                    var Remaining = $.number(this.Remaining, Window.NumberDecimal, '.', ',');
                    rowPos = functions.AddRow([IssueDate, ExpireDate, InvoiceNo, ClientName, VoucherType, VoucherStatus, VoucherCode, Total, Redeemed, Remaining], rowPos);
                })

                //#endregion

                // Set column widths
                var cols = functions.CreateCellPos(rels, 'cols');
                $('worksheet', rels).prepend(cols);

                for (var i = 0, ien = 10 ; i < ien ; i++) {
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
        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i>  CSV',
            filename: "Vouchers",
            customize: function (output, config) {
                output = 'ISSUE DATE, EXPIRY DATE, INVOICE NO., CLIENT, TYPE, STATUS, CODE, TOTAL, REDEEMED, REMAINING\n';
                $.each(table1.rows().data(), function () {
                    var IssueDate = moment(this.IssueDate).format(Window.FormatDateWithDayOfWeekJS);
                    var ExpireDate = moment(this.ExpireDate).format(Window.FormatDateWithDayOfWeekJS);
                    var InvoiceNo = this.InvoiceNo;
                    var ClientName = this.ClientName;
                    var VoucherType = Window.ResourcesEnum[this.VoucherType];
                    var VoucherStatus = Window.ResourcesEnum[this.VoucherTypeVoucherStatus];
                    var VoucherCode = this.VoucherCode;
                    var Total = $.number(this.Total, Window.NumberDecimal, '.', ',');
                    var Redeemed = $.number(this.Redeemed, Window.NumberDecimal, '.', ',');
                    var Remaining = $.number(this.Remaining, Window.NumberDecimal, '.', ',');

                    output += '"' + IssueDate + '",'
                            + '"' + ExpireDate + '",'
                            + '"' + InvoiceNo + '",'
                            + '"' + ClientName + '",'
                            + '"' + VoucherType + '",'
                            + '"' + VoucherStatus + '",'
                            + '"' + VoucherCode + '",'
                            + '"' + Total + '",'
                            + '"' + Redeemed + '",'
                            + '"' + Remaining + '"\n';
                })

                return output;
            },
            extend: 'csvHtml5',
        }, '#buttonCSV');

        table1.CreateButtonExportExcel({
            className: 'btn-block',
            text: '<i class="fa fa-file"></i> PDF',
            title: "Vouchers",
            filename: "Vouchers",
            extend: 'pdfHtml5',
            download: "open",
            width: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
        }, '#buttonPDF');
    }

    var loaddata = function () {
        if ($.fn.DataTable.isDataTable('#table1'))
            table1.destroy();

        loadTable1();
        var text2 = "";

        var status = $("#formVouchers #status").val();
        if (status == null) {
            text2 += "All statuses";
        }
        else {
            if (status != "") {
                text2 += $("#formVouchers #status").val();
            }
            else {
                text2 += "All statuses";
            }
        }

        text2 = text2 + ", generated " + moment().tz(Window.TimeZone).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment().tz(Window.TimeZone).format(Window.FormatTimeJS);
        $("#formVouchers #txtfilter").text(text2);
    }
    loaddata();
    //#endregion

    //#region Event
    $("#formVouchers #btnView").click(function () {
        loaddata();
    })
    $(document).on("click", "#linkInvoice", function () {
        if (table1 != null) {
            localStorage.setItem("PreLink", "/Reports/Vouchers");
        }
    })
    //#endregion
})