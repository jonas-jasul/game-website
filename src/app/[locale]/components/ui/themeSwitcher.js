import { useTranslations } from "next-intl"
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
        { value: 'black', label: t('darkTheme') },
        { value: 'cyberpunk', label: t('cyberpunkTheme') },
        { value: 'halloween', label: t('halloweenTheme') },
        { value: 'wireframe', label: t('wireframeTheme') },
        { value: 'business', label: t('businessTheme') },
        { value: 'pastel', label: t('pastelTheme') },
        { value: 'dark', label: t('nightTheme') },
    ];

    const handleThemeChange = (selected) => {
        const currentTheme = selected.value;
        setTheme(currentTheme);
    }

    const customStyles = {
        input: (baseStyles) => ({
            ...baseStyles,
            "input[type='text']:focus": { boxShadow: 'none' },
        }),

        menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: colors[`[data-theme=${theme}]`]["base-100"],
        }),
        option: (baseStyles, state) => {

            let backgroundColor = colors[`[data-theme=${theme}]`]["base-100"];

            if (state.isFocused) {
                backgroundColor = colors[`[data-theme=${theme}]`]["primary"];
            }
            if (state.isSelected) {
                backgroundColor = colors[`[data-theme=${theme}]`]["accent"];

            }
            if (state.isClicked) {
                backgroundColor = colors[`[data-theme=${theme}]`]["accent"];
            }

            return {
                ...baseStyles,
                backgroundColor
            };
        },


    }

    const customTheme = (_theme) => ({
        ..._theme,
        colors: {
            ..._theme.colors,
            primary: colors[`[data-theme=${theme}]`]["primary"],
            primary25: colors[`[data-theme=${theme}]`]["accent"],
            primary50: colors[`[data-theme=${theme}]`]["accent"],
            primary75: colors[`[data-theme=${theme}]`]["accent"],
        }
    })
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
            />
        </div>
    )
}

export default ThemeSwitcher