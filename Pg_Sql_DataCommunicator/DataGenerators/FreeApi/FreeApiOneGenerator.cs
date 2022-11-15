using DataCommunicator.IDataGenerators;
using DataCommunicator.Pocos;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Pg_Sql_DataCommunicator.DataGenerators.FreeApiOne
{
    // https://api.namefake.com/ For All Data
    // https://avatars.dicebear.com/api airlines images
    // https://robohash.org/  customers imgaes
    internal class FreeApiOneGenerator : IDataGenerator
    {
        private string dataApi = "https://api.namefake.com/";
        private string imagesApiForAirlines = "https://avatars.dicebear.com/api/";
        private string imagesApiForCustomers = "https://robohash.org/";
        private string[] ipsumApiForReviews = new string[] {@"https://asdfast.beobit.net/api/?type=%27word%27,length=8",
            "https://baconipsum.com/api/?type=all-meat&sentences=2"};
        private Random rnd = new Random();
        public List<long> currentCountriesId = new List<long>();
        public List<long> currentCustomersId = new List<long>();
        public List<long> currentAirlinesId = new List<long>();
        public List<long> currentFlightsId = new List<long>();
        // Max Errors before we declare an api down exception
        private int apiErrorCount = 100;
        private string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[rnd.Next(s.Length)]).ToArray());
        }
        private async Task DataApi(Action<JObject> callBack, string str)
        {
            string responseStr;
            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(str);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage response = await client.GetAsync("");
                    if (response.IsSuccessStatusCode)
                    {
                        responseStr = await response.Content.ReadAsStringAsync();
                        callBack(JsonConvert.DeserializeObject<dynamic>(responseStr));
                    }
                }
                
            }
            catch (Exception ex)
            {
                if (apiErrorCount-- == 0)
                    throw new GeneratorApiDownException("Data API Down");
            }

        }

        // Since were dealing with free api's here which are unreliable at best
        // Were gonna use redundency to minimize Unaviable Serivce excpetions
        private async Task IpsumApi(Action<string> callBack)
        {
            HttpResponseMessage response;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ipsumApiForReviews[0]);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await client.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    string responseStr;
                    responseStr = await response.Content.ReadAsStringAsync();
                    JObject responseObj = JsonConvert.DeserializeObject<dynamic>(responseStr);
                    responseStr = (string)responseObj["text"];
                    responseStr = responseStr.Length > 150 ? responseStr.Substring(0, 150) : responseStr;                    
                    callBack(responseStr);
                }
                else
                {
                    client.BaseAddress = new Uri(ipsumApiForReviews[1]);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    response = await client.GetAsync("");
                    if (response.IsSuccessStatusCode)
                    {
                        string responseStr;
                        responseStr = await response.Content.ReadAsStringAsync();
                        responseStr = responseStr.Length > 150 ? responseStr.Substring(0, 150) : responseStr;
                        callBack(responseStr);
                    }
                    if (apiErrorCount-- == 0)
                        throw new GeneratorApiDownException(response.ReasonPhrase);
                }

            }

        }
        public List<Admin> AdminsDataGenerator(long quantity)
        {
            throw new NotImplementedException();
        }

        public List<Airline> AirlinesDataGenerator(long quantity)
        {
            List<Airline> result = new List<Airline>();
            string[] imagesStylesOptions = new string[] { "identicon", "jdenticon", "gridy" };
            List<Task> tasks = new List<Task>();
            Action<JObject> airlineConstructor = (JObject obj) =>
            {
                Airline newAirline = new Airline();
                newAirline.UserFk = new User();
                newAirline.CountryFk = new Country();
                newAirline.OverAllScore = (rnd.Next(0, 100) / ((decimal)10)); 
                newAirline.Name = (obj["company"]).Value<string>();
                newAirline.CountryFk.Id = currentCountriesId[rnd.Next(0, currentCountriesId.Count)];
                newAirline.UserFk.Username = (obj["username"]).Value<string>() + rnd.Next(1, 1000).ToString();
                newAirline.UserFk.Password = (obj["password"]).Value<string>() + rnd.Next(1, 1000).ToString();
                newAirline.UserFk.Email = (obj["email_u"]).Value<string>() + "@" + (obj["email_d"]).Value<string>();
                newAirline.ImgLink = imagesApiForAirlines + imagesStylesOptions[rnd.Next(0, 3)] +
                $"/{RandomString(5)}.svg";
                result.Add(newAirline);
            };
            for (int i = 0; i < quantity; i++)
            {
                tasks.Add(DataApi(airlineConstructor, dataApi));
            }
            Task.WaitAll(tasks.ToArray());
            return result;
        }

        public List<Country> CountriesDataGenerator(long quantity)
        {
            throw new NotImplementedException();
        }

        public List<Customer> CustomersDataGenerator(long quantity)
        {
            List<Customer> result = new List<Customer>();
            List<Task> tasks = new List<Task>();
            
            Action<JObject> customerDataConstructor = (JObject obj) =>
            {

                Customer newCustomer = new Customer();
                newCustomer.UserFk = new User();

                newCustomer.FirstName = (obj["maiden_name"]).Value<string>();
                newCustomer.LastName = (obj["name"]).Value<string>().Split(' ')[1];
                newCustomer.Address = (obj["address"]).Value<string>().Substring(0, (obj["address"]).Value<string>().Length / 2);
                newCustomer.Credit_Card_No = (obj["plasticcard"]).Value<string>();
                newCustomer.Points = rnd.Next(0, 200);
                newCustomer.PhoneNo = new string ( (obj["phone_h"]).Value<string>().Where(c => char.IsDigit(c)).ToArray()).Substring(0,7);
                newCustomer.Gender = rnd.Next(0, 2) == 1;
                newCustomer.UserFk.Username = (obj["username"]).Value<string>() + rnd.Next(1, 1000).ToString();
                newCustomer.UserFk.Password = (obj["password"]).Value<string>() + rnd.Next(1, 1000).ToString();
                newCustomer.UserFk.Email = (obj["email_u"]).Value<string>() + "@" + (obj["email_d"]).Value<string>();
                newCustomer.ImgLink = imagesApiForCustomers + RandomString(5) + "?set=set" + rnd.Next(1, 4).ToString();
                result.Add(newCustomer);
            };
            for (int i = 0; i < quantity; i++)
            {
                tasks.Add(DataApi(customerDataConstructor, dataApi));
            }
            Task.WaitAll(tasks.ToArray());
            return result;
        }

        public List<Flight> FlightsDataGenerator(long quantity)
        {
            List<Flight> result = new List<Flight>();
            TimeSpan timeSpanForDepartureDate;
            TimeSpan timeSpanForFlightDuration;
            long originCountryId;
            long destinationCountryId;
            DateTime now = DateTime.Now;
            DateTime departureDate;
            Flight newFlight;
            for (int i = 0; i < quantity; i++)
            {
                timeSpanForDepartureDate = new TimeSpan(rnd.Next(0, 168), 0, 0);
                timeSpanForFlightDuration = new TimeSpan(rnd.Next(0, 96), rnd.Next(0, 60), 0);
                originCountryId = currentCountriesId[rnd.Next(0, currentCountriesId.Count)];
                do
                {
                    destinationCountryId = currentCountriesId[rnd.Next(0, currentCountriesId.Count)];
                } while (originCountryId == destinationCountryId);
                
                departureDate = ((rnd.Next(0, 3) % 2 == 0 )? now + timeSpanForDepartureDate : now - timeSpanForDepartureDate);
                newFlight = new Flight(
                    currentAirlinesId[rnd.Next(0, currentAirlinesId.Count)],
                    originCountryId,
                    destinationCountryId,
                    departureDate,
                    departureDate + timeSpanForFlightDuration,
                    rnd.Next(0, 500),
                    rnd.Next(300, 400)
                    );
                result.Add(newFlight);
            }
            return result;
        }

        public List<Ticket> TicketsDataGenerator(long quantity)
        {
            List<Ticket> result = new List<Ticket>();
            Ticket newTicket;
            long currentFlightId;
            for (int i = 0; i < quantity; i++)
            {
                currentFlightId = currentFlightsId[rnd.Next(0, currentFlightsId.Count)];
                newTicket = new Ticket(
                    currentFlightId,
                    currentCustomersId[rnd.Next(0, currentCustomersId.Count)],
                    "Data Generator Stripe Id"
                    );
                newTicket.Cost = rnd.Next(250, 300);
                result.Add(newTicket);
            }
            return result;
        }
        public List<Review> ReviewsDataGenerator(long quantity)
        {
            List<Review> result = new List<Review>();
            List<Task> tasks = new List<Task>();

            Action<string> reviewDataConstructor = (string str) =>
            {

                Review newReview = new Review();
                newReview.AirlineFk.Id = currentAirlinesId[rnd.Next(0, currentAirlinesId.Count)];
                newReview.CustomerFk.Id = currentCustomersId[rnd.Next(0, currentCustomersId.Count)];
                newReview.Score = (rnd.Next(0, 100) / ((decimal)10));
                newReview.Description = str;

                result.Add(newReview);

            };
            for (int i = 0; i < quantity; i++)
            {
                tasks.Add(IpsumApi(reviewDataConstructor));
            }
            Task.WaitAll(tasks.ToArray());
            return result;

        }
    }
}
