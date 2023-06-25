import React, { memo, useRef, useState } from "react";
import classNames from "classnames";
import { RxCross2 } from "react-icons/rx";
import { useTranslations } from "next-intl";


const GameGenreDropdown = ({items, value, onChange }) => {

    const t = useTranslations('FilterBar');
    const ref = useRef();

    const [open, setOpen] = useState(false);

    const resetDropdown = () => {
        ref.current.value="";
        onChange("");
    }
    return (
        <div
            className={classNames({
                "dropdown w-full": true,
                "dropdown-open": open,
            })}

            ref={ref}
        >

            <input type="text" className="input w-full" value={value} onChange={(event) => onChange(event.target.value)}
                placeholder={t('gameFilterGameSelectPlaceh')}
                tabIndex={0} />

            <div className="dropdown-content bg-base-200 border border-primary top-14 max-h-96 overflow-auto flex-col rounded-md" style={{ zIndex: 1 }}>

                <ul
                    className="menu menu-compact "
                    style={{ width: ref.current?.clientWidth }}
                >

                    {items.map((item, index) => {
                        return (
                            <li key={index}
                                tabIndex={index + 1}
                                onClick={() => {
                                    onChange(item);
                                    setOpen(false);
                                }}
                                className="border w-full m-1 p-1"
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

export default memo(GameGenreDropdown);