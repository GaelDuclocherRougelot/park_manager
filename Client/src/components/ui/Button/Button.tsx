"use client";

import { MouseEventHandler } from "react";

type Button = {
  type?: "button" | "submit" | "reset";
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  classNames?: string;
};

export default function Button({
  type = "button",
  title,
  onClick,
  classNames,
}: Button) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={
        `${classNames} border w-fit px-4 py-3 border-slate-400 rounded-md text-white bg-slate-700 md:text-slate-700 md:bg-white md:hover:bg-slate-700 md:hover:text-white transition-colors duration-200`
      }
    >
      {title}
    </button>
  );
}
