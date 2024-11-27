document.addEventListener("DOMContentLoaded",async ()=>{
    const tabsContainer= document.getElementById("tabs-container");

    //Fetch all open tabs
    const tabs = await chrome.tabs.query({});

    //Group tabs by domain
    const groupedTabs = groupedTabsByDomain(tabs);

    //Display tabs in the popup
    for(const [domain, domainTabs] of Object.entries(groupedTabs)){
        //Add domain header

        const domainHeader = document.createElement("h3");
        domainHeader.textContent = domain;
        tabsContainer.appendChild(domainHeader);

        //List all tabs under the domain
        domainTabs.forEach((tab) =>{
            const tabItem = document.createElement("div");
            tabItem.className ="tab-item";
            //Tab title 
            const tabTitle = document.createElement("span");
            tabTitle.textContent = tab.title;
            tabTitle.style.flexGrow ="1";

            //close button
            const closeButton = document.createElement("button");
            closeButton.textContent ="Close";
            closeButton.addEventListener("click",function(){
                closeTab(tab.id,tabItem);
            });

            tabItem.appendChild(tabTitle);
            tabItem.appendChild(closeButton);
            tabsContainer.appendChild(tabItem);
        });
    }
});
        
//Helper function to group tabs by domain
function groupedTabsByDomain(tabs){
    const grouped={};
    tabs.forEach((tab) => { 
        try{
            const url =new URL(tab.url);
            const domain = url.hostname;
            if(!grouped[domain]){
                grouped[domain] = [];

            }
            grouped[domain].push(tab);
        } catch(e){
            //Handle invalid URLs
            if(!grouped["Other"]){
                grouped["Other"] =[];
            }
            grouped["Other"].push(tab);
        }
    });
    return grouped;
}

//Helper function to close a tab
function closeTab(tabId,tabItem) {
    chrome.tabs.remove(tabId, ()=>{
        alert("Tab closed!");
        location.reload();
    })
}