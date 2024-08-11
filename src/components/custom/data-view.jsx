import clsx from "clsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react"

export function DataView({ data, className }) {
    // Serialize data if nested and create flat objects
    const serializeData = (obj, prefix = '') =>
        Object.keys(obj).reduce((acc, key) => {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                Object.assign(acc, serializeData(obj[key], newKey));
            } else {
                acc[newKey] = obj[key];
            }
            return acc;
        }, {});

    // Flattened data array
    const flattenedData = data.map(item => serializeData(item));

    // Get table headers from the first item's keys
    const headers = flattenedData.length > 0 ? Object.keys(flattenedData[0]) : [];

    // Convert flattened data to CSV format
    const convertToCSV = (data) => {
        const csvRows = [];
        // Add the headers row
        csvRows.push(['Serial No.', ...headers].join(','));

        // Add the data rows
        data.forEach((item, index) => {
            const values = headers.map(header => `"${item[header] || ''}"`);
            csvRows.push([index + 1, ...values].join(','));
        });

        return csvRows.join('\n');
    };

    // Handle CSV download
    const handleDownloadCSV = () => {
        const csvData = convertToCSV(flattenedData);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'data.csv');
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <Card className={clsx("shadow-lg", className)}>
            <CardHeader className="flex flex-row justify-between items-center px-7">
                <div>
                    <CardTitle>Data Table</CardTitle>
                    <CardDescription>
                        Displaying serialized nested data.
                    </CardDescription>
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="icon">
                        <Copy className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleDownloadCSV}>
                        <Download className="w-5 h-5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {flattenedData.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                {headers.map((header) => (
                                    <TableHead key={header}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {flattenedData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    {headers.map((header) => (
                                        <TableCell key={header}>{item[header]}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-gray-500">
                        No data available to display.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
