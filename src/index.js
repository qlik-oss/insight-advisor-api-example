/* eslint-disable */
import {embedConfig} from './configure';
import {connect, connectAuth} from './connect';
import {setConfig, getConfig} from './setup';

import {setupInsightAdvisor, runInsightAdvisorRequest} from './insightadvisor';

import {Auth, AuthType} from '@qlik/sdk';

window.globalChart = null;

window.removeChart = async function() {
  if(window.globalChart) {
    const chart = await window.globalChart;
    if(chart){
      await chart.destroy();
      window.globalChart = null;
    }
  }
}

async function setupAuth(host, clientId) {
  const config = {
    authType: AuthType.OAuth2,
    host: host,
    clientId: clientId,
    redirectUri: window.location.origin,
    scopes: ["user_default"]
  }

  const auth = new Auth(config);
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  if (code) {
    await auth.authorize(window.location.href); // exchanges the credentials for a token
    window.history.pushState({}, "", "/");
  } else if (!(await auth.isAuthorized())) { 
    const { url } = await auth.generateAuthorizationUrl();
    window.location = url;
  }
  return auth;
}

async function configureQlik(setup) {
  const auth = await setupAuth(setup.url, setup.clientId);
  let app = await connectAuth(auth, setup.appId);

  const n = embedConfig(app);

  await setupInsightAdvisor(auth, setup, n);
  document.querySelector('#requestInsight').addEventListener('click', async function(){
    await removeChart();
    window.globalChart = runInsightAdvisorRequest(auth, setup, n, "chart", "text");
  });

  document.querySelector('#selectAnalysis').addEventListener('change', async function(){
    await removeChart();
    window.globalChart = runInsightAdvisorRequest(auth, setup, n, "chart", "field");
  });

  (await n.selections()).mount(document.querySelector('.toolbar'));
}

async function configureSetup() {
  const setup = getConfig();
  if(setup.url != ""){
    document.getElementById("tenant").value = setup.url;
    if(setup.clientId != "") {
      document.getElementById("clientid").value = setup.clientId;
      if(setup.appId != "") {
        document.getElementById("appid").value = setup.appId;
        //Now we can setup the connection to Qlik
        await configureQlik(setup);
      }
    }
  }
}

async function updateSetup() {
  const url = document.getElementById("tenant").value;
  const clientId = document.getElementById("clientid").value;
  const appId = document.getElementById("appid").value;
  if(url != "") setConfig("url",url);
  if(clientId != "") setConfig("clientId",clientId);
  if(appId != "") setConfig("appId",appId);
  await configureSetup();
}

async function run() {
  
  document.querySelector('#connectToTenant').addEventListener('click', function(){
    updateSetup();
  });

  //Try Configuring setup when first start
  await configureSetup();
  
}

run();
