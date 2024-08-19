function scrapeCompanyPage() {
    const linkedinCompanyXPaths = {
        // Company Info:-
        company: `//section[1]/div[1]/div[2]/div[2]/div[1]/div[2]/div/h1`,
        desc: `//section[1]/div[1]/div[2]/div[2]/div[1]/div[2]/div/p`,
        industry: `//section[1]/div[1]/div[2]/div[2]/div[1]/div[2]/div/div/div[1]`,
        location: `//section[1]/div[1]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div`,
        followers: `//section[1]/div[1]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]`,
        employees: `//section[1]/div[1]/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/a/span`,

        // About section:-
        aboutSec: `//main/div[2]/div/div/div/section`,
        overview: `//main/div[2]/div/div/div/section/p`,
        website: `//dl/dt[h3[text()='Website']]/following-sibling::dd[1]//a/span`,
        phone: `//dl/dt[h3[text()='Phone']]/following-sibling::dd[1]//a/span[@aria-hidden='true']`,
        industryFromAbout: `//dl/dt[h3[text()='Industry']]/following-sibling::dd[1]`,
        companySize: `//dl/dt[h3[text()='Company size']]/following-sibling::dd[1]`,
        headquarters: `//dl/dt[h3[text()='Headquarters']]/following-sibling::dd[1]`,
        founded: `//dl/dt[h3[text()='Founded']]/following-sibling::dd[1]`,
        specialities: `//dl/dt[h3[text()='Specialties']]/following-sibling::dd[1]`,
    }

    const company = document.evaluate(linkedinCompanyXPaths.company, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const desc = document.evaluate(linkedinCompanyXPaths.desc, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const industry = document.evaluate(linkedinCompanyXPaths.industry, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const location = document.evaluate(linkedinCompanyXPaths.location, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const followers = document.evaluate(linkedinCompanyXPaths.followers, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const employees = document.evaluate(linkedinCompanyXPaths.employees, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();

    const aboutSec = document.evaluate(linkedinCompanyXPaths.aboutSec, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const overview = document.evaluate(linkedinCompanyXPaths.overview, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const website = document.evaluate(linkedinCompanyXPaths.website, aboutSec, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const phone = document.evaluate(linkedinCompanyXPaths.phone, aboutSec, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const industryFromAbout = document.evaluate(linkedinCompanyXPaths.industryFromAbout, aboutSec, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const companySize = document.evaluate(linkedinCompanyXPaths.companySize, aboutSec, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const headquarters = document.evaluate(linkedinCompanyXPaths.headquarters, aboutSec, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const founded = document.evaluate(linkedinCompanyXPaths.founded, aboutSec, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const specialities = document.evaluate(linkedinCompanyXPaths.specialities, aboutSec, null, XPathResult.STRING_TYPE, null).stringValue.trim();

    return { company, desc, industry, location, followers, employees, overview, website, phone, industryFromAbout, companySize, headquarters, founded, specialities };
}

async function scrapeLinkedinJobList() {
    const linkedinJobListXPaths = {
        totalJobs: `//*[@id="main"]/div/div[2]/div[1]/header/div/small`,
        jobListContainer: `.//div[contains(concat(" ",normalize-space(@class)," ")," jobs-search-results-list ")]`,
        jobList: `.//ul[contains(concat(' ',normalize-space(@class),' '),' scaffold-layout__list-container ')]//li[contains(concat(' ',normalize-space(@class),' '),' jobs-search-results__list-item ')][count(.//div) > 0]`,
        jobTitle: `.//a[contains(concat(' ',normalize-space(@class),' '),' disabled ')]/span`,
        jobLink: `.//a[contains(concat(' ',normalize-space(@class),' '),' disabled ')]/@href`,
        companyName: `.//span[contains(concat(' ',normalize-space(@class),' '),' job-card-container__primary-description ')]`,
        companyLocation: `.//li[contains(concat(' ',normalize-space(@class),' '),' job-card-container__metadata-item ')]`,
        paginationBtnList: `.//ul[contains(concat(" ",normalize-space(@class)," ")," artdeco-pagination__pages ")][contains(concat(" ",normalize-space(@class)," ")," artdeco-pagination__pages--number ")]`,
        nextPageBtn: `//li[contains(@class, 'active') and contains(@class, 'selected')]/following-sibling::li[1]/button`,
        paginationState: `.//div[contains(concat(" ",normalize-space(@class)," ")," artdeco-pagination__page-state ")]`,
    }

    const jobs = [];
    let i = 1;

    while (true) {
        // Scroll incrementally to ensure all jobs are loaded
        const joblistContainer = document.evaluate(linkedinJobListXPaths.jobListContainer, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let currentScrollPosition = 0;
        const scrollIncrement = 300; // Pixels to scroll each time

        while (currentScrollPosition < joblistContainer.scrollHeight) {
            joblistContainer.scrollTo({
                top: currentScrollPosition,
                behavior: 'smooth'
            });
            currentScrollPosition += scrollIncrement;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust delay as needed
        }

        await new Promise(resolve => setTimeout(resolve, 3000)); // Additional delay to ensure new items load

        const jobListElement = document.evaluate(linkedinJobListXPaths.jobList, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        console.log("Iteration:", i, ", Jobs Found:", jobListElement.snapshotLength);

        if (jobListElement.snapshotLength > 0) {
            for (let j = 0; j < jobListElement.snapshotLength; j++) {
                const jobItem = jobListElement.snapshotItem(j);

                const jobTitle = document.evaluate(linkedinJobListXPaths.jobTitle, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const jobLink = "https://www.linkedin.com" + document.evaluate(linkedinJobListXPaths.jobLink, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim().split("?")[0];
                const companyName = document.evaluate(linkedinJobListXPaths.companyName, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const companyLocation = document.evaluate(linkedinJobListXPaths.companyLocation, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();

                jobs.push({ jobTitle, jobLink, companyName, companyLocation });
            }
        }

        const paginationBtnList = document.evaluate(linkedinJobListXPaths.paginationBtnList, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const nextPageBtn = document.evaluate(linkedinJobListXPaths.nextPageBtn, paginationBtnList, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (nextPageBtn) {
            try {
                i++;
                nextPageBtn.click();
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for the next page to load
                continue;
            } catch (error) {
                console.error("Failed to click next page button:", error);
            }
        } else {
            break;
        }
    }

    return jobs;
}

function scrapeJobPage() {
    // Job Page
    const linkedinJobPageXPaths = {
        company: `.//div[contains(concat(" ",normalize-space(@class)," ")," job-details-jobs-unified-top-card__company-name ")]/a`,
        companyLinkedin: `.//div[contains(concat(" ",normalize-space(@class)," ")," job-details-jobs-unified-top-card__company-name ")]/a/@href`,
        jobTitle: `.//h1`,
        location: `.//div[contains(concat(" ",normalize-space(@class)," ")," t-black--light ")][contains(concat(" ",normalize-space(@class)," ")," mt2 ")]/span[contains(concat(" ",normalize-space(@class)," ")," tvm__text ")][contains(concat(" ",normalize-space(@class)," ")," tvm__text--low-emphasis ")]`,
        jobPosted: `.//span[contains(concat(" ",normalize-space(@class)," ")," tvm__text ")][contains(concat(" ",normalize-space(@class)," ")," tvm__text--positive ")]`,
        jobDetails: `.//div[contains(concat(" ",normalize-space(@class)," ")," mt2 ")][contains(concat(" ",normalize-space(@class)," ")," mb2 ")]/ul/li[(count(preceding-sibling::*)+1) = 1]`,
        companyDetails: `.//div[contains(concat(" ",normalize-space(@class)," ")," mt2 ")][contains(concat(" ",normalize-space(@class)," ")," mb2 ")]/ul/li[(count(preceding-sibling::*)+1) = 2]`,
        skills: `.//div[contains(concat(" ",normalize-space(@class)," ")," mt2 ")][contains(concat(" ",normalize-space(@class)," ")," mb2 ")]/ul/li[(count(preceding-sibling::*)+1) = 3]`,
        jobPoster: `.//div[contains(concat(" ",normalize-space(@class)," ")," artdeco-card ")][contains(concat(" ",normalize-space(@class)," ")," mb4 ")]/div/div/div/a`,
        jobPosterLinkedin: `.//div[contains(concat(" ",normalize-space(@class)," ")," artdeco-card ")][contains(concat(" ",normalize-space(@class)," ")," mb4 ")]/div/div/div/a/@href`,
    }

    const company = document.evaluate(linkedinJobPageXPaths.company, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const companyLinkedin = document.evaluate(linkedinJobPageXPaths.companyLinkedin, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const jobTitle = document.evaluate(linkedinJobPageXPaths.jobTitle, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const location = document.evaluate(linkedinJobPageXPaths.location, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const jobPosted = document.evaluate(linkedinJobPageXPaths.jobPosted, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const jobDetails = document.evaluate(linkedinJobPageXPaths.jobDetails, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const companyDetails = document.evaluate(linkedinJobPageXPaths.companyDetails, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const skills = document.evaluate(linkedinJobPageXPaths.skills, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const jobPoster = document.evaluate(linkedinJobPageXPaths.jobPoster, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
    const jobPosterLinkedin = document.evaluate(linkedinJobPageXPaths.jobPosterLinkedin, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();

    console.log({ company, companyLinkedin, jobTitle, location, jobPosted, jobDetails, companyDetails, skills, jobPoster, jobPosterLinkedin });
    return { company, companyLinkedin, jobTitle, location, jobPosted, jobDetails, companyDetails, skills, jobPoster, jobPosterLinkedin };
}

function scrapeLinkedinProfile() {
    const linkedinProfileXPaths = {
        name: `.//h1[contains(concat(" ",normalize-space(@class)," ")," text-heading-xlarge ")][contains(concat(" ",normalize-space(@class)," ")," inline ")][contains(concat(" ",normalize-space(@class)," ")," t-24 ")][contains(concat(" ",normalize-space(@class)," ")," v-align-middle ")][contains(concat(" ",normalize-space(@class)," ")," break-words ")]`,
        title: `.//div[contains(concat(" ",normalize-space(@class)," ")," text-body-medium ")][contains(concat(" ",normalize-space(@class)," ")," break-words ")]`,
        location: `.//span[contains(concat(" ",normalize-space(@class)," ")," text-body-small ")][contains(concat(" ",normalize-space(@class)," ")," inline ")][contains(concat(" ",normalize-space(@class)," ")," t-black--light ")][contains(concat(" ",normalize-space(@class)," ")," break-words ")]`,
        followers: `.//main/section[1]/div[2]/ul/li[1]`,
        connections: `.//main/section[1]/div[2]/ul/li[2]`,
        experience: `.//section[div[1][@id="experience" and contains(@class, "pv-profile-card__anchor")]]/div/ul/li`,
        companyName: `./div/div[2]/div/div/span/span`,
        role: `./div/div[2]/div/div/div`,
        workDuration: `./div/div[2]/div/div/span[2]/span`,
        companyLinkedinUrl: `./div/div/a/@href`,
        education: `.//section[div[1][@id="education" and contains(@class, "pv-profile-card__anchor")]]/div/ul/li`,
        schoolName: `./div/div[2]/div[1]/a/div/div/div/div/span[1]`,
        schoolLinkedinUrl: `./div/div[1]/a/@href`,
        degree: `./div/div[2]/div[1]/a/span[1]/span[1]`,
        duration: `./div/div[2]/div[1]/a/span[2]/span[1]`,
    };

    try {
        const name = document.evaluate(linkedinProfileXPaths.name, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        const title = document.evaluate(linkedinProfileXPaths.title, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        const location = document.evaluate(linkedinProfileXPaths.location, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        const followers = document.evaluate(linkedinProfileXPaths.followers, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        const connections = document.evaluate(linkedinProfileXPaths.connections, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();

        const experiences = [];
        const experienceSection = document.evaluate(linkedinProfileXPaths.experience, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const noOfExp = experienceSection.snapshotLength;

        if (noOfExp > 0) {
            for (let i = 0; i < noOfExp; i++) {
                const element = experienceSection.snapshotItem(i);
                const role = document.evaluate(linkedinProfileXPaths.role, element, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const company = document.evaluate(linkedinProfileXPaths.companyName, element, null, XPathResult.STRING_TYPE, null).stringValue;
                const duration = document.evaluate(linkedinProfileXPaths.workDuration, element, null, XPathResult.STRING_TYPE, null).stringValue;
                const linkedin = document.evaluate(linkedinProfileXPaths.companyLinkedinUrl, element, null, XPathResult.STRING_TYPE, null).stringValue;

                experiences.push({ role, company, duration, linkedin });
            }
        }

        const schools = [];
        const educationSection = document.evaluate(linkedinProfileXPaths.education, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const noOfSchools = educationSection.snapshotLength;

        if (noOfSchools > 0) {
            for (let i = 0; i < noOfSchools; i++) {
                const element = educationSection.snapshotItem(i);
                const school = document.evaluate(linkedinProfileXPaths.schoolName, element, null, XPathResult.STRING_TYPE, null).stringValue;
                const degree = document.evaluate(linkedinProfileXPaths.degree, element, null, XPathResult.STRING_TYPE, null).stringValue;
                const duration = document.evaluate(linkedinProfileXPaths.duration, element, null, XPathResult.STRING_TYPE, null).stringValue;
                const linkedin = document.evaluate(linkedinProfileXPaths.schoolLinkedinUrl, element, null, XPathResult.STRING_TYPE, null).stringValue;

                schools.push({ school, degree, duration, linkedin });
            }
        }

        const scrapedData = { name, title, location, followers, connections, experiences, schools };

        return scrapedData;
    } catch (error) {
        console.error("Error during scraping:", error);
        return null;
    }
}

function linkedinConnectionStatus() {
    const connectionXpath = `//*[@id="profile-content"]/div/div[2]/div/div/main/section[1]/div[2]/div[3]/div`;

    let status = "Unknown";
    let temp = document.evaluate(connectionXpath, document, null, XPathResult.STRING_TYPE, null).stringValue;

    if (temp.includes("Connect") && !temp.includes("Remove Connection")) {
        status = "Not connected";
    } else if (temp.includes("Pending")) {
        status = "Pending";
    } else if (temp.includes("Give Kudos")) {
        status = "Accepted";
    }

    return { status };
}

async function scrapeLinkedinSearchResult() {
    const linkedinSearchXpaths = {
        searchListContainer: `.//ul[contains(concat(" ",normalize-space(@class)," ")," reusable-search__entity-result-list ")]`,
        searchList: `.//ul[contains(concat(" ",normalize-space(@class)," ")," reusable-search__entity-result-list ")]//li[contains(concat(" ",normalize-space(@class)," ")," reusable-search__result-container ")][count(.//div) > 0]`,
        name: `.//span[contains(concat(" ",normalize-space(@class)," ")," entity-result__title-text ")][contains(concat(" ",normalize-space(@class)," ")," t-16 ")]//a//span//span[(count(preceding-sibling::*)+1) = 1]`,
        linkedin: `.//span[contains(concat(" ",normalize-space(@class)," ")," entity-result__title-text ")][contains(concat(" ",normalize-space(@class)," ")," t-16 ")]//a/@href`,
        title: `.//div[contains(concat(" ",normalize-space(@class)," ")," entity-result__primary-subtitle ")][contains(concat(" ",normalize-space(@class)," ")," t-14 ")][contains(concat(" ",normalize-space(@class)," ")," t-black ")][contains(concat(" ",normalize-space(@class)," ")," t-normal ")]`,
        location: `.//div[contains(concat(" ",normalize-space(@class)," ")," entity-result__secondary-subtitle ")][contains(concat(" ",normalize-space(@class)," ")," t-14 ")][contains(concat(" ",normalize-space(@class)," ")," t-normal ")]`,
        summary: `.//p[contains(concat(" ",normalize-space(@class)," ")," entity-result__summary ")][contains(concat(" ",normalize-space(@class)," ")," entity-result__summary--2-lines ")][contains(concat(" ",normalize-space(@class)," ")," t-12 ")][contains(concat(" ",normalize-space(@class)," ")," t-black--light ")]`,
        insights: `.//div[contains(concat(" ",normalize-space(@class)," ")," reusable-search-simple-insight ")]`,
        nextPageBtn: `.//button[contains(concat(" ",normalize-space(@class)," ")," artdeco-pagination__button--next ") and not(contains(concat(" ",normalize-space(@class)," ")," artdeco-button--disabled "))]`,
    } // artdeco-button--disabled

    const results = [];

    while (true) {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });

        await new Promise(resolve => setTimeout(resolve, 3000)); // Additional delay to ensure new items load

        const searchListElement = document.evaluate(linkedinSearchXpaths.searchList, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        if (searchListElement.snapshotLength > 0) {
            for (let j = 0; j < searchListElement.snapshotLength; j++) {
                const searchItem = searchListElement.snapshotItem(j);

                const name = document.evaluate(linkedinSearchXpaths.name, searchItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const linkedin = document.evaluate(linkedinSearchXpaths.linkedin, searchItem, null, XPathResult.STRING_TYPE, null).stringValue.trim().split("?")[0];
                const title = document.evaluate(linkedinSearchXpaths.title, searchItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const location = document.evaluate(linkedinSearchXpaths.location, searchItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const summary = document.evaluate(linkedinSearchXpaths.summary, searchItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const insights = document.evaluate(linkedinSearchXpaths.insights, searchItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();

                results.push({ name, linkedin, title, location, summary, insights });
            }
        }

        const nextPageBtn = document.evaluate(linkedinSearchXpaths.nextPageBtn, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        await new Promise(resolve => setTimeout(resolve, 5000));

        if (nextPageBtn) {
            try {
                nextPageBtn.click();
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for the next page to load
            } catch (error) {
                console.log("Failed to click next page button:", error);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        } else {
            console.log("breaking")
            break;
        }
    }

    return results;
}

export { scrapeCompanyPage, scrapeLinkedinJobList, scrapeJobPage, scrapeLinkedinProfile, linkedinConnectionStatus, scrapeLinkedinSearchResult };