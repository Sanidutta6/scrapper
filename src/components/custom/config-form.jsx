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
    acc[key] = config[key].type === "number"
      ? Number(config[key].defaultValue)
      : config[key].defaultValue;
    return acc;
  }, {});

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  })

  async function onSubmit(data) {
    try {
      setLoading(true);
      let { delay, links } = data;

      // Ensure task is defined and valid
      if (!task) {
        throw new Error("Task is not defined.");
      }

      if (task === "scrapeCompanies") {
        links = links.map(link => `${link}/about`);
      }

      // Open a new tab for scraping
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "scrapper.newTab" }, (response) => {
          if (chrome.runtime.lastError) {
            return reject(new Error(chrome.runtime.lastError.message));
          }
          resolve(response);
        });
      });

      const targetTab = response.newTabId;

      // Perform the scraping task
      const scrapeResponse = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: `scrapper.${task}`, targetTab, delay, links }, (response) => {
          if (chrome.runtime.lastError) {
            return reject(new Error(chrome.runtime.lastError.message));
          }
          resolve(response);
        });
      });

      setData(scrapeResponse.results);

      // Close the tab after scraping is done
      const tabStatus = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "scrapper.removeTab", targetTab }, (response) => {
          if (chrome.runtime.lastError) {
            return reject(new Error(chrome.runtime.lastError.message));
          }
          resolve(response);
        });
      });

      console.log(tabStatus);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    } finally {
      setLoading(false);
    }
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
                          value={field.value !== undefined ? field.value : ""}
                          onChange={(e) => {
                            const { type, value } = e.target;
                            if (type === "number") {
                              field.onChange(value === "" ? "" : Number(value));
                            } else {
                              field.onChange(value);
                            }
                          }}
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
            <Button type="submit" disabled={loading}>Scrape</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}