using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Sharat.Utilities;
using System.Collections.Generic;
using System.Text.Json;


namespace Sharat.Filters
{
    public class ResponseFormatterFilter : IResultFilter
    {

        private string FormatValidationExceptionMsg(Dictionary<string, string[]> ErrorsArray)
        {
            string message = "";
            int max = 4;
            foreach (KeyValuePair<string, string[]> singlePropertyErrs in ErrorsArray)
            {
                if (max == 0)
                    break;
                message = message + $"* {singlePropertyErrs.Key} : ";
                foreach (string oneErr in singlePropertyErrs.Value)
                {
                    message = message + oneErr + "<br/>";
                }
                max--;

            }
            return message;
        }
        public void OnResultExecuted(ResultExecutedContext context)
        {
            
           
        }

        public void OnResultExecuting(ResultExecutingContext context)
        {
            //if (context.Controller.ToString() == "Sharat.Controllers.ImageController")
            //    return;
            if (!context.ModelState.IsValid)
            {
                ProblemDetails responseObj = (ProblemDetails)context.Result.GetType().GetProperty("Value").GetValue(context.Result);
                Dictionary<string, string[]> errArr = (Dictionary<string,string[]>) responseObj.GetType().GetProperty("Errors").GetValue(responseObj);
                int statusCode = (int)typeof(ProblemDetails).GetProperty("Status").GetValue(responseObj);
                string title = (string)typeof(ProblemDetails).GetProperty("Title").GetValue(responseObj);

                throw new AspValidationException(FormatValidationExceptionMsg(errArr), statusCode);
            }
            //run code immediately before and after the execution of action results. They run only when the action method has executed successfully. They are useful for logic that must surround view or formatter execution.
            var result = context.Result as ObjectResult;
            var resultObj = result?.Value;


            var resp = ApiResponseFormater<object>.Success(resultObj,
                context.HttpContext.Request.Path.HasValue ? context.HttpContext.Request.Path.Value : "",
                context.HttpContext.Request.Method
                );


            context.Result = new JsonResult(resp, new JsonSerializerOptions()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            }

            );

        }


    }
}
