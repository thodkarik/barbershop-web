import { useEffect, useState } from "react";
import { getServices, type ServiceDto } from "./servicesApi";

const ServicesPage = () => {
    const [services, setServices] = useState<ServiceDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const data = await getServices();
                setServices(data);
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.title ||
                    (typeof err?.response?.data === "string" ? err.response.data : null) ||
                    "Failed to load services";
                setError(msg);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    if (isLoading) {
        return <p>Loading services...</p>;
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
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="mt-1 text-sm text-gray-600">
                Choose a service to book an appointment.
            </p>

            {services.length === 0 ? (
                <p className="mt-6 text-sm text-gray-600">No services available.</p>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {services.map((s) => (
                        <div key={s.id} className="rounded-xl bg-white p-5 shadow">
                            <div className="flex items-start justify-between gap-3">
                                <h2 className="text-lg font-semibold">{s.name}</h2>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                                    {s.durationMinutes} min
                                </span>
                            </div>

                            <p className="mt-2 text-sm text-gray-600">
                                {s.description}
                            </p>

                            <p className="mt-3 text-sm text-gray-700">
                                Price: <span className="font-medium">{s.price}€</span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicesPage;
