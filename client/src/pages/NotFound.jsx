import React, { useState, useEffect } from "react";
import "./pages.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h1 className="not_found">404</h1>
      <h2 className="not_found_message" id="h2">
        Oops!, Page not Found
      </h2>
      <h3 className="not_found_message" id="h3">
        We realize all the frustration. But it looks like the page you're
        looking for doesn't exited or has been removed
      </h3>
      <h3 className="not_found_message" id="h3">
        But there's no need to worry. You can always go back.
      </h3>
      <Link to={"/"} className="back_to_home_link">
        <button className="back_to_home">Back to Home Page</button>
      </Link>
    </div>
  );
}
