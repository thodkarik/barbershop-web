import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getServices, type ServiceDto } from "../services/servicesApi";
import { getBarbers, type BarberDto } from "../barbers/barbersApi";
import { getAvailability, type AvailabilitySlotDto } from "./availabilityApi";
import { createAppointment } from "./appointmentsApi";

import Button from "../../shared/components/ui/Button";
import Select from "../../shared/components/ui/Select";
import TextInput from "../../shared/components/ui/TextInput";
import Alert from "../../shared/components/ui/Alert";

const BookAppointmentPage = () => {
    const navigate = useNavigate();

    const [services, setServices] = useState<ServiceDto[]>([]);
    const [barbers, setBarbers] = useState<BarberDto[]>([]);

    const [serviceId, setServiceId] = useState<number | "">("");
    const [barberId, setBarberId] = useState<number | "">("");
    const [date, setDate] = useState("");

    const [slots, setSlots] = useState<AvailabilitySlotDto[]>([]);
    const [selectedStart, setSelectedStart] = useState("");

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

    const barberOptions = barbers.map((b) => ({ value: b.id, label: b.fullName }));
    const serviceOptions = services.map((s) => ({ value: s.id, label: s.name }));

    const timeOptions = slots.map((s) => ({
        value: s.start,
        label: `${s.start.slice(11, 16)} - ${s.end.slice(11, 16)}`,
    }));

    return (
        <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-bold">Book Appointment</h1>
            <p className="mt-1 text-sm text-gray-600">
                Select barber, service and an available time slot.
            </p>

            {error && (
                <div className="mt-4">
                    <Alert variant="error">{error}</Alert>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Select
                    label="Barber"
                    value={barberId}
                    onChange={(e) => setBarberId(e.target.value ? Number(e.target.value) : "")}
                    options={barberOptions}
                    placeholder="Select barber"
                    required
                />

                <Select
                    label="Service"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : "")}
                    options={serviceOptions}
                    placeholder="Select service"
                    required
                />

                <TextInput
                    label="Date"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <Select
                    label="Time"
                    value={selectedStart}
                    onChange={(e) => setSelectedStart(e.target.value)}
                    options={timeOptions}
                    placeholder={
                        isLoadingSlots
                            ? "Loading available slots..."
                            : slots.length === 0
                                ? "No slots available"
                                : "Select time"
                    }
                    disabled={isLoadingSlots || slots.length === 0}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Booking..." : "Book appointment"}
                </Button>
            </form>
        </div>
    );
};

export default BookAppointmentPage;



