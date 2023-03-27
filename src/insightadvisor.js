import {clientNames} from './configure';

import { library, icon, findIconDefinition } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas);

const globedef = findIconDefinition({ prefix: 'fas', iconName: 'earth-americas' });
const datedef = findIconDefinition({ prefix: 'fas', iconName: 'calendar-days' });

async function createRecommendationRequest(auth, setup, type) {
    const requestPayload = { fields: [], libItems: []};
    
    if(type == 'text'){
        //Get question text
        const text = document.getElementById("inputText").value;

        if (text) {
            requestPayload.text = text;
        }
    } else {
        const targetAnalysis = document.getElementById('selectAnalysis').value;
        const selected = document.querySelectorAll('input[type="checkbox"]:checked');

        // Field Selection list
        if(selected.length > 0) {
            selected.forEach(element => {
                if(element.dataset.type == "fields"){
                    requestPayload.fields.push({ name: element.dataset.value });
                }else {
                    requestPayload.libItems.push({ libId: element.dataset.value });
                }
            });
        } else {
          return null; //Dont get recommendations if no fields are selected
        }

      if (targetAnalysis) {
        requestPayload.id = targetAnalysis;
      }
    }
    
    const endpointUrl = `/apps/${setup.appId}/insight-analyses/actions/recommend`;
    let data = {};
    if (requestPayload.text) {
        data = JSON.stringify({
          text: requestPayload.text,
        });
    } else if (requestPayload.fields || requestPayload.libItems) {
        data = JSON.stringify({
          fields: requestPayload.fields,
          libItems: requestPayload.libItems,
          targetAnalysis: { id: requestPayload.id },
        });
    }
    let headers = {};
    headers["Accept-Language"] = "en";
    const rec = await getApiRequest(auth, endpointUrl, headers, 'POST', data);
    console.log(rec);
    const recommendation = pickValidRecommendation(rec.data.recAnalyses);
    return recommendation[0];
}

function pickValidRecommendation(analyses) {
    //Remove recommendations not available for rendering
    return analyses.filter(i => Object.values(clientNames).includes(i.chartType));
}


function addOption(element, name, value) {
    var opt = document.createElement("option");
    opt.text = name;
    opt.value = value;
    document.getElementById(element).appendChild(opt);
}

function addListOption(element, name, value, type, classifications) {
    var opt = document.createElement("li");
    var inp = document.createElement("input");
    var lab = document.createElement("label");
    
    inp.dataset.text = name;
    inp.dataset.value = value;
    inp.dataset.type = type;
    inp.id = element + "_" + value;
    inp.type = "checkbox";
    lab.setAttribute("for", element + "_" + value);
    lab.innerText = name;
    opt.appendChild(inp);
    opt.appendChild(lab);
    if(classifications.includes("geographical")){
      opt.appendChild(icon(globedef).node[0]);
    }
    if(classifications.includes("temporal")){
      opt.appendChild(icon(datedef).node[0]);
    }
    document.getElementById(element).appendChild(opt);
}

async function fetchMetadata(auth, setup, n) {
    // retrieve the analyses types for given application
    const analysesResponse = await getAnalyses(auth, setup.url, setup.appId);
    // retrieve the classification information such as fields and master items along with it's classifications
    const metadata = await getClassifications(auth, setup.url, setup.appId);

    // fill up the analyses dropdown
    analysesResponse.data.forEach((analysis) => {
      const name = analysis.compositions[0].description.short;
      const value = analysis.id;
      addOption("selectAnalysis", name, value);
    });
  
    // filter out dimension from fields
    const fieldDimensions = metadata.data.fields.filter((field) => 
      field.simplifiedClassifications.includes('dimension') && field.isHidden != true
    );
    fieldDimensions.forEach((dimension) => {
      const name = dimension.name;
      addListOption("fd", name, name, "fields", dimension.simplifiedClassifications);
    });
  
    // filter out dimension from master items
    const masterDimensions = metadata.data.masterItems.filter((masterItem) =>
      masterItem.simplifiedClassifications.includes('dimension') && masterItem.isHidden != true
    );
    masterDimensions.forEach((dimension) => {
      const name = dimension.caption;
      const value = dimension.libId;
      addListOption("md", name, value, "libItems", dimension.simplifiedClassifications);
    });
  
    // filter out measures from fields
    const fieldMeasures = metadata.data.fields.filter((field) => 
      field.simplifiedClassifications.includes('measure') && field.isHidden != true
    );
    // fill up the measures dropdown
    fieldMeasures.forEach((measure) => {
      const name = measure.name;
      addListOption("fm", name, name, "fields", measure.simplifiedClassifications);
    });
    // filter out measures from master items
    const masterMeasures = metadata.data.masterItems.filter((masterItem) =>
      masterItem.classifications.includes('measure') && masterItem.isHidden != true
    );
    // fill up the measures dropdown
    masterMeasures.forEach((measure) => {
      const name = measure.caption;
      const value = measure.libId;
      addListOption("mm", name, value, "libItems", measure.simplifiedClassifications);
    });

    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    if(checkboxes) {
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function(){
              globalChart = runInsightAdvisorRequest(auth, setup, n, "chart", "field");
            });
        })
        
    }
    
}

/**
 * rest api call for analyses
 */
 async function getAnalyses(auth, url, appId) {
    
    // build url to execute analyses call
    const endpointUrl = `/apps/${appId}/insight-analyses`;
    return getApiRequest(auth, endpointUrl, {}, 'GET');
}

/**
 * rest api call to fetch metadata & classifications
 */
 async function getClassifications(auth, url, appId) {
    // build url to execute classification call
    const endpointUrl = `/apps/${appId}/insight-analyses/model`;
    return getApiRequest(auth, endpointUrl, {}, 'GET');
}

/**
 * rest api calls
 */
 async function getApiRequest(auth, url, headers, method, body) {
  const response = await auth.rest(url, {
      method,
      headers,
      credentials: 'include',
      body,
    });
    const responsejson = await response.json();
    return responsejson;
}

async function renderChart(nebula, chartelement, recommendation) {
  var chart;  
  if(recommendation){
        const type = recommendation.chartType;

        chart = await nebula.render({
          type: type,
          element: document.getElementById(chartelement),
          extendProperties: true,
          options: {
            configuration: {
              serverUrl: 'https://maps.qlikcloud.com',
              serverKey: 'may21-K8DU2D3jU9PWhr'
            },
          },
          properties: { ...recommendation.options },
        });
        return chart;
    } else {
        console.log("There were no recomendations for the request");
        return null;
    }

}

async function setupInsightAdvisor(auth, setup, n){
    fetchMetadata(auth, setup, n);
}

async function runInsightAdvisorRequest(auth, setup, nebula, chartelement, type){
    const req = await createRecommendationRequest(auth, setup, type);
    document.getElementById(chartelement).replaceChildren();
    return await renderChart(nebula, chartelement, req);
}

export {globalChart, removeChart, setupInsightAdvisor, runInsightAdvisorRequest};