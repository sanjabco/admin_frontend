import Cookies from 'js-cookie';

function setCookie(name, value, expiresIn) {
    let options = {path: '/'};

    if (typeof expiresIn === 'number') {
        options.expires = expiresIn / (60 * 24);
    } else if (expiresIn instanceof Date) {
        options.expires = expiresIn;
    }

    Cookies.set(name, value, options);
}

function getCookie(name) {
    return Cookies.get(name);
}

function deleteCookie(name) {
    Cookies.remove(name, {path: '/'});
}

export {
    setCookie,
    getCookie,
    deleteCookie
};
