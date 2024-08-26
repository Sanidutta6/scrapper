import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Trash, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 p-6 md:p-10">
                <h2 className="text-3xl font-bold tracking-tight">Home</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 md:mt-10">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profiles</CardTitle>
                            <CardDescription>Scrape data from LinkedIn profiles.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={()=> {navigate("/scrape/scrapeLiProfiles")}}>Scrape Profiles</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Companies</CardTitle>
                            <CardDescription>Scrape data from LinkedIn company pages.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={()=> {navigate("/scrape/scrapeCompanies")}}>Scrape Companies</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Postings</CardTitle>
                            <CardDescription>Scrape job post data from LinkedIn job post.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={()=> {navigate("/scrape/scrapeJobs")}}>Scrape Job Postings</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Listings</CardTitle>
                            <CardDescription>Scrape data from LinkedIn job Listing.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={()=> {navigate("/scrape/scrapeJobList")}}>Scrape Job Listing</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Connection Status</CardTitle>
                            <CardDescription>Check Connection Status in Bulk.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={()=> {navigate("/scrape/connectionStatus")}}>Check Connection Status</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Linkedin Search Scrape</CardTitle>
                            <CardDescription>Scrape result of linkedin search</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={()=> {navigate("/scrape/scrapeLiSearchResult")}}>Check Connection Status</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Naukri Jobs Scrape</CardTitle>
                            <CardDescription>Scrape jobs from naukri</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={()=> {navigate("/scrape/scrapeNaukriJobs")}}>Scrape Jobs</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Scrape Websites</CardTitle>
                            <CardDescription>Scrape websites using xpaths</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={()=> {navigate("/scrape/scrapeWebsiteUsingXpath")}}>Scrape Websites</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-6 md:mt-10">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Scrapes</CardTitle>
                            <CardDescription>View and manage your scraped data.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Records</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Profiles</TableCell>
                                        <TableCell>2023-04-15</TableCell>
                                        <TableCell>250</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon">
                                                    <Download className="w-4 h-4" />
                                                    <span className="sr-only">Download</span>
                                                </Button>
                                                <Button variant="outline" size="icon">
                                                    <Trash className="w-4 h-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Companies</TableCell>
                                        <TableCell>2023-03-28</TableCell>
                                        <TableCell>100</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon">
                                                    <Download className="w-4 h-4" />
                                                    <span className="sr-only">Download</span>
                                                </Button>
                                                <Button variant="outline" size="icon">
                                                    <Trash className="w-4 h-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Job Postings</TableCell>
                                        <TableCell>2023-05-01</TableCell>
                                        <TableCell>300</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon">
                                                    <Download className="w-4 h-4" />
                                                    <span className="sr-only">Download</span>
                                                </Button>
                                                <Button variant="outline" size="icon">
                                                    <Trash className="w-4 h-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}