import React from "react";

const navigationRef = React.createRef<any>();

const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

export { navigationRef, navigate };
