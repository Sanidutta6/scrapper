async function scrapeNaukriJobs() {
    const naukriJobsXpaths = {
        rows: `.//div[contains(concat(" ",normalize-space(@class)," ")," srp-jobtuple-wrapper ")]`,
        jobTitle: `.//div[contains(@class, 'row1')]//a[contains(concat(" ",normalize-space(@class)," ")," title ")]`,
        jobLink: `.//div[contains(@class, 'row1')]//a[contains(concat(" ",normalize-space(@class)," ")," title ")]/@href`,
        company: `.//div[contains(@class, 'row2')]//a[contains(concat(" ",normalize-space(@class)," ")," comp-name ")]`,
        ratings: `.//div[contains(@class, 'row2')]//span[contains(@class, 'ratings')]`,
        reviews: `.//div[contains(@class, 'row2')]//a[contains(concat(" ",normalize-space(@class)," ")," review ")]`,
        exp: `.//div[contains(@class, 'row3')]//span[contains(concat(" ",normalize-space(@class)," ")," expwdth ")]`,
        salary: `.//div[contains(@class, 'row3')]//span[contains(concat(" ",normalize-space(@class)," ")," ni-job-tuple-icon-srp-rupee ")]//span`,
        location: `.//div[contains(@class, 'row3')]//span[contains(concat(" ",normalize-space(@class)," ")," locWdth ")]`,
        shortDesc: `.//div[contains(@class, 'row4')]//span[contains(concat(" ",normalize-space(@class)," ")," job-desc ")]`,
        skills: `.//div[contains(@class, 'row5')]//li[contains(concat(" ",normalize-space(@class)," ")," dot-gt ")][contains(concat(" ",normalize-space(@class)," ")," tag-li ")]`,
        posted: `.//div[contains(@class, 'row6')]//span[contains(concat(" ",normalize-space(@class)," ")," job-post-day ")]`,
        nextPageBtn: `.//div[contains(@class, 'styles_pagination__oIvXh')]//a[contains(@class, 'styles_btn-secondary__2AsIP') and not(@disabled)][span[text()='Next']]`,
    }

    const jobs = [];

    while (true) {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });

        await new Promise(resolve => setTimeout(resolve, 3000)); // Additional delay to ensure new items load

        const rows = document.evaluate(naukriJobsXpaths.rows, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        if (rows.snapshotLength > 0) {
            for (let j = 0; j < rows.snapshotLength; j++) {
                const jobItem = rows.snapshotItem(j);

                const jobTitle = document.evaluate(naukriJobsXpaths.jobTitle, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const jobLink = document.evaluate(naukriJobsXpaths.jobLink, jobItem, null, XPathResult.STRING_TYPE, null).stringValue;
                const company = document.evaluate(naukriJobsXpaths.company, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const ratings = document.evaluate(naukriJobsXpaths.ratings, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const reviews = document.evaluate(naukriJobsXpaths.reviews, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const exp = document.evaluate(naukriJobsXpaths.exp, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const salary = document.evaluate(naukriJobsXpaths.salary, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const location = document.evaluate(naukriJobsXpaths.location, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const shortDesc = document.evaluate(naukriJobsXpaths.shortDesc, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const skills = document.evaluate(naukriJobsXpaths.skills, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();
                const posted = document.evaluate(naukriJobsXpaths.posted, jobItem, null, XPathResult.STRING_TYPE, null).stringValue.trim();

                jobs.push({ jobTitle, jobLink, company, ratings, reviews, exp, salary, location, shortDesc, skills, posted });
            }
        }

        console.log(jobs);

        const nextPageBtn = document.evaluate(naukriJobsXpaths.nextPageBtn, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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
            console.log("breaking");
            await new Promise(resolve => setTimeout(resolve, 5000));
            break;
        }
    }

    return jobs;
}

async function scrapeWebsiteUsingXpath(xpaths) {
    const extractedTexts = [];
    xpaths.forEach((xpath) => {
        const nodes = document.evaluate(xpath, document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        extractedTexts.push(nodes);
    });
    console.log(extractedTexts);
    return extractedTexts;
}

export { scrapeNaukriJobs, scrapeWebsiteUsingXpath };