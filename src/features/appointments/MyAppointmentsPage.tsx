import { useEffect, useState } from "react";
import { getMyAppointments, type MyAppointmentDto } from "./api.appointments.ts";

import Alert from "../../shared/components/ui/Alert";


const statusBadgeClass = (status: string) => {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-800";
        case "Canceled":
            return "bg-red-100 text-red-800";
        case "NoShow":
            return "bg-orange-100 text-orange-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const MyAppointmentsPage = () => {
    const [items, setItems] = useState<MyAppointmentDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const data = await getMyAppointments();
                setItems(data);
            } catch (err: any) {
                const data = err?.response?.data;
                const msg =
                    data?.message ||
                    data?.title ||
                    (typeof data === "string" ? data : null) ||
                    "Failed to load appointments";
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    const formatDateTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString();
    };

    if (isLoading) {
        return <p>Loading appointments...</p>;
    }

    if (error) {
        return <Alert variant="error">{error}</Alert>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">My Appointments</h1>
            <p className="mt-1 text-sm text-gray-600">
                Your upcoming and past appointments.
            </p>

            {items.length === 0 ? (
                <div className="mt-6">
                    <Alert>No appointments yet.</Alert>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {items.map((a) => (
                        <div key={a.id} className="rounded-xl bg-white p-5 shadow">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-gray-600">Date & time</p>
                                    <p className="font-medium">{formatDateTime(a.appointmentDateTime)}</p>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(a.status)}`}
                                >
                                    {a.status}
                                </span>
                            </div>
                            <div className="mt-4 grid gap-2 text-sm">
                                <p>
                                    <span className="text-gray-600">Barber:</span>{" "}
                                    <span className="font-medium">{a.barberName}</span>
                                </p>
                                <p>
                                    <span className="text-gray-600">Service:</span>{" "}
                                    <span className="font-medium">{a.serviceName}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsPage;


