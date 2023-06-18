import { useTranslations } from "next-intl"

const ThemeSwitcher = () => {

    const t = useTranslations('Navbar');
    return (
        <div className="p-0 m-0 me-1">
            <select className="gradientselect select select-bordered max-w-xs dropdown" data-choose-theme>
                <option disabled value="">
                    {t('chooseTheme')}
                </option>

                <option value="cupcake">{t('lightTheme')}</option>
                <option value="black">{t('darkTheme')}</option>
                <option value="cyberpunk">{t('cyberpunkTheme')}</option>
                <option value="halloween">{t('halloweenTheme')}</option>
                <option value="wireframe">{t('wireframeTheme')}</option>
                <option value="business">{t('businessTheme')}</option>
                <option value="pastel">{t('pastelTheme')}</option>

            </select>
        </div>
    )
}

export default ThemeSwitcher