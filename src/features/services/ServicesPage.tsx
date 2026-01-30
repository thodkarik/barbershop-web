import { useEffect, useState } from "react";
import { getServices, type ServiceDto } from "./api.services.ts";

import Alert from "../../shared/components/ui/Alert";
import {getErrorMessage} from "../../shared/utils/error.ts";

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
            } catch (err: unknown) {
                setError(getErrorMessage(err, "Failed to load services"));
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
        return <Alert variant="error">{error}</Alert>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="mt-1 text-sm text-gray-600">
                Browse our services and book your appointment.
            </p>

            {services.length === 0 ? (
                <div className="mt-6">
                    <Alert>No services available.</Alert>
                </div>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {services.map((s) => (
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicesPage;

