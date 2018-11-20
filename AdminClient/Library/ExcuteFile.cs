using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace AdminClient.Library
{
    public class ExcuteFile
    {
        /// <summary>
        /// save image product category 
        /// </summary>
        /// <param name="file"></param>
        /// <param name="pathFolder"></param>
        /// <param name="fileName"></param>
        public static void SaveFileFolder(HttpPostedFileBase file, string fileName, string pathFolder)
        {
            if (file != null && file.ContentLength > 0)
            {
                bool isExists = System.IO.Directory.Exists(pathFolder);

                if (!isExists)
                    System.IO.Directory.CreateDirectory(pathFolder);

                var path = string.Format("{0}\\{1}", pathFolder, fileName);
                file.SaveAs(path);
            }
        }
        /// <summary>
        /// delete image product category
        /// </summary>
        /// <param name="pathFolder"></param>
        /// <param name="fileName"></param>
        public static void DeleteFileFolder(string fileName, string pathFolder)
        {
            string pathFile = Path.Combine(pathFolder, fileName);
            if (System.IO.File.Exists(pathFile))
            {
                System.IO.File.Delete(pathFile);
            }
            //else { throw new Exception("Image path no exist"); }
        }
    }
}