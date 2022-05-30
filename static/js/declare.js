const drop = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseBtn = document.querySelector('.browseBtn');
const host = "https://quickshare-easy.herokuapp.com/";
const uploadUrl = `${host}api/files/`;
const emailUrl =  `${host}api/files/send`;
const progress_container = document.querySelector('.progress-container');
const toast = document.querySelector('.my-toast');
const maxAllowedSize = 100 * 1024 *1024;

const progress_bar = document.querySelector('.progress-bar');
const percentageDisplay = document.querySelector('.percent');
const uploadStatus = document.querySelector('#uploadStatus');

const fileURL = document.querySelector('#fileURL');

const sharing_container = document.querySelector('.sharing-container');
const emailForm = document.querySelector('#emailForm');

const copyBtn = document.querySelector('#copyBtn');

const fileInfoWrapper = document.querySelector('.fileInformation');

const qrGenerator = document.querySelector('#qrGenerate');
const clipBoardOnClick = document.getElementsByClassName('clipBoardOnClick');
const  uploading = document.querySelector('#uploading');
const  uploadSuccessful = document.querySelector('#uploadSuccessful');
export{ drop,fileInput,browseBtn,host,uploadUrl,emailUrl,
    progress_container,toast,maxAllowedSize,progress_bar,percentageDisplay,
    uploadStatus,fileURL,sharing_container,emailForm,copyBtn,fileInfoWrapper,qrGenerator,clipBoardOnClick,
    uploading,uploadSuccessful
};
//because i dont't want to access everything with modulename.
AOS.init({
    once: true
});

const scrollTop = document.querySelector('.scroll-to-top');

const displayButton = ()=>{
    if(document.documentElement.scrollTop<=500){
       scrollTop.classList.add('d-none');
    }else{
        scrollTop.classList.remove('d-none');
    }
}
window.addEventListener('scroll',(e)=>{
    displayButton();
});
scrollTop.addEventListener('click',()=>{
    document.body.scrollTop=0;
    document.documentElement.scrollTop=0;
});