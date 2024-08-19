import { z } from "zod";

export const bulkScrapeFormSchema = z.object({
    delay: z.number()
        .min(5, { message: "Minimum delay should be 5 sec." })
        .max(60, { message: "Minimum delay should be 60 sec." }),
    links: z.string()
        .transform((value) => value.split('\n').map(link => link.trim()).filter(link => link !== ""))
        .refine((links) => {
            return links.every(link => isValidURL(link));
        }, {
            message: "Each line must be a valid URL",
        }),
});
export const singleScrapeFormSchema = z.object({
    delay: z.number()
        .min(5, { message: "Minimum delay should be 5 sec." })
        .max(60, { message: "Minimum delay should be 60 sec." }),
    link: z.string()
        .url("Please enter a valid URL"),
});

// Helper function to validate URLs (simplified version)
function isValidURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}