import React, { memo, useRef, useState } from "react";
import classNames from "classnames";
import { RxCross2 } from "react-icons/rx";
import { useTranslations } from "next-intl";
const GameCategoryDropdown = ({items, value, onChange }) => {

    const t = useTranslations('FilterBar');
    const refCateg = useRef();
    const [openCatDropd, setOpenCatDropd] = useState(false);

    const resetDropdown = () => {
        refCateg.current.value="";
        onChange("");
    }
    return (
        <div
            className={classNames({
                "dropdown w-full": true,
                "dropdown-open": openCatDropd,
            })}

            ref={refCateg}
        >

            <input type="text" className="input w-full" value={value} onChange={(event) => onChange(event.target.value)}
                placeholder={t('gameFilterGameSelectPlaceh')}
                tabIndex={0} />

            <div className="dropdown-content bg-base-200 border border-primary top-14 max-h-96 overflow-auto flex-col rounded-md" style={{ zIndex: 1 }}>

                <ul
                    className="menu menu-compact"
                    style={{ width: refCateg.current?.clientWidth }}
                >

                    {items.map((item, index) => {
                        return (
                            <li key={index}
                                onClick={() => {
                                    onChange(item);
                                    setOpenCatDropd(false);
                                }}
                                className="border w-full rounded-full"
                            >
                                <button className="pl-2">{item}</button>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <button className="btn btn-error " onMouseDown={(event) => event.preventDefault()} onClick={resetDropdown}><RxCross2 size="1.7em" /></button>
        </div>
    )
}

export default memo(GameCategoryDropdown);