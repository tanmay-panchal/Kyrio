using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Xml;
using System.Xml.Linq;

namespace AdminClient.Library
{
    public class XML
    {
        public static string NameRootLanguage = "languages";
        public static string FolderLanguagePath = Path.Combine(HostingEnvironment.MapPath(@"\"), "FolderLanguage");
        public static readonly Dictionary<string, int> PathXML = new Dictionary<string, int>
        {
            {"/XML/KeyPermissionForControler.xml", 1},
        };
        /// <summary>
        /// tìm danh sách cha khi biết giá trị của con
        /// </summary>
        /// <param name="path">đường dẫn tới file xml</param>
        /// <param name="valueChild">giá trị con cần tìm</param>
        /// <param name="nameNodeChild">tên xml của con</param>
        /// <param name="nameNodeParent">tên xml của cha</param>
        /// <returns></returns>
        public static List<XElement> GetParentsBaseChild(string path, string valueChild, string nameNodeChild, string nameNodeParent)
        {
            XDocument xDocument = XDocument.Load(path);
            List<XElement> result = xDocument.Descendants(nameNodeChild).Where(i => i.Value == valueChild).Select(i => i.Parent).ToList();
            return result;
        }
        /// <summary>
        /// tìm danh sách cha khi biết giá trị của con với path là option
        /// </summary>
        /// <param name="opitionPath">option trong PathXML</param>
        /// <param name="valueChild">giá trị con cần tìm</param>
        /// <param name="nameNodeChild">tên xml của con</param>
        /// <param name="nameNodeParent">tên xml của cha</param>
        /// <returns></returns>
        public static List<XElement> GetParentsBaseChildPathIsOpition(int opitionPath, string valueChild, string nameNodeChild, string nameNodeParent)
        {
            string path = PathXML.Keys.ElementAt(opitionPath - 1);
            path = Path.GetDirectoryName(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().GetName().CodeBase)) + path;
            path = path.Remove(0, 6);
            return GetParentsBaseChild(path, valueChild, nameNodeChild, nameNodeParent);
        }
        public static void WriteXmlLanguage(string pathFile, Dictionary<String, String> languages, string nameRoot)
        {
            XElement root = new XElement(nameRoot);
            foreach (KeyValuePair<string, String> item in languages)
                root.Add(new XElement(item.Key, XmlConvert.EncodeLocalName(item.Value)));
            var myFile = File.Create(pathFile);
            myFile.Close();
            root.Save(pathFile);
        }
        public static string GetLanguageBaseKey(string pathFile, string nameNode)
        {
            XDocument xDocument = XDocument.Load(pathFile);
            return XmlConvert.DecodeName(xDocument.Descendants(nameNode).FirstOrDefault().Value ?? "");
        }
        public static string GetNameFileLanguage(long userId, string lauguage)
        {
            return userId.ToString() + "-" + lauguage + ".xml";
        }
    }
}