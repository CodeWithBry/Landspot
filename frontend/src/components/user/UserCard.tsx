import { useAuth } from "@/hooks/useAuth";
import { ProfileType } from "@/types/AuthContextType";
import { useState } from "react";

function UserCard({ prof }: { prof: ProfileType }) {
  const {profile, follow, unFollow} = useAuth();
  const [getProfile, setGetProfile] = useState<ProfileType>(prof);
  const imageStyle = {
    backgroundImage: `url("${prof?.photo_url ? prof.photo_url : "./empty-profile.svg"}")`,
    backgroundPosition: "center",
    backgroundSize: "cover"
  }

  async function handleFollow(isFollowed: boolean) {
    if(!profile) return;
    console.log(isFollowed)
    if(!isFollowed) {
      const message = await follow(profile.profile_id, prof.profile_id);
      if(message == "Success") setGetProfile(prev => ({...prev, followed: true}));
    } else {
      const message = await unFollow(profile.profile_id, prof.profile_id);
      if(message == "Success") setGetProfile(prev => ({...prev, followed: false}));
    }
  }

  return (
    <div className="flex flex-col h-fit overflow-hidden rounded-md shadow-md mx-2">
      {/* profile image */}
      <div className="relative w-full border-b-2 border-b-gray-300">
        <div
          className={`w-full h-50`}
          style={{ ...imageStyle }} />
      </div>

      {/* profile contents */}
      <div className="flex flex-col p-3 gap-3">
        <div className="w-full flex flex-col items-baseline gap-px ml-1">
          <h3 className="font-serif text-lg font-semibold text-left w-full">{getProfile?.user_name ? getProfile.user_name : getProfile.first_name + getProfile.last_name}</h3>
          <span className="font-semibold text-s text-gray-500">{getProfile.role.toUpperCase()}</span>
          <span className="font-semibold text-s text-gray-500">
            {getProfile.followers} followers
          </span>
        </div>
        <div className="w-full flex flex-col gap-2">
          <button 
            className={`btn justify-center text-s font-serif text-center transition-all text-white ${getProfile.followed ? "bg-primary-500" : "bg-gray-500"}`}
            onClick={() => {
              if(getProfile.followed != null) handleFollow(getProfile.followed);
            }}>{getProfile.followed ? "Followed" : "Follow"}</button>
          <button className="btn justify-center text-s font-serif text-center bg-accent-400 text-white">See Profile</button>
        </div>
      </div>
    </div>
  )
}

export default UserCard;