import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Scroll_To_Top() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}
