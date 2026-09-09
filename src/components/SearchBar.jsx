import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Search, Trophy } from "lucide-react";
import Button from "./Button";
import { sports } from "@/data/sports";
import { turfApi } from "@/lib/api";

const timeSlots = [
  { value: "06:00", label: "06:00 AM - 07:00 AM" },
  { value: "07:00", label: "07:00 AM - 08:00 AM" },
  { value: "08:00", label: "08:00 AM - 09:00 AM" },
  { value: "17:00", label: "05:00 PM - 06:00 PM" },
  { value: "18:00", label: "06:00 PM - 07:00 PM" },
  { value: "19:00", label: "07:00 PM - 08:00 PM" },
  { value: "20:00", label: "08:00 PM - 09:00 PM" },
];

const field =
  "w-full rounded-2xl border border-border bg-card px-10 py-3 text-sm text-foreground outline-none focus:border-primary";

export default function SearchBar() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    location: "",
    date: "",
    time: "",
    sport: "",
  });
  const [locations, setLocations] = useState([]);
  const [sportOptions, setSportOptions] = useState(sports);

  useEffect(() => {
    turfApi.cities().then((cities) => setLocations(cities.map((city) => city.name))).catch(() => {});
    turfApi.sports().then((items) => setSportOptions(items.map((name) => ({ id: name.toLowerCase(), name: name.replaceAll("_", " ") })))).catch(() => {});
  }, []);

  const set = (key) => (e) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const search = {};
    if (values.location) search.location = values.location;
    if (values.sport) search.sport = values.sport;
    if (values.date) search.date = values.date;
    if (values.time) search.time = values.time;
    navigate({ to: "/turfs", search });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card/95 shadow-lift grid w-full gap-3 rounded-3xl p-4 backdrop-blur md:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto]"
    >
      <label className="relative block">
        <MapPin
          size={16}
          className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
        />
        <select
          aria-label="Location"
          value={values.location}
          onChange={set("location")}
          className={field}
        >
          <option value="">Any location</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>

      <label className="relative block">
        <CalendarDays
          size={16}
          className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
        />
        <input
          aria-label="Date"
          type="date"
          value={values.date}
          onChange={set("date")}
          className={field}
        />
      </label>

      <label className="relative block">
        <Clock
          size={16}
          className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
        />
        <select
          aria-label="Time"
          value={values.time}
          onChange={set("time")}
          className={field}
        >
          <option value="">Any time</option>
          {timeSlots.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="relative block">
        <Trophy
          size={16}
          className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
        />
        <select
          aria-label="Sport"
          value={values.sport}
          onChange={set("sport")}
          className={field}
        >
          <option value="">All sports</option>
          {sportOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <Button type="submit" size="lg" className="w-full lg:w-auto">
        <Search size={16} /> Search Turfs
      </Button>
    </form>
  );
}
