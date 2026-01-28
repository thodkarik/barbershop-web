import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices, type ServiceDto } from "../services/servicesApi";
import { getBarbers, type BarberDto } from "../barbers/barbersApi";
import { getAvailability, type AvailabilitySlotDto } from "./availabilityApi";
import { createAppointment } from "./appointmentsApi";

const BookAppointmentPage = () => {
    const navigate = useNavigate();

    const [services, setServices] = useState<ServiceDto[]>([]);
    const [barbers, setBarbers] = useState<BarberDto[]>([]);

    const [serviceId, setServiceId] = useState<number | "">("");
    const [barberId, setBarberId] = useState<number | "">("");
    const [date, setDate] = useState(""); // YYYY-MM-DD

    const [slots, setSlots] = useState<AvailabilitySlotDto[]>([]);
    const [selectedStart, setSelectedStart] = useState(""); // ISO datetime (slot.start)

    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getServices().then(setServices);
        getBarbers().then(setBarbers);
    }, []);

    const isSunday = (dateStr: string) => {
        const d = new Date(dateStr + "T00:00:00");
        return d.getDay() === 0;
    };

    useEffect(() => {
        const canLoad = date && barberId !== "" && serviceId !== "";
        if (!canLoad) {
            setSlots([]);
            setSelectedStart("");
            return;
        }

        if (isSunday(date)) {
            setSlots([]);
            setSelectedStart("");
            setError("Sunday is closed. Please select another day.");
            return;
        }

        const loadSlots = async () => {
            setError(null);
            setIsLoadingSlots(true);

            try {
                const data = await getAvailability({
                    date,
                    barberId: Number(barberId),
                    serviceId: Number(serviceId),
                });
                setSlots(data);
                setSelectedStart("");
            } catch (err: any) {
                const data = err?.response?.data;
                const msg =
                    data?.message ||
                    data?.title ||
                    (typeof data === "string" ? data : null) ||
                    "Failed to load availability";
                setError(msg);
                setSlots([]);
            } finally {
                setIsLoadingSlots(false);
            }
        };

        loadSlots();
    }, [date, barberId, serviceId]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);

        if (barberId === "" || serviceId === "" || !date || !selectedStart) return;

        const selected = new Date(selectedStart);
        if (selected <= new Date()) {
            setError("Appointment date and time must be in the future.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createAppointment({
                barberId: Number(barberId),
                serviceId: Number(serviceId),
                appointmentDateTime: selectedStart,
            });

            navigate("/appointments/me");
        } catch (err: any) {
            const data = err?.response?.data;
            const msg =
                data?.message ||
                data?.title ||
                (data?.errors ? Object.values(data.errors).flat().join(", ") : null) ||
                (typeof data === "string" ? data : null) ||
                "Failed to book appointment";
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (iso: string) => iso.slice(11, 16); // "HH:mm"

    return (
        <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-bold">Book Appointment</h1>

            {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label className="text-sm font-medium">Barber</label>
                    <select
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={barberId}
                        onChange={(e) => setBarberId(e.target.value ? Number(e.target.value) : "")}
                        required
                    >
                        <option value="">Select barber</option>
                        {barbers.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Service</label>
                    <select
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : "")}
                        required
                    >
                        <option value="">Select service</option>
                        {services.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Date</label>
                    <input
                        type="date"
                        min={new Date().toISOString().slice(0, 10)}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Time</label>
                    <select
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        value={selectedStart}
                        onChange={(e) => setSelectedStart(e.target.value)}
                        required
                        disabled={isLoadingSlots || slots.length === 0}
                    >
                        <option value="">
                            {isLoadingSlots
                                ? "Loading available slots..."
                                : slots.length === 0
                                    ? "No slots available"
                                    : "Select time"}
                        </option>

                        {slots.map((s) => (
                            <option key={s.start} value={s.start}>
                                {formatTime(s.start)} - {formatTime(s.end)}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-60"
                >
                    {isSubmitting ? "Booking..." : "Book appointment"}
                </button>
            </form>
        </div>
    );
};

export default BookAppointmentPage;


