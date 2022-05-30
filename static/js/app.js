import { drop,fileInput,browseBtn,host,uploadUrl,emailUrl,
    progress_container,toast,maxAllowedSize,progress_bar,percentageDisplay,
    uploadStatus,fileURL,sharing_container,emailForm,copyBtn,fileInfoWrapper,qrGenerator,clipBoardOnClick
,uploading,uploadSuccessful} from './declare.js';

// import * as module_name from './declare';
drop.addEventListener("dragover",(e)=>{
    e.preventDefault();
    if(!drop.classList.contains('dragged')){
        drop.classList.add('dragged');
    }//Occours when user just hover on drop-zone
});
drop.addEventListener("dragleave",(e)=>{
    e.preventDefault();
    if(drop.classList.contains('dragged')){
        drop.classList.remove('dragged');
    } //occours when user leaves
});
drop.addEventListener("drop",(e)=>{
    e.preventDefault();
    drop.classList.remove('dragged'); 
    const actualFile = e.dataTransfer.files;
    fileInput.files= actualFile;
    upload();//occours when user drop the file over drop-zone and upload() will be called.
});
browseBtn.addEventListener('click',(e)=>{
    fileInput.click(); //to open the drawer window
});
fileInput.addEventListener('change',(e)=>{
    upload(); //To Call the upload method to upload file
});
//calculateFileSize;
const calculateFileSize=(bytes,decimalPoint)=> {
    if(bytes == 0) return '0 Bytes';
    let k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }
//upload fn.
const upload = () => {
    const file = fileInput.files[0];
     if(fileInput.files.length>1){
        resetInput();
        showToast('You Can Upload 1 File Only.');
        return;
    }
    else if(file.size>maxAllowedSize){
        resetInput();
        showToast("Can't upload more than 100MB.");
        return;
    }else{
        const fileName = file.name;
        const fileSize = calculateFileSize(file.size);
        fileInformation(fileName,fileSize);
        const formData = new FormData;
        formData.append("myFile", file);
        fileInfoWrapper.classList.remove('d-none');
        uploadSuccessful.style.display="none";
        progress_container.style.display="block";
        const xhr = new XMLHttpRequest;
         xhr.onreadystatechange=()=>{
             if(xhr.readyState===XMLHttpRequest.DONE){
              xhr.response?(displayLink(JSON.parse(xhr.response)), setStorage(file)):showToast(`Something Went Wrong : ${xhr.statusText}`);
             }
            }
         xhr.upload.onprogress = updateProgress;
         xhr.upload.onerror = ()=>{
         resetInput();
         showToast(`Error in upload: ${xhr.statusText}`);
         uploading.style.display="none";
         uploadStatus.innerHTML="Error";
        }
    xhr.open("POST",uploadUrl);
    xhr.send(formData); 
    }
}
//Percentage Progress
const updateProgress = (e) => {
    let percentage = Math.round((e.loaded/e.total)*100);
    progress_bar.style.width=percentage+"%";
    percentageDisplay.innerHTML=percentage+"%";
}
//display the sharing options
const displayLink =({file:url})=>{
    uploadStatus.innerHTML="Uploaded.";
    uploading.style.display="none";
    uploadSuccessful.style.display="block";
    progress_container.style.display="none";
    sharing_container.style.display="block";
    emailForm[2].innerHTML="Send";
    emailForm[2].removeAttribute("disabled");
    progress_bar.style.width="0%";
    percentageDisplay.innerHTML="0%";
    resetInput();
    fileURL.value=url; 
}
//Copy Clipboard 
copyBtn.addEventListener('click',()=>{
    fileURL.select();
    document.execCommand("copy");
    showToast("Copied To Clipboard.");
});
//Reset Input
const resetInput = () =>{
    fileInput.value="";
}
//Email
 emailForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const url = fileURL.value;

    const formData = {
      uuid:url.split("/").splice(-1,1)[0],
      emailTo:emailForm.elements["toEmail"].value,
      emailFrom:emailForm.elements["fromEmail"].value
    }
    emailForm[2].setAttribute("disabled","true");
    emailForm[2].innerHTML="Sending..";
    fetch(emailUrl,{
        method:'POST',
        headers:{
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(formData),
    }).then((res)=>res.json()).then(({success,error})=>{
        if(success){
            //api kaam nahi kr rahi islie ! lagaya hai remove krna hai isse
            let myModal = document.getElementById('emailBackdrop');
            let modal = bootstrap.Modal.getInstance(myModal);
            modal.hide();
            sharing_container.style.display="none";
            fileInfoWrapper.classList.add('d-none');
            showToast("Email Sent");            
            emailForm.elements["toEmail"].value="";
            emailForm.elements["fromEmail"].value="";
        }else if(error){
            modal.hide();
            showToast(error);
        }
    })
});
//showToast
const showToast = (message)=>{
    let hideToast;
    toast.innerHTML=message;
    toast.classList.add('my-toast--visible');
    clearTimeout(hideToast);
    hideToast= setTimeout(()=>{
        toast.classList.remove('my-toast--visible');
    },2000);
}
const fileInformation = (fileName,fileSize)=>{
    const filename = document.querySelector('.filename');
    const filesize = document.querySelector('.filesize');
    uploading.style.display="block";
    uploadStatus.innerHTML="Uploading..";
    filename.innerHTML=fileName;
    filesize.innerHTML=`${fileSize}.`;
}
qrGenerator.addEventListener('click',()=>{
    const qrCode = document.querySelector('#qrCode');
    const imgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=625x625&data=${fileURL.value}`;
    qrCode.setAttribute('src',imgUrl);
    qrCode.setAttribute('alt',imgUrl);
});

//LocalStorage 
//manually called krna pdata hai to add event listener on every element [array] kynki jab page render hoga jaruri nai h tb
// row ho islie everytime i display the result will called..
function updateRecentUploads(){
    for(let i=0;i<clipBoardOnClick.length;i++){
        clipBoardOnClick[i].addEventListener('click',()=>{
            const indexNo=clipBoardOnClick[i].getAttribute('data-index');
           let getLink = document.getElementsByClassName('fileDownloadLink')[indexNo];
           getLink.select();
          document.execCommand("copy");
          showToast("Copied To Clipboard.");
        });
    }    
}
//populate the previous result from localstorage
const showRecentUploads = ()=>{
    if(localStorage.getItem('recentUploads')){
        const recentUpload = document.querySelector('.recentUpload');
        const recentUploadContainer = document.querySelector('#recentUploadContainer');
        let list=[];
        list = JSON.parse(localStorage.getItem('recentUploads'));
        let row="";
        let dateObj = new Date();
        list.forEach((element,index) => {
            dateObj= JSON.stringify(element[3]);//just a hack to override the jsonStringfy UTC PROBLEM.
            dateObj = new Date(JSON.parse(dateObj));
            if((new Date() < dateObj) ){
                row += "<tr>" + `<td>${element[0]}</td>` + `<td class="d-none d-sm-block">${element[1]}.</td>`+ `<td> 
                <input type="text" class="inputBoxReset text-success fileDownloadLink"  readonly value="${element[2]}"> 
                <img src="./assets/images/content_copy.svg" alt="CopySvg" class="img-fluid px-2 clipBoardOnClick modalCopysvg" data-index="${index}">
                </td>`+ `<td class="d-none d-sm-block">${dateObj.toLocaleDateString() +" "+ dateObj.toLocaleTimeString()} </td>`+
                "</tr>"  
                recentUpload.style.display="block"; 
            }else{
               removeElement(index);
            }
        }); 
        recentUploadContainer.innerHTML=row;
    }
    updateRecentUploads();
}
const removeElement=(index)=>{
    let convertIntoStr = JSON.parse(localStorage.getItem('recentUploads'));
    convertIntoStr.splice(index,1);
    localStorage.setItem('recentUploads',JSON.stringify(convertIntoStr));
}
//this method called when user upload the file
const setStorage = ({name,size}=fileInfo)=>{
    const fsize = calculateFileSize(size);
    if(localStorage.getItem('recentUploads')==null){
        const recent=[];
        const link = fileURL.value;
        recent.push([name,fsize,link,setExpiryDate()]);
        localStorage.setItem('recentUploads',JSON.stringify(recent));
        showRecentUploads();
    }else{
        const prevUploads=JSON.parse(localStorage.getItem('recentUploads'));
        const link = fileURL.value;
        prevUploads.push([name,fsize,link,setExpiryDate()]);
        localStorage.setItem('recentUploads',JSON.stringify(prevUploads));
        showRecentUploads();
    }
}
const setExpiryDate = () =>{
    let oneday = new Date();
    oneday.setHours(oneday.getHours() + 24);
    return oneday;
}
window.onload = showRecentUploads;
//if user try to clear localstorage then we remove the recentUploads
window.addEventListener('storage', function(e) {
    const recentUpload = document.querySelector('.recentUpload');
    recentUpload.style.display="none";
    const recentUploadContainer = document.querySelector('#recentUploadContainer');
    recentUploadContainer.innerHTML="";
});



