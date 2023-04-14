import React from "react";
import classnames from "classnames";

type BaseButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
} & BaseButtonProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement | HTMLButtonElement>,
    "type" | "onClick"
  >;

export type NativeButtonProps = {
  // htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick">;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button className={classnames("btn", className)} {...props}>
      {children}
    </button>
  );
};

export { Button };
