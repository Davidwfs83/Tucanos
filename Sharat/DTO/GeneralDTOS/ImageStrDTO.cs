using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sharat.DTO.GeneralDTOS
{
    public class ImageStrDTO
    {
        public ImageStrDTO(string imgstr)
        {
            ImgStr = imgstr;
        }

        public string ImgStr { get; set; }
    }
}
