using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Sharat.Utilities
{
    public class DateTimeConverter : JsonConverter<DateTime>
    {
        
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            DateTime dateValue;
            var formatStrings = new string[] { "dd/MM/yyyy","MM/dd/yyyy" , "dd-MM-yyyy", "MM-dd-yyyy", "yyyy-MM-dd hh:mm:ss" };
            if (DateTime.TryParseExact(reader.GetString(), formatStrings, null, DateTimeStyles.None, out dateValue))
                return dateValue;
            throw new UnParsableDateException($"Unable To Identify Date Time Format of: {reader.GetString()}");
        }
         
        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToUniversalTime().ToString("yyyy'/'MM'/'dd'T'HH':'mm'"));
        }
    }
}
