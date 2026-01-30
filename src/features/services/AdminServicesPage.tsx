import { useEffect, useMemo, useState } from "react";
import Alert from "../../shared/components/ui/Alert";
import Button from "../../shared/components/ui/Button";
import TextInput from "../../shared/components/ui/TextInput";
import Select from "../../shared/components/ui/Select";

import { getServices, type ServiceDto } from "./api.services.ts";
import { createService, updateService, deleteService, type UpsertServiceRequest } from "./api.servicesAdmin.ts";
import {getErrorMessage} from "../../shared/utils/error.ts";

const emptyForm: UpsertServiceRequest = {
    name: "",
    description: "",
    durationMinutes: 30,
    price: 0,
};

const DURATION_OPTIONS = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "60 minutes" },
];

const AdminServicesPage = () => {
    const [items, setItems] = useState<ServiceDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<UpsertServiceRequest>(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    const load = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const data = await getServices();
            setItems(data);
        } catch {
            setError("Failed to load services");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const startCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
    };

    const startEdit = (s: ServiceDto) => {
        setEditingId(s.id);
        setForm({
            name: s.name,
            description: s.description ?? "",
            durationMinutes: s.durationMinutes,
            price: s.price,
        });
    };

    const onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);

        try {
            if (editingId === null) {
                await createService(form);
            } else {
                await updateService(editingId, form);
            }
            await load();
            startCreate();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Save failed"));
        } finally {
            setIsSaving(false);
        }
    };

    const onDelete = async (id: number) => {
        const ok = window.confirm("Delete this service?");
        if (!ok) return;

        setError(null);
        try {
            await deleteService(id);
            await load();
            if (editingId === id) startCreate();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Delete failed"));
        }
    };

    const title = useMemo(
        () => (editingId === null ? "Create service" : `Edit service #${editingId}`),
        [editingId]
    );

    if (isLoading) return <p>Loading services...</p>;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div>
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">Admin · Services</h1>
                        <p className="mt-1 text-sm text-gray-600">Create, edit or delete services.</p>
                    </div>

                    <Button type="button" variant="ghost" onClick={startCreate}>
                        New
                    </Button>
                </div>

                {error && (
                    <div className="mt-4">
                        <Alert variant="error">{error}</Alert>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="mt-6">
                        <Alert>No services found.</Alert>
                    </div>
                ) : (
                    <div className="mt-6 space-y-3">
                        {items.map((s) => (
                            <div key={s.id} className="rounded-xl bg-white p-5 shadow">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold">{s.name}</h2>
                                        <p className="mt-1 text-sm text-gray-600">{s.description}</p>
                                    </div>

                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                    {s.durationMinutes} min
                  </span>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <p className="text-gray-600">Price</p>
                                    <p className="font-medium">{s.price}€</p>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button type="button" variant="ghost" onClick={() => startEdit(s)}>
                                        Edit
                                    </Button>
                                    <Button type="button" variant="danger" onClick={() => onDelete(s.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
                <h2 className="text-lg font-semibold">{title}</h2>

                <form className="mt-4 space-y-4" onSubmit={onSubmit}>
                    <TextInput
                        label="Name"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        required
                    />

                    <TextInput
                        label="Description"
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        required
                    />

                    <Select
                        label="Duration"
                        value={form.durationMinutes}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, durationMinutes: Number(e.target.value) }))
                        }
                        options={DURATION_OPTIONS}
                        showPlaceholder={false}
                        required
                    />

                    <TextInput
                        label="Price (€)"
                        type="number"
                        step="0.01"
                        min="0"
                        value={String(form.price)}
                        onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                        required
                    />

                    <Button type="submit" disabled={isSaving} className="w-full">
                        {isSaving ? "Saving..." : editingId === null ? "Create" : "Update"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminServicesPage;