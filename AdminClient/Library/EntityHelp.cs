using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdminClient.Models;
using System.Linq.Expressions;
using System.Data;
using System.Configuration;
using System.Data.SqlClient;
using System.Transactions;
using System.Linq.Dynamic;
using System.Data.Common;
using Newtonsoft.Json;

namespace AdminClient.Library
{
    ///// <summary>
    ///// Class cung cấp hàm mở rộng cho thực thể được kèm theo thực thể chính
    ///// </summary>
    ///// <typeparam name="ClassEntity">Thực thể phụ được kèm theo</typeparam>
    ///// <typeparam name="ClassEntityOther">Thực thể chính</typeparam>
    //public class listEntityDeleteEntityAttacthEntityOther<ClassEntity, ClassEntityOther> where ClassEntity : class
    //{
    //    #region Thuộc tính
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    /// <param name="lEntitys"></param>
    //    /// <param name="entity"></param>
    //    /// <returns></returns>
    //    public delegate List<ClassEntity> MethodGetListEntityInsertUpdateDeleteBaseEntityOther(List<ClassEntity> lEntitys, ClassEntityOther entity);
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    private List<ClassEntity> ListEntity { get; set; }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    private ClassEntityOther EntityOther { get; set; }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    private MethodGetListEntityInsertUpdateDeleteBaseEntityOther GetListEntityInsert { get; set; }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    private MethodGetListEntityInsertUpdateDeleteBaseEntityOther GetListEntityUpdate { get; set; }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    private MethodGetListEntityInsertUpdateDeleteBaseEntityOther GetListEntityDelete { get; set; }

    //    private Func<List<ClassEntity>, ClassEntityOther, List<ClassEntity>> UpdateEntityBaseEntityOther { get; set; }
    //    #endregion

    //    #region Constructor
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    public EntityAttacthEntityOther()
    //    {
    //        this.ListEntity = new List<ClassEntity>();
    //        this.GetListEntityDelete = null;
    //        this.GetListEntityInsert = null;
    //        this.GetListEntityUpdate = null;
    //    }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    /// <param name="listEntity"></param>
    //    /// <param name="entityOther"></param>
    //    /// <param name="getListEntityInsert"></param>
    //    /// <param name="getListEntityUpdate"></param>
    //    /// <param name="getListEntityDelete"></param>
    //    public EntityAttacthEntityOther(List<ClassEntity> listEntity, ClassEntityOther entityOther, MethodGetListEntityInsertUpdateDeleteBaseEntityOther getListEntityInsert, MethodGetListEntityInsertUpdateDeleteBaseEntityOther getListEntityUpdate, Func<List<ClassEntity>, ClassEntityOther, MethodGetListEntityInsertUpdateDeleteBaseEntityOther getListEntityDelete)
    //    {
    //        this.ListEntity = listEntity;
    //        this.EntityOther = entityOther;
    //        this.GetListEntityDelete = getListEntityDelete;
    //        this.GetListEntityInsert = getListEntityInsert;
    //        this.GetListEntityUpdate = getListEntityUpdate;
    //    }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    /// <param name="listEntity"></param>
    //    /// <param name="entityOther"></param>
    //    public EntityAttacthEntityOther(List<ClassEntity> listEntity, ClassEntityOther entityOther, Func<List<ClassEntity>, ClassEntityOther, List<ClassEntity>> updateEntityBaseEntityOther)
    //    {
    //        this.ListEntity = listEntity;
    //        this.EntityOther = entityOther;
    //        this.UpdateEntityBaseEntityOther = updateEntityBaseEntityOther;
    //    }
    //    public EntityAttacthEntityOther(List<ClassEntity> listEntity, ClassEntityOther entityOther, MethodGetListEntityInsertUpdateDeleteBaseEntityOther getListEntityInsert, MethodGetListEntityInsertUpdateDeleteBaseEntityOther getListEntityUpdate, Func<List<ClassEntity>, ClassEntityOther, MethodGetListEntityInsertUpdateDeleteBaseEntityOther getListEntityDelete, Func<List<ClassEntity>, ClassEntityOther, List<ClassEntity>> updateEntityBaseEntityOther)
    //    {
    //        this.ListEntity = listEntity;
    //        this.EntityOther = entityOther;
    //        this.GetListEntityDelete = getListEntityDelete;
    //        this.GetListEntityInsert = getListEntityInsert;
    //        this.GetListEntityUpdate = getListEntityUpdate;
    //        this.UpdateEntityBaseEntityOther = updateEntityBaseEntityOther;
    //    }
    //    #endregion

    //    #region method
    //    /// <summary>
    //    /// Hàm xử lý danh sách đối tượng đính kèm khi đối tượng insert
    //    /// </summary>
    //    /// <param name="lambadaUpdateEnitty"></param>
    //    /// <returns></returns>
    //    public bool ActionWhenInsertEntityOther()
    //    {
    //        if (ListEntity.Count > 0)
    //        {
    //            if(this.UpdateEntityBaseEntityOther != null)
    //            {
    //                ModelEntity excuteData = new ModelEntity();
    //                this.ListEntity = this.UpdateEntityBaseEntityOther(this.ListEntity, this.EntityOther);
    //                InsertEntity(ref excuteData, this.ListEntity);
    //                int result = excuteData.SaveChanges();
    //                excuteData.Dispose();
    //                return result > 0 ? true : false;
    //            }
    //            return false;
    //        }
    //        return true;
    //    }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    /// <returns></returns>
    //    public bool ActionWhenUpdateEntityOther()
    //    {
    //        if (ListEntity.Count > 0)
    //        {
    //            if(this.GetListEntityDelete != null && this.GetListEntityInsert != null && this.GetListEntityUpdate != null && this.UpdateEntityBaseEntityOther != null)
    //            {
    //                ModelEntity exucteData = new ModelEntity();
    //                List<ClassEntity> listEntityDelete = this.GetListEntityDelete(this.ListEntity, this.EntityOther);
    //                List<ClassEntity> listEntityUpdate = this.GetListEntityUpdate(this.ListEntity, this.EntityOther);
    //                List<ClassEntity> listEntityInsert = this.GetListEntityInsert(this.ListEntity, this.EntityOther);
    //                listEntityInsert = this.UpdateEntityBaseEntityOther(listEntityInsert, this.EntityOther);
    //                this.InsertEntity(ref exucteData, listEntityInsert);
    //                this.UpdateEntity(ref exucteData, listEntityUpdate);
    //                exucteData.SaveChanges();
    //                exucteData.Dispose();
    //                if (listEntityDelete.Count > 0)
    //                    listEntityDelete.ForEach(n => this.Delete(n));
    //                return true;
    //            }
    //            return false;
    //        }
    //        return true;
    //    }

    //    #region method support 
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    /// <param name="excuteData"></param>
    //    /// <param name="listEntity"></param>
    //    private void InsertEntity(ref ModelEntity excuteData, List<ClassEntity> listEntity)
    //    {
    //        var dbSet = excuteData.Set<ClassEntity>();
    //        listEntity.ForEach(n => { dbSet.Add(n); });
    //    }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    /// <param name="excuteData"></param>
    //    /// <param name="lisEntity"></param>
    //    private void UpdateEntity(ref ModelEntity excuteData, List<ClassEntity> lisEntity)
    //    {
    //        var dbSet = excuteData.Set<ClassEntity>();
    //        foreach (ClassEntity item in lisEntity)
    //        {
    //            dbSet.Attach(item);
    //            excuteData.Entry(item).State = System.Data.Entity.EntityState.Modified;
    //        }
    //    }
    //    /// <summary>
    //    /// 
    //    /// </summary>
    //    /// <param name="excuteData"></param>
    //    /// <param name="listEnitty"></param>
    //    private void DeleteEntity(ref ModelEntity excuteData, params object[] parameters)
    //    {
    //        var dbSet = excuteData.Set<ClassEntity>();
    //        ClassEntity entity = EntityHelp<ClassEntity>.GetById(parameters);
    //        if (entity == null)
    //            throw new Exception("Không tìm thấy đối tượng cần xóa");
    //        dbSet.Attach(entity);
    //        dbSet.Remove(entity);
    //    }
    //    private int Delete(ClassEntity entity)
    //    {
    //        using (ModelEntity excuteData = new ModelEntity())
    //        {
    //            var dbSet = excuteData.Set<ClassEntity>();
    //            dbSet.Attach(entity);
    //            dbSet.Remove(entity);
    //            return excuteData.SaveChanges();
    //        }
    //    }
    //    #endregion

    //    #endregion
    //}
    /// <summary>
    /// Class cung cấp một số hàm mở rộng cho thực thể cơ sở dữ liệu
    /// </summary>
    /// <typeparam name="ClassEntity"></typeparam>
    public abstract class EntityHelp<ClassEntity> where ClassEntity : class
    {
        #region Insert 
        /// <summary>
        /// insert một đối tượng xuống cơ sở dữ liệu
        /// </summary>
        /// <param name="entity">Đối tượng</param>
        /// <returns></returns>
        public static int Insert(ClassEntity entity)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                dbSet.Add(entity);
                return excuteData.SaveChanges();
            }
        }
        /// <summary>
        /// insert một danh sách các đối tượng xuống cơ sở dữ liệu
        /// </summary>
        /// <param name="lisEntity">Danh sách các đối tượng</param>
        /// <returns></returns>
        public static int Insert(List<ClassEntity> lisEntity)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                lisEntity.ForEach(n => { dbSet.Add(n); });
                return excuteData.SaveChanges();
            }
        }
        #endregion

        #region Update
        /// <summary>
        /// update một đối tượng xuống cơ sở dữ liệu
        /// </summary>
        /// <param name="entity">Đối tượng</param>
        /// <returns></returns>
        public static int Update(ClassEntity entity)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                dbSet.Attach(entity);
                excuteData.Entry(entity).State = System.Data.Entity.EntityState.Modified;
                return excuteData.SaveChanges();
            }
        }
        /// <summary>
        /// Update nhiều đối tượng
        /// </summary>
        /// <typeparam name="Class"></typeparam>
        /// <param name="lisEntity">danh sách đối tượng</param>
        /// <returns></returns>
        public static int Update(List<ClassEntity> lisEntity)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                lisEntity.ForEach(n => { dbSet.Attach(n); excuteData.Entry(n).State = System.Data.Entity.EntityState.Modified; });
                return excuteData.SaveChanges();
            }
        }
        /// <summary>
        /// Update cho phép fitter đối tượng
        /// </summary>
        /// </summary>
        /// <param name="fitter">Lambada method tìm đối tượng</param>
        /// <returns></returns>
        public static int UpdateFlowFitter(Expression<Func<ClassEntity, bool>> fitter, Action<ClassEntity> updateEntity)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                List<ClassEntity> lisEntity = dbSet.AsNoTracking().Where(fitter).ToList();
                lisEntity.ForEach(updateEntity);
                lisEntity.ForEach(n => { dbSet.Attach(n); excuteData.Entry(n).State = System.Data.Entity.EntityState.Modified; });
                return excuteData.SaveChanges();
            }
        }
        #endregion

        #region Delete
        /// <summary>
        /// Delete đối tượng trong cơ sở dữ liệu
        /// </summary>
        /// <param name="entity">Đối tượng</param>
        /// <returns></returns>
        public static int Delete(ClassEntity entity)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                dbSet.Attach(entity);
                dbSet.Remove(entity);
                return excuteData.SaveChanges();
            }
        }
        /// <summary>
        /// Delete danh sách đối tượng
        /// </summary>
        /// <param name="parameters">danh sách id đối tượng</param>
        /// <returns></returns>
        public static int Delete(params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                ClassEntity entity = GetById(parameters);
                if (entity == null)
                    return -1;
                dbSet.Attach(entity);
                dbSet.Remove(entity);
                return excuteData.SaveChanges();
            }
        }
        #endregion

        #region Get entity
        /// <summary>
        /// Lấy tất cả danh sách đối tượng
        /// </summary>
        /// <returns></returns>
        public static List<ClassEntity> GetAll()
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                return dbSet.AsNoTracking().ToList();
            }
        }
        /// <summary>
        /// lấy danh sách đối tượng theo id
        /// </summary>
        /// <typeparam name="ClassObject"></typeparam>
        /// <param name="id"></param>
        /// <returns></returns>
        public static ClassEntity GetById(params object[] id)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                return dbSet.Find(id);
            }
        }
        /// <summary>
        /// Lấy phần tử đầu tiên của đối tượng
        /// </summary>
        /// <param name="fitter">Lambada method tìm đối tượng</param>
        /// <returns></returns>
        public static ClassEntity First(Expression<Func<ClassEntity, bool>> fitter)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                return dbSet.AsNoTracking().FirstOrDefault(fitter);
            }
        }
        /// <summary>
        /// Lấy phần tử duy nhất của đối tượng
        /// </summary>
        /// <param name="fitter">Lambada method tìm đối tượng</param>
        /// <returns></returns>
        public static ClassEntity Single(Expression<Func<ClassEntity, bool>> fitter)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                return dbSet.AsNoTracking().SingleOrDefault(fitter);
            }
        }
        /// <summary>
        /// Tìm phần tử của đối tượng
        /// </summary>
        /// <param name="fitter">Lambada method tìm đối tượng</param>
        /// <returns></returns>
        public static List<ClassEntity> Find(Expression<Func<ClassEntity, bool>> fitter)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                return dbSet.AsNoTracking().Where(fitter).ToList();
            }
        }
        /// <summary>
        /// Lấy đối tượng có phân trang 
        /// </summary>
        /// <param name="methodFitter">Method lambada fitter</param>
        /// <param name="pageIndex">Vị trí của trang</param>
        /// <param name="pageSize">Có bao nhiêu phần tử trong 1 trang</param>
        /// <param name="orderColName">Tên cột cần order ( không có để bằng rỗng)</param>
        /// <param name="desc">Sắp xếp là DESC hay là ASC</param>
        /// <returns></returns>
        public static List<ClassEntity> SelectWithPaging(Expression<Func<ClassEntity, bool>> methodFitter, int? pageIndex, int? pageSize, string orderColName, bool desc)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                IEnumerable<ClassEntity> entities;
                pageIndex = pageIndex.HasValue ? pageIndex.Value : 0;
                pageSize = pageSize.HasValue ? pageSize.Value : 20;
                if (methodFitter != null && orderColName == "")
                    entities = dbSet.AsNoTracking().Where(methodFitter);
                else if (methodFitter == null && orderColName != "")
                    entities = dbSet.AsNoTracking().OrderBy(orderColName + (desc ? " DESC" : " ASC"));
                else
                    entities = dbSet.AsNoTracking().Where(methodFitter).OrderBy(orderColName + (desc ? " DESC" : " ASC"));
                if ((int)pageIndex == 0)
                    entities = entities.Take((int)pageSize);
                else
                    entities = entities.Skip((int)pageIndex).Take((int)pageSize);
                return entities.ToList();
            }
        }
        /// <summary>
        /// Lấy dữ liệu geom json từ câu lệnh query
        /// </summary>
        /// <param name="querySql"></param>
        /// <returns></returns>
        public static List<Object> GetDataGeomForQuerySQL(string querySql)
        {
            List<Object> result = new List<Object>();
            try
            {
                result = ExecuteSqlQuery(querySql, n => JsonConvert.DeserializeObject<Object>(n.Field<string>("st_asgeojson")), new Object[0]);
            }
            catch (Exception ex) { }
            return result;
        }
        #endregion

        #region Any
        /// <summary>
        /// Any linq
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public static Boolean Any(Expression<Func<ClassEntity, bool>> predicate)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                return dbSet.Any(predicate);
            }
        }
        #endregion

        #region Count entity
        /// <summary>
        /// Đếm số lượng tất cả đối tượng
        /// </summary>
        /// <returns></returns>
        public static int Count()
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                return dbSet.Count();
            }
        }
        /// <summary>
        /// Đến số lượng phần tử theo method call back 
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public static int Count(Expression<Func<ClassEntity, bool>> predicate)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                var dbSet = excuteData.Set<ClassEntity>();
                return dbSet.Count(predicate);
            }
        }
        #endregion

        #region Store produce
        /// <summary>
        /// Thực thi lệnh sql
        /// </summary>
        /// <param name="commandStr">Query sql</param>
        /// <param name="parameters">Tham số</param>
        /// <returns></returns>
        public static int ExecuteSqlCommand(string commandStr, params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                return excuteData.Database.ExecuteSqlCommand(commandStr, parameters);
            }
        }
        /// <summary>
        /// Lấy dữ liệu theo câu lệnh sql
        /// </summary>
        /// <param name="commandStr">Query sql</param>
        /// <param name="parameters">Tham số</param>
        /// <returns></returns>
        public static List<ClassEntity> ExecuteSqlQuery(string commandStr, params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                IDbCommand storeQuery = excuteData.Database.Connection.CreateCommand();
                storeQuery.CommandText = commandStr;
                storeQuery.CommandType = CommandType.Text;
                if (parameters.Length > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        storeQuery.Parameters.Add(parameter);
                    }
                }
                excuteData.Database.Connection.Open();
                var entities = Activator.CreateInstance<List<ClassEntity>>();
                using (var reader = storeQuery.ExecuteReader())
                {
                    var properties = typeof(ClassEntity).GetProperties();
                    while (reader.Read())
                    {
                        var entity = Activator.CreateInstance<ClassEntity>();
                        foreach (var prop in properties)
                        {
                            if (!prop.PropertyType.IsValueType && prop.PropertyType != typeof(String)) continue;
                            try
                            {
                                prop.SetValue(entity, reader[prop.Name], null);
                            }
                            catch { }
                        }
                        entities.Add(entity);
                    }
                }
                excuteData.Database.Connection.Close();
                return entities;
            }
        }
        /// <summary>
        /// Lấy dữ liệu theo câu lệnh sql
        /// </summary>
        /// <param name="commandStr">Query sql</param>
        /// <param name="parameters">Tham số</param>
        /// <returns></returns>
        public static List<Object> ExecuteSqlQuery(string commandStr, Func<DataRow, Object> methodGetData, params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                IDbCommand storeQuery = excuteData.Database.Connection.CreateCommand();
                storeQuery.CommandText = commandStr;
                storeQuery.CommandType = CommandType.Text;
                if (parameters.Length > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        storeQuery.Parameters.Add(parameter);
                    }
                }
                excuteData.Database.Connection.Open();
                IDbDataAdapter da = DbProviderFactories.GetFactory("System.Data.SqlClient").CreateDataAdapter();
                da.SelectCommand = storeQuery;
                DataSet dSet = new DataSet();
                da.Fill(dSet);
                List<Object> result = dSet.Tables[0].AsEnumerable().Select(methodGetData).ToList();
                excuteData.Database.Connection.Close();
                return result;
            }
        }
        /// <summary>
        /// thực thi từ store produce
        /// </summary>
        /// <param name="commandStr">Query sql</param>
        /// <param name="parameters">Tham số</param>
        /// <returns></returns>
        public static List<Object> ExecuteStoreCommand(string commandStr, Func<DataRow, Object> methodGetData, params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                IDbCommand storeQuery = excuteData.Database.Connection.CreateCommand();
                storeQuery.CommandText = commandStr;
                storeQuery.CommandType = CommandType.StoredProcedure;
                if (parameters.Length > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        storeQuery.Parameters.Add(parameter);
                    }
                }
                excuteData.Database.Connection.Open();
                IDbDataAdapter da = DbProviderFactories.GetFactory("System.Data.SqlClient").CreateDataAdapter();
                da.SelectCommand = storeQuery;
                DataSet dSet = new DataSet();
                da.Fill(dSet);
                List<Object> result = dSet.Tables[0].AsEnumerable().Select(methodGetData).ToList();
                excuteData.Database.Connection.Close();
                return result;
            }
        }
        /// <summary>
        /// thực thi từ store produce
        /// </summary>
        /// <param name="commandStr"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public static int ExecuteStoreCommand(string commandStr, params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                IDbCommand storeCommand = excuteData.Database.Connection.CreateCommand();
                storeCommand.CommandText = commandStr;
                storeCommand.CommandType = CommandType.StoredProcedure;

                if (parameters.Length > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        storeCommand.Parameters.Add(parameter);
                    }
                }
                excuteData.Database.Connection.Open();
                
                int result = storeCommand.ExecuteNonQuery();
                excuteData.Database.Connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Lấy dữ liệu từ store produce
        /// </summary>
        /// <param name="commandStr"></param>
        /// <param name="parameters"></param>
        /// <returns></returns>
        public static List<ClassEntity> ExecuteStoreQuery(string commandStr, params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                IDbCommand storeQuery = excuteData.Database.Connection.CreateCommand();
                storeQuery.CommandText = commandStr;
                storeQuery.CommandType = CommandType.StoredProcedure;
                if (parameters.Length > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        storeQuery.Parameters.Add(parameter);
                    }
                }
                excuteData.Database.Connection.Open();
                var entities = Activator.CreateInstance<List<ClassEntity>>();
                using (var reader = storeQuery.ExecuteReader())
                {
                    var properties = typeof(ClassEntity).GetProperties();
                    while (reader.Read())
                    {
                        var entity = Activator.CreateInstance<ClassEntity>();
                        foreach (var prop in properties)
                        {
                            if (!prop.PropertyType.IsValueType && prop.PropertyType != typeof(String)) continue;
                            try
                            {
                                prop.SetValue(entity, reader[prop.Name], null);
                            }
                            catch { }
                        }
                        entities.Add(entity);
                    }
                }
                excuteData.Database.Connection.Close();
                return entities;
            }
        }
        /// <summary>
        /// Lấy dữ liệu từ store produce
        /// </summary>
        /// <param name="commandStr">Query sql</param>
        /// <param name="parameters">Tham số</param>
        /// <returns></returns>
        public static Object ExecuteStoreQuery(string commandStr, Func<DataRow, Object> methodGetDataTable, Func<DataSet, Object> methodGetDataSet, Boolean getFristTable, params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                IDbCommand storeQuery = excuteData.Database.Connection.CreateCommand();
                storeQuery.CommandText = commandStr;
                storeQuery.CommandType = CommandType.StoredProcedure;
                if (parameters.Length > 0)
                {
                    foreach (var parameter in parameters)
                        storeQuery.Parameters.Add(parameter);
                }
                excuteData.Database.Connection.Open();
                IDbDataAdapter da = DbProviderFactories.GetFactory("System.Data.SqlClient").CreateDataAdapter();
                da.SelectCommand = storeQuery;
                DataSet dSet = new DataSet();
                da.Fill(dSet);
                Object result = new Object();
                if (getFristTable)
                {
                    if (dSet.Tables.Count > 0)
                        result = dSet.Tables[0].AsEnumerable().Select(methodGetDataTable).ToList();
                }
                else
                    result = methodGetDataSet(dSet);
                excuteData.Database.Connection.Close();
                return result;
            }
        }

        public static DataTable ExecuteStore(string commandStr, params object[] parameters)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                IDbCommand storeQuery = excuteData.Database.Connection.CreateCommand();
                storeQuery.CommandText = commandStr;
                storeQuery.CommandType = CommandType.StoredProcedure;
                storeQuery.CommandTimeout = 0;
                if (parameters.Length > 0)
                {
                    foreach (var parameter in parameters)
                    {
                        storeQuery.Parameters.Add(parameter);
                    }
                }
                excuteData.Database.Connection.Open();
                IDbDataAdapter da = DbProviderFactories.GetFactory("System.Data.SqlClient").CreateDataAdapter();
                da.SelectCommand = storeQuery;
                DataSet dSet = new DataSet();
                da.Fill(dSet);
                excuteData.Database.Connection.Close();
                if (dSet.Tables.Count > 0)
                    return dSet.Tables[0];
                else
                    return null;
            }
        }
        public static object ExecutCMD(string commandStr)
        {
            using (ModelEntity excuteData = new ModelEntity())
            {
                IDbCommand storeQuery = excuteData.Database.Connection.CreateCommand();
                storeQuery.CommandText = commandStr;
                storeQuery.CommandType = CommandType.Text;
                excuteData.Database.Connection.Open();
                IDbDataAdapter da = DbProviderFactories.GetFactory("System.Data.SqlClient").CreateDataAdapter();
                da.SelectCommand = storeQuery;
                DataSet dSet = new DataSet();
                da.Fill(dSet);
                Object result = new Object();
                if (dSet.Tables.Count > 0)
                {
                    if (dSet.Tables[0].Rows.Count == 1)
                    {
                        result = dSet.Tables[0].Rows[0][0];
                    }
                }

                excuteData.Database.Connection.Close();
                return result;
            }
        }
        #endregion

        #region Insert Or Update
        /// <summary>
        /// Insert hoặc Update entity
        /// </summary>
        /// <param name="entity">Đối tượng cần thực thi</param>
        /// <param name="isUpdate">Có phải là update</param>
        /// <param name="methodValidateEntity">hàm validate value entity</param>
        /// <returns></returns>
        public static bool InsertOrUpdateEntity(ClassEntity entity, bool isUpdate, Expression<Func<ClassEntity, bool>> methodValidateEntity)
        {
            if (methodValidateEntity.Compile()(entity))
                return (isUpdate ? Update(entity) : Insert(entity)) > 0 ? true : false;
            return false;
        }
        //public static bool InsertOrUpdateEntityFlowAttachEntityOther<ClassEntityAttach>(ClassEntity entity, bool isUpadate, EntityAttacthEntityOther<ClassEntityAttach, ClassEntity> entityAttach, Expression<Func<ClassEntity, bool>> methodValidateEntity) where ClassEntityAttach : class
        //{
        //    using (var scope = new TransactionScope())
        //    {
        //        if (methodValidateEntity.Compile()(entity))
        //        {
        //            if (isUpadate)
        //            {
        //                Update(entity);
        //                entityAttach.ActionWhenUpdateEntityOther();
        //            }
        //            else
        //            {
        //                Insert(entity);
        //                entityAttach.ActionWhenInsertEntityOther();
        //            }
        //            return true;
        //        }
        //        return false;
        //    }
        //}
        //public static bool InsertOrUpdateEntityFlowAttachEntityOther<ClassEntityAttach, ClassEntityAttach1>(ClassEntity entity, bool isUpadate, EntityAttacthEntityOther<ClassEntityAttach, ClassEntity> entityAttach, EntityAttacthEntityOther<ClassEntityAttach, ClassEntity> entityAttach1, Expression<Func<ClassEntity, bool>> methodValidateEntity) where ClassEntityAttach : class, new() where ClassEntityAttach1 : class, new()
        //{
        //    using (var scope = new TransactionScope())
        //    {
        //        if (methodValidateEntity.Compile()(entity))
        //        {
        //            if (isUpadate)
        //            {
        //                Update(entity);
        //                entityAttach.ActionWhenUpdateEntityOther();
        //                entityAttach1.ActionWhenUpdateEntityOther();
        //            }
        //            else
        //            {
        //                Insert(entity);
        //                entityAttach.ActionWhenInsertEntityOther();
        //                entityAttach1.ActionWhenInsertEntityOther();
        //            }
        //            return true;
        //        }
        //        return false;
        //    }
        //}
        //public static bool InsertOrUpdateEntityFlowAttachEntityOther<ClassEntityAttach, ClassEntityAttach1, ClassEntityAttach2>(ClassEntity entity, bool isUpadate, EntityAttacthEntityOther<ClassEntityAttach, ClassEntity> entityAttach, EntityAttacthEntityOther<ClassEntityAttach1, ClassEntity> entityAttach1, EntityAttacthEntityOther<ClassEntityAttach2, ClassEntity> entityAttach2, Expression<Func<ClassEntity, bool>> methodValidateEntity) where ClassEntityAttach : class, new() where ClassEntityAttach1 : class, new() where ClassEntityAttach2 : class, new()
        //{
        //    using (var scope = new TransactionScope())
        //    {
        //        if (methodValidateEntity.Compile()(entity))
        //        {
        //            if (isUpadate)
        //            {
        //                Update(entity);
        //                entityAttach.ActionWhenUpdateEntityOther();
        //                entityAttach1.ActionWhenUpdateEntityOther();
        //                entityAttach2.ActionWhenUpdateEntityOther();
        //            }
        //            else
        //            {
        //                Insert(entity);
        //                entityAttach.ActionWhenInsertEntityOther();
        //                entityAttach1.ActionWhenInsertEntityOther();
        //                entityAttach2.ActionWhenInsertEntityOther();
        //            }
        //            return true;
        //        }
        //        return false;
        //    }
        //}
        #endregion
    }
}
