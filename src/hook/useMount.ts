import React, { useEffect, useRef } from "react";

const useEffectOnlyOnce = (
  callback: (params: any) => void,
  dependencies: any,
  condition: (params: any) => boolean
) => {
  const calledOnce = React.useRef(false);

  React.useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    if (condition(dependencies)) {
      callback(dependencies);

      calledOnce.current = true;
    }
  }, [callback, condition, dependencies]);
};

export { useEffectOnlyOnce };
