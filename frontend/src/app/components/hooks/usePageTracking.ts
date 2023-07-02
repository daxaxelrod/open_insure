import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";

export default function usePageTracking() {
    const location = useLocation();

    useEffect(() => {
        console.log(
            "process.env.REACT_APP_G_TAG_ID",
            process.env.REACT_APP_G_TAG_ID
        );

        ReactGA.initialize(process.env.REACT_APP_G_TAG_ID as string, {});
    }, []);

    useEffect(() => {
        ReactGA.send({
            hitType: "pageview",
            page: window.location.pathname + window.location.search,
        });
    }, [location]);
}
