type NotificationsType = {
    id: string,
    user_id: string,
    title: string,
    message_description: string,
    sent_at: Date
    sender_id: string
    sender_email: string;
    sender_name: string;
    html: string
}

type SortedNotificationsType = {
    label: string,
    notifications: NotificationsType[] 
}