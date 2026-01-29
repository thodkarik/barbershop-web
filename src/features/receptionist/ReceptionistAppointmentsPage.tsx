import { useEffect, useState } from "react";
import Alert from "../../shared/components/ui/Alert";
import Button from "../../shared/components/ui/Button";
import Select, { type SelectOption } from "../../shared/components/ui/Select";
import {
    getReceptionistAppointments,
    type ReceptionistAppointmentDto,
    updateAppointmentStatus,
} from "./receptionistApi";

type AppointmentStatus = "Completed" | "Canceled" | "NoShow";

const STATUS_OPTIONS: SelectOption[] = [
    { value: "Completed", label: "Completed" },
    { value: "Canceled", label: "Canceled" },
    { value: "NoShow", label: "NoShow" },
];

const ReceptionistAppointmentsPage = () => {
    const [items, setItems] = useState<ReceptionistAppointmentDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [savingId, setSavingId] = useState<number | null>(null);
    const [serverStatusById, setServerStatusById] = useState<Record<number, string>>({});
    const [draftStatusById, setDraftStatusById] = useState<Record<number, string>>({});

    const load = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const data = await getReceptionistAppointments();
            setItems(data);

            const map: Record<number, string> = {};
            data.forEach((x) => (map[x.appointmentId] = String(x.status)));
            setServerStatusById(map);
            setDraftStatusById(map);
        } catch (err: unknown) {
            setError("Failed to load appointments");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const formatDate = (iso: string) => new Date(iso).toLocaleDateString();
    const formatTime = (iso: string) =>
        new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleSave = async (appointmentId: number) => {
        const newStatus = draftStatusById[appointmentId] as AppointmentStatus;

        setSavingId(appointmentId);
        setError(null);

        try {
            await updateAppointmentStatus(appointmentId, { status: newStatus });
            await load();
        } catch (err: unknown) {
            setError("Failed to update status");
        } finally {
            setSavingId(null);
        }
    };

    const hasChanges = (id: number) =>
        (draftStatusById[id] ?? "") !== (serverStatusById[id] ?? "");



    if (isLoading) return <p>Loading appointments...</p>;
    if (error) return <Alert variant="error">{error}</Alert>;

    return (
        <div>
            <h1 className="text-2xl font-bold">Receptionist</h1>
            <p className="mt-1 text-sm text-gray-600">
                View all appointments and update their status.
            </p>

            {items.length === 0 ? (
                <div className="mt-6">
                    <Alert>No appointments found.</Alert>
                </div>
            ) : (
                <div className="mt-6 space-y-3">
                    {items.map((a) => (
                        <div key={a.appointmentId} className="rounded-xl bg-white p-5 shadow">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Date & time</p>
                                    <p className="font-medium">
                                        {formatDate(a.start)} — {formatTime(a.start)} to {formatTime(a.end)}
                                    </p>

                                    <div className="mt-3 grid gap-1 text-sm">
                                        <p>
                                            <span className="text-gray-600">Customer:</span>{" "}
                                            <span className="font-medium">{a.customerName}</span>
                                            <span className="text-gray-600"> · {a.customerPhone}</span>
                                        </p>
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

                                <div className="w-full sm:w-64">
                                    <Select
                                        label="Status"
                                        value={draftStatusById[a.appointmentId] ?? ""}
                                        onChange={(e) =>
                                            setDraftStatusById((prev) => ({
                                                ...prev,
                                                [a.appointmentId]: e.target.value,
                                            }))
                                        }
                                        options={STATUS_OPTIONS}
                                        showPlaceholder={false}
                                    />
                                    {hasChanges(a.appointmentId) && (
                                        <p className="mt-2 text-xs text-gray-600">Unsaved change</p>
                                    )}

                                    <Button
                                        className="mt-3 w-full"
                                        onClick={() => handleSave(a.appointmentId)}
                                        disabled={savingId === a.appointmentId || !hasChanges(a.appointmentId)}
                                        type="button"
                                    >
                                        {savingId === a.appointmentId ? "Updating..." : "Update"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReceptionistAppointmentsPage;
