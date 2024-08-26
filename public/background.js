import { getTabs, createNewTab, removeTab, tabHandler } from "./tabHandler.js";
import { 
    scrapeCompanyPage,
    scrapeLinkedinJobList,
    scrapeJobPage,
    scrapeLinkedinProfile,
    linkedinConnectionStatus,
    scrapeLinkedinSearchResult } from "./linkedin-scrapper.js";
import { scrapeNaukriJobs, scrapeWebsiteUsingXpath } from "./job-portal-scrapper.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background.js")
    if (message.action === "scrapper.getTabs") {
        getTabs(sendResponse);
    }
    else if (message.action === "scrapper.newTab") {
        createNewTab(sendResponse);
    }
    else if (message.action === "scrapper.removeTab") {
        const { targetTab } = message;
        removeTab(targetTab, sendResponse);
    }
    else if (message.action === "scrapper.scrapeLiProfiles") {
        tabHandler(message, sendResponse, scrapeLinkedinProfile);
    }
    else if (message.action === "scrapper.scrapeCompanies") {
        tabHandler(message, sendResponse, scrapeCompanyPage);
    }
    else if (message.action === "scrapper.scrapeJobs") {
        tabHandler(message, sendResponse, scrapeJobPage);
    }
    else if (message.action === "scrapper.scrapeJobList") {
        tabHandler(message, sendResponse, scrapeLinkedinJobList);
    }
    else if (message.action === "scrapper.connectionStatus") {
        tabHandler(message, sendResponse, linkedinConnectionStatus);
    }
    else if (message.action === "scrapper.scrapeLiSearchResult") {
        tabHandler(message, sendResponse, scrapeLinkedinSearchResult);
    }
    else if (message.action === "scrapper.scrapeNaukriJobs") {
        tabHandler(message, sendResponse, scrapeNaukriJobs);
    }
    else if (message.action === "scrapper.scrapeWebsiteUsingXpath") {
        tabHandler(message, sendResponse, scrapeWebsiteUsingXpath);
    }
    else {
        console.error("Invalid action received:", message.action);
        sendResponse({ error: "Invalid action" });
    }

    return true;
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});