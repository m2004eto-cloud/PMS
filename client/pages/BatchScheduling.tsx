import { useState } from "react";
import { ArrowLeft, Plus, Calendar, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const batchSchema = z.object({
  product: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
  scheduledStart: z.string().min(1, "Scheduled start date is required"),
  rawMaterial: z.string().min(1, "Raw material ID is required"),
});

interface Batch {
  id: string;
  product: string;
  quantity: number;
  stage: string;
  scheduledStart: string;
  estimatedCompletion: string;
  rawMaterial: string;
  status: "scheduled" | "in_progress" | "completed";
}

const PRODUCTION_STAGES = [
  "Intake & De-stoning",
  "Hulling & Drying",
  "Roasting",
  "Cooling & Destoning",
  "Grinding (Primary)",
  "Secondary Milling",
  "Mixing/Kneading",
  "Filling & Sealing",
];

export default function BatchScheduling() {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: "BATCH-2024-0847",
      product: "Premium Sesame Paste",
      quantity: 500,
      stage: "Grinding (Primary)",
      scheduledStart: "2024-01-15 08:00",
      estimatedCompletion: "2024-01-15 14:30",
      rawMaterial: "RM-2024-0156",
      status: "in_progress",
    },
    {
      id: "BATCH-2024-0848",
      product: "Sweet Paste Pistachio",
      quantity: 400,
      stage: "Intake & De-stoning",
      scheduledStart: "2024-01-15 10:00",
      estimatedCompletion: "2024-01-15 18:00",
      rawMaterial: "RM-2024-0157",
      status: "scheduled",
    },
    {
      id: "BATCH-2024-0849",
      product: "Organic Sesame Paste",
      quantity: 300,
      stage: "Roasting",
      scheduledStart: "2024-01-15 12:00",
      estimatedCompletion: "2024-01-15 19:00",
      rawMaterial: "RM-2024-0158",
      status: "in_progress",
    },
    {
      id: "BATCH-2024-0850",
      product: "Premium Sesame Paste",
      quantity: 500,
      stage: "Intake & De-stoning",
      scheduledStart: "2024-01-15 14:00",
      estimatedCompletion: "2024-01-15 22:00",
      rawMaterial: "RM-2024-0159",
      status: "scheduled",
    },
    {
      id: "BATCH-2024-0846",
      product: "Sweet Paste Cocoa",
      quantity: 350,
      stage: "Filling & Sealing",
      scheduledStart: "2024-01-15 06:00",
      estimatedCompletion: "2024-01-15 13:00",
      rawMaterial: "RM-2024-0155",
      status: "completed",
    },
  ]);

  const form = useForm<z.infer<typeof batchSchema>>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      product: "",
      quantity: 0,
      scheduledStart: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      rawMaterial: "",
    },
  });

  const onSubmit = (values: z.infer<typeof batchSchema>) => {
    const newBatch: Batch = {
      id: `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      product: values.product,
      quantity: values.quantity,
      stage: PRODUCTION_STAGES[0],
      scheduledStart: values.scheduledStart.replace("T", " "),
      estimatedCompletion: format(new Date(new Date(values.scheduledStart).getTime() + 8 * 60 * 60 * 1000), "yyyy-MM-dd HH:mm"),
      rawMaterial: values.rawMaterial,
      status: "scheduled",
    };
    setBatches([...batches, newBatch]);
    setOpen(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="p-2 hover:bg-secondary hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Batch Scheduling & Routing
              </h1>
              <p className="text-sm text-text-secondary">
                Finite capacity scheduling with sequential process routing
              </p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="btn-primary gap-2">
                <Plus className="w-4 h-4" />
                Schedule Batch
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Batch</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Premium Sesame Paste">Premium Sesame Paste</SelectItem>
                            <SelectItem value="Sweet Paste Pistachio">Sweet Paste Pistachio</SelectItem>
                            <SelectItem value="Organic Sesame Paste">Organic Sesame Paste</SelectItem>
                            <SelectItem value="Sweet Paste Cocoa">Sweet Paste Cocoa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="scheduledStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Start</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rawMaterial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Raw Material ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. RM-2024-0160" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Schedule Batch</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Production Stages Flowchart */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Production Process Flow
          </h3>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2 min-w-max">
              {PRODUCTION_STAGES.map((stage, idx) => (
                <div key={stage} className="flex items-center">
                  <div className="bg-primary bg-opacity-20 border border-primary border-opacity-30 rounded-lg px-4 py-2 min-w-max">
                    <p className="text-xs font-semibold text-foreground">
                      {stage}
                    </p>
                  </div>
                  {idx < PRODUCTION_STAGES.length - 1 && (
                    <div className="mx-1 text-text-secondary">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Batch Schedule Table */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Today's Batch Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 data-label">Batch ID</th>
                  <th className="text-left py-3 px-4 data-label">Product</th>
                  <th className="text-left py-3 px-4 data-label">Quantity (kg)</th>
                  <th className="text-left py-3 px-4 data-label">Current Stage</th>
                  <th className="text-left py-3 px-4 data-label">
                    Scheduled Start
                  </th>
                  <th className="text-left py-3 px-4 data-label">Est. Completion</th>
                  <th className="text-left py-3 px-4 data-label">Raw Material</th>
                  <th className="text-left py-3 px-4 data-label">Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="border-b border-border hover:bg-secondary hover:bg-opacity-30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-primary text-xs">
                      {batch.id}
                    </td>
                    <td className="py-3 px-4 data-cell">{batch.product}</td>
                    <td className="py-3 px-4 data-cell font-mono">
                      {batch.quantity}
                    </td>
                    <td className="py-3 px-4 data-cell text-xs">
                      {batch.stage}
                    </td>
                    <td className="py-3 px-4 text-xs text-text-secondary">
                      {batch.scheduledStart}
                    </td>
                    <td className="py-3 px-4 text-xs text-text-secondary">
                      {batch.estimatedCompletion}
                    </td>
                    <td className="py-3 px-4 font-mono text-primary text-xs">
                      {batch.rawMaterial}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          batch.status === "completed"
                            ? "bg-success bg-opacity-10 text-success"
                            : batch.status === "in_progress"
                              ? "bg-primary bg-opacity-10 text-primary"
                              : "bg-warning bg-opacity-10 text-warning"
                        }`}
                      >
                        {batch.status === "in_progress"
                          ? "In Progress"
                          : batch.status === "scheduled"
                            ? "Scheduled"
                            : "Completed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Capacity Planning */}
        <div className="card-ninja">
          <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wide">
            Equipment Capacity (Next 24 Hours)
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Roasting Drum", capacity: 75 },
              { name: "Colloid Mill", capacity: 60 },
              { name: "Filling Line", capacity: 85 },
              { name: "De-stoning Unit", capacity: 45 },
            ].map((item) => (
              <div key={item.name} className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-text-secondary mb-3">
                  {item.name}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-2xl font-bold text-foreground">
                    {item.capacity}%
                  </p>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.capacity > 80
                        ? "bg-critical"
                        : item.capacity > 60
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                    style={{ width: `${item.capacity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
