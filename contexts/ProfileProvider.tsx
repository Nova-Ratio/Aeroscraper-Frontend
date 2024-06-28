import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAppContext } from "./AppProvider";

export interface ProfileDetailModel {
    walletAddress: string;
    photoUrl: string;
    appType: number;
    balance?: number;
}

type ProfileContextValue = {
    profileDetail: ProfileDetailModel | undefined;
    setProfileDetail: (profile: ProfileDetailModel | undefined) => void;
}

const ProfileContext = createContext<ProfileContextValue>({
    profileDetail: undefined,
    setProfileDetail: () => { }
});

const ProfileProvider: FC<PropsWithChildren> = ({ children }) => {
    const { userInfo } = useAppContext();
    const [profileDetail, setProfileDetail] = useState<ProfileDetailModel | undefined>(undefined);


    const getProfileDetail = useCallback(async () => {
        
        if (userInfo.address) {
            
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PROFILE_API}/api/users/profile-detail`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        walletAddress: userInfo.address,
                        appType: 999
                    })
                });
                if (response.status === 200) {
                    const data = await response.json();

                    setProfileDetail(data);

                    localStorage.setItem("profile-detail", JSON.stringify(data));
                }

            }
            catch (error) {
                console.error(error);
            }
        }
    }, [userInfo])

    const value = useMemo<ProfileContextValue>(() => ({
        profileDetail,
        setProfileDetail
    }), [
        profileDetail,
        setProfileDetail
    ])

    useEffect(() => {
        getProfileDetail();
    }, [getProfileDetail]);

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile = () => useContext(ProfileContext);

export default ProfileProvider;