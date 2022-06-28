public with sharing class SchedulerData {
 
    @RemoteAction
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getEvents() {
       
        // fetching the Records via SOQL
        List<SchedulerEvent__c> Events = new List<SchedulerEvent__c>();
        Events = [SELECT Id, Name, Start_Date__c, End_Date__c, Text__c FROM SchedulerEvent__c];

        Map<String, Object> result = new Map<String, Object>{'events' => Events };
        return result;
   }
}
