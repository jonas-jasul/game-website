
import { RxDropdownMenu } from "react-icons/rx"
import ShowHideFilterGameBar from "./showHideFilterGameBar";
import { useState } from "react";
const FilterGameBar = ({onFilterClick}) => {
    const [filterGameBar, setFilterGameBar] = useState(false);

    const handleFilterClick = () => {
        setFilterGameBar(!filterGameBar);
        onFilterClick();
    }
    return (
        <>
            <div className="">
                <button onClick={(handleFilterClick)} className="btn button flex items-center">Filter<RxDropdownMenu size='1.4rem' className="m-1" /> </button>
            </div>

            <div>
            
            </div>
        </>
    )
}

export default FilterGameBar;