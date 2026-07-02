"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createManualLeadAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { leadStatusLabels } from "@/lib/labels";

export function AddLeadDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createManualLeadAction(null, formData);
      if (result?.ok) {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result?.message ?? "Povpraševanja ni bilo mogoče dodati.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Dodaj stranko</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ročni vnos povpraševanja</DialogTitle>
          <DialogDescription>Dodajte stranko, ki ste jo pridobili mimo spletnega obrazca.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 px-6 py-5">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Ime in priimek</Label>
            <Input id="name" name="name" required placeholder="Janez Novak" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="041 234 567" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">E-pošta (neobvezno)</Label>
              <Input id="email" name="email" type="email" placeholder="janez@primer.si" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="location">Naslov / lokacija</Label>
            <Input id="location" name="location" placeholder="Slovenska cesta 1, Ljubljana" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="service">Vrsta dela</Label>
            <Input id="service" name="service" required placeholder="Zamenjava strešne kritine" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="message">Opis dela</Label>
            <Textarea id="message" name="message" required rows={4} placeholder="Kaj vse zajema delo, obseg, posebnosti..." />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="new">
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(leadStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending} className="mt-1">
            {isPending ? "Dodajam..." : "Dodaj povpraševanje"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
