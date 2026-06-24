"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Mail, MapPin, MessageSquareText, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ClientCustomerBoardItem } from "@/lib/dashboard-data";
import { customerStatusLabels, formatDate, leadStatusLabels } from "@/lib/labels";

type LeadStatus = keyof typeof leadStatusLabels;

const statusTabs: Array<{ value: LeadStatus; label: string }> = [
  { value: "new", label: "Nove" },
  { value: "contacted", label: "Kontaktirane" },
  { value: "quote_sent", label: "Ponudba poslana" },
  { value: "won", label: "Dogovorjeno" },
  { value: "completed", label: "Zaključeno" },
  { value: "lost", label: "Izgubljeno" },
];

export function CustomerStatusBoard({ customers }: { customers: ClientCustomerBoardItem[] }) {
  const [query, setQuery] = useState("");
  const [consentFilter, setConsentFilter] = useState("all");

  const filteredCustomers = useMemo(
    () =>
      customers.filter((customer) => {
        const normalizedQuery = query.trim().toLowerCase();
        const matchesQuery =
          !normalizedQuery ||
          [
            customer.name,
            customer.phone,
            customer.email,
            customer.city,
            customer.latestLead?.service,
            customer.latestLead?.message,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        const hasConsent = customer.marketingConsent && !customer.optOut;
        const matchesConsent =
          consentFilter === "all" ||
          (consentFilter === "with_consent" && hasConsent) ||
          (consentFilter === "without_consent" && !hasConsent);

        return matchesQuery && matchesConsent;
      }),
    [customers, query, consentFilter],
  );

  const customersByStatus = useMemo(
    () =>
      statusTabs.reduce(
        (acc, tab) => {
          acc[tab.value] = filteredCustomers.filter((customer) => getCustomerLeadStatus(customer) === tab.value);
          return acc;
        },
        {} as Record<LeadStatus, ClientCustomerBoardItem[]>,
      ),
    [filteredCustomers],
  );

  if (customers.length === 0) {
    return (
      <div className="rounded-[16px] border border-dashed border-[#DCD8E6] bg-[#FBFAFF] px-5 py-8 text-center text-sm font-semibold text-[#777382]">
        Kontakti se ustvarijo ob oddaji obrazca.
      </div>
    );
  }

  return (
    <Tabs defaultValue="new" className="w-full">
      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_240px]">
        <div className="grid gap-2">
          <Label htmlFor="customer-search">Išči stranke</Label>
          <Input
            id="customer-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ime, telefon, email, kraj ali storitev"
          />
        </div>
        <div className="grid gap-2">
          <Label>Marketing soglasje</Label>
          <Select value={consentFilter} onValueChange={setConsentFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Vse stranke</SelectItem>
              <SelectItem value="with_consent">S soglasjem</SelectItem>
              <SelectItem value="without_consent">Brez soglasja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TabsList>
        {statusTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
            <span className="ml-2 rounded-full bg-[#F1EFF8] px-2 py-0.5 text-[11px] text-[#5C55B8]">
              {customersByStatus[tab.value].length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {statusTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <CompactCustomerList customers={customersByStatus[tab.value]} emptyText={`V kategoriji "${tab.label}" ni zadetkov.`} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function CompactCustomerList({ customers, emptyText }: { customers: ClientCustomerBoardItem[]; emptyText: string }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(customers.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleCustomers = customers.slice((safePage - 1) * pageSize, safePage * pageSize);

  if (customers.length === 0) {
    return (
      <div className="rounded-[16px] border border-dashed border-[#DCD8E6] bg-[#FBFAFF] px-5 py-8 text-center text-sm font-semibold text-[#777382]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#EEEAF5]">
      <div className="hidden grid-cols-[1.1fr_.9fr_.9fr_auto] gap-3 border-b border-[#EEEAF5] bg-[#FBFAFF] px-4 py-3 text-xs font-extrabold uppercase tracking-[.06em] text-[#8D8999] md:grid">
        <div>Stranka</div>
        <div>Zadnja storitev</div>
        <div>Kontakt</div>
        <div className="text-right">Podrobnosti</div>
      </div>
      <div className="divide-y divide-[#EEEAF5] bg-white">
        {visibleCustomers.map((customer) => (
          <CustomerRow key={customer.id} customer={customer} />
        ))}
      </div>
      <PaginationFooter
        page={safePage}
        pageCount={pageCount}
        total={customers.length}
        pageSize={pageSize}
        onPrevious={() => setPage((current) => Math.max(1, current - 1))}
        onNext={() => setPage((current) => Math.min(pageCount, current + 1))}
      />
    </div>
  );
}

function PaginationFooter({
  page,
  pageCount,
  total,
  pageSize,
  onPrevious,
  onNext,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEAF5] bg-[#FBFAFF] px-4 py-3">
      <div className="text-xs font-bold text-[#827E8D]">
        Prikaz {start}-{end} od {total}
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" size="sm" disabled={page <= 1} onClick={onPrevious}>
          Nazaj
        </Button>
        <span className="text-xs font-extrabold text-[#827E8D]">
          {page}/{pageCount}
        </span>
        <Button type="button" variant="secondary" size="sm" disabled={page >= pageCount} onClick={onNext}>
          Naprej
        </Button>
      </div>
    </div>
  );
}

function CustomerRow({ customer }: { customer: ClientCustomerBoardItem }) {
  const status = getCustomerLeadStatus(customer);

  return (
    <Dialog>
      <div className="grid gap-3 px-4 py-3 transition hover:bg-[#FBFAFF] md:grid-cols-[1.1fr_.9fr_.9fr_auto] md:items-center">
        <DialogTrigger className="block min-w-0 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6A5AE0]/10">
          <div className="truncate text-sm font-extrabold">{customer.name}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#827E8D]">
            <Badge variant="outline">{leadStatusLabels[status]}</Badge>
            <span>{customer.city || "Brez kraja"}</span>
          </div>
        </DialogTrigger>
        <div className="text-sm">
          <div className="font-bold text-[#28262F]">{customer.latestLead?.service ?? "Brez povpraševanja"}</div>
          <div className="mt-1 text-xs font-semibold text-[#8A8694]">{customer.latestLead ? formatDate(customer.latestLead.createdAt) : formatDate(customer.createdAt)}</div>
        </div>
        <div className="min-w-0 text-sm font-semibold text-[#686473]">
          <div className="truncate">{customer.phone}</div>
          <div className="mt-1 truncate text-xs text-[#8A8694]">{customer.email || "Brez emaila"}</div>
        </div>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="justify-self-start md:justify-self-end">
            Odpri
          </Button>
        </DialogTrigger>
      </div>
      <CustomerDialogContent customer={customer} />
    </Dialog>
  );
}

function CustomerDialogContent({ customer }: { customer: ClientCustomerBoardItem }) {
  const status = getCustomerLeadStatus(customer);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{customer.name}</DialogTitle>
        <DialogDescription>
          {leadStatusLabels[status]} · {customerStatusLabels[customer.customerStatus]} · dodano {formatDate(customer.createdAt)}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[calc(88vh-110px)] overflow-y-auto p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Info icon={Phone} label="Telefon" value={customer.phone} />
          <Info icon={Mail} label="Email" value={customer.email || "Brez emaila"} />
          <Info icon={MapPin} label="Lokacija" value={customer.city || customer.address || "Brez lokacije"} />
          <Info icon={MessageSquareText} label="Vir" value={customer.source || "Ni vpisano"} />
        </div>

        <div className="mt-5 rounded-[16px] border border-[#EEEAF5] bg-[#FBFAFF] p-4">
          <div className="text-sm font-extrabold">Soglasja</div>
          <div className="mt-2 grid gap-2 text-sm font-semibold text-[#686473] sm:grid-cols-2">
            <div>Marketing: {customer.marketingConsent && !customer.optOut ? "Da" : "Ne"}</div>
            <div>Odjava: {customer.optOut ? "Da" : "Ne"}</div>
            <div className="sm:col-span-2">
              Vir soglasja: {customer.marketingConsentSource || "Ni vpisano"}
              {customer.marketingConsentAt ? ` · ${formatDate(customer.marketingConsentAt)}` : ""}
            </div>
          </div>
        </div>

        {customer.latestLead ? (
          <div className="mt-5 rounded-[16px] border border-[#EEEAF5] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold">Zadnje povpraševanje</div>
                <div className="mt-1 text-sm font-semibold text-[#777382]">
                  {customer.latestLead.service} · {formatDate(customer.latestLead.createdAt)}
                </div>
              </div>
              <Badge>{leadStatusLabels[customer.latestLead.status]}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#55515F]">{customer.latestLead.message}</p>
            {customer.latestLead.aiSummary ? (
              <div className="mt-3 rounded-[12px] bg-[#F1EFF8] p-3 text-sm font-semibold leading-6 text-[#514AA8]">
                {customer.latestLead.aiSummary}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold">
            <CalendarDays className="h-4 w-4 text-[#6A5AE0]" />
            Zgodovina povpraševanj
          </div>
          <div className="grid gap-2">
            {customer.leads.length ? (
              customer.leads.map((lead) => (
                <div key={lead.id} className="rounded-[14px] border border-[#EEEAF5] px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-extrabold">{lead.service}</div>
                    <Badge variant="outline">{leadStatusLabels[lead.status]}</Badge>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[#8A8694]">{formatDate(lead.createdAt)} · {lead.location || "Brez lokacije"}</div>
                </div>
              ))
            ) : (
              <div className="rounded-[14px] border border-dashed border-[#DCD8E6] bg-[#FBFAFF] px-4 py-5 text-center text-sm font-semibold text-[#777382]">
                Ta stranka še nima povpraševanj.
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[14px] border border-[#EEEAF5] p-4">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.06em] text-[#9A96A5]">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-extrabold">{value}</div>
    </div>
  );
}

function getCustomerLeadStatus(customer: ClientCustomerBoardItem): LeadStatus {
  return customer.latestLead?.status ?? "new";
}
