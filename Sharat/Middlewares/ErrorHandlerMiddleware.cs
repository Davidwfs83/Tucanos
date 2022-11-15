using DataCommunicator.IDaos;
using DataCommunicator.ILoginServices;
using Microsoft.AspNetCore.Http;
using Sharat.Filters;
using Sharat.Utilities;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace Sharat.Middlewares
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                var response = context.Response;
                response.ContentType = "application/json";
                var responseModel = ApiResponseFormater<string>.Fail(error.Message);
                switch (error)
                {
                    // Error From Db
                    case DbExceptionModified e:
                        response.StatusCode = (int)e.statusCode;
                        break;
                    // Our Custom Datetime couldn't parse the datetime provided
                    case UnParsableDateException e:
                        response.StatusCode = 400;
                        break;
                    case AspValidationException e:
                        response.StatusCode = e.StatusCode;
                        break;

                    // An Admin Trying to access an method with a higher level 
                    case AdminLevelUnAllowedException e:
                        response.StatusCode = 401;
                        break;
                    case WrongCredentialsException e:
                        response.StatusCode = 401;
                        break;
                    case Azure.RequestFailedException e:
                        response.StatusCode = 404;
                        break;
                    case PlaceboUserException e:
                        {
                            response.StatusCode = 403;
                            break;
                        }
                    case StripeException e:
                        {
                            response.StatusCode = (int)e.HttpStatusCode;
                            break;
                        }
                    default:
                        {
                            // unhandled error
                            response.StatusCode = (int)HttpStatusCode.InternalServerError;
                            responseModel.Message = "Internal Server Error, Please Visit At A Later Occasion";
                            break;
                        }
                }
                var result = JsonSerializer.Serialize(responseModel);
                await response.WriteAsync(result);
            }
        }
    }
}
