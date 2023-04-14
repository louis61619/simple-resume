import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

// function ShadowContent({
//   root,
//   children,
// }: {
//   root: globalThis.ShadowRoot;
//   children?: React.ReactNode;
// }) {
//   return ReactDOM.createPortal(children, root);
// }

// export const Perview: React.FC<{
//   children?: React.ReactNode;
// }> = ({ children }) => {
//   const node = useRef<HTMLDivElement | null>(null);
//   const [root, setRoot] = useState<globalThis.ShadowRoot | null>(null);

//   useLayoutEffect(() => {
//     if (node.current) {
//       try {
//         if (node.current.shadowRoot) {
//           return;
//         }
//         const root = node.current.attachShadow({ mode: "open" });
//         setRoot(root);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }, []);

//   return (
//     <>
//       <div className="w-full overflow-hidden" ref={node}>
//         {root && (
//           <ShadowContent root={root}>
//             <link rel="stylesheet" href="/preview.css" />
//             <div className="text-preview" id="preview">
//               <div className="row row--section">
//                 <div className="column column--1-1" id="content">
//                   {children}
//                 </div>
//               </div>
//             </div>
//           </ShadowContent>
//         )}
//       </div>
//     </>
//   );
// };
