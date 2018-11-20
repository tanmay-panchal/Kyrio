using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_Client : EntityHelp<Client>
    {
        public static Object GetClientForAppontmentCanlendar(long ClientID)
        {
            ModelEntity excute = new ModelEntity();
            Object result = (from c in excute.Clients
                             join b in (from a in excute.Businesses
                                        join b in excute.Currencies on a.CurrencyCode equals b.CurrencyCode into lsB
                                        from b in lsB.DefaultIfEmpty()
                                        select new { a.BusinessID, b.CurrencySymbol }
                                         ) on c.BusinessID equals b.BusinessID into lsB
                             from b in lsB.DefaultIfEmpty()
                             where c.ClientID == ClientID
                             select new { ClientItem = c, CurrencySymbol = b.CurrencySymbol }).OrderBy(n => n.ClientItem.FirstName).ToList<Object>().FirstOrDefault();
            return result;
        }
    }
}