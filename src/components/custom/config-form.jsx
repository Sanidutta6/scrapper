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
      // Normalize the keys
      const delay = data.delay;
      let links = data.links || data.link; // Handle both cases

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
      console.log(scrapeResponse);

      setData(scrapeResponse.results);

      // Close the tab after scraping is done
      await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "scrapper.removeTab", targetTab }, (response) => {
          if (chrome.runtime.lastError) {
            return reject(new Error(chrome.runtime.lastError.message));
          }
          resolve(response);
        });
      });

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
                      {(() => {
                        if (config[key].type === "textarea") {
                          return (
                            <Textarea placeholder={config[key].label} {...field} />
                          );
                        } else if (config[key].type === "text") {
                          return (
                            <Input type="text" placeholder={config[key].label} {...field} />
                          );
                        } else if (config[key].type === "number") {
                          return (
                            <Input
                              type="number"
                              placeholder={config[key].label}
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              onBlur={(e) => {
                                if (isNaN(e.target.valueAsNumber)) {
                                  field.onChange(5); // Set to a default value if it's not a valid number
                                }
                              }}
                            />
                          );
                        } else {
                          // Handle other input types if necessary
                          return null;
                        }
                      })()}
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