import axios from 'axios';
import {
    GetToken
} from '../AuthService';
import { Buffer } from "buffer";


const baseURL = process.env.REACT_APP_API_URL;







// Upload Your Own Img
export function UploadImage(file) {
    var token = GetToken();
    var formData = new FormData();
    formData.append("Picture", file);
    return axios.post(
        `${baseURL}/Image/uploadmyimage`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        }
    )
}














export async function GetSomeUserImage(userDetails) {
    //Check To see if its an external api link and the link isnt broken
   
    var result = {
        ContentType: "",
        ContentInfo: ""
    }
    await axios.get(userDetails.imgLink)
        .then(response1 => result = { ContentType: "ExternalApi", ContentInfo: userDetails.imgLink })
        .catch(error =>
            axios.get(`${baseURL}/Image/${userDetails.userFk.id}`, { responseType: "arraybuffer" })
                .then(response2 => {
                    result = { ContentType: "TucanosStorage", ContentInfo: Buffer.from(response2.data, "binary").toString("base64") }

                })
                .catch(error2 => {

                    return result;
                })
        );
    return result;
}