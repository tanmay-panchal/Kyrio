class ClientDetailDestop {
    constructor(clientId, showFooter) {
        this.ClientId = clientId;
        this.ShowFooter = showFooter;
    }
    LoadData() {
        var that = this;
        $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/Index.html", function (data) { that.DestopClientDetail = data; });
        $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/TabAppointments.html", function (data) { that.DestopTabAppointments = data; });
        $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/TabInfo.html", function (data) { that.DestopTabInfo = data; });
        $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/TabProducts.html", function (data) { that.DestopTabProducts = data; });
    }
    CreateClient(callback) {
        var that = this;
        if (!this.DestopClientDetail && !this.DestopTabAppointments && !this.DestopTabInfo && !this.DestopTabProducts)
            that.LoadData();
        $.RequestAjax("/Calendar/GetClientBaseIdForAppointment", JSON.stringify({ ClientId: that.ClientId }), function (data) {
            var Body;
            var IconNew = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#2883D2"></circle><path fill="#FFF" d="M13.3073393 6.6688549l-2.3327276-.1691103-.8803685-2.16361733C9.9102114 3.8884823 9.48246183 3.6 9 3.6c-.4824618 0-.91021143.2884823-1.09424324.73612727L7.02538834 6.4997446l-2.33272764.1691103c-.4824618.03481684-.88534226.35314215-1.03455725.81073477-.149215.45759264-.00497383.95497592.3630898 1.2683274l1.78560602 1.50707133-.5570693 2.2680678c-.08952898.3531422-.00994765.7212058.21387483 1.0047143.22382248.2884823.57199078.4575927.93010676.4575927.21884864 0 .43272346-.0596861.6217291-.1790581L9 12.5727946l1.9845593 1.2335105c.1890057.119372.4028805.1790581.6217292.1790581.3581159 0 .7062843-.1691104.9301067-.4575927.2238224-.2835085.3034038-.6515721.2138748-1.0047143l-.5570693-2.2680678 1.7856061-1.50707133c.3680636-.30837764.5123047-.80576093.3630897-1.2683274-.1492149-.45759262-.5570693-.77591793-1.0345572-.81073476zm-1.918745 2.9967374c-.2018798.16823322-.2859964.4374063-.2243108.6897561l.7065793 2.865572-2.50667456-1.5589609c-.22431087-.1401942-.50469953-.1401942-.72340268 0l-2.51228234 1.5701766.71218718-2.8823955c.0616855-.2523497-.0224311-.5215228-.22431092-.68975602L4.35644692 7.75334173l2.94408087-.21309538c.2579575-.01682332.4878762-.18505652.5888161-.42619075L8.999683 4.3830701l1.11594678 2.73659326c.10094.24113425.3252509.40936744.5888162.42619076l2.9440809.21309538-2.2599326 1.9066428z"></path></g></svg>';
            var IconArrived = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(3 3)" fill-rule="nonzero" fill="none"><circle fill="#F5A623" cx="9" cy="9" r="9"></circle><path d="M13.286214 7.815888l-.43317-.41247C12.70296 7.267806 12.52764 7.2 12.327507 7.2c-.204255 0-.377487.067815-.519984.2034l-2.807496 2.672622-2.80746-2.672532c-.142488-.135594-.315765-.2034-.51993-.2034-.200232 0-.375507.067806-.525636.2034l-.4275.41247c-.146357.13923-.2195.30609-.2195.5004 0 .197946.073224.362916.219492.494865l3.760578 3.57984C8.61876 12.530313 8.791983 12.6 9 12.6c.20412 0 .379368-.06966.5256-.208935l3.760596-3.57984c.142506-.135675.213804-.3006.213804-.494865.000018-.190683-.07128-.357444-.213786-.500472z" fill="#FFF"></path></g></svg>';
            var IconConfirmed = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#3093E8"></circle><path fill="#FFF" d="M13.184262 8.7361c.210582-.32027.315738-.672823.315738-1.057905 0-.445708-.163107-.832836-.48959-1.161997-.326643-.32882-.713404-.493195-1.160237-.493195H10.71574c.206204-.42832.309486-.843748.309486-1.246083 0-.506268-.075402-.908626-.225663-1.20719-.15042-.298654-.369603-.518178-.65753-.658867C9.854043 2.770243 9.529723 2.7 9.16879 2.7c-.219252 0-.412542.08004-.580118.240187-.184734.181698-.31795.415407-.39956.70099-.081656.285493-.147215.55921-.196587.820993-.049372.26176-.125722.44673-.2288.55489-.210606.229322-.440468.506313-.6897.83079-.433987.566758-.72837.902124-.882988 1.00601H4.425015c-.22774 0-.422204.081245-.583346.24337-.16108.162285-.24167.358076-.24167.58742v4.15368c0 .229343.0805.425066.24167.58735.16123.162285.3556.243484.58334.243484h1.85617c.09454 0 .39098.08652.88944.2596.52855.186086.9937.327752 1.39542.425137.40177.09739.80892.1461 1.22146.1461h.83143c.60583 0 1.0935-.17426 1.46308-.52261.369442-.34834.552144-.8232.5479-1.42462.25781-.33318.38669-.71826.38669-1.15522 0-.09513-.006344-.18815-.019303-.2791.16322-.28979.245035-.60133.245035-.93451-.00007-.15578-.01937-.30513-.058087-.44782zm-8.05668 2.979c-.081633.082154-.1783.12339-.290026.12339-.111747 0-.208437-.041214-.290092-.12339-.08161-.08213-.12245-.179515-.12245-.292108 0-.112478.04075-.209794.12245-.29204.081745-.08222.178345-.12332.290092-.12332.111726 0 .208393.0411.290026.12332.081655.082223.122493.17954.122493.29204 0 .112592-.040838.209977-.122493.292108zm7.40913-3.504404c-.092402.198997-.207378.300678-.344862.30495.06443.073585.118182.176448.161166.308294.042938.132005.064272.25203.064272.360258 0 .298405-.113712.555914-.341474.772187.077433.138393.11606.287743.11606.447754 0 .1601-.037543.31911-.112787.47701-.075108.15776-.17724.27137-.3061.34057.02147.12978.032126.25096.032126.36344 0 .72254-.41254 1.08382-1.237647 1.08382h-.77966c-.56303 0-1.297698-.15783-2.204436-.47376-.021514-.00864-.083732-.03144-.186923-.06815-.103192-.03672-.17943-.06379-.22887-.08104-.04944-.01744-.12457-.04231-.225617-.07468-.101024-.03253-.182566-.05636-.24492-.07143-.062262-.0151-.133216-.02917-.212636-.04217-.079466-.01298-.14717-.01944-.20302-.01944h-.206248v-4.1535h.206248c.068742 0 .145-.01953.2288-.05838.083778-.03896.169767-.09736.257833-.175265.088112-.07791.17076-.1547.248148-.23046.077366-.0757.163288-.17088.257856-.2855.09453-.11471.16864-.20661.22239-.27586.05369-.06922.12135-.15797.203-.26613.08161-.108137.13108-.17306.14825-.194724.2363-.294175.40173-.491035.49625-.5906.17618-.185994.304-.422886.38349-.71063.07958-.287787.14509-.5593.19648-.814536.05152-.25526.13327-.439207.24513-.55171.41241 0 .68749.101636.82495.30502.13744.20334.206207.517064.206207.941086 0 .25526-.103214.60247-.30951 1.04161-.206202.439184-.309235.784258-.309235 1.035197h2.268704c.215074 0 .406197.083245.573706.249917.167643.16656.25156.360148.25156.580877-.00007.151417-.04628.32668-.13866.52595z"></path></g></svg>';
            var IconStarted = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#0BC2B0"></circle><path fill="#FFF" d="M7.81588982 4.7137819L7.4034091 5.14695C7.26781586 5.2970585 7.2 5.4723775 7.2 5.672502c0 .2042521.06781587.377487.2034091.519988l2.67261173 2.80748975-2.6725347 2.8074696c-.13559322.14248073-.2034091.3157561-.2034091.51992724 0 .2002257.06781588.3755041.2034091.52563292l.41248074.4274827c.13923343.14636548.3060863.21950775.50040447.21950775.19793914 0 .36290447-.0732232.49485747-.21948753l3.5798344-3.76058527C12.5303159 9.3812301 12.6 9.2080154 12.6 9c0-.2041105-.0696649-.3793686-.2089368-.5255925L8.8112288 4.713802C8.67555856 4.5713011 8.5106125 4.5 8.31637135 4.5c-.19069723-.0000202-.35745378.0712808-.50048152.2137819z"></path></g></svg>';
            var IconNoShow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="#F33155" d="M12 3c-4.96246154 0-9 4.0371923-9 9s4.03753846 9 9 9c4.9624615 0 9-4.0371923 9-9s-4.0375385-9-9-9z"></path><path fill="#FFF" d="M15.9616618 13.3259828l-1.3960641-2.37770694 1.4093294-2.40051724c.0281341-.04794828.0295919-.10815517.0039359-.1575-.0258018-.04934483-.0744898-.0799138-.127551-.0799138H9.62837733V8H9v9h.76019354v-3.4137931H15.851312c.0835277 0 .148688-.0693621.148688-.1551724 0-.0405-.0145773-.0772759-.0383382-.1050517z"></path></g></svg>';
            var IconCompleted = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#11CFBD"></circle><path fill="#FFF" d="M17.0175 8.9985l-5.53846152 6.2307692c-.13638462.1533462-.3264231.2322693-.5178462.2322693-.15196152 0-.30461538-.0498462-.43234614-.1516154L7.0673077 12.54069228c-.29838462-.2385-.34684616-.67430766-.108-.97303842.2385-.29873076.67465384-.34719234.97303845-.10834614l2.94819233 2.35834618L15.9825 8.0780769c.2533846-.28592304.6916154-.31153842.9771923-.05746152.2859231.2544231.3118846.69196152.0578077.97788462z"></path></svg>';
            var IconCancelled = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="#F33155" d="M12 3c-4.96246154 0-9 4.0371923-9 9s4.03753846 9 9 9c4.9624615 0 9-4.0371923 9-9s-4.0375385-9-9-9z"></path><path fill="#FFF" d="M12.85570935 12.0000169L15.422774 9.43294924c.2363013-.23630165.2363013-.61942135 0-.8556892-.2363014-.23630166-.6193869-.23630166-.8556883 0l-2.56709836 2.56710145-2.56709847-2.5671353c-.23630137-.23630165-.6193868-.23630165-.8556882 0-.23626756.23630166-.23626756.61942136 0 .85568923l2.56709844 2.56706764-2.5670984 2.5671014c-.23626756.2363017-.23626756.6194214 0 .8556893.2363014.2363016.6193868.2363016.8556882 0l2.56709847-2.56710147 2.56709836 2.56710146c.2362676.2363016.6193869.2363016.8556883 0 .2363013-.2363017.2363013-.6193876 0-.8556893l-2.56706464-2.5670676z"></path></g></svg>';
            var lineService = '<div class="_1EOvhM" AppointmentID="@AppointmentID"><div class="_3xe42K"><div class="_1p62pX tHvQyk _297s6m">@ServiceName</div><div class="_1p62pX tHvQyk _1311Sc">@Price</div></div><div><div class="_1p62pX NvtZlc _297s6m">@DurationNameAndStaff</div></div></div>';
            var lineProduct = '<div class="_2mPFMy _1Ov_P6 ex0yBB _2KNr67" style="display: flex; flex-direction: column;"><div class="UV7tO0"><div class="_1p62pX tHvQyk _1ZsqH8">@ProductName</div><div class="_1p62pX tHvQyk _3eh4EJ">@PriceAfterDiscount</div></div><div class="UV7tO0"><div class="_1p62pX NvtZlc _1ZsqH8">@Quantity</div><div class="_1p62pX NvtZlc">@InvoiceDate</div></div></div>';
            var lineInvoice = '<div class="_2mPFMy _1Ov_P6 ex0yBB _2KNr67" InvoiceID = "@InvoiceID" style="display: flex; flex-direction: column;"><div class="UV7tO0">@Status</div><div class="UV7tO0"><div class="_1p62pX tHvQyk _1ZsqH8">@InvoiceNo</div><div class="_1p62pX tHvQyk _3eh4EJ">@Total</div></div><div class="UV7tO0"><div class="_1p62pX NvtZlc _1ZsqH8">@LocationName</div><div class="_1p62pX NvtZlc">@InvoiceDate</div></div></div>';

            $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/ClientDetail.html", function (html) {

                var mobilenumber = (data.Client.MobileNumber == null || data.Client.MobileNumber == "") ? "" : ("+" + data.Client.MobileNumberDialCode + " " + data.Client.MobileNumber);
                var email = (data.Client.Email == null || data.Client.Email == "") ? "" : data.Client.Email;

                Body = $(html.replace("@Represent", ($.trim(data.Client.FirstName) == "" ? '' : data.Client.FirstName.toString().charAt(0).toUpperCase()))
                            .replace("@FullName", ($.trim(data.Client.FirstName) == "" ? '' : data.Client.FirstName) + ($.trim(data.Client.LastName) == "" ? '' : ' ' + data.Client.LastName))
                            .replace("@Description", (mobilenumber == "" && email == "") ? "" : (mobilenumber == "" ? email : (email == "" ? mobilenumber : (mobilenumber + ", " + email)))));
            });

            var lineAP = '';
            $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/LineAppointments.html", function (data) {
                lineAP = data;
            });
            //client info

            //summary info
            Body.find("#divClientTotalBookings").html(data.Client.Appointments);
            Body.find("#divClientTotalSales").html(Window.CurrencySymbol + $.number(data.Client.TotalSales, Window.NumberDecimal, '.', ','));
            //show tab Appointment
            Body.find("#divClientAppointmentUpcoming").html("");
            Body.find("#divClientAppointmentPast").html("");
            if (data.Appointments != null && data.Appointments.length > 0) {
                var oldAppointmentID = 0;
                var NewLineAP = '';
                var Item;
                var countUp = 0;
                var countPast = 0;
                var curyear = moment().year();
                var oldYear = 0;
                $.each(data.Appointments, function () {
                    if (this.AppointmentID != oldAppointmentID) {
                        NewLineAP = lineAP.replace("@Date", moment(this.StartTime).format(Window.FormatDayAndMonthNameJS));
                        NewLineAP = NewLineAP.replace("@Time", moment(this.StartTime).startOf('day').add(this.StartTimeInSecond, "seconds").format(Window.FormatTimeJS));
                        if (this.Status == "New") {
                            NewLineAP = NewLineAP.replace("@TipStatus", "New Appointment");
                            NewLineAP = NewLineAP.replace("@Icon", IconNew);
                        }
                        else if (this.Status == "Completed") {
                            NewLineAP = NewLineAP.replace("@TipStatus", "Completed");
                            NewLineAP = NewLineAP.replace("@Icon", IconCompleted);
                        }
                        else if (this.Status == "NoShow") {
                            NewLineAP = NewLineAP.replace("@TipStatus", "No Show");
                            NewLineAP = NewLineAP.replace("@Icon", IconNoShow);
                        }
                        else if (this.Status == "Confirmed") {
                            NewLineAP = NewLineAP.replace("@TipStatus", "Confirmed");
                            NewLineAP = NewLineAP.replace("@Icon", IconConfirmed);
                        }
                        else if (this.Status == "Arrived") {
                            NewLineAP = NewLineAP.replace("@TipStatus", "Arrived");
                            NewLineAP = NewLineAP.replace("@Icon", IconArrived);
                        }
                        else if (this.Status == "Started") {
                            NewLineAP = NewLineAP.replace("@TipStatus", "Started");
                            NewLineAP = NewLineAP.replace("@Icon", IconStarted);
                        }
                        else if (this.Status == "Cancelled") {
                            NewLineAP = NewLineAP.replace("@TipStatus", "Cancelled");
                            NewLineAP = NewLineAP.replace("@Icon", IconCancelled);
                        }

                        var newlineservice = lineService.replace("@Price", Window.CurrencySymbol + $.number(this.Price, Window.NumberDecimal, '.', ','));
                        newlineservice = newlineservice.replace("@ServiceName", this.ServiceName);
                        newlineservice = newlineservice.replace("@AppointmentID", this.AppointmentID);
                        newlineservice = newlineservice.replace("@DurationNameAndStaff", (this.DurationName == "" ? "" : (this.DurationName)) + (this.StaffName == null ? "" : " with " + this.StaffName));
                        Item = $(NewLineAP);

                        Item.find("#divLineService").append(newlineservice);


                        if (moment(this.StartTime).isBefore(moment())) {
                            if (moment(this.StartTime).year() < curyear && moment(this.StartTime).year() != oldYear) {
                                Body.find("#divClientAppointmentPast").append('<div class="_1p62pX _2wNE54">' + moment(this.StartTime).year() + '</div>');
                            }
                            Body.find("#divClientAppointmentPast").append(Item);
                            countPast = countPast + 1;
                        }
                        else {
                            if (moment(this.StartTime).year() < curyear && moment(this.StartTime).year() != oldYear) {
                                Body.find("#divClientAppointmentUpcoming").append('<div class="_1p62pX _2wNE54">' + moment(this.StartTime).year() + '</div>');
                            }
                            Body.find("#divClientAppointmentUpcoming").append(Item);
                            countUp = countUp + 1;
                        }
                    }
                    else {
                        var newlineservice = lineService.replace("@Price", Window.CurrencySymbol + $.number(this.Price, Window.NumberDecimal, '.', ','));
                        newlineservice = newlineservice.replace("@ServiceName", this.ServiceName);
                        newlineservice = newlineservice.replace("@AppointmentID", this.AppointmentID);
                        newlineservice = newlineservice.replace("@DurationNameAndStaff", (this.DurationName == "" ? "" : (this.DurationName)) + (this.StaffName == null ? "" : " with " + this.StaffName));
                        Item.find("#divLineService").append(newlineservice);
                    }
                    oldAppointmentID = this.AppointmentID;
                    oldYear = moment(this.StartTime).year();


                })
                if (countPast > 0) {
                    Body.find("#divClientPast").html("Past (" + countPast + ")");
                }
                else {
                    Body.find("#divPast").css("display", "none");
                }
                if (countUp > 0) {
                    Body.find("#divClientUpcoming").html("Upcoming (" + countUp + ")");
                }
                else {
                    Body.find("#divUpcoming").css("display", "none");
                }
            }
            else {
                $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoAppointment.html", function (data) {
                    Body.find("#divTabAppointment").html(data);
                });
            }
            //show tab product
            Body.find("#divClientProduct").html("");
            if (data.Products != null && data.Products.length > 0) {
                $.each(data.Products, function () {
                    var item = lineProduct.replace("@ProductName", this.ItemName);
                    item = item.replace("@PriceAfterDiscount", Window.CurrencySymbol + $.number(this.PriceAfterDiscount, Window.NumberDecimal, '.', ','));
                    item = item.replace("@Quantity", this.Quantity + " sold");
                    item = item.replace("@InvoiceDate", moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS));
                    Body.find("#divClientProduct").append(item);
                })
            }
            else {
                $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoProduct.html", function (data) {
                    Body.find("#divTabProduct").html(data);
                });
            }
            //show line invoice
            Body.find("#divClientInvoice").html("");
            if (data.Invoices != null && data.Invoices.length > 0) {
                $.each(data.Invoices, function () {
                    var item = lineInvoice;
                    if (this.InvoiceStatus == "invoice_status_complete") {
                        item = item.replace("@Status", '<span class="_3GjCeD _2-xB9j _1bAC7l">' + Window.ResourcesEnum[this.InvoiceStatus] + '</span>');
                    }
                    else if (status == "invoice_status_refund") {
                        item = item.replace("@Status", '<span class="_3GjCeD _3HGXVo _1bAC7l">' + Window.ResourcesEnum[this.InvoiceStatus] + '</span>');
                    }
                    else {
                        item = item.replace("@Status", '<span class="_3GjCeD GbRcyD _1bAC7l">' + Window.ResourcesEnum[this.InvoiceStatus] + '</span>');
                    }

                    item = item.replace("@InvoiceNo", this.InvoiceNo);
                    item = item.replace("@InvoiceID", this.InvoiceID);
                    item = item.replace("@LocationName", this.LocationName);
                    item = item.replace("@Total", Window.CurrencySymbol + $.number(this.TotalWithTip, Window.NumberDecimal, '.', ','));
                    item = item.replace("@InvoiceDate", moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS));
                    Body.find("#divClientInvoice").append(item);
                })
            }
            else {
                $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoInvoice.html", function (data) {
                    Body.find("#divTabInvoice").html(data);
                });
            }
            //show line info
            var lineinfo = '<div class="_1qZ_Gc"><div class="_1p62pX _1-EIW_">@Name</div><div class="_1p62pX _206u0u">@Value</div></div>';
            Body.find("#divClientInfo").html("");
            if (data.Client.MobileNumber != null && data.Client.MobileNumber != "") {
                var item = lineinfo.replace("@Name", "Mobile");
                item = item.replace("@Value", "+" + data.Client.MobileNumberDialCode + " " + data.Client.MobileNumber);
                Body.find("#divClientInfo").append(item);
            }
            if (data.Client.Email != null && data.Client.Email != "") {
                var item = lineinfo.replace("@Name", "Email");
                item = item.replace("@Value", data.Client.Email);
                Body.find("#divClientInfo").append(item);
            }
            if (data.Client.Gender != null && data.Client.Gender != "gender_unknown") {
                var item = lineinfo.replace("@Name", "Gender");
                item = item.replace("@Value", Window.ResourcesEnum[data.Client.Gender]);
                Body.find("#divClientInfo").append(item);
            }

            Body.find("#btnTabAppointments").addClass("oEUy3Y");
            Body.find("#divTabAppointment").css('display', 'block');
            Body.find("#divTabProduct").css('display', 'none');
            Body.find("#divTabInvoice").css('display', 'none');
            Body.find("#divTabInfo").css('display', 'none');

            Body.find("#btnTabAppointments").click(function () {
                //; debugger;
                Body.find("#btnTabAppointments").removeClass("oEUy3Y").addClass("oEUy3Y");
                Body.find("#btnTabProducts").removeClass("oEUy3Y");
                Body.find("#btnTabInvoices").removeClass("oEUy3Y");
                Body.find("#btnTabInfo").removeClass("oEUy3Y");

                Body.find("#divTabAppointment").css('display', 'block');
                Body.find("#divTabProduct").css('display', 'none');
                Body.find("#divTabInvoice").css('display', 'none');
                Body.find("#divTabInfo").css('display', 'none');
            })
            Body.find("#btnTabProducts").click(function () {
                //; debugger;
                Body.find("#btnTabProducts").removeClass("oEUy3Y").addClass("oEUy3Y");
                Body.find("#btnTabAppointments").removeClass("oEUy3Y");
                Body.find("#btnTabInvoices").removeClass("oEUy3Y");
                Body.find("#btnTabInfo").removeClass("oEUy3Y");

                Body.find("#divTabProduct").css('display', 'flex');
                Body.find("#divTabAppointment").css('display', 'none');
                Body.find("#divTabInvoice").css('display', 'none');
                Body.find("#divTabInfo").css('display', 'none');
            })
            Body.find("#btnTabInvoices").click(function () {
                //; debugger;
                Body.find("#btnTabInvoices").removeClass("oEUy3Y").addClass("oEUy3Y");
                Body.find("#btnTabAppointments").removeClass("oEUy3Y");
                Body.find("#btnTabProducts").removeClass("oEUy3Y");
                Body.find("#btnTabInfo").removeClass("oEUy3Y");

                Body.find("#divTabInvoice").css('display', 'flex');
                Body.find("#divTabAppointment").css('display', 'none');
                Body.find("#divTabProduct").css('display', 'none');
                Body.find("#divTabInfo").css('display', 'none');
            })
            Body.find("#btnTabInfo").click(function () {
                //; debugger;
                Body.find("#btnTabInfo").removeClass("oEUy3Y").addClass("oEUy3Y");
                Body.find("#btnTabAppointments").removeClass("oEUy3Y");
                Body.find("#btnTabProducts").removeClass("oEUy3Y");
                Body.find("#btnTabInvoices").removeClass("oEUy3Y");

                Body.find("#divTabInfo").css('display', 'flex');
                Body.find("#divTabAppointment").css('display', 'none');
                Body.find("#divTabProduct").css('display', 'none');
                Body.find("#divTabInvoice").css('display', 'none');
            })

            if (!that.ShowFooter)
                Body.find("#containtFooter").remove();

            callback({ Html: Body[0].outerHTML, Data: data })
        })
    }
}
class ClientSearchDestop {
    constructor(locationId) {
        this.LocationId = locationId;
    }
    LoadData() {
        var that = this;
        $.RequestAjaxText("/ContentHtml/Client/Desktop/Search/ClientSearchItem.html", function (data) { that.DestopClientSearchItem = data; });
        $.RequestAjaxText("/ContentHtml/Client/Desktop/Search/Index.html", function (data) { that.DestopClientSearchIndex = data; });
    }
    Excute(callback) {
        var that = this;
        if (!this.DestopClientSearchItem || !this.DestopClientSearchIndex)
            this.LoadData();
        this.CallBack = callback;
        this.Containt = $(this.DestopClientSearchIndex);
        $("body").append(this.Containt);
        this.Containt.find('[name="searchClient"]').focus();
        this.SearchClient();
        this.Containt.find('[name="searchClient"]').keyup(function () {
            that.SearchClient();
        })
        this.Containt.find('#buttonCloseSearchClient').click(function () {
            that.RemoveClientSearch();
            $(document).find("#contentRight").css('display', 'block');
            that.CallBack({
                Data: {
                    ClientItem: 0
                }
            });
        })
        this.Containt.find('#buttonCreateClient').click(function () {

        })
        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                that.RemoveClientSearch();
            }
        })
    }
    RemoveClientSearch() {
        if (this.Containt) {
            this.Containt.find('[name="searchClient"]').off("keyup");
            this.Containt.find('#buttonCloseSearchClient').off("click");
            this.Containt.find('#buttonCreateClient').off("click");
            //$(document).off("keyup");
            this.Containt.remove();
        }
    }
    SearchClient() {
        var that = this;
        $.RequestAjax("/Home/GetDataClientSearch", JSON.stringify({ search: $.trim(this.Containt.find('[name="searchClient"]').val()), locationId: that.LocationId }), function (data) {
            that.ListClientSearch = data.Result;
            var length = data.Result.length;
            that.Containt.find("[name='contantClientItem']").remove();
            $.each(data.Result, function (index, item) {
                var mobilenumber = (item.MobileNumber == null || item.MobileNumber == "") ? "" : ("+" + item.MobileNumberDialCode + " " + item.MobileNumber);
                var email = (item.Email == null || item.Email == "") ? "" : item.Email;
                var html = that.DestopClientSearchItem.toString().replace("@BorderTop", (index == length ? '' : 'border-top'))
                    .replace("@ClientID", item.ClientID)
                    .replace("@Represent", ($.trim(item.FirstName) == "" ? '' : item.FirstName.toString().charAt(0).toUpperCase()))
                    .replace("@FullName", ($.trim(item.FirstName) == "" ? '' : item.FirstName) + ($.trim(item.LastName) == "" ? '' : ' ' + item.LastName))
                    .replace("@Description", (mobilenumber == "" && email == "") ? "" : (mobilenumber == "" ? email : (email == "" ? mobilenumber : (mobilenumber + ", " + email))));
                that.Containt.find("#listClientSearch").append(html);
                that.Containt.find("#listClientSearch [name='contantClientItem']:last").show("slow");
            })
            that.Containt.find("[name='contantClientItem']").click(function () {
                that.RemoveClientSearch();
                var clientDestop = new ClientDetailDestop(parseInt($(this).attr("clientid")), false);
                var renposive = clientDestop.CreateClient(that.CallBack);
            })
            $("#buttonCreateClient").unbind("click");
            $("#buttonCreateClient").click(function () {

                var nameClient = $.trim(that.Containt.find('[name="searchClient"]').val());
                var arrayNameClient = nameClient.split(" ");
                var firstName = "";
                var lastName = "";
                if (arrayNameClient.length > 0) {
                    firstName = arrayNameClient[0];
                    if (arrayNameClient.length > 1) {
                        arrayNameClient.shift();
                        lastName = arrayNameClient.join(" ");
                    }
                }

                $("#actionModal #TitleModal").text("New Client");
                $("#actionModal #ClientID").val(0);
                $("#actionModal #FirstName").val(firstName);
                $("#actionModal #LastName").val(lastName);
                $("#actionModal #MobileNumber").val("");
                $("#actionModal #Telephone").val("");
                $("#actionModal #Email").val("");
                $("#actionModal #AppointmentNotificationType").val("marketing_both").change();
                $("#actionModal #AcceptMarketingNotifications").iCheck('check');
                $("#actionModal #Gender").val("gender_unknown").change();
                $("#actionModal #ReferralSource").SetValueSelect2("", "Referral Source");
                $("#actionModal #DateOfBirth").data('daterangepicker').setStartDate(moment()._d);
                $("#actionModal #DisplayOnAllBookings").iCheck('uncheck');
                $("#actionModal #ClientNotes").val("");
                $("#actionModal #Address").val("");
                $("#actionModal #Suburb").val("");
                $("#actionModal #City").val("");
                $("#actionModal #State").val("");
                $("#actionModal #PostCode").val("");
                $("#actionModal #deleteButton").hide();
                $('#actionModal').modal("show");
                that.RemoveClientSearch();
            })
        })
    }
}