using System.Web;
using System.Web.Optimization;

namespace AdminClient
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region script

            #region index home
            bundles.Add(new ScriptBundle("~/Scripts/loadHeaderIndex").Include(
                        "~/Extension/js/jquery.min.js",
                        "~/Extension/js/moment.min.js",
                        "~/Extension/js/moment-timezone-with-data.min.js",
                        "~/Scripts/global/globalFunction.js"));
            bundles.Add(new ScriptBundle("~/Scripts/loadfooterIndex").Include(
                        "~/Extension/js/pace.min.js",
                        "~/Extension/js/popper.min.js",
                        "~/Extension/js/jquery.number.min.js",
                        "~/Extension/js/purl.js",
                        "~/Extension/js/toastr.min.js",
                        "~/Extension/js/jquery.validate.min.js",
                        "~/Extension/js/jquery-ui.min.js",
                        "~/Extension/js/spin.min.js",
                        "~/Extension/js/pdfmake.min.js",
                        "~/Extension/js/vfs_fonts.js",
                        "~/Extension/js/jszip.min.js",
                        "~/Extension/js/ladda.min.js",
                        "~/Extension/js/bootstrap.min.js",
                        "~/Extension/js/PNotify.js",
                        "~/Extension/js/PNotifyAnimate.js",
                        "~/Extension/js/PNotifyButtons.js",
                        "~/Extension/js/PNotifyCallbacks.js",
                        "~/Extension/js/PNotifyConfirm.js",
                        "~/Extension/js/PNotifyDesktop.js",
                        "~/Extension/js/PNotifyHistory.js",
                        "~/Extension/js/PNotifyMobile.js",
                        "~/Extension/js/PNotifyNonBlock.js",
                        "~/Extension/js/PNotifyReference.js",
                        "~/Extension/js/PNotifyStyleMaterial.js",
                        "~/Scripts/coretheme.js"));
            #endregion

            bundles.Add(new ScriptBundle("~/Scripts/datatable").Include(
                        "~/Extension/js/jquery.dataTables.min.js",
                        "~/Extension/js/dataTables.rowReorder.min.js",
                        "~/Extension/js/dataTables.buttons.min.js",
                        "~/Extension/js/buttons.html5.min.js",
                        "~/Extension/js/buttons.print.min.js",
                        "~/Extension/js/dataTables.select.min.js",
                        "~/Extension/js/dataTables.bootstrap4.min.js"));

            // PNotify
            bundles.Add(new ScriptBundle("~/Scripts/PNotify").Include(
                        "~/Extension/js/PNotify.js",
                        "~/Extension/js/PNotifyAnimate.js",
                        "~/Extension/js/PNotifyButtons.js",
                        "~/Extension/js/PNotifyCallbacks.js",
                        "~/Extension/js/PNotifyConfirm.js",
                        "~/Extension/js/PNotifyDesktop.js",
                        "~/Extension/js/PNotifyHistory.js",
                        "~/Extension/js/PNotifyMobile.js",
                        "~/Extension/js/PNotifyNonBlock.js",
                        "~/Extension/js/PNotifyReference.js",
                        "~/Extension/js/PNotifyStyleMaterial.js"));
            // fullcalendar
            bundles.Add(new ScriptBundle("~/Scripts/fullcalendar").Include(
                        "~/Extension/js/fullcalendar.min.js",
                        "~/Extension/js/scheduler.min.js"));
            // inputmask
            bundles.Add(new ScriptBundle("~/Scripts/inputmask").Include(
                        "~/Extension/js/inputmask.min.js",
                        "~/Extension/js/inputmask.numeric.extensions.min.js",
                        "~/Extension/js/jquery.inputmask.bundle.min.js"));
            // Numeral-js-master
            bundles.Add(new ScriptBundle("~/Scripts/numeral").Include(
                        "~/Extension/js/Numeral-js-master/numeral.js",
                        "~/Extension/js/Numeral-js-master/formats/currency.js",
                        "~/Extension/js/Numeral-js-master/formats/bytes.js",
                        "~/Extension/js/Numeral-js-master/formats/bps.js",
                        "~/Extension/js/Numeral-js-master/formats/exponential.js",
                        "~/Extension/js/Numeral-js-master/formats/percentage.js",
                        "~/Extension/js/Numeral-js-master/formats/time.js",
                        "~/Extension/js/Numeral-js-master/formats/ordinal.js"));
            #endregion

            #region style

            #region index home
            bundles.Add(new StyleBundle("~/Style/index").Include(
                        "~/Extension/css/flag-icon.min.css",
                        "~/Extension/css/font-awesome.min.css",
                        "~/Content/coretheme.min.css",
                        "~/Extension/css/simple-line-icons.min.css",
                        "~/Extension/css/jquery-ui.min.css",
                        "~/Extension/css/bootstrap-big-grid.min.css",
                        "~/Extension/css/spinkit.min.css",
                        "~/Extension/css/PNotifyBrightTheme.css",
                        "~/Extension/css/toastr.min.css"));
            #endregion
            //datatable
            bundles.Add(new StyleBundle("~/Style/datatable").Include(
                     "~/Extension/css/dataTables.bootstrap4.min.css",
                      "~/Extension/css/buttons.dataTables.min.css",
                      "~/Extension/css/select.dataTables.min.css",
                     "~/Extension/css/rowReorder.dataTables.min.css"));
            //fullcalendar
            bundles.Add(new StyleBundle("~/Style/fullcalendar").Include(
                       "~/Extension/css/fullcalendar.min.css",
                       "~/Extension/css/scheduler.min.css"));
            #endregion

            BundleTable.EnableOptimizations = false;
        }
    }
}
