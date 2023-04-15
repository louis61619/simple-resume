import React from "react";

const Dialog: React.FC<{
  height?: number;
  width?: number;
  children?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
}> = ({
  // height = 210,
  // width = 360,
  children,
  open = true,
  onClose,
  ...props
}) => {
  if (!open) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-full bg-white">
      <div
        // style={{
        //   height,
        //   width,
        // }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-slate-300 bg-white p-8 shadow-md"
        {...props}
      >
        {children}
        {/* eslint-disable-next-line */}
        <img
          className="absolute right-4 top-4 h-[9px] w-[9px] cursor-pointer opacity-50 hover:opacity-100"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJAQMAAADaX5RTAAAABlBMVEV7mr3///+wksspAAAAAnRSTlP/AOW3MEoAAAAdSURBVAgdY9jXwCDDwNDRwHCwgeExmASygSL7GgB12QiqNHZZIwAAAABJRU5ErkJggg=="
          alt="close"
          onClick={() => onClose?.()}
        />
      </div>
    </div>
  );
};

export { Dialog };
