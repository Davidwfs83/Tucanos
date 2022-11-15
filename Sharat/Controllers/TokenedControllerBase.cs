using DataCommunicator.IFacades;
using DataCommunicator.ILoginServices;
using DataCommunicator.Pocos;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Sharat.Controllers
{
    public abstract class TokenedControllerBase<T> : ExtendedControllerBase where T : IUserResource 
    {
        internal T tokenUserInfo;
    }
}
