type MailType = {
    mail_id: string,
    user_id: string,
    agent_name: string,
    agent_email: string,
    subject: string,
    message_description: string,
    html: Date,
    sent_at: string,
    sender_id: string,
    sender_email: string,
    sender_name: string,
    is_important: boolean,
    is_seen: boolean
}

type SortedMailType = {
    label: string,
    mails: MailType[] 
}