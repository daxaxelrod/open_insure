import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div>
            Url not found!
            <Link to={"/"}>
                <Button>Go to home</Button>
            </Link>
        </div>
    );
}
