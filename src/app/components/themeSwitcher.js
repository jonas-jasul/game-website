
const ThemeSwitcher = () => {

    return (
        <select className="gradientselect select select-bordered max-w-xs" data-choose-theme>
            <option disabled value="">
                Choose a theme
            </option>

            <option value="cupcake">Light</option> 
            <option value="black">Dark</option>            
            <option value="cyberpunk">Cyberpunk</option>
            <option value="halloween">Halloween</option>            
           
        </select>
    )
}

export default ThemeSwitcher