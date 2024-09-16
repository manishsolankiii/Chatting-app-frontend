import moment from "moment";

const fileFormat= (url="") => {
   
    const fileExtention=url.split(".").pop();

    if(fileExtention==="mp4" ||fileExtention==="webm" || fileExtention==="ogg"){
        return "video";
    }

    if(fileExtention==="mp3" ||fileExtention==="wav" ){
        return "audio";
    }
      
    if(fileExtention==="png" ||fileExtention==="jpg" || fileExtention==="jpeg" || fileExtention==="gif"){
        return "image";
    }

    return "file"
    
}; 


const transformImage = (url="",width=100) => {
    
   // const newUrl=url.replace("upload/", `upload/dpr_auto/w_${width}/`);

    return url;
};




const getLast7Days = () => {

    const curruntDate = moment();
    const last7Days=[];

    for(let i=0;i<7;i++){
         last7Days.unshift(curruntDate.format("dddd"));
         curruntDate.subtract(1,"days");
    }

    return last7Days;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
    if (get)
      return localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : null;
    else localStorage.setItem(key, JSON.stringify(value));
  };

export {fileFormat,transformImage,getLast7Days,getOrSaveFromStorage};