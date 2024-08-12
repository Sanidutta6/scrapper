export function getTabs(sendResponse) {
    chrome.tabs.query({}, async function (tabs) {
        let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const currentTabId = tab.id;

        const filteredTabs = tabs.filter(tab => tab.id !== currentTabId);
        const tablist = filteredTabs.map(tab => ({ tabId: tab.id, tabUrl: tab.url }));

        sendResponse({ tablist });
    });
}

export function createNewTab(sendResponse) {
    chrome.tabs.create({ url: "" }, function (newTab) {
        sendResponse({ newTabId: newTab.id });
    });
}

export function removeTab(targetTab, sendResponse) {
    chrome.tabs.remove(targetTab, function () {
        sendResponse({ status: "removed" });
    });
}

export function tabHandler(message, sendResponse, func) {
    const { links, delay, targetTab: userGivenTargetTab } = message;

    chrome.tabs.get(userGivenTargetTab, function (tab) {
        if (chrome.runtime.lastError || !tab) {
            chrome.tabs.create({ url: "" }, function (newTab) {
                console.log("New target tab opened with ID:", newTab.id);
                scrapeLinksInTab(newTab.id, links, delay, sendResponse, func);
            });
        } else {
            scrapeLinksInTab(userGivenTargetTab, links, delay, sendResponse, func);
        }
    });
}

async function scrapeLinksInTab(tabId, links, delay, sendResponse, func) {
    let results = [];

    // Single link in string format
    if (typeof links === "string") {
        await updateTabAndWait(tabId, links);
        await new Promise(resolve => setTimeout(resolve, delay * 1000));

        scrollTargetTabToBottom(tabId);

        results = await executeScriptInTab(tabId, func);
    } else { // Multiple links in array format
        for (let i = 0; i < links.length; i++) {
            const link = links[i];

            await updateTabAndWait(tabId, link);
            await new Promise(resolve => setTimeout(resolve, delay * 1000));

            scrollTargetTabToBottom(tabId);

            const result = await executeScriptInTab(tabId, func);
            results.push(result || null);

            await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }
    }

    sendResponse({ results });
}

function updateTabAndWait(tabId, url) {
    return new Promise((resolve) => {
        chrome.tabs.update(tabId, { url }, function () {
            chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {
                if (updatedTabId === tabId && info.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve();
                }
            });
        });
    });
}

function executeScriptInTab(tabId, func) {
    return new Promise((resolve) => {
        chrome.scripting.executeScript({
            target: { tabId },
            func
        }, (result) => {
            if (chrome.runtime.lastError) {
                console.error("Script execution error:", chrome.runtime.lastError);
                resolve(null);
            } else {
                resolve(result[0]?.result || null);
            }
        });
    });
}

function scrollTargetTabToBottom(tabId) {
    chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            window.scrollTo(0, document.body.scrollHeight); // Scroll to the bottom of the page
        }
    }, (result) => {
        if (chrome.runtime.lastError) {
            console.error("Error scrolling target tab:", chrome.runtime.lastError);
        }
    });
}