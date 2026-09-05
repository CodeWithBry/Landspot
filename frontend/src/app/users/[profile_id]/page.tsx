import { useAuth } from "@/hooks/useAuth";
import { ProfileType } from "@/types/AuthContextType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ProfilePreview() {
    const { profile_id } = useParams<{ profile_id: string }>();
    const { getProfile } = useAuth();
    const [profile, setProfile] = useState<ProfileType | null>(null);

    useEffect(() => {
        if (profile_id) {
            getProfile().then(res => {
                if (res) setProfile(res);
            });
        }
    }, [profile_id])
    return (
        <div>
            
        </div>
    )
}

export default ProfilePreview