/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { createRecord, updateRecord, deleteRecord } from "lightning/uiRecordApi";

// Static resources
import SchedulerFiles from "@salesforce/resourceUrl/scheduler";

// Controllers
import getEvents from "@salesforce/apex/SchedulerData.getEvents";

function unwrap(fromSF) {
    const data = fromSF.events.map((a) => ({
        id: a.Id,
        info: a.Name,
        start_date: a.Start_Date__c,
        end_date: a.End_Date__c,
        text: a.Text__c,
    }));

    return { data };
}

export default class SchedulerView extends LightningElement {
    static delegatesFocus = true;

    @api height;
    schedulerInitialized = false;

    renderedCallback() {
        if (this.schedulerInitialized) {
            return;
        }
        this.schedulerInitialized = true;

        Promise.all([
            loadScript(this, SchedulerFiles + "/dhtmlxscheduler.js"),
            loadStyle(this, SchedulerFiles + "/dhtmlxscheduler_material_nofont.css")
        ])
            .then(() => {
                this.initializeUI();
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error loading scheduler",
                        message: error.message,
                        variant: "error"
                    })
                );
            });
    }

    initializeUI() {
        const root = this.template.querySelector(".thescheduler");
        root.style.height = this.height + "px";

        //uncomment the following line if you use the Enterprise or Ultimate version
        //const scheduler = window.Scheduler.getSchedulerInstance();
        scheduler.templates.parse_date = (date) => new Date(date);
        scheduler.templates.format_date = (date) => date.toISOString();
        scheduler.config.header = [
            "day",
            "week",
            "month",
            "date",
            "prev",
            "today",
            "next"
        ];

        scheduler.init(root, new Date(), "week");

        getEvents().then((d) => {

            const chartData = unwrap(d);
            scheduler.parse({
                events: chartData.data,
            });
        });

        ///↓↓↓ saving changes back to SF backend ↓↓↓
        scheduler.createDataProcessor(function (entity, action, data, id) {
            switch (action) {
                case "create":
                    console.log("createEvent", data);
                    const insert = {
                        apiName: "SchedulerEvent__c",
                        fields: {
                            Name: data.info,
                            Start_Date__c: data.start_date,
                            End_Date__c: data.end_date,
                            Text__c: data.text
                        }
                    };
                    scheduler.config.readonly = true; // suppress changes until saving is complete
                    return createRecord(insert).then((res) => {
                        scheduler.config.readonly = false;
                        return { tid: res.id, ...res };
                    });
                case "update":
                    console.log("updateEvent", data);
                    const update = {
                        fields: {
                            Id: id,
                            Name: data.info,
                            Start_Date__c: data.start_date,
                            End_Date__c: data.end_date,
                            Text__c: data.text
                        }
                    };
                    return updateRecord(update).then(() => ({}));
                case "delete":
                    return deleteRecord(id).then(() => ({}));
            }
        });
    }
}
