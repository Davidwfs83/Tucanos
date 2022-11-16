import { ActiveResponseBox } from '../redux/CenterPopUp/ceneterpopup.actions';
import React from 'react';

export function DateTimeToDateAndTimeParser(dateTime) {
    var dateAndTime;
    if (typeof (dateTime) === 'string') {
        dateAndTime = dateTime.split("T");
        if (dateAndTime.length === 2)
            return {
                Date: dateAndTime[0],
                Time: dateAndTime[1]
            }
    }
    
    return {}       
}

// Takes File And Convert Into String Base 64 byte array
export function FileToByteArrStingified(file, callback) {
    var binary = '';
    var reader = new FileReader();
    reader.onload = () => {
        var bytes = new Uint8Array(reader.result);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        callback(window.btoa(binary));
    }
    reader.readAsArrayBuffer(file);
}

export function FormObjFactory(obj) {
    var propNameArr = Object.getOwnPropertyNames(obj);
    var formData = new FormData();
    propNameArr.forEach(propName => formData.append(propName, obj[propName]));
    return formData;
}

export function ObjectDefaultValueCleaner(obj) {
    var result = {};
    for (const key in obj) {

        if (typeof obj[key] == "string" && obj[key] !== "")
            result[key] = obj[key];
        else if (typeof obj[key] == "object" && !isEmptyArr(obj[key]) && !isEmptyObject(obj[key]) && obj[key] !== null )
            result[key] = obj[key];       
        else if (typeof obj[key] == "number" && obj[key] !== 0)
            result[key] = obj[key];
        else if (Array.isArray(obj[key]) && obj.length > 0)
            result[key] = obj[key];
        else if (typeof obj[key] === 'boolean')
            result[key] = obj[key];
    }
    return result;
}
export function ExtractStatusAndMsgForSuccessPopup(response, dispatch) {
    console.log(response);
    dispatch(ActiveResponseBox(response.status, response.data.info))
}
export function ExtractStatusAndMsgForErrorPopup(error, dispatch) {
    console.log(error);
    dispatch(ActiveResponseBox(error.response.status, error.response.data.Message))
}

export function isEmptyObject(obj) {
    return JSON.stringify(obj) === '{}'
}
export function isEmptyArr(arr) {

    return JSON.stringify(arr) === '[]'
}


export function FigureOutImageSrc(ImgObj, defaultImg, ImgLink) {
    if (ImgObj !== null && ImgObj !== undefined)
        return `data:image/jpg;base64,${ImgObj}`;
    if (ImgLink !== null && ImgLink !== undefined)
        return ImgLink;
    return defaultImg;
    
}


export function ScoreStarCalculator(score) {
    var numOfFullStars = Math.floor(score / 2);
    var numOfHalfStars = 0;
    var key = 0;
    var starsArr = [];
    for (var i = 0; i < numOfFullStars; i++) {
        starsArr.push((<i key={key++} className="fa-solid fa-star"></i>))
    }
    if (score / 2 - numOfFullStars !== 0) {
        numOfHalfStars++;
        starsArr.push((<i key={key++} className="fa-regular fa-star-half-stroke"></i>))
    }
    for (var i = 0; i < 5 - numOfFullStars - numOfHalfStars; i++) {
        starsArr.push(<i key={key++} className="fa-regular fa-star"></i>)
    }
    return starsArr;

}


export function fileToByteArray(file) {
    return new Promise((resolve, reject) => {
        try {
            let reader = new FileReader();
            let fileByteArray = [];
            reader.readAsArrayBuffer(file);
            reader.onloadend = (evt) => {
                if (evt.target.readyState == FileReader.DONE) {
                    let arrayBuffer = evt.target.result,
                        array = new Uint8Array(arrayBuffer);
                    for (byte of array) {
                        fileByteArray.push(byte);
                    }
                }
                resolve(fileByteArray);
            }
        }
        catch (e) {
            reject(e);
        }
    })
}



export function QueryStringToObject(str) {
    
    var objSearchParam = new URLSearchParams(str);
    var objFromEntries = Object.fromEntries(objSearchParam);
    var crntProp = undefined;
    var result = {};
    for (const key in objFromEntries) {
        crntProp = objFromEntries[key];
        if (typeof crntProp === 'string' && (crntProp[0] == "[") && (crntProp[crntProp.length - 1] == "]")) {
            var newArray = [];
            var currentChar = '';
            for (var i = 1; i <= crntProp.length - 2; i++) {
                if (crntProp[i] !== ',') {
                    currentChar = currentChar + crntProp[i];

                }
                if (crntProp[i] === ',' || (i == (crntProp.length - 2))) {
                    newArray.push(parseInt(currentChar))
                    currentChar = '';
                }
            }
            result[key] = newArray;
        }
        else if (typeof crntProp === 'string' && crntProp === 'null') {
            result[key] = null;
        }
        else {
            result[key] = crntProp;
        }
         
    }
    return result;
}

export function ObjectToQueryString(obj) {
    
    return Object.keys(obj).map(key => {
        if (Array.isArray(obj[key]))
            return key + '=[' + obj[key] + ']'
        else
            return key + '=' + obj[key]
    }).join('&');
}