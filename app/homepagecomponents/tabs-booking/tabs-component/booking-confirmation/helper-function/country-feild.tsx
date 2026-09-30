import { useMemo, useRef, useState } from "react";
import { COUNTRIES } from "../data/country-data";
import { cn } from "@heroui/react";
import { Check, Search, X } from "lucide-react";
import { useFormikContext } from "formik";
import type { BookingFormValues } from "../../../booking-form-values";

export default function PhoneField() {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<BookingFormValues>();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [countryName, setCountryName] = useState("India");
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedCountry =
    COUNTRIES.find((c) => c.name === countryName) ?? COUNTRIES[0];

  const filteredCountries = useMemo(() => {
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.replace("+", "").includes(q.replace("+", ""))
    );
  }, [search]);

  // strip everything but digits for the national number part
  const nationalNumber = values.partyPhone
    ?.replace(selectedCountry.dialCode, "")
    .trim() ?? "";

  const updatePhone = (dialCode: string, national: string) => {
    setFieldValue("partyPhone", `${dialCode} ${national}`.trim());
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="phone" className="text-sm font-medium text-slate-700">
        Phone / WhatsApp
      </label>

      <div className="relative flex h-11 rounded-xl border border-slate-200 bg-white overflow-visible focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        {/* Country trigger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 pl-3 pr-2 border-r bg-blue-500 border-slate-200 rounded-l-xl hover:bg-slate-50 transition-colors"
          aria-label="Select country"
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-[13px] font-medium  tabular-nums">
            {selectedCountry.dialCode}
          </span>
          <svg
            className={cn(
              "w-3 h-3 text-slate-400 transition-transform duration-200",
              open && "rotate-180"
            )}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Number input */}
        <input
          id="phone"
          name="partyPhone"
          type="tel"
          value={nationalNumber}
          onChange={(e) => updatePhone(selectedCountry.dialCode, e.target.value)}
          placeholder="Enter Your Phone No"
          className="flex-1 min-w-0 px-3 text-sm outline-none rounded-r-xl"
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/80 overflow-hidden">
            <div className="p-2.5 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search country or code…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-8 pr-3 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:bg-white transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto p-1.5">
              {filteredCountries.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">
                  No countries found
                </p>
              ) : (
                filteredCountries.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setCountryName(c.name);
                      updatePhone(c.dialCode, nationalNumber);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors",
                      c.name === countryName && "bg-indigo-50"
                    )}
                  >
                    <span className="text-base leading-none flex-shrink-0">{c.flag}</span>
                    <span className="flex-1 truncate text-[13px]">{c.name}</span>
                    <span className="tabular-nums text-[12px] text-slate-400 flex-shrink-0">
                      {c.dialCode}
                    </span>
                    {c.name === countryName && (
                      <Check className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {touched.partyPhone && errors.partyPhone && (
        <span className="text-xs text-red-600">{errors.partyPhone}</span>
      )}
    </div>
  );
}