using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_Currency : EntityHelp<Currency>
    {
        public static Currency GetCurrencyBaseCountry(int countryId)
        {
            ModelEntity excute = new ModelEntity();
            Currency result = new Currency();
            result = (from c in excute.Countries
                      join t in excute.Currencies on c.CurrencyCode equals t.CurrencyCode into lsT
                      from t in lsT.DefaultIfEmpty()
                      where c.CountryID == countryId
                      select t).FirstOrDefault() ?? new Currency();
            return result;
        }
        public static Currency GetCurrencyBaseBusinessID(long bussinessID)
        {
            ModelEntity excute = new ModelEntity();
            Currency result = new Currency();
            result = (from c in excute.Currencies
                      where c.CurrencyCode == (from a in excute.Businesses.Where(n => n.BusinessID == bussinessID)
                                               join b in excute.Countries on a.CountryID equals b.CountryID into lsB
                                               from b in lsB.DefaultIfEmpty()
                                               select b).FirstOrDefault().CurrencyCode
                      select c).FirstOrDefault() ?? new Currency();
            return result;
        }
    }
}