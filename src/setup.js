function getConfig() {
    var config = {};
    config.url = getItem("qlik-url");
    config.clientId = getItem("qlik-clientId");
    config.appId = getItem("qlik-appId");
    return config;
}

function getItem(key) {
    const item = localStorage.getItem(key);
    if(item == null) return "";
    return item;
}

function setConfig(item, value) {
    localStorage.setItem(`qlik-${item}`,value);
}

export {getConfig, setConfig}
