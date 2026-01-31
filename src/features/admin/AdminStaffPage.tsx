import { useEffect, useState } from "react";
import Alert from "../../shared/components/ui/Alert";
import type { StaffListItem } from "../../shared/types/staff";
import { getBarbers, getReceptionists } from "./api.staff";
import { getErrorMessage } from "../../shared/utils/error";

type Tab = "barbers" | "receptionists";

export default function AdminStaffPage() {
    const [tab, setTab] = useState<Tab>("barbers");
    const [items, setItems] = useState<StaffListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async (t: Tab) => {
        setError(null);
        setIsLoading(true);

        try {
            const data =
                t === "barbers" ? await getBarbers() : await getReceptionists();
            setItems(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Failed to load staff"));
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load(tab);
    }, [tab]);

    return (
        <div>
            <h1 className="text-2xl font-bold">Staff Directory</h1>
            <p className="mt-1 text-sm text-gray-600">
                Read-only list of staff members.
            </p>
            <div className="mt-5 flex gap-2">
                <button
                    type="button"
                    onClick={() => setTab("barbers")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        tab === "barbers"
                            ? "bg-black text-white"
                            : "border bg-white hover:bg-gray-100"
                    }`}
                >
                    Barbers
                </button>

                <button
                    type="button"
                    onClick={() => setTab("receptionists")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        tab === "receptionists"
                            ? "bg-black text-white"
                            : "border bg-white hover:bg-gray-100"
                    }`}
                >
                    Receptionists
                </button>
            </div>

            {isLoading && <p className="mt-6">Loading...</p>}

            {!isLoading && error && (
                <div className="mt-6">
                    <Alert variant="error">{error}</Alert>
                </div>
            )}

            {!isLoading && !error && items.length === 0 && (
                <div className="mt-6">
                    <Alert>No staff found.</Alert>
                </div>
            )}

            {!isLoading && !error && items.length > 0 && (
                <div className="mt-6 space-y-3">
                    {items.map((x) => (
                        <div
                            key={x.id}
                            className="rounded-xl bg-white p-5 shadow"
                        >
                            <p className="font-medium">{x.fullName}</p>
                            <p className="mt-1 text-sm text-gray-600">
                                ID: {x.id}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
