'use client'
import { api } from "@/lib/api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
export type UseMailType = {
    getMails: (setUnseenMailsLength: Dispatch<SetStateAction<number>>) => Promise<MailType[] | undefined>,
    handleIsSeenOnOpen: (mail_id: string, setUnseenMailsLength: Dispatch<SetStateAction<number>>) => Promise<MailType | undefined>,
    getUnseenEmailsLength: (setUnseenMailsLength: Dispatch<SetStateAction<number>>) => void
}

export function useMails(): UseMailType {
    async function getMails(setUnseenMailsLength: Dispatch<SetStateAction<number>>): Promise<MailType[] | undefined> {
        try {
            const result = (await api.get("/api/mails/get-mails")).data;
            const data = result.data as MailType[];
            return data;
        } catch (error) {
            throw error;
        } finally {
            await getUnseenEmailsLength(setUnseenMailsLength);

        }
    }

    async function handleIsSeenOnOpen(mail_id: string, setUnseenMailsLength: Dispatch<SetStateAction<number>>): Promise<MailType | undefined> {
        try {
            const result = await api.get(`/api/mails/seen-mail/${mail_id}`);
            const data = result.data.data as MailType;
            return data;
        } catch (error) {
            throw error;
        } finally {
            await getUnseenEmailsLength(setUnseenMailsLength);
        }
    }

    async function getUnseenEmailsLength(setUnseenMailsLength: Dispatch<SetStateAction<number>>) {
        try {
            const result = await api.get("/api/mails/unseen-mails-length");
            const data = result.data.data as number;
            setUnseenMailsLength(data);
        } catch (error) {
            throw error;
        }
    }

    return { getMails, handleIsSeenOnOpen, getUnseenEmailsLength };
}