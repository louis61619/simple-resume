import { createPortal, render } from "react-dom";
import * as ReactDOM from "react-dom/client";

export const Alert = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed left-1/2 top-10 mb-2 w-10/12 max-w-md -translate-x-1/2 rounded-sm bg-gray-600 px-4 py-1 text-center text-sm text-white">
      {children}
    </div>
  );
};

let container: HTMLElement | null;
let timer: NodeJS.Timeout;
let root: null | ReactDOM.Root;

Alert.info = (str: string) => {
  if (timer) {
    clearTimeout(timer);
  }

  container = document.getElementById("alert-wrapper");
  if (!container) {
    container = document.createElement("div");
    container.setAttribute("id", "alert-wrapper");
    document.body.appendChild(container);
  }

  if (!root) {
    root = ReactDOM.createRoot(container);
  }

  timer = setTimeout(() => {
    root?.unmount();
    container?.remove();
    root = null;
  }, 1500);

  root.render(<Alert>{str}</Alert>);
};
