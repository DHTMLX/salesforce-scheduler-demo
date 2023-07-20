# DHTMLX Scheduler demo for SalesForce LWC

[![dhtmlx.com](https://img.shields.io/badge/made%20by-DHTMLX-blue)](https://dhtmlx.com/)
[![License: GPL v2](https://img.shields.io/badge/license-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)

Here you can find a code example of the event calendar for Lightning Web Components on Salesforce Platform.

The sample is implemented with the help of JavaScript Scheduler library - [DHTMLX Scheduler](https://dhtmlx.com/docs/products/dhtmlxScheduler/).

## Prerequisites

- Enable the [Developer Hub](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_enable_devhub.htm) in your organization
- Install the [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)

## How to start

- [Change login url](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_web_flow.htm) (sfdcLoginUrl) in sfdx-project.json to url of your SalesForce organization

- Create [scratch org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_scratch_orgs.htm#!)

```sh
sfdx org login web -d
sfdx org create scratch -f config/project-scratch-def.json -d
```

- Publish code

```sh
sfdx project deploy start
```

- Open scratch org in browser

```
sfdx org open
```

The scratch org already has Scheduler app which you can check, or go to "Setup : Lighting Apps", create a new Lighting App and drop the Scheduler from the list of available components.

## How to configure / modify

### Backend

getEvents in force-app/main/default/classes/SchedulerData.cls returns list of events, adjust this query as necessary.

### Frontend

force-app/main/default/lwc/scheduler/scheduler.js contains code of web component

```js
function unwrap(fromSF){
    const data = fromSF.events.map(a => ({
```

**unwrap** functions controls how data from SalesForce is converted to dhtmlxScheduler compatible objects. You will need to modify this code if you will want to provide some additional data properties from SalesForce to the dhtmlxScheduler

```js
initializeUI(){
        const root = this.template.querySelector('.thescheduler');
        root.style.height = this.height + "px";

        const scheduler = window.Scheduler.getSchedulerInstance();
```

**initializeUI** creates an instance of scheduler. This is the perfect place to configure the scheduler by using its [API](https://docs.dhtmlx.com/scheduler)


```js
scheduler.createDataProcessor(function (entity, action, data, id) {
    switch (action) {
        case "create":
```

**createDataProcessor** defines data saving rules, they need to be adjusted if you will want to save some extra fields along with the default Event's data.

### Version of the Scheduler

force-app/main/default/staticresources/scheduler contains a trial version of the Scheduler ( it will show a warning message time to time ). For production usage you will need to replace js and css files in this archive with ones from enterprise/ultimate Scheduler package.

The earliest version of dhtmlxScheduler that is fully compatible with SalesForce LWC is [dhtmlxScheduler v6.0.1](https://docs.dhtmlx.com/scheduler/what_s_new.html#601).

## Related resources

- Documentation: [https://docs.dhtmlx.com/scheduler/](https://docs.dhtmlx.com/scheduler/)
- dhtmlxScheduler product page: [https://dhtmlx.com/docs/products/dhtmlxScheduler/](https://dhtmlx.com/docs/products/dhtmlxScheduler/)
- Video tutorial: [https://youtu.be/IceDT8O1Pys](https://youtu.be/IceDT8O1Pys?list=PLKS_XdyIGP4M1Jtg1qyjdJtCsqU1bqGsc)
- About DHTMLX Scheduler in Salesforce: [https://dhtmlx.com/docs/products/demoApps/salesforce-scheduler/](https://dhtmlx.com/docs/products/demoApps/salesforce-scheduler/)


## Support Us

Star our GitHub repo :star:

Read us on [Medium](https://medium.com/@dhtmlx) :newspaper:

Follow us on [Twitter](https://twitter.com/dhtmlx) :bird:

Like our page on [Facebook](https://www.facebook.com/dhtmlx/) :thumbsup:
