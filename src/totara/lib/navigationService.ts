import React from "react";

const navigationRef = React.createRef<any>();

const navigate = (name, params = undefined) => {
  navigationRef.current?.navigate(name, params);
};

export { navigationRef, navigate };
