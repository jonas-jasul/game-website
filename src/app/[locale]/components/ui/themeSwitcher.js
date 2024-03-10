import { useTranslations } from "next-intl";
import Select from 'react-select';
import { useTheme } from "next-themes";
import { useState } from "react";
import colors from "daisyui/src/theming/themes"
const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState()
    const t = useTranslations('Navbar');

    const themeOptions = [
        { value: 'cupcake', label: t('lightTheme') },
        { value: 'cyberpunk', label: t('cyberpunkTheme') },
        { value: 'halloween', label: t('halloweenTheme') },
        { value: 'lofi', label: t('lofiTheme') },
        { value: 'business', label: t('businessTheme') },
        { value: 'pastel', label: t('pastelTheme') },
        {value: 'dracula', label: t('draculaTheme')}
    ];
    const themeKey=`[data-theme=${theme}]`;
    const themeColors = colors[themeKey] || {};


    const handleThemeChange = (selected) => {
        const currentTheme = selected.value;
        setTheme(currentTheme);
    }

    const customStyles = {
        input: (baseStyles) => ({
            ...baseStyles,
            "input[type='text']:focus": { boxShadow: 'none' },
        }),

        menu: (baseStyles) => {
            
            let backgroundColor;
            let color;
            if(localStorage.getItem("theme")===null) {
                backgroundColor = "black";
                color="white";
            }
            else {
                backgroundColor= themeColors["base-100"];
            }

            return {
                ...baseStyles,
                backgroundColor,
                color
    
            }
            
        },
        option: (baseStyles, state) => {

            let backgroundColor = themeColors["base-100"];
            let color;
            if (state.isFocused) {
                backgroundColor = themeColors["primary"];
                color = themeColors["base-100"]
            }
            if (state.isSelected) {
                backgroundColor = themeColors["accent"];
                color = themeColors["base-100"]

            }
            if (state.isClicked) {
                backgroundColor = themeColors["accent"];
            }

            return {
                ...baseStyles,
                backgroundColor,
                color
            };
        },


    }

    const customTheme = (_theme) => {

        return {
            ..._theme,
            colors: {
                ..._theme.colors,
                primary: themeColors["primary"],
                primary25: themeColors["accent"],
                primary50: themeColors["accent"],
                primary75: themeColors["accent"],
            }
        }
       
    }
    return (
        <div className="p-0 m-0 me-1 z-50" data-choose-theme>
            <Select
                styles={customStyles}
                classNamePrefix="react-select"
                className="react-select-container min-w-[10em] text-base-content font-semibold"
                onChange={handleThemeChange}
                options={themeOptions}
                placeholder={t('chooseTheme')}
                theme={customTheme}
                noOptionsMessage={() => t('noOptionsMessage')}
                isSearchable={false}
            />
        </div>
    )
}

export default ThemeSwitcher