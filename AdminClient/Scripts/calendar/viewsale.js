//#region variable
var urlGetDataAllPaymentType = "/Home/GetDataAllPaymentType";
var urlGetInvoiceBaseId = "/Sale/GetInvoiceBaseId";
var urlVoidInvoice = "/Sale/VoidInvoice";
var urlSearchVoucherCode = "/Sale/SearchVoucherCode"
var urlSaveInvoice = "/Sale/Pay";
var urlGetClientBaseIdForAppointment = "/Calendar/GetClientBaseIdForAppointment";
var htmlRebook = '<a href="@href" class="XmhvoV _1FszNF _2T3dvr _26KSgC"><span class="_2FSeuB _240vE8 _2WkLBf" style="margin-right: 8px;"><svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 3.125a.625.625 0 1 1-1.25 0v-2.5a.625.625 0 1 1 1.25 0v2.5zm10-2.5a.625.625 0 1 0-1.25 0v2.5a.625.625 0 1 0 1.25 0v-2.5zM15 11.25A3.754 3.754 0 0 0 11.25 15 3.754 3.754 0 0 0 15 18.75 3.754 3.754 0 0 0 18.75 15 3.754 3.754 0 0 0 15 11.25zM15 10a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM5 7.5H2.5V10H5V7.5zm0 3.75H2.5v2.5H5v-2.5zM8.75 7.5h-2.5V10h2.5V7.5zm0 3.75h-2.5v2.5h2.5v-2.5zm0 3.75H1.354c-.056 0-.104-.059-.104-.124V6.25H15v2.5h1.25V3.875c0-.76-.606-1.375-1.354-1.375h-.521v.625c0 .689-.56 1.25-1.25 1.25s-1.25-.561-1.25-1.25V2.5h-7.5v.625c0 .689-.56 1.25-1.25 1.25s-1.25-.561-1.25-1.25V2.5h-.52C.605 2.5 0 3.115 0 3.875v11c0 .757.606 1.375 1.354 1.375H8.75V15zm3.75-7.5H10V10h2.5V7.5zm4.375 6.875h-1.25v-1.25a.625.625 0 1 0-1.25 0v1.25h-1.25a.625.625 0 1 0 0 1.25h1.25v1.25a.625.625 0 1 0 1.25 0v-1.25h1.25a.625.625 0 1 0 0-1.25z"></path></svg></span>@RebookText</a>';
var htmlHideLeft = '<div id="divCloseHide"  class="_3JCqqK _3ZC5t0 _1FszNF"><div class="_3LcBX_" style="display: flex; flex-direction: column; align-items: center; opacity: 100"><div class="_3yag3W" style="display: flex; flex-direction: row; justify-content: space-around;"><div style="display: flex; flex-direction: column; align-items: center; margin-top: 16px;"><span class="_2FSeuB _240vE8 _2xvPfd RCcMXQ _3aE861"><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M6.188 4.9996l3.565-3.565a.8403.8403 0 0 0 0-1.1884.8403.8403 0 0 0-1.1883 0l-3.5651 3.565L1.4345.2462A.8403.8403 0 1 0 .246 1.4345l3.5651 3.565-3.565 3.5651A.8404.8404 0 0 0 1.4345 9.753l3.565-3.5651L8.5648 9.753a.8403.8403 0 0 0 1.1884 0 .8403.8403 0 0 0 0-1.1884L6.188 4.9996z"></path></svg></span><div class="_1p62pX _3y3xr- _2xtCX5 _1CdKlX" style="margin-top: 6px;">ESC</div></div></div><div class="_1p62pX _3y3xr- _2xtCX5 _2sB30X" style="margin-top: 16px;">Click to close</div></div></div>';
var htmlInvoiceItem = '<div class="_3ZK4oI" data-qa="invoice-sale-item" style="display: flex; flex-direction: row; justify-content: space-between;"><div class="_1p62pX i3ajAS _2BCoj4" style="flex-shrink: 0; flex-basis: 40px;">@Quantity</div><div class="_30LpQ2" style="display: flex; flex-direction: column; flex-shrink: 1; flex-grow: 1;"><div class="_1p62pX i3ajAS">@ItemName</div><div class="_1p62pX _23Ey6Y" data-qa="invoice-description">@ItemDetail</div></div><div class="_2uVtdf" style="display: flex; flex-direction: column; flex-shrink: 0; flex-basis: 60px; align-items: flex-end;"><div class="_1p62pX i3ajAS">@ItemAmount</div><div class="_1p62pX i3ajAS"><del>@OrgPriceDisplay</del></div></div></div>';
var htmlPaymentItem = '<div class="_1liZ7q" style="display: flex; flex-direction: column;"><div data-qa="invoice-payment" style="display: flex; flex-direction: row; flex-grow: 1; justify-content: space-between;"><div class="_1p62pX i3ajAS">@PaymentType</div><div class="_1p62pX i3ajAS"><span>@PaymentAmount</span></div></div><div class="_1p62pX _3y3xr- _3gvVWN">@PaymentTime</div></div>';
var htmlVoidItem = '<div class="ktQkHD smHX5e"><div class="_1p62pX lbu1uV">@line1</div><div class="_1p62pX myXqT_">@line2</div></div>';
var htmlTaxDetail = '<div style="display: flex; flex-direction: row; flex-grow: 1; justify-content: space-between;"><div class="_1p62pX i3ajAS">@TaxName</div><div class="_1p62pX i3ajAS"><span>@TaxAmount</span></div></div>'
var dataInvoice;
var BalanceAmount = 0;
var IconNew = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#2883D2"></circle><path fill="#FFF" d="M13.3073393 6.6688549l-2.3327276-.1691103-.8803685-2.16361733C9.9102114 3.8884823 9.48246183 3.6 9 3.6c-.4824618 0-.91021143.2884823-1.09424324.73612727L7.02538834 6.4997446l-2.33272764.1691103c-.4824618.03481684-.88534226.35314215-1.03455725.81073477-.149215.45759264-.00497383.95497592.3630898 1.2683274l1.78560602 1.50707133-.5570693 2.2680678c-.08952898.3531422-.00994765.7212058.21387483 1.0047143.22382248.2884823.57199078.4575927.93010676.4575927.21884864 0 .43272346-.0596861.6217291-.1790581L9 12.5727946l1.9845593 1.2335105c.1890057.119372.4028805.1790581.6217292.1790581.3581159 0 .7062843-.1691104.9301067-.4575927.2238224-.2835085.3034038-.6515721.2138748-1.0047143l-.5570693-2.2680678 1.7856061-1.50707133c.3680636-.30837764.5123047-.80576093.3630897-1.2683274-.1492149-.45759262-.5570693-.77591793-1.0345572-.81073476zm-1.918745 2.9967374c-.2018798.16823322-.2859964.4374063-.2243108.6897561l.7065793 2.865572-2.50667456-1.5589609c-.22431087-.1401942-.50469953-.1401942-.72340268 0l-2.51228234 1.5701766.71218718-2.8823955c.0616855-.2523497-.0224311-.5215228-.22431092-.68975602L4.35644692 7.75334173l2.94408087-.21309538c.2579575-.01682332.4878762-.18505652.5888161-.42619075L8.999683 4.3830701l1.11594678 2.73659326c.10094.24113425.3252509.40936744.5888162.42619076l2.9440809.21309538-2.2599326 1.9066428z"></path></g></svg>';
var IconArrived = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(3 3)" fill-rule="nonzero" fill="none"><circle fill="#F5A623" cx="9" cy="9" r="9"></circle><path d="M13.286214 7.815888l-.43317-.41247C12.70296 7.267806 12.52764 7.2 12.327507 7.2c-.204255 0-.377487.067815-.519984.2034l-2.807496 2.672622-2.80746-2.672532c-.142488-.135594-.315765-.2034-.51993-.2034-.200232 0-.375507.067806-.525636.2034l-.4275.41247c-.146357.13923-.2195.30609-.2195.5004 0 .197946.073224.362916.219492.494865l3.760578 3.57984C8.61876 12.530313 8.791983 12.6 9 12.6c.20412 0 .379368-.06966.5256-.208935l3.760596-3.57984c.142506-.135675.213804-.3006.213804-.494865.000018-.190683-.07128-.357444-.213786-.500472z" fill="#FFF"></path></g></svg>';
var IconConfirmed = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#3093E8"></circle><path fill="#FFF" d="M13.184262 8.7361c.210582-.32027.315738-.672823.315738-1.057905 0-.445708-.163107-.832836-.48959-1.161997-.326643-.32882-.713404-.493195-1.160237-.493195H10.71574c.206204-.42832.309486-.843748.309486-1.246083 0-.506268-.075402-.908626-.225663-1.20719-.15042-.298654-.369603-.518178-.65753-.658867C9.854043 2.770243 9.529723 2.7 9.16879 2.7c-.219252 0-.412542.08004-.580118.240187-.184734.181698-.31795.415407-.39956.70099-.081656.285493-.147215.55921-.196587.820993-.049372.26176-.125722.44673-.2288.55489-.210606.229322-.440468.506313-.6897.83079-.433987.566758-.72837.902124-.882988 1.00601H4.425015c-.22774 0-.422204.081245-.583346.24337-.16108.162285-.24167.358076-.24167.58742v4.15368c0 .229343.0805.425066.24167.58735.16123.162285.3556.243484.58334.243484h1.85617c.09454 0 .39098.08652.88944.2596.52855.186086.9937.327752 1.39542.425137.40177.09739.80892.1461 1.22146.1461h.83143c.60583 0 1.0935-.17426 1.46308-.52261.369442-.34834.552144-.8232.5479-1.42462.25781-.33318.38669-.71826.38669-1.15522 0-.09513-.006344-.18815-.019303-.2791.16322-.28979.245035-.60133.245035-.93451-.00007-.15578-.01937-.30513-.058087-.44782zm-8.05668 2.979c-.081633.082154-.1783.12339-.290026.12339-.111747 0-.208437-.041214-.290092-.12339-.08161-.08213-.12245-.179515-.12245-.292108 0-.112478.04075-.209794.12245-.29204.081745-.08222.178345-.12332.290092-.12332.111726 0 .208393.0411.290026.12332.081655.082223.122493.17954.122493.29204 0 .112592-.040838.209977-.122493.292108zm7.40913-3.504404c-.092402.198997-.207378.300678-.344862.30495.06443.073585.118182.176448.161166.308294.042938.132005.064272.25203.064272.360258 0 .298405-.113712.555914-.341474.772187.077433.138393.11606.287743.11606.447754 0 .1601-.037543.31911-.112787.47701-.075108.15776-.17724.27137-.3061.34057.02147.12978.032126.25096.032126.36344 0 .72254-.41254 1.08382-1.237647 1.08382h-.77966c-.56303 0-1.297698-.15783-2.204436-.47376-.021514-.00864-.083732-.03144-.186923-.06815-.103192-.03672-.17943-.06379-.22887-.08104-.04944-.01744-.12457-.04231-.225617-.07468-.101024-.03253-.182566-.05636-.24492-.07143-.062262-.0151-.133216-.02917-.212636-.04217-.079466-.01298-.14717-.01944-.20302-.01944h-.206248v-4.1535h.206248c.068742 0 .145-.01953.2288-.05838.083778-.03896.169767-.09736.257833-.175265.088112-.07791.17076-.1547.248148-.23046.077366-.0757.163288-.17088.257856-.2855.09453-.11471.16864-.20661.22239-.27586.05369-.06922.12135-.15797.203-.26613.08161-.108137.13108-.17306.14825-.194724.2363-.294175.40173-.491035.49625-.5906.17618-.185994.304-.422886.38349-.71063.07958-.287787.14509-.5593.19648-.814536.05152-.25526.13327-.439207.24513-.55171.41241 0 .68749.101636.82495.30502.13744.20334.206207.517064.206207.941086 0 .25526-.103214.60247-.30951 1.04161-.206202.439184-.309235.784258-.309235 1.035197h2.268704c.215074 0 .406197.083245.573706.249917.167643.16656.25156.360148.25156.580877-.00007.151417-.04628.32668-.13866.52595z"></path></g></svg>';
var IconStarted = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" transform="translate(3 3)"><circle cx="9" cy="9" r="9" fill="#0BC2B0"></circle><path fill="#FFF" d="M7.81588982 4.7137819L7.4034091 5.14695C7.26781586 5.2970585 7.2 5.4723775 7.2 5.672502c0 .2042521.06781587.377487.2034091.519988l2.67261173 2.80748975-2.6725347 2.8074696c-.13559322.14248073-.2034091.3157561-.2034091.51992724 0 .2002257.06781588.3755041.2034091.52563292l.41248074.4274827c.13923343.14636548.3060863.21950775.50040447.21950775.19793914 0 .36290447-.0732232.49485747-.21948753l3.5798344-3.76058527C12.5303159 9.3812301 12.6 9.2080154 12.6 9c0-.2041105-.0696649-.3793686-.2089368-.5255925L8.8112288 4.713802C8.67555856 4.5713011 8.5106125 4.5 8.31637135 4.5c-.19069723-.0000202-.35745378.0712808-.50048152.2137819z"></path></g></svg>';
var IconNoShow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="#F33155" d="M12 3c-4.96246154 0-9 4.0371923-9 9s4.03753846 9 9 9c4.9624615 0 9-4.0371923 9-9s-4.0375385-9-9-9z"></path><path fill="#FFF" d="M15.9616618 13.3259828l-1.3960641-2.37770694 1.4093294-2.40051724c.0281341-.04794828.0295919-.10815517.0039359-.1575-.0258018-.04934483-.0744898-.0799138-.127551-.0799138H9.62837733V8H9v9h.76019354v-3.4137931H15.851312c.0835277 0 .148688-.0693621.148688-.1551724 0-.0405-.0145773-.0772759-.0383382-.1050517z"></path></g></svg>';
var IconCompleted = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#11CFBD"></circle><path fill="#FFF" d="M17.0175 8.9985l-5.53846152 6.2307692c-.13638462.1533462-.3264231.2322693-.5178462.2322693-.15196152 0-.30461538-.0498462-.43234614-.1516154L7.0673077 12.54069228c-.29838462-.2385-.34684616-.67430766-.108-.97303842.2385-.29873076.67465384-.34719234.97303845-.10834614l2.94819233 2.35834618L15.9825 8.0780769c.2533846-.28592304.6916154-.31153842.9771923-.05746152.2859231.2544231.3118846.69196152.0578077.97788462z"></path></svg>';
var IconCancelled = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path fill="#F33155" d="M12 3c-4.96246154 0-9 4.0371923-9 9s4.03753846 9 9 9c4.9624615 0 9-4.0371923 9-9s-4.0375385-9-9-9z"></path><path fill="#FFF" d="M12.85570935 12.0000169L15.422774 9.43294924c.2363013-.23630165.2363013-.61942135 0-.8556892-.2363014-.23630166-.6193869-.23630166-.8556883 0l-2.56709836 2.56710145-2.56709847-2.5671353c-.23630137-.23630165-.6193868-.23630165-.8556882 0-.23626756.23630166-.23626756.61942136 0 .85568923l2.56709844 2.56706764-2.5670984 2.5671014c-.23626756.2363017-.23626756.6194214 0 .8556893.2363014.2363016.6193868.2363016.8556882 0l2.56709847-2.56710147 2.56709836 2.56710146c.2362676.2363016.6193869.2363016.8556883 0 .2363013-.2363017.2363013-.6193876 0-.8556893l-2.56706464-2.5670676z"></path></g></svg>';
var lineService = '<div class="_1EOvhM" AppointmentID="@AppointmentID"><div class="_3xe42K"><div class="_1p62pX tHvQyk _297s6m">@ServiceName</div><div class="_1p62pX tHvQyk _1311Sc">@Price</div></div><div><div class="_1p62pX NvtZlc _297s6m">@DurationNameAndStaff</div></div></div>';
var lineProduct = '<div class="_2mPFMy _1Ov_P6 ex0yBB _2KNr67" style="display: flex; flex-direction: column;"><div class="UV7tO0"><div class="_1p62pX tHvQyk _1ZsqH8">@ProductName</div><div class="_1p62pX tHvQyk _3eh4EJ">@PriceAfterDiscount</div></div><div class="UV7tO0"><div class="_1p62pX NvtZlc _1ZsqH8">@Quantity</div><div class="_1p62pX NvtZlc">@InvoiceDate</div></div></div>';
var lineInvoice = '<div class="_2mPFMy _1Ov_P6 ex0yBB _2KNr67" style="display: flex; flex-direction: column;"><div class="UV7tO0">@Status</div><div class="UV7tO0"><div class="_1p62pX tHvQyk _1ZsqH8">@InvoiceNo</div><div class="_1p62pX tHvQyk _3eh4EJ">@Total</div></div><div class="UV7tO0"><div class="_1p62pX NvtZlc _1ZsqH8">@LocationName</div><div class="_1p62pX NvtZlc">@InvoiceDate</div></div></div>';
var NotYear = true;
$(function () {
    //#region Client
    var country = "vn";
    $.each($.fn.intlTelInput.getCountryData(), function () {
        if ($("#MobileNumberDialCode").val() == this.dialCode) {
            country = this.iso2;
            return;
        }
    })
    $("#MobileNumber").intlTelInput({
        separateDialCode: true,
        initialCountry: country,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $.each($.fn.intlTelInput.getCountryData(), function () {
        if ($("#TelephoneDialCode").val() == this.dialCode) {
            country = this.iso2;
            return;
        }
    })
    $("#Telephone").intlTelInput({
        separateDialCode: true,
        initialCountry: country,
        preferredCountries: [Window.CountryCode],
        utilsScript: "/Extension/js/utils.js"
    });
    $("#DateOfBirth").prop("formatdate", Window.FormatDateJS)
    $("#DateOfBirth").daterangepicker({
        "singleDatePicker": true,
        "timePicker": false,
        "changeYear": false,
        "locale": {
            "format": "DD/MM",
        }
    });
    $("#actionForm #ReferralSource").InStallSelect2('/Home/LoadSelect2ForReferralSource', 20, 'Referral Source', null);
    $('#actionForm').validate({
        rules: {
            FirstName: 'required',
        },
        messages: {
            FirstName: 'Please enter first name',
        },
        errorElement: 'em',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            if (element.prop('type') === 'checkbox') {
                error.insertAfter(element.parent('label'));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        },
    });
    $("#setyear").click(function () {
        if (NotYear) {
            $("#DateOfBirth").daterangepicker({
                "singleDatePicker": true,
                "timePicker": false,
                "locale": {
                    "format": Window.FormatDateJS,
                }
            });
            $(this).html("Remove year");
            NotYear = false;
        }
        else {
            $("#DateOfBirth").daterangepicker({
                "singleDatePicker": true,
                "timePicker": false,
                "changeYear": false,
                "locale": {
                    "format": "DD/MM",
                }
            });
            $(this).html("Set year");
            NotYear = true;
        }

    })
    //#endregion
    var LoadPaymentType = function () {
        $.RequestAjax(urlGetDataAllPaymentType, JSON.stringify({
            IsAddVoucher: true
        }), function (data) {
            var row = '<div class="_1l0BC1"><button type="button" PaymentTypeID= "@PaymentTypeID" PaymentTypeName="@PaymentTypeName" class="_2wtmYU _2Bn9Xa _1FszNF _23tAim _2DZ1oJ _26WQGn"><div class="_2nLI4N">@TextPaymentTypeName</div></button></div>';
            $("#divPaymentMethod").html('');
            if (data.Result.length > 0) {
                $.each(data.Result, function () {
                    var line = row.replace('@PaymentTypeName', this.PaymentTypeName).replace("@PaymentTypeID", this.PaymentTypeID).replace('@TextPaymentTypeName', this.PaymentTypeName);
                    $("#divPaymentMethod").append(line);
                })
            }
        }, function () {
        })
    }
    var SumTotal = function () {
        var TotalPay = 0;
        $("#divPayment ._3A8Cgx").each(function () {
            TotalPay = TotalPay + parseFloat($(this).attr("Amount"));
        })

        var Balance = dataInvoice.Invoice.Balance - TotalPay;
        BalanceAmount = Balance;
        $("#Pay").val(parseFloat(Balance).toFixed(Window.NumberDecimal));
        if (Balance == 0) {
            $("#divFullPaymentLeft").css('display', 'flex');
            $("#divPaymentLeft").css('display', 'none');
        }
        else {
            $("#divFullPaymentLeft").css('display', 'none');
            $("#divPaymentLeft").css('display', 'flex');
        }
        if (dataInvoice.Invoice.TotalPayment == 0 && TotalPay == 0) {
            $("#btnSavePartPaid").hide();
            $("#btnSaveUnpaid").show();
        }
        else {
            $("#btnSavePartPaid").show();
            $("#btnSaveUnpaid").hide();
        }
    }
    var AddItemPayment = function (PaymentTypeID, PaymentAmount, PaymentTypeName, VoucherID, VoucherCode, PayForServiceID) {
        //find same payment type
        var findsame = false;
        var count = 0;
        $("#divPayment ._3A8Cgx").each(function () {
            count++;
            if (PaymentTypeID == $(this).attr("PaymentTypeID") && VoucherID == 0) {
                var total = PaymentAmount + parseFloat($(this).attr("Amount"));
                $(this).attr("Amount", total);
                $(this).find("#divAmount").text(Window.CurrencySymbol + $.number(total, Window.NumberDecimal, '.', ','));
                findsame = true;
            }
        })

        if (findsame == false) {
            var ItemPayment = '<div class="_3A8Cgx" PaymentTypeID="" Amount="" VoucherID="" VoucherCode="" PayForServiceID="" style="display: flex; flex-direction: row;"><div style="display: flex; flex-direction: row; flex-grow: 1; justify-content: space-between;"><div class="_1p62pX i3ajAS">@PaymentTypeName</div><div class="_1p62pX i3ajAS"><span id="divAmount">@Amount</span></div></div><div role="button" class="_1TG8o8 _2VkICb _1FszNF"><span class="_2FSeuB _240vE8 _2xvPfd RCcMXQ"><svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M6.188 4.9996l3.565-3.565a.8403.8403 0 0 0 0-1.1884.8403.8403 0 0 0-1.1883 0l-3.5651 3.565L1.4345.2462A.8403.8403 0 1 0 .246 1.4345l3.5651 3.565-3.565 3.5651A.8404.8404 0 0 0 1.4345 9.753l3.565-3.5651L8.5648 9.753a.8403.8403 0 0 0 1.1884 0 .8403.8403 0 0 0 0-1.1884L6.188 4.9996z"></path></svg></span></div></div>';
            ItemPayment = ItemPayment.replace('@PaymentTypeName', PaymentTypeName)
            ItemPayment = ItemPayment.replace('@Amount', Window.CurrencySymbol + $.number(PaymentAmount, Window.NumberDecimal, '.', ','))
            var element = $(ItemPayment);
            element.attr("PaymentTypeID", PaymentTypeID);
            element.attr("Amount", PaymentAmount);
            element.attr("VoucherID", VoucherID);
            element.attr("VoucherCode", VoucherCode);
            element.attr("PayForServiceID", PayForServiceID);
            $("#divPayment").append(element[0].outerHTML);
            $("._3A8Cgx ._1TG8o8").click(function () {
                $(this).closest("._3A8Cgx").remove();
                SumTotal();
            })
        }
        SumTotal();
    }
    var SaveInvoice = function (InvoiceStatus) {
        var InvoicePayments = [];
        $("#divPayment ._3A8Cgx").each(function () {
            InvoicePayments.push({
                PaymentTypeID: $(this).attr("PaymentTypeID"),
                PaymentAmount: $(this).attr("Amount"),
                VoucherID: $(this).attr("VoucherID"),
                PayForServiceID: $(this).attr("PayForServiceID"),
                VoucherCode: $(this).attr("VoucherCode"),
                UserPayment: $("#UserID").val(),
                PaymentDate: moment().tz(Window.TimeZone).format("YYYY/MM/DD HH:mm")
            })
        })
        $.RequestAjax(urlSaveInvoice, JSON.stringify({
            InvoicePayments: InvoicePayments,
            InvoiceID: $("#InvoiceID").val(),
            InvoiceStatus: InvoiceStatus
        }), function (data) {
            if (!JSON.parse(data.Result)) {
                toastr["error"](data.ErrorMessage, "Error");
            } else {
                location.href = "/Sale/Invoices?id=" + data.InvoiceID;
            }
        })
    }
    var ShowClientInfo = function (Client) {
        $("#ClientID").val(Client.ClientID);
        $("#openClientDetail").show();//icon click open clientDetail
        $("#txtClientName").html(Client.FirstName + " " + (Client.LastName == null ? "" : Client.LastName));
        $("#txtClientLetter").html(Client.FirstName.substr(0, 1).toUpperCase());
        var mobilenumber = (Client.MobileNumber == null || Client.MobileNumber == "") ? "" : ("+" + Client.MobileNumberDialCode + " " + Client.MobileNumber);
        var email = (Client.Email == null || Client.Email == "") ? "" : Client.Email;
        var info = (mobilenumber == "" && email == "") ? "" : (mobilenumber == "" ? email : (email == "" ? mobilenumber : (mobilenumber + ", " + email)));
        $("#txtClientInfo").html(info);
        $("#email").val((Client.Email == null || Client.Email == "") ? "" : Client.Email);
        $("#divClientTotalBookings").html(Client.Appointments);
        $("#divClientTotalSales").html(Window.CurrencySymbol + $.number(Client.TotalSales, Window.NumberDecimal, '.', ','));
        //get detail for 4 tab
        var lineAP = '';
        $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/LineAppointments.html", function (data) {
            lineAP = data;
        });
        //get Client info
        $.RequestAjax(urlGetClientBaseIdForAppointment, JSON.stringify({
            "ClientId": Client.ClientID
        }), function (data) {
            //show tab Appointment
            $("#divClientAppointmentUpcoming").html("");
            $("#divClientAppointmentPast").html("");
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
                        NewLineAP = NewLineAP.replace("@Time", moment(this.StartTime).format(Window.FormatTimeJS));
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
                        if (moment(this.StartTime).isBefore(moment().tz(Window.TimeZone))) {
                            if (moment(this.StartTime).year() < curyear && moment(this.StartTime).year() != oldYear) {
                                $("#divClientAppointmentPast").append('<div class="_1p62pX _2wNE54">' + moment(this.StartTime).year() + '</div>');
                            }
                            $("#divClientAppointmentPast").append(Item);
                            countPast = countPast + 1;
                        }
                        else {
                            if (moment(this.StartTime).year() < curyear && moment(this.StartTime).year() != oldYear) {
                                $("#divClientAppointmentUpcoming").append('<div class="_1p62pX _2wNE54">' + moment(this.StartTime).year() + '</div>');
                            }
                            $("#divClientAppointmentUpcoming").append(Item);
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
                    $("#divClientPast").html("Past (" + countPast + ")");
                }
                if (countUp > 0) {
                    $("#divClientUpcoming").html("Upcoming (" + countUp + ")");
                }
            }
            else {
                $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoAppointment.html", function (data) {
                    $("#divTabAppointment").html(data);
                });
            }
            //show tab product
            $("#divClientProduct").html("");
            if (data.Products != null && data.Products.length > 0) {
                $.each(data.Products, function () {
                    var item = lineProduct.replace("@ProductName", this.ItemName);
                    item = item.replace("@PriceAfterDiscount", Window.CurrencySymbol + $.number(this.PriceAfterDiscount, Window.NumberDecimal, '.', ','));
                    item = item.replace("@Quantity", this.Quantity + " sold");
                    item = item.replace("@InvoiceDate", moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS));
                    $("#divClientProduct").append(item);
                })
            }
            else {
                $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoProduct.html", function (data) {
                    $("#divTabProduct").html(data);
                });
            }
            //show line invoice
            $("#divClientInvoice").html("");
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
                    item = item.replace("@LocationName", this.LocationName);
                    item = item.replace("@Total", Window.CurrencySymbol + $.number(this.TotalWithTip, Window.NumberDecimal, '.', ','));
                    item = item.replace("@InvoiceDate", moment(this.InvoiceDate).format(Window.FormatDateWithDayOfWeekJS));
                    $("#divClientInvoice").append(item);
                })
            }
            else {
                $.RequestAjaxText("/ContentHtml/Client/Desktop/Detail/NoInvoice.html", function (data) {
                    $("#divTabInvoice").html(data);
                });
            }
            //show line info
            var lineinfo = '<div class="_1qZ_Gc"><div class="_1p62pX _1-EIW_">@Name</div><div class="_1p62pX _206u0u">@Value</div></div>';
            $("#divClientInfo").html("");
            if (data.Client.MobileNumber != null && data.Client.MobileNumber != "") {
                var item = lineinfo.replace("@Name", "Mobile");
                item = item.replace("@Value", "+" + data.Client.MobileNumberDialCode + " " + data.Client.MobileNumber);
                $("#divClientInfo").append(item);
            }
            if (data.Client.Email != null && data.Client.Email != "") {
                var item = lineinfo.replace("@Name", "Email");
                item = item.replace("@Value", data.Client.Email);
                $("#divClientInfo").append(item);
            }
            if (data.Client.Gender != null && data.Client.Gender != "gender_unknown") {
                var item = lineinfo.replace("@Name", "Gender");
                item = item.replace("@Value", Window.ResourcesEnum[data.Client.Gender]);
                $("#divClientInfo").append(item);
            }

            $("#btnTabAppointments").addClass("oEUy3Y");
            $("#divTabAppointment").css('display', 'block');
            $("#divTabProduct").css('display', 'none');
            $("#divTabInvoice").css('display', 'none');
            $("#divTabInfo").css('display', 'none');

        })
    }
    var SendEmail = function () {
        if ($("#form-invoice-send-email").valid()) {
            var email = function () {
                var excute = new EmailInvoice($("#InvoiceID").val());
                excute.GetHtml(function (html) {
                    var entity = new Object();
                    $.RequestAjax(urlGetInvoiceBaseId, JSON.stringify({
                        "InvoiceID": $("#InvoiceID").val()
                    }), function (reponsive) {
                        var Invoice = reponsive.Invoice;

                        entity["SendFrom"] = "";
                        entity["Destination"] = $("#form-invoice-send-email #email").val();
                        entity["MessageSubject"] = "Invoice copy";
                        entity["MessageBody"] = html;
                        entity["MessageType"] = "Invoice Email";
                        entity["AppointmentID"] = Invoice.AppointmentID;
                        entity["ClientID"] = Invoice.ClientID;
                        $.RequestAjax("/Messages/SendMessage", JSON.stringify({
                            entity: entity
                        }), function (data) {
                            if (!JSON.parse(data.Result)) {
                                toastr["error"](data.ErrorMessage, "Error");
                            } else {
                                toastr["success"]("Invoice has been sent to " + $("#form-invoice-send-email #email").val(), "Notification");
                            }
                        })
                    })
                });
            }
            if (typeof EmailInvoice === "undefined") {
                $.getScript("/Scripts/invoice/email-invoice_V2.js").done(function () {
                    email();
                }).fail(function () {
                    console.log("Load file js fail");
                })
            } else
                email();
        }
    }
    $('#form-invoice-send-email').validate({
        rules: {
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            email: 'Recipient Email Address must be filled',
        },
        errorElement: 'em',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            if (element.prop('type') === 'checkbox') {
                error.insertAfter(element.parent('label'));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid').removeClass('is-valid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass('is-valid').removeClass('is-invalid');
        },
    });
    $('#modalVoidInvoice').modal({
        backdrop: false,
        show: false,
    })
    $('#modalVoidInvoice').on('hidden.bs.modal', function (e) {
        $("body").find(".modal-backdrop").remove();
    })
    $('#modalVoidInvoice').on('shown.bs.modal', function (e) {
        $("body").append('<div class="modal-backdrop fade show"></div>');
    })
    $("#titleModalMain").text("View Invoice");
    //Load invoice
    if ($("#InvoiceID").val() != 0) {
        $.RequestAjax(urlGetInvoiceBaseId, JSON.stringify({
            "InvoiceID": $("#InvoiceID").val()
        }), function (reponsive) {
            dataInvoice = reponsive;
            var Invoice = reponsive.Invoice;
            var Client = reponsive.Client;
            var InvoiceDetail = reponsive.InvoiceDetail;
            var InvoicePayment = reponsive.InvoicePayment;
            var Refund = reponsive.Refund;
            var OrgInvoice = reponsive.OrgInvoice;
            //show client
            $("#titleViewInvoice").html("View Invoice");

            if (Client != null) {
                ShowClientInfo(Client);
            }
            else {
                $("#txtClientName").html(Invoice.ClientName);
                $("#txtClientLetter").html(Invoice.ClientName.substr(0, 1).toUpperCase());
                $("#openClientDetail").hide();//icon click open clientDetail
            }
            //show rebook
            if (Invoice.AppointmentID != null && Invoice.AppointmentID != 0) {
                $(".divRebook").show();
                var html = htmlRebook.replace("@RebookText", "Rebook " + Invoice.ClientName + "'s appointment");
                html = html.replace("@href", "/Calendar");
                $(".divRebook").html(html);
            }
            $("#divInvoiceStatus").hide();
            $("#divCompleted").hide();
            $("#divUnpaid").hide();
            $("#divRefund").hide();
            if (Invoice.InvoiceStatus == "invoice_status_unpaid" || Invoice.InvoiceStatus == "invoice_status_part_paid") {
                $("#divInvoiceStatus").show();
                $("#txtInvoiceStatus").html(Window.CurrencySymbol + $.number(Invoice.TotalWithTip, Window.NumberDecimal, '.', ',') + " " + Window.ResourcesEnum[Invoice.InvoiceStatus]);
                $("#divUnpaid").css('display', 'flex');
                $("#txtInvoiceStatusText").html(Window.ResourcesEnum[Invoice.InvoiceStatus]);
            }
            else if (Invoice.InvoiceStatus == "invoice_status_complete") {
                $("#divCompleted").css('display', 'flex');
                var note = "Full payment received on " + moment(Invoice.InvoiceDateString).format(Window.FormatDateWithDayOfWeekJS) + " at " + Invoice.LocationName + " by " + Invoice.UserCreateName;
                if (Invoice.HasRefund == true && Invoice.RefInvoiceID != null && Refund != null) {
                    note = note + ", Refunded " + moment(Refund.InvoiceDateString).format(Window.FormatDateWithDayOfWeekJS) + " at " + Refund.LocationName + " by " + Refund.UserCreateName + " with <a href='/Sale/Invoices?id=" + Refund.InvoiceID + "'>#" + Refund.InvoiceNo + "</a>";
                }
                $("#txtCompleteNote").html(note);
            }
            else if (Invoice.InvoiceStatus == "invoice_status_refund") {
                $("#divRefund").css('display', 'flex');
                $("#txtRefundNote").html("Refund created on " + moment(Invoice.InvoiceDateString).format(Window.FormatDateWithDayOfWeekJS) + " at " + Invoice.LocationName + " by " + Invoice.UserCreateName + "");
            }
            //show invoice
            $("#txtInvoiceNo").html(Window.customInvoiceTitle + " #" + Invoice.InvoiceNo);
            $("#txtInvoiceDate").html(moment(Invoice.InvoiceDateString).format(Window.FormatDateWithDayOfWeekJS));
            //show invoice detail
            $("#divInvoiceDetail").html('');
            var TaxDetail = [];
            $.each(InvoiceDetail, function () {
                var ItemDetail = "";
                if (this.ItemType == "item_type_product") {
                    ItemDetail = ItemDetail + (this.Barcode == null ? "" : $.trim(this.Barcode));
                    ItemDetail = ItemDetail + (ItemDetail == "" ? "" : ",") + (this.SKU == null ? "" : this.SKU);
                    if (ItemDetail == "")
                        ItemDetail = ItemDetail == "" ? "" : ((this.DiscountName == null || this.DiscountName == "") ? "" : "" + this.DiscountName);
                    else
                        ItemDetail = ItemDetail + ((this.DiscountName == null || this.DiscountName == "") ? "" : ", " + this.DiscountName);
                }
                else if (this.ItemType == "item_type_service") {
                    if (this.AppointmentServiceID != null && this.AppointmentServiceID != 0) {
                        ItemDetail = ItemDetail + (this.StartTimeAPSServiceString == null ? "" : (moment(this.StartTimeAPSServiceString).format(Window.FormatTimeJS) + ', ' + moment(this.StartTimeAPSServiceString).format(Window.FormatDateMonthNameJS)));
                        ItemDetail = ItemDetail == "" ? "" : (ItemDetail + ", " + (this.StaffAPSService == null ? "" : " with  " + this.StaffAPSService));
                    }
                    else {
                        ItemDetail = (this.StaffIV == null || this.StaffIV == "") ? "" : " with  " + this.StaffIV;
                    }
                }
                else {
                    ItemDetail = "Code: " + this.VoucherCode + ", expires on " + moment(this.ExpireDateString).format(Window.FormatDateMonthNameJS);
                }
                var htmlitem = htmlInvoiceItem.replace("@Quantity", this.Quantity)
                    .replace("@ItemName", this.ItemName + (this.ItemType == "item_type_gift_voucher" ? ": " + Window.CurrencySymbol + $.number(this.VoucherValue, Window.NumberDecimal, '.', ',') : ""))
                    .replace("@ItemDetail", ItemDetail)
                    .replace("@ItemAmount", $.number(this.PriceAfterDiscount, Window.NumberDecimal, '.', ','));
                if (this.RetailPrice > this.PriceAfterDiscount) {
                    htmlitem = htmlitem.replace("@OrgPriceDisplay", $.number(this.RetailPrice, Window.NumberDecimal, '.', ','));
                }
                else {
                    htmlitem = htmlitem.replace("@OrgPriceDisplay", "");
                }
                $("#divInvoiceDetail").append(htmlitem);

                //check tax 
                if (this.TaxID != null && this.TaxID != 0) {
                    if (TaxDetail.length > 0) {
                        var isexist = false;
                        for (var i = 0; i < TaxDetail.length; i++) {
                            if (this.TaxID == TaxDetail[i].TaxID) {
                                TaxDetail[i].TaxAmount = TaxDetail[i].TaxAmount + this.TotalTaxDetail;
                                isexist = true;
                                break;
                            }
                        }
                        if (isexist == false) {
                            TaxDetail.push({
                                TaxID: this.TaxID,
                                TaxName: this.TaxName,
                                TaxAmount: this.TotalTaxDetail,
                                TaxRate: this.TaxRate
                            });
                        }
                    }
                    else {
                        TaxDetail.push({
                            TaxID: this.TaxID,
                            TaxName: this.TaxName,
                            TaxAmount: this.TotalTaxDetail,
                            TaxRate: this.TaxRate
                        });
                    }
                }

            })
            //line tax detail
            $("#divTaxDetail").html("");
            if (TaxDetail != null && TaxDetail.length > 0) {
                $.each(TaxDetail, function () {
                    var htmltax = htmlTaxDetail.replace("@TaxName", this.TaxName + " " + $.number(this.TaxRate, 0, '.', ',') + "%").replace("@TaxAmount", Window.CurrencySymbol + $.number(this.TaxAmount, Window.NumberDecimal, '.', ','));
                    $("#divTaxDetail").append(htmltax);
                })
            }
            //line total
            $("#subtotal").html(Window.CurrencySymbol + $.number(Invoice.SubTotalBeForeTax, Window.NumberDecimal, '.', ','));
            $("#total").html(Window.CurrencySymbol + $.number(Invoice.Total, Window.NumberDecimal, '.', ','));
            if (Invoice.Change > 0) {
                $("#divChange").css('display', 'flex');
                $("#ChangeAmount").html(Window.CurrencySymbol + $.number(Invoice.Change, Window.NumberDecimal, '.', ','));
            }
            $("#balance").html(Window.CurrencySymbol + $.number(Invoice.Balance, Window.NumberDecimal, '.', ','));
            //divLinePayment
            $("#divLinePayment").html("");
            $("#divLinePayment").css('display', 'flex');
            if (Invoice.TipAmount > 0) {
                var tip = htmlPaymentItem.replace("@PaymentType", "Tips")
                        .replace("@PaymentAmount", Window.CurrencySymbol + $.number(Invoice.TipAmount, Window.NumberDecimal, '.', ','))
                        .replace("@PaymentTime", "");
                $("#divLinePayment").append(tip);
            }
            if (InvoicePayment != null && InvoicePayment.length > 0) {
                //PaymentTime
                $.each(InvoicePayment, function () {
                    var line = htmlPaymentItem.replace("@PaymentType", this.PaymentTypeName)
                        .replace("@PaymentAmount", Window.CurrencySymbol + $.number(this.PaymentAmount, Window.NumberDecimal, '.', ','))
                        .replace("@PaymentTime", moment(this.PaymentDateString).format(Window.FormatDateWithDayOfWeekJS) + " at " + moment(this.PaymentDateString).format(Window.FormatTimeJS));
                    $("#divLinePayment").append(line);
                })
            }
            //add them div de add new payment
            $("#divLinePayment").append('<div id="divPayment"></div>');
            //show hide button more option
            if (Invoice.InvoiceType == "invoice_type_refund") {
                $("#btnRefund").hide();
                $("#txtRefundOrgInvoice").html("Refund of original invoice <a href='/Sale/Invoices?id=" + OrgInvoice.InvoiceID + "'>" + OrgInvoice.InvoiceNo + "</a>");
            }
            else if (Invoice.HasRefund == true) {
                $("#btnRefund").hide();
                $("#btnVoid").hide();
            }
            //truong hop pay khong phai view invoice
            if ($("#IsPay").val() != null && $("#IsPay").val() == "1") {
                $("#titleViewInvoice").html("Apply Payment");
                $("#divPaymentLeft").css('display', 'flex');
                $("#divCompleted").css('display', 'none');
                $("#divUnpaid").css('display', 'none');
                $("#divRefund").css('display', 'none');
                $("#divGroupSendEmail").css('display', 'none');
                $("#divGroupMoreOption").css('display', 'none');
                $("#spanCurrencySymbol").html(Window.CurrencySymbol);
                $("#Pay").val(parseFloat(Invoice.Balance).toFixed(Window.NumberDecimal));
                //Setting min, max, step input amount
                if (Window.NumberDecimal == 0) {
                    $("#Pay").attr("step", "1");
                }
                else if (Window.NumberDecimal == 1) {
                    $("#Pay").attr("step", "0.1");
                }
                else if (Window.NumberDecimal == 2) {
                    $("#Pay").attr("step", "0.01");
                }
                LoadPaymentType();
                SumTotal();
            }

            //
            var FromSaveInvoice = localStorage.getItem("FromSaveInvoice");
            localStorage.setItem("FromSaveInvoice", '');
            if (Window.printReceipts == "1" && FromSaveInvoice != null && FromSaveInvoice == "1") {
                var print = function () {
                    var excute = new PrintInvoice($("#InvoiceID").val());
                    excute.Print();
                }
                if (typeof PrintInvoice === "undefined") {
                    $.getScript("/Scripts/invoice/print-invoice.js").done(function () {
                        print();
                    }).fail(function () {
                        console.log("Load file js fail");
                    })
                } else
                    print();
            }
        })
    }

    //#region event
    $("#divLineInfo").click(function () {
        if ($("#ClientID").val() != 0) {
            if ($("#IsPay").val() != null && $("#IsPay").val() == "1") {
                $("#divPaymentLeft").css('display', 'none');
            }
            var element = $(htmlHideLeft);
            $("#divHideLeft").html(element);
            $("#divClientDetail").css('transform', 'translate3d(0px, 0px, 0px)');
            $("#divClientDetail").css('transition', '-webkit-transform 375ms cubic-bezier(0, 0, 0.2, 1) 0ms');
            $("#openClientDetail").hide();
            $("#btnMoreOptionClient").show();

            element.click(function () {
                if ($("#IsPay").val() != null && $("#IsPay").val() == "1") {
                    $("#divPaymentLeft").css('display', 'flex');
                }
                $("#divClientDetail").css('transform', 'translateX(100%)');
                $("#divClientDetail").css('transition', '');
                $("#divHideLeft").html('');
                $("#openClientDetail").show();
                $("#btnMoreOptionClient").hide();
            })
        }
    })
    $(".divRebook").click(function () {
        ; debugger;
        if (dataInvoice && dataInvoice.Invoice.AppointmentID) {
            localStorage.setItem("IsViewCopyOrCutAppointment", true);
            localStorage.setItem("locationIdCopyOrCutAppointment", dataInvoice.Invoice.LocationID);
            localStorage.setItem("CopyOrCutAppointmentID", dataInvoice.Invoice.AppointmentID);
            localStorage.setItem("IsCopyOrCutAppointment", false);
        }
    })
    $("#btnEditClientDetails").click(function () {
        $("#actionModal #TitleModal").text("Edit Client");
        //lay client
        $.RequestAjax("/Clients/GetClientByID", JSON.stringify({
            ID: $("#ClientID").val(),
        }), function (data) {
            var client = data.data;
            $("#actionModal #ClientID").val(client.ClientID);
            $("#actionModal #FirstName").val(client.FirstName);
            $("#actionModal #LastName").val(client.LastName);
            $("#actionModal #MobileNumber").val(client.MobileNumber);
            $("#actionModal #Telephone").val(client.Telephone);
            $("#actionModal #Email").val(client.Email);
            $("#actionModal #AppointmentNotificationType").val(client.AppointmentNotificationType).change();
            $("#actionModal #AcceptMarketingNotifications").iCheck(client.AcceptMarketingNotifications == true ? 'check' : 'uncheck');
            $("#actionModal #Gender").val(client.Gender).change();
            $("#actionModal #ReferralSource").SetValueSelect2ID(client.ReferralSource);
            if (client.DateOfBirth != null) {
                if (moment(client.DateOfBirth).year() == 1900) {
                    NotYear = true;
                    $("#actionModal #DateOfBirth").daterangepicker({
                        "singleDatePicker": true,
                        "timePicker": false,
                        "changeYear": false,
                        "locale": {
                            "format": "DD/MM",
                        }
                    });
                    $("#actionModal #setyear").html("Set year");
                }
                else {
                    NotYear = false;
                    $("#actionModal #DateOfBirth").daterangepicker({
                        "singleDatePicker": true,
                        "timePicker": false,
                        "locale": {
                            "format": Window.FormatDateJS,
                        }
                    });
                    $("#actionModal #setyear").html("Remove year");
                }
            }
            $("#actionModal #DateOfBirth").data('daterangepicker').setStartDate(client.DateOfBirth ? moment(client.DateOfBirth)._d : moment()._d);
            $("#actionModal #DisplayOnAllBookings").iCheck(client.DisplayOnAllBookings == true ? 'check' : 'uncheck');
            $("#actionModal #ClientNotes").val(client.ClientNotes);
            $("#actionModal #Address").val(client.Address);
            $("#actionModal #Suburb").val(client.Suburb);
            $("#actionModal #City").val(client.City);
            $("#actionModal #State").val(client.State);
            $("#actionModal #PostCode").val(client.PostCode);
        }, function () {
        })

        $('#actionModal').modal("show");

        if ($("#IsPay").val() != null && $("#IsPay").val() == "1") {
            $("#divPaymentLeft").css('display', 'flex');
        }
        $("#divClientDetail").css('transform', 'translateX(100%)');
        $("#divClientDetail").css('transition', '');
        $("#divHideLeft").html('');
        $("#openClientDetail").show();
        $("#btnMoreOptionClient").hide();
    })
    $("#closeModalMain").click(function () {
        var PreLink = localStorage.getItem("PreLink");
        localStorage.setItem("PreLink", '');
        if (PreLink != null && PreLink != '') {
            window.location = PreLink;
        }
        else {
            location.href = "/Calendar";
        }
    })
    $("#btnClose").click(function () {
        var PreLink = localStorage.getItem("PreLink");
        localStorage.setItem("PreLink", '');
        if (PreLink != null && PreLink != '') {
            window.location = PreLink;
        }
        else {
            location.href = "/Calendar";
        }
    })
    $("#btnDownload").click(function () {
        var generatepdf = function () {
            var generate = new PDFInvoice($("#InvoiceID").val());
            generate.GeneratePDF(true);
        }
        if (typeof PDFInvoice === "undefined") {
            $.getScript("/Scripts/invoice/pdf-invoice.js").done(function () {
                generatepdf();
            }).fail(function () {
                console.log("Load file js fail");
            })
        } else
            generatepdf();
    })
    $("#btnPrint").click(function () {
        var print = function () {
            var excute = new PrintInvoice($("#InvoiceID").val());
            excute.Print();
        }
        if (typeof PrintInvoice === "undefined") {
            $.getScript("/Scripts/invoice/print-invoice.js").done(function () {
                print();
            }).fail(function () {
                console.log("Load file js fail");
            })
        } else
            print();
    })
    $("#btnSendInvoice").click(function () {
        $("#form-invoice-send-email #email").val($.trim($("#form-invoice-send-email #email").val()));
        SendEmail();
    })
    document.getElementById("form-invoice-send-email").onkeypress = function (e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            SendEmail();
            e.preventDefault();
        }
    }
    $("#btnRefund").click(function () {
        location.href = "/Sale/Refund?id=" + $("#InvoiceID").val();
    })
    $("#btnVoid").click(function () {
        if (dataInvoice != null) {
            $("#divVoidItem").html("");
            var Invoice = dataInvoice.Invoice;
            var InvoiceDetail = dataInvoice.InvoiceDetail;
            var InvoicePayment = dataInvoice.InvoicePayment;
            //delete payment
            if (InvoicePayment != null && InvoicePayment.length > 0) {
                $.each(InvoicePayment, function () {
                    var line1 = "Payment " + this.InvoicePaymentID + " will be deleted";
                    var line2 = "The amount paid is " + $.number(this.PaymentAmount, Window.NumberDecimal, '.', ',') + " by " + this.PaymentTypeName + " on " + moment(this.PaymentDate).format(Window.FormatDateWithDayOfWeekJS);
                    var line = htmlVoidItem.replace("@line1", line1).replace("@line2", line2);
                    $("#divVoidItem").append(line);
                })
            }
            //return product
            $.each(InvoiceDetail, function () {
                if (this.ItemType == "item_type_product" && this.EnableStockControl == true) {
                    var line1 = "Product stock will be returned to " + Invoice.LocationName;
                    var line2 = this.Quantity + " of " + this.ItemName + " will be returned";
                    var line = htmlVoidItem.replace("@line1", line1).replace("@line2", line2);
                    $("#divVoidItem").append(line);
                }
            })
            $("#modalVoidInvoice").modal("show");
        }
    })
    $("#btnVoidInvoice").click(function () {
        $.RequestAjax(urlVoidInvoice, JSON.stringify({
            "InvoiceID": $("#InvoiceID").val()
        }), function (data) {
            if (JSON.parse(data.Result)) {
                var PreLink = localStorage.getItem("PreLink");
                localStorage.setItem("PreLink", '');
                if (PreLink != null && PreLink != '') {
                    window.location = PreLink;
                }
                else {
                    location.href = "/Calendar";
                }
            }
            else {
                toastr["error"](data.ErrorMessage, "Error");
            }
        })
    })
    $("#btnPayNow").click(function () {
        window.location = "/Sale/Pay?id=" + $("#InvoiceID").val();
    })
    $("#divPaymentMethod").find(":button").click(function () {
        //kiem tra la voucher
        if ($(this).attr("PaymentTypeID") == 0) {
            $("#formRedeemVoucher #VoucherID").val("");
            $("#formRedeemVoucher #ServiceID").val("");
            $("#formRedeemVoucher #txtSearchVoucherCode").val("");
            $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'flex');
            $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');
            $("#formRedeemVoucher #divFoundVoucher").css('display', 'none');
            $("#actionModalRedeemVoucher").modal("show");
            return;
        }
        AddItemPayment($(this).attr("PaymentTypeID"), parseFloat($("#Pay").val()), $(this).attr("PaymentTypeName"), 0, "", 0);
    })
    $("#btnBackToPayment").click(function () {
        $("#divPayment").html("");
        SumTotal();
    })
    $("#btnCompleteSale").click(function () {
        SaveInvoice("invoice_status_complete");
    })
    $("#btnSaveUnpaid").click(function () {
        SaveInvoice("invoice_status_unpaid");
    })
    $("#btnSavePartPaid").click(function () {
        SaveInvoice("invoice_status_part_paid");
    })
    $.ModalInvoiceDetails = function (clickSave) {
        if (!HtmlModalModalInvoiceDetails)
            $.RequestAjaxText("/ContentHtml/CheckOut/Desktop/ModalPaymentDetails.html", function (data) { HtmlModalModalInvoiceDetails = data; });
        var modal = $(HtmlModalModalInvoiceDetails);
        modal.find("#staffModalInvoiceDetails").InStallSelect2('/Sale/LoadSelect2ForUserLocation', 20, 'Select staff', { "LocationId": dataInvoice.Invoice.LocationID });
        modal.find("#staffModalInvoiceDetails").SetValueSelect2ID($("#UserID").val());
        modal.modal({
            keyboard: false,
            show: true,
            backdrop: "static"
        })
        modal.on('hidden.bs.modal', function (e) {
            $(this).remove();
        })
        if (clickSave) {
            modal.find("#saveModalInvoiceDetailsButton").click(clickSave);
        }
    };
    var HtmlModalModalInvoiceDetails;
    $("#btnInvoiceDetails").click(function () {
        $.ModalInvoiceDetails(function () {
            var modal = $(this).closest(".modal");
            $("#UserID").val(modal.find("#staffModalInvoiceDetails").val());
        });
    })
    $("#actionModalRedeemVoucher #txtSearchVoucherCode").on("input", function (e) {
        var code = $(this).val();
        if (code == "") {
            $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'flex');
            $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');
            $("#formRedeemVoucher #divFoundVoucher").css('display', 'none');
        }
        else {
            $.RequestAjax(urlSearchVoucherCode, JSON.stringify({
                "Search": code
            }), function (data) {
                if (data.Results.length > 0) {
                    var Voucher = data.Results[0];
                    //show thong tin voucher
                    $("#formRedeemVoucher #txtCurrency").html(Window.CurrencySymbol);
                    if (Voucher.VoucherType == "voucher_type_gift_voucher") {
                        $("#formRedeemVoucher #txtVoucherType").html("GIFT");
                        $("#formRedeemVoucher #divVoucherType").html("Outstanding <span>" + Window.CurrencySymbol + $.number(Voucher.Remaining, Window.NumberDecimal, '.', ',') + "</span>");
                        $("#formRedeemVoucher #divVoucherServiceName").html("");
                    }
                    else {
                        $("#formRedeemVoucher #txtVoucherType").html("SERVICE");
                        $("#formRedeemVoucher #divVoucherType").html("Voucher of <span>" + Window.CurrencySymbol + $.number(Voucher.Remaining, Window.NumberDecimal, '.', ',') + "</span>");
                        $("#formRedeemVoucher #divVoucherServiceName").html(Voucher.ServiceName + " (" + Voucher.DurationName + ")");
                    }
                    if (Voucher.RedeemedDate != null) {
                        $("#formRedeemVoucher #txtExpire").html("Redeemed " + moment(Voucher.RedeemedDate).format(Window.FormatDateWithDayOfWeekJS) + ", invoice " + Voucher.RedeemedInvoiceNo);
                    }
                    else {
                        if (Voucher.ExpireDate != null) {
                            $("#formRedeemVoucher #txtExpire").html("Expires " + moment(Voucher.ExpireDate).format(Window.FormatDateWithDayOfWeekJS));
                        }
                        else {
                            $("#formRedeemVoucher #txtExpire").html("No Expiry");
                        }
                    }
                    $("#formRedeemVoucher #txtPurchase").html("Purchased " + moment(Voucher.IssueDate).format(Window.FormatDateWithDayOfWeekJS));
                    //
                    $("#formRedeemVoucher #divMessageVoucher").css('display', 'block');
                    $("#formRedeemVoucher #lblRedeemInput").css('display', 'none');
                    $("#formRedeemVoucher #btnRedeem").css('display', 'none');
                    $("#formRedeemVoucher #divFoundVoucher").css('display', 'flex');
                    $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'none');
                    $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');
                    //kiem tra neu la service voucher thi co service khop khong
                    var existService = false;
                    if (Voucher.VoucherType == "voucher_type_service_voucher") {
                        $.each(dataInvoice.InvoiceDetail, function () {
                            if (this.ItemType == "item_type_service") {
                                if (this.ItemID == Voucher.ServiceID) {
                                    existService = true;
                                }
                            }
                        })
                        if (existService == false) {
                            $("#formRedeemVoucher #divMessageVoucher").html("This voucher cannot be redeemed, the service type does not match.");
                            return;
                        }
                    }
                    //check ExpireDate
                    if (Voucher.ExpireDate != null) {
                        if (moment(Voucher.ExpireDate).isBefore(moment().tz(Window.TimeZone))) {
                            $("#formRedeemVoucher #divMessageVoucher").html("This voucher has been expired.");
                            return;
                        }
                    }
                    //kiem tra voucher con remaining khong
                    if (Voucher.Remaining == 0) {
                        $("#formRedeemVoucher #divMessageVoucher").html("This voucher was already fully redeemed.");
                        return;
                    }
                    //kiem tra voucher nay co status = unpaid hoac da refund
                    if (Voucher.VoucherStatus == "voucher_status_refunded_invoice" || Voucher.VoucherStatus == "voucher_status_unpaid") {
                        $("#formRedeemVoucher #divMessageVoucher").html("This voucher cannot be redeemed, the original sale is unpaid.");
                        return;
                    }
                    //kiem tra xem voucher nay da add trong invoice nay chua
                    var isexist = false
                    $("#divPayment ._3A8Cgx").each(function () {
                        if (Voucher.VoucherID == $(this).attr("VoucherID")) {
                            isexist = true;
                        }
                    })
                    if (isexist == true) {
                        $("#formRedeemVoucher #divMessageVoucher").html("This voucher was already selected for payment on this invoice.");
                        return;
                    }
                    //--------------------------------------------EVERYTHING IS OK
                    $("#formRedeemVoucher #VoucherID").val(Voucher.VoucherID);
                    $("#formRedeemVoucher #divMessageVoucher").css('display', 'none');
                    $("#formRedeemVoucher #lblRedeemInput").css('display', 'flex');
                    $("#formRedeemVoucher #btnRedeem").css('display', 'block');
                    $("#formRedeemVoucher #divFoundVoucher").css('display', 'flex');
                    $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'none');
                    $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');

                    //Setting min, max, step input amount
                    if (Window.NumberDecimal == 0) {
                        $("#formRedeemVoucher #txtPayAmount").attr("step", "1");
                    }
                    else if (Window.NumberDecimal == 1) {
                        $("#formRedeemVoucher #txtPayAmount").attr("step", "0.1");
                    }
                    else if (Window.NumberDecimal == 2) {
                        $("#formRedeemVoucher #txtPayAmount").attr("step", "0.01");
                    }
                    //Set readonly input amount and set redeem amount
                    if (Voucher.VoucherType == "voucher_type_service_voucher") {
                        $("#formRedeemVoucher #txtPayAmount").attr("readonly", true);
                        $("#formRedeemVoucher #txtPayAmount").attr("disabled", true);
                        //Lay tong tien service can phai thanh toan
                        var ServiceAmount = 0;
                        $.each(dataInvoice.InvoiceDetail, function () {
                            if (this.ItemType == "item_type_service") {
                                if (this.ItemID == Voucher.ServiceID) {
                                    ServiceAmount = ServiceAmount + parseFloat(this.SubTotalDetail);
                                }
                            }
                        })
                        //Lay tong tien da thanh toan cho service nay
                        var PayForService = 0;
                        $("#divPayment ._3A8Cgx").each(function () {
                            if ($(this).attr("PayForServiceID") == Voucher.ServiceID) {
                                PayForService = PayForService + parseFloat($(this).attr("Amount"));
                            }
                        })
                        //lay luon phan da thanh toan
                        $.each(dataInvoice.InvoicePayment, function () {
                            if (this.PayForServiceID == Voucher.ServiceID) {
                                PayForService = PayForService + parseFloat(this.PaymentAmount);
                            }
                        })

                        //So tien con lai phai thanh toan cho service
                        var RedeemAmount = 0;
                        ServiceAmount = ServiceAmount - PayForService;
                        //kiem tra tong tien con lai phai thanh toan so voi tien thanh toan cho service
                        if (BalanceAmount <= ServiceAmount) {
                            RedeemAmount = BalanceAmount;
                        }
                        else {
                            RedeemAmount = ServiceAmount;
                        }
                        if (RedeemAmount > Voucher.Remaining) {
                            RedeemAmount = Voucher.Remaining;
                        }

                        if (RedeemAmount == 0) {
                            $("#formRedeemVoucher #divMessageVoucher").html("This service has been pay full.");
                            $("#formRedeemVoucher #divMessageVoucher").css('display', 'block');
                            $("#formRedeemVoucher #lblRedeemInput").css('display', 'none');
                            $("#formRedeemVoucher #btnRedeem").css('display', 'none');
                            $("#formRedeemVoucher #divFoundVoucher").css('display', 'flex');
                            $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'none');
                            $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'none');
                            return;
                        }

                        $("#formRedeemVoucher #txtPayAmount").val(RedeemAmount);
                        $("#formRedeemVoucher #txtPayAmount").attr("max", RedeemAmount);
                        $("#formRedeemVoucher #ServiceID").val(Voucher.ServiceID);
                    }
                    else {
                        if (parseFloat(Voucher.Remaining) >= parseFloat($("#Pay").val())) {
                            $("#formRedeemVoucher #txtPayAmount").val($("#Pay").val());
                            $("#formRedeemVoucher #txtPayAmount").attr("max", $("#Pay").val());
                        }
                        else {
                            $("#formRedeemVoucher #txtPayAmount").val(Voucher.Remaining);
                            $("#formRedeemVoucher #txtPayAmount").attr("max", Voucher.Remaining);
                        }

                        $("#formRedeemVoucher #txtPayAmount").attr("readonly", false);
                        $("#formRedeemVoucher #txtPayAmount").attr("disabled", false);
                    }
                }
                else {
                    $("#formRedeemVoucher #divSearchVoucherCode").css('display', 'none');
                    $("#formRedeemVoucher #divFoundVoucher").css('display', 'none');
                    $("#formRedeemVoucher #divNotFoundVoucher").css('display', 'flex');
                }
            }, function () {
            })
        }
    })
    $("#actionModalRedeemVoucher #txtPayAmount").on("input", function (e) {
        var amount = $(this).val();
        if (amount == 0) {
            $("#actionModalRedeemVoucher #btnRedeem").css("", "");
        }
    })
    $("#actionModalRedeemVoucher #btnRedeem").click(function () {
        AddItemPayment(0, parseFloat($("#formRedeemVoucher #txtPayAmount").val()), "Voucher (" + $("#formRedeemVoucher #txtSearchVoucherCode").val() + ")", $("#formRedeemVoucher #VoucherID").val(), $("#formRedeemVoucher #txtSearchVoucherCode").val(), $("#formRedeemVoucher #ServiceID").val());
        $("#actionModalRedeemVoucher").modal("hide");
    })
    //cho 4 tab client
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            if ($("#IsPay").val() != null && $("#IsPay").val() == "1") {
                $("#divPaymentLeft").css('display', 'flex');
            }
            $("#divClientDetail").css('transform', 'translateX(100%)');
            $("#divClientDetail").css('transition', '');
            $("#divHideLeft").html('');
            $("#openClientDetail").show();
            $("#btnMoreOptionClient").hide();
        }
    })
    $("#btnTabAppointments").click(function () {
        $("#btnTabAppointments").removeClass("oEUy3Y").addClass("oEUy3Y");
        $("#btnTabProducts").removeClass("oEUy3Y");
        $("#btnTabInvoices").removeClass("oEUy3Y");
        $("#btnTabInfo").removeClass("oEUy3Y");

        $("#divTabAppointment").css('display', 'block');
        $("#divTabProduct").css('display', 'none');
        $("#divTabInvoice").css('display', 'none');
        $("#divTabInfo").css('display', 'none');
    })
    $("#btnTabProducts").click(function () {
        $("#btnTabProducts").removeClass("oEUy3Y").addClass("oEUy3Y");
        $("#btnTabAppointments").removeClass("oEUy3Y");
        $("#btnTabInvoices").removeClass("oEUy3Y");
        $("#btnTabInfo").removeClass("oEUy3Y");

        $("#divTabProduct").css('display', 'flex');
        $("#divTabAppointment").css('display', 'none');
        $("#divTabInvoice").css('display', 'none');
        $("#divTabInfo").css('display', 'none');
    })
    $("#btnTabInvoices").click(function () {
        $("#btnTabInvoices").removeClass("oEUy3Y").addClass("oEUy3Y");
        $("#btnTabAppointments").removeClass("oEUy3Y");
        $("#btnTabProducts").removeClass("oEUy3Y");
        $("#btnTabInfo").removeClass("oEUy3Y");

        $("#divTabInvoice").css('display', 'flex');
        $("#divTabAppointment").css('display', 'none');
        $("#divTabProduct").css('display', 'none');
        $("#divTabInfo").css('display', 'none');
    })
    $("#btnTabInfo").click(function () {
        $("#btnTabInfo").removeClass("oEUy3Y").addClass("oEUy3Y");
        $("#btnTabAppointments").removeClass("oEUy3Y");
        $("#btnTabProducts").removeClass("oEUy3Y");
        $("#btnTabInvoices").removeClass("oEUy3Y");

        $("#divTabInfo").css('display', 'flex');
        $("#divTabAppointment").css('display', 'none');
        $("#divTabProduct").css('display', 'none');
        $("#divTabInvoice").css('display', 'none');
    })
    Ladda.bind('#actionButton', {
        callback: function (instance) {
            instance.start();
            if ($("#actionForm").valid()) {
                var entity = new Object();
                $("#actionForm").find("[ispropertiesmodel]").each(function () {
                    if ($(this).is("input[type='text'],input[type='number'],input[type='email'],textarea,select,input[type='hidden'],input[type='password']"))
                        entity[$(this).attr("id")] = $(this).val();
                    if ($(this).is("input[type='checkbox'],input[type='radio']"))
                        entity[$(this).attr("id")] = this.checked;
                    if ($(this).is("[isnumber]"))
                        entity[$(this).attr("id")] = entity[$(this).attr("id")].replace(/,/gi, '');
                    if ($(this).is("[isdate]") && $(this).val() != "") {
                        if ($(this).attr("id") == "DateOfBirth") {
                            if (NotYear) {
                                entity[$(this).attr("id")] = "1900/" + moment(entity[$(this).attr("id")], Window.FormatDateJS).format("MM/DD");
                            }
                            else {
                                entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], Window.FormatDateJS).format("YYYY/MM/DD");
                            }
                        }
                        else
                            entity[$(this).attr("id")] = moment(entity[$(this).attr("id")], Window.FormatDateJS).format("YYYY/MM/DD");
                    }
                })
                $.extend(entity, { MobileNumberDialCode: $("#MobileNumber").intlTelInput("getSelectedCountryData").dialCode });
                $.extend(entity, { TelephoneDialCode: $("#Telephone").intlTelInput("getSelectedCountryData").dialCode });
                $.RequestAjax("/Clients/AddOrUpdate", JSON.stringify({
                    entity: entity,
                    isUpdate: $("#actionForm [ispropertiesidmodel]").val() != 0,
                }), function (data) {
                    toastr["success"]("Data saved successfully.", "Notification");
                    $('#actionModal').modal("hide");
                    ShowClientInfo(data.Client, false);

                }, function () {
                    instance.stop();
                })
            } else
                instance.stop();
        }
    });
    //#endregion
})