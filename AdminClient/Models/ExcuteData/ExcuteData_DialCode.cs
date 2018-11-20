using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_DialCode : EntityHelp<Dial_Code>
    {
        public static Dial_Code GetEntityBaseUserId(long userId)
        {
            ModelEntity excute = new ModelEntity();
            Dial_Code entity = (from d in excute.Dial_Code
                                join g in (from u in (from a in excute.Users
                                                      join b in excute.Businesses on a.BusinessID equals b.BusinessID into lsB
                                                      from b in lsB.DefaultIfEmpty()
                                                      select new { a.UserID, b.CountryID, a.BusinessID })
                                           join c in excute.Countries on u.CountryID equals c.CountryID into lsC
                                           from c in lsC.DefaultIfEmpty()
                                           select new { u.UserID, u.CountryID, c.DialCode }) on d.DialCode equals g.DialCode into lsG
                                from g in lsG.DefaultIfEmpty()
                                where g.UserID == userId
                                select d).FirstOrDefault() ?? new Dial_Code();
            return entity;
        }
    }
}