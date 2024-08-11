import { useState } from "react";
import { useParams } from "react-router-dom";
import { ConfigForm } from "@/components/custom/config-form";
import { DataView } from "@/components/custom/data-view";
import { bulkScrapeFormConfig, singleScrapeFormConfig } from "@/form-config/config";
import { bulkScrapeFormSchema, singleScrapeFormSchema } from "@/form-config/form-schema";

export default function ProfileScrape() {
    const [scrapedData, setScrapedData] = useState([]);
    const { id } = useParams();

    return (
        <div className="flex flex-col gap-6 p-6 md:p-10">
            <h1 className="text-3xl font-bold text-white">LinkedIn Profile Scraper</h1>
            <div className="grid grid-cols-3 gap-6">
                {(id === "scrapeJobList") ? (
                    <ConfigForm config={singleScrapeFormConfig} FormSchema={singleScrapeFormSchema} task={id} setData={setScrapedData} />
                ) : (
                    <ConfigForm config={bulkScrapeFormConfig} FormSchema={bulkScrapeFormSchema} task={id} setData={setScrapedData} />
                )}
                {/* Data Preview */}
                <DataView className="col-span-2" data={scrapedData} />
            </div>
        </div>
    )
}