using Azure.Storage.Blobs;
using DataCommunicator;
using DataCommunicator.IConfiguration;
using DataCommunicator.IFacades;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Sharat.Filters;
using Sharat.Middlewares;
using Sharat.Services.AzureBlobs;
using Sharat.Utilities;
using Stripe;
using System;
using System.Text;

namespace Sharat
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services
                .AddControllers(options =>
            {
                options.Filters.Add(new ResponseFormatterFilter());
            })
               .AddJsonOptions(options =>
                   {
                       options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
                   });
            ////////////////////// AZURE BLOB STORAGE //////////////////////////
            var a = Configuration.GetValue<string>("AzureBlobSotrageConnectionString");
            services.AddSingleton(x => new BlobServiceClient(Configuration.GetValue<string>("AzureBlobSotrageConnectionString")));
            services.AddSingleton<IBlobService, BlobService>();
            ///////////////////// AZURE BLOB STORAGE END/////////////////////////



            ////////////////////////////// SWAGGER API /////////////////////////////////////
            services.AddSwaggerGen(c =>
            {
                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "JWT Authentication",
                    Description = "Please insert JWT with Bearer into field",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer", // must be lower case
                    BearerFormat = "JWT",
                    Reference = new OpenApiReference
                    {
                        Id = JwtBearerDefaults.AuthenticationScheme,
                        Type = ReferenceType.SecurityScheme
                    }
                };
                c.AddSecurityDefinition(securityScheme.Reference.Id,
                 securityScheme);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                  {securityScheme, new string[] { }}
                });

            });
            //////////////////////// END SWAGGER API //////////////////////////////

            ///////////////////////////// REACT ////////////////////

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
            //////////////////// END REACT ///////////////////////////
            ///////////////////////////Mapper//////////////////////////////////////////
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            ///////////////////////////End Mapper//////////////////////////////////////////

            ///////////////////////////JWT Token//////////////////////////////////////////
            string securityKey = Configuration.GetSection("Jwt").GetValue<string>("SecurityKey");
            var symmetricSecurityKey = new
               SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                     JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme =
                     JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new
                     TokenValidationParameters
                {
                    //  what to validate
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    // setup validate data
                    ValidIssuer = "smesk.in",
                    ValidAudience = "readers",
                    IssuerSigningKey = symmetricSecurityKey
                };
            });
            ///////////////////////////END Jwt TOKEN//////////////////////////////////////////
            ////////////////////////// Flight Cetner Singelton///////////////////////////////
            services.AddSingleton<IFlightCenterSystem>(provider =>
            {
                IConfigurationSection facadesSec = Configuration.GetSection("NumberOfActiveFacades");
                IConfigurationSection mainDbInfo = Configuration.GetSection("MainDbInfo");
                return new FlightCenterSystem(
                    new FacadesCount(
                    facadesSec.GetValue<short>("Anonymous"),
                    facadesSec.GetValue<short>("Customer"),
                    facadesSec.GetValue<short>("AirlineCompany"),
                    facadesSec.GetValue<short>("Adminstrator")
                    ),
                    new DbInfo(
                        mainDbInfo.GetValue<string>("Username"),
                        mainDbInfo.GetValue<string>("Password"),
                        mainDbInfo.GetValue<string>("DbName"),
                        mainDbInfo.GetValue<string>("Host"),
                        mainDbInfo.GetValue<string>("Port"),
                        mainDbInfo.GetValue<int>("ConnectionPoolCapacity")
                        )
                    );
            }
            );
            /////////////////////////////END Flight Cetner Singelton//////////////////////////
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            var a = Configuration.GetSection("Stripe");
            StripeConfiguration.ApiKey = Configuration.GetSection("Stripe").GetValue<string>("SecretKey");
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FlightsManagmentSystemWebAPI v1");
                    c.DocumentTitle = "Flights Managment System API";
                });
            }
            else
            {
                app.UseHsts();
            }
            //app.UseMiddleware<RequestResponseLoggingMiddleware>();
            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseMiddleware<ErrorHandlerMiddleware>();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
