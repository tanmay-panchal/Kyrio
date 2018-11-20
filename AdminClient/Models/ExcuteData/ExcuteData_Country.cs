using AdminClient.Library;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;

namespace AdminClient.Models.ExcuteData
{
    public class ExcuteData_Country : EntityHelp<Country>
    {
        public static Country GetEntityBaseUserId(long userId)
        {
            ModelEntity excute = new ModelEntity();
            Country entity = (from c in excute.Countries
                              join l in (from u in excute.Users
                                         join b in excute.Businesses on u.BusinessID equals b.BusinessID into lsB
                                         from b in lsB.DefaultIfEmpty()
                                         select new { u.UserID, b.CountryID, u.BusinessID }) on c.CountryID equals l.CountryID into lsL
                              from l in lsL.DefaultIfEmpty()
                              where l.UserID == userId
                              select c).FirstOrDefault() ?? new Country();
            return entity;
        }
    }
}