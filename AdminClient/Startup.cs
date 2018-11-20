using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AdminClient.Startup))]
namespace AdminClient
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
