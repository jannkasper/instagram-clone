import * as React from "react";

function MoreIcon(props) {
    return (
        <svg aria-label="More" fill="#262626" height="16" viewBox="0 0 48 48" width="16" {...props}>
            <circle clipRule="evenodd" cx="8" cy="24" fillRule="evenodd" r="4.5"></circle>
            <circle clipRule="evenodd" cx="24" cy="24" fillRule="evenodd" r="4.5"></circle>
            <circle clipRule="evenodd" cx="40" cy="24" fillRule="evenodd" r="4.5"></circle>
        </svg>
    )
}

export default MoreIcon