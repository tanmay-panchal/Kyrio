using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Web;
using AdminClient.Models;


namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_Service : EntityHelp<Service>
    {
        public static List<Object> GetDataTableIndex(string search, long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            List<Object> result = (from e in excute.ServiceGroups
                                   join c in (from s in excute.Services
                                              join l in (from a in excute.ServiceDurations
                                                         join b in excute.Durations on a.Duration equals b.DurationTime into lsB
                                                         from b in lsB.DefaultIfEmpty()
                                                         where a.BusinessID == BusinessID
                                                         select new { a.ServiceID, a.Duration, b.DurationName, a.RetailPrice, a.SpecialPrice }) on s.ServiceID equals l.ServiceID into lsL
                                              from l in lsL.DefaultIfEmpty()
                                              group l by s into g
                                              where g.Key.BusinessID == BusinessID
                                              select new
                                              {
                                                  g.Key.ServiceID,
                                                  ServiceDurations = g.Select(n => n),
                                                  g.Key.ServiceGroupID,
                                                  g.Key.ServiceName,
                                                  g.Key.BusinessID,
                                                  g.Key.SortOrder
                                              }) on e.ServiceGroupID equals c.ServiceGroupID into lsC
                                   from c in lsC.DefaultIfEmpty()
                                   group new
                                   {
                                       ServiceName = c.ServiceName ?? "",
                                       ServiceDurations = c.ServiceDurations.Select(n => new { Duration = (int?)n.Duration ?? 0, DurationName = n.DurationName ?? "", RetailPrice = (Decimal?)n.RetailPrice ?? 0, SpecialPrice = (Decimal?)n.SpecialPrice ?? 0 }),
                                       ServiceID = (long?)c.ServiceID ?? 0,
                                       BusinessID = (long?)c.BusinessID ?? 0,
                                       SortOrder = (int?)c.SortOrder ?? 0
                                   } by new { e.ServiceGroupID, e.ServiceGroupName, e.BusinessID, e.AppointmentColor, e.SortOrder } into g
                                   where (g.Any(n => n.ServiceName.Contains(search) || n.ServiceDurations.Any(m => m.DurationName.Contains(search))) || g.Key.ServiceGroupName.Contains(search)) && g.Any(n => n.BusinessID == BusinessID || n.BusinessID == 0) && g.Key.BusinessID == BusinessID
                                   select new
                                   {
                                       g.Key.ServiceGroupID,
                                       ServiceGroupName = g.Key.ServiceGroupName ?? "",
                                       Services = g.Where(n => n.BusinessID != 0).Select(n => n).OrderBy(n => n.SortOrder),
                                       AppointmentColor = g.Key.AppointmentColor ?? "",
                                       g.Key.SortOrder
                                   }).OrderBy(n => n.SortOrder).ToList<Object>();
            return result;
        }
        public static Object GetEntityAttachDurationBaseId(long ServiceID)
        {
            ModelEntity excute = new ModelEntity();
            Object result = (from s in (from a in excute.Services
                                        join b in excute.PricingTypes on a.PricingType equals b.PricingTypeID into lsB
                                        from b in lsB.DefaultIfEmpty()
                                        join c in excute.TreatmentTypes on a.TreatmentType equals c.TreatmentTypeID into lsC
                                        from c in lsC.DefaultIfEmpty()
                                        join d in excute.AvailableFors on a.AvailableFor equals d.AvailableForID into lsD
                                        from d in lsD.DefaultIfEmpty()
                                        join e in excute.ExtraTimeTypes on a.ExtraTimeType equals e.ExtraTimeTypeID into lsE
                                        from e in lsE.DefaultIfEmpty()
                                        join i in excute.Durations on a.ExtraTimeDuration equals i.DurationTime into lsI
                                        from i in lsI.DefaultIfEmpty()
                                        join t in excute.Taxes on a.TaxID equals t.TaxID into lsT
                                        from t in lsT.DefaultIfEmpty()
                                        join v in excute.VoucherExpiryPeriods on a.VoucherExpiryPeriod equals v.VoucherExpiryPeriodID into lsV
                                        from v in lsV.DefaultIfEmpty()
                                        where a.ServiceID == ServiceID
                                        select new { Service = a, PricingTypeName = b.PricingTypeName ?? "", TreatmentTypeName = c.TreatmentTypeName ?? "", AvailableForName = d.AvailableForName ?? "", ExtraTimeTypeName = e.ExtraTimeTypeName ?? "", DurationName = i.DurationName ?? "", TaxName = t.TaxName ?? "", VoucherExpiryPeriodName = v.VoucherExpiryPeriodName ?? "" }
                                         )
                             select new
                             {
                                 Service = s,
                                 ServiceDurations = excute.ServiceDurations.Where(n => n.ServiceID == ServiceID),
                                 ServiceStaffs = excute.ServiceStaffs.Where(n => n.ServiceID == ServiceID),
                                 ServiceResources = excute.ServiceResources.Where(n => n.ServiceID == ServiceID)
                             }).FirstOrDefault();
            return result;
        }
        public static List<Object> GetComboboxServiceAppointment(string search, long BusinessID)
        {
            ModelEntity excute = new ModelEntity();
            List<Object> result = (from s_g in excute.ServiceGroups
                                   join s in (from s_d in excute.ServiceDurations
                                              join d in excute.Durations on s_d.Duration equals d.DurationTime into lsD
                                              from d in lsD.DefaultIfEmpty()
                                              join s in excute.Services on new { s_d.ServiceID, s_d.BusinessID } equals new { s.ServiceID, s.BusinessID } into lsS
                                              from s in lsS.DefaultIfEmpty()
                                              select new
                                              {
                                                  s_d.Duration,
                                                  RetailPrice = (Decimal?)s_d.RetailPrice ?? 0,
                                                  SpecialPrice = (Decimal?)s_d.SpecialPrice ?? 0,
                                                  d.DurationName,
                                                  s.ServiceGroupID,
                                                  s_d.BusinessID,
                                                  s.ServiceName,
                                                  s.ServiceID
                                              }).OrderBy(n => n.ServiceGroupID) on new { s_g.ServiceGroupID, s_g.BusinessID } equals new { s.ServiceGroupID, s.BusinessID } into lsS
                                   from s in lsS.DefaultIfEmpty()
                                   group s by s_g into g
                                   where g.Any(n => n.ServiceName.Contains(search)) && g.Key.BusinessID == BusinessID
                                   select new { g.Key.ServiceGroupID, g.Key.ServiceGroupName, g.Key.AppointmentColor, g.Key.SortOrder, Service = g.Where(n => n.ServiceName.Contains(search)).Select(n => n) }).OrderBy(n => n.SortOrder).ToList<Object>();
            return result;
        }
    }
}