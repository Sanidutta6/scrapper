import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Import Textarea component
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function ConfigForm({ config, FormSchema, task, setData }) {
  const [loading, setLoading] = useState(false);
  const defaultValues = Object.keys(config).reduce((acc, key) => {
    acc[key] = config[key].defaultValue;
    return acc;
  }, {});

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues, // Fixed to defaultValues
  })

  async function onSubmit(data) {
    setLoading(true);
    console.log(data);
    const { delay, links } = data;

    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "scrapper.newTab" }, (response) => {
        resolve(response);
      });
    });

    const targetTab = response.newTabId;

    const scrapeResponse = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: `scrapper.${task}`, targetTab, delay, links }, (response) => {
        resolve(response);
      });
    });

    console.log(scrapeResponse);
    setData(scrapeResponse.results);
    setLoading(false);

    const tabStatus = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "scrapper.newTab" }, (response) => {
        resolve(response);
      });
    });

    console.log(tabStatus);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrape Form</CardTitle>
        <CardDescription>Please enter details below to start scraping</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {Object.keys(config).map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{config[key].label}</FormLabel>
                    <FormControl>
                      {config[key].type === "textarea" ? (
                        <Textarea placeholder={config[key].label} {...field} />
                      ) : (
                        <Input
                          type={config[key].type}
                          placeholder={config[key].label}
                          {...field}
                        />
                      )}
                    </FormControl>
                    {config[key].description && (
                      <FormDescription>{config[key].description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" loading={loading}>Scrape</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}