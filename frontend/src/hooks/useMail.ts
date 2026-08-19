import { api } from "@/lib/api";
export type UseMailType = {
    getMails: () => Promise<MailType[] | undefined>,
    getUnseenEmailsLength: (user_id: string) => Promise<number | undefined>
}

export function useMails(): UseMailType {
    async function getMails(): Promise<MailType[] | undefined> {
        try {
            const result = (await api.get("/api/mails/get-mails")).data;
            const data = result.data as MailType[];
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function getUnseenEmailsLength(): Promise<number | undefined> {
        try {
            const result = await api.get("/api/mails/unseen-mails-length");
            const data = result.data as number;
            return data;
        } catch (error) {
            throw error;
        }
    }

    return { getMails, getUnseenEmailsLength};
}