const {shell} = require('electron');

const parser = new DOMParser();

const linkSection = document.querySelector('.links');
const errormessage = document.querySelector('.error-message');
const newlinkform = document.querySelector('.new-link-form');
const newlinkurl = document.querySelector('.new-link-url');
const newlinksubmit = document.querySelector('.new-link-submit');
const clearstorage = document.querySelector('.clear-storage');

newlinkurl.addEventListener('keyup', ()=>{
    newlinksubmit.disabled = !newlinkurl.validity.valid;
});

newlinkform.addEventListener("submit", (event)=>{
    event.preventDefault();

    const url = newlinkurl.value;
    fetch(url)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title=>storeLink(title, url))
    .then(clearform)
    .then(renderLinks)
    .catch(error=>handleError(error, url));
});

clearstorage.addEventListener('click', ()=>{
    localStorage.clear();
    linkSection.innerHTML = '';
});

linkSection.addEventListener('click', (event)=>{
    if (event.target.href) {
        event.preventDefault();
        shell.openExternal(event.target.href);
    }
});

const clearform = () => {
    newlinkurl.value = null;
};

const parseResponse = (text) => {
    return parser.parseFromString(text, 'text/html');
};

const findTitle = (nodes) => {
    return nodes.querySelector('title').innerText;
};

const storeLink = (title, url) => {
    localStorage.setItem(url, JSON.stringify({title:title, url:url}));
}

const getLinks = () => {
    return Object.keys(localStorage).map(key =>JSON.parse(localStorage.getItem(key)));
};

const convertToElement = (link) => {
    console.log(link);
    console.log(link.title);
    return `<div class="link"><h3>${link.title}<h3><p><a href="${link.url}">${link.url}</a></p></div>`;
}

const renderLinks = () => {
    const linkElements = getLinks().map(convertToElement).join('');
    linkSection.innerHTML = linkElements;
};

const handleError = (error, url) => {
    errormessage.innerHTML = `there was an issue adding "${url}": ${error.message}`.trim();
    setTimeout(() => {
        errormessage.innerHTML = null;
    }, 5000);
}

const validateResponse = (response) => {
    if (response.ok) {
        return response;
    }

    throw new Error(`Status code of ${response.status} ${response.statusText}`);
}

renderLinks();