import type { OkPacket } from "mysql2";
import type { Actions } from "./$types";

export const actions = {
    default: async ({ locals, request }) => {
        const data = await request.formData();
        const title = data.get('transparent-input');

        if (title) {
            const day = new Date().toLocaleString("default", {weekday: "long"})
            const [group] = await locals.connection.execute<OkPacket>(`
                INSERT INTO song_groups (day, title, updateAt) VALUES (?, ?, CURRENT_TIMESTAMP);
            `, [day, title.toString()]);

            return group.insertId;
        }

        return 0;
    }
} satisfies Actions;