import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import notFoundImage from "../../assets/images/undraw_back_home_nl-5-c.svg";

export default function NotFound() {
    return (
        <div>
            <Result
                title="Not found"
                subTitle="Sorry, the page you visited does not exist."
                icon={
                    <img
                        src={notFoundImage}
                        alt="404"
                        style={{ height: "35%", width: "35%" }}
                    />
                }
                extra={
                    <Link to={"/home"}>
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </div>
    );
}
