import { useEffect, useState } from "react";
import { getMyAppointments, type MyAppointmentDto } from "./appointmentsApi";

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
        return (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">My Appointments</h1>

            {items.length === 0 ? (
                <p className="mt-4 text-sm text-gray-600">No appointments yet.</p>
            ) : (
                <div className="mt-6 space-y-3">
                    {items.map((a) => (
                        <div key={a.id} className="rounded-xl bg-white p-5 shadow">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-gray-600">Date & time</p>
                                    <p className="font-medium">{formatDateTime(a.appointmentDateTime)}</p>
                                </div>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                  {a.status}
                </span>
                            </div>

                            <div className="mt-3 grid gap-2 text-sm">
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

