import { getTranslations } from "next-intl/server";
import LoungeDetailPage from "@/components/lounge_detail/page";
import LoadingPopup from "@/components/loading_popup/page";

export default async function DetailLounge({ params }: { params: Promise<{ lounge_detail: string }> }) {
    

    const t = await getTranslations();
    
    // Ambil teks terjemahan yang dibutuhkan
    const translations = {
        sectionHeading: t("lounge.sectionHeading"),
        spaces: t("lounge.spaces"),
        menu: t("lounge.menu"),
        descMenu: t("lounge.descMenu"),
        openMenu: t("lounge.openMenu"),
        reservation: t("reservation.heading"),
    };
    

    return (
        <>
            <LoadingPopup duration={700} />
            <LoungeDetailPage loungeDetail={(await params).lounge_detail} translations={translations} />
        </>
    );  
}
