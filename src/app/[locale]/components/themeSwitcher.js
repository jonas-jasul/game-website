import { useTranslations } from "next-intl"

const ThemeSwitcher = () => {

    const t = useTranslations('Navbar');
    return (
        <select className="gradientselect select select-bordered max-w-xs dropdown" data-choose-theme>
            <option disabled value="">
                {t('chooseTheme')}
            </option>

            <option value="cupcake">{t('lightTheme')}</option> 
            <option value="black">{t('darkTheme')}</option>            
            <option value="cyberpunk">{t('cyberpunkTheme')}</option>
            <option value="halloween">{t('halloweenTheme')}</option>            
           
        </select>
    )
}

export default ThemeSwitcher