# Insight Advisor API Example

Insight Advisor API endpoints offer capabilities to query and get responses back from Insight advisor within the context of an interactive app.

A tutorial is available which shows a basic example. This more comprehensive example provides code with will demonstrate the capability with complete authentication integration using OAuth.

https://qlik.dev/embed/make-analytics-conversational/build-insight-advisor-web-app

This code was written by Steven Pressland (steven.pressland@qlik.com)

To get to the content of this repo do the following:

## Install Packages
`yarn install`

## Run local server
`yarn run start`

## Setup Web App
The first time you launch the UI, you will need to complete the 3 connection settings. these will be stored in local storage in your browser for future use.

* Tenant URL: This should the tenant you are using, *for example*: https://tenantname.us.qlik.cloud.com
* OAuth Client ID: This is the public client ID you have created. *See section below for details.*
* App ID: This is the GUID of the AppID.

Click "Connect to Tenant" and follow login and one time approval process.


## Create a OAuth Client ID

An OAuth Client ID is generated in the management console by a Tenant Admin.

1. Launch Qlik Cloud Management Console
1. Select Integration - OAuth
1. Click "Create new"
1. Client type: Single-page app
1. Name: Name of your app
1. Description: a suitable description
1. Add redirect URLs: *(for this basic demo)* http://localhost:1234
1. Add allowed origins: *(for this basic demo)* http://localhost:1234
1. Click "Create"
1. Copy the Client ID and use in web page above.