export function generateTimeSlots() {
    const slots: string[] = [];

    for (let hour = 10; hour < 20; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }

    return slots;
}
