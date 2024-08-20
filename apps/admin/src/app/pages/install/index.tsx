import { fetchApplications, selectAppById, useAppDispatch } from "@mezon/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAppearance } from "../../context/AppearanceContext";

const Install: React.FC = () => {
    const dispatch = useAppDispatch();
    const { applicationId } = useParams();
    const { isDarkMode } = useAppearance();
    const appSelect = useSelector(selectAppById(applicationId || ''));

    useEffect(() => {
		dispatch(fetchApplications({}));
	}, [dispatch]);

    return (
        <div className="dark:bg-bgPrimary bg-bgLightPrimary flex flex-col h-screen dark:text-textDarkTheme text-textLightTheme relative justify-center items-center">
			<div className="flex flex-row items-center justify-center gap-[4px] absolute top-5 left-5">
                <img
                    src={isDarkMode ? 'assets/images/mezon-logo-black.svg' : 'assets/images/mezon-logo-white.svg'}
                    alt="LogoMezon"
                    width={36}
                    height={36}
                />
                <span className="text-2xl font-bold">MEZON</span>
            </div>
            <div className="rounded bg-bgProfileBody w-[440px] px-4 py-8 flex flex-col items-center">
                <div 
                    className="rounded-full dark:text-bgAvatarLight text-bgAvatarDark dark:bg-bgAvatarDark bg-bgAvatarLight text-2xl font-bold size-[80px] min-w-[80px] uppercase flex justify-center items-center" 
                >
                    {appSelect?.appname?.at(0)}
                </div>
                <p>{appSelect?.appname}</p>
                <div></div>
            </div>
		</div>
    )
}

export default Install;