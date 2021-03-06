import React from "react";

import styles from "./feed-item-header.module.css"
import {More, Verified} from "../../icons";
import Link from "next/link";
import Button from "../../button";
import {Info, Label} from "../../text";
import Avatar from "../../avatar";

const FeedItemHeader = ({ owner, location }) => {

    return (
        <div className={styles.container}>
            <Avatar src={owner.userImageUrl} size={32} />
            <div className={styles.textWrapper}>
                <Button href={`/${owner.username}`}>
                    <Label verified={owner.isVerified} useHover>
                        {owner.username}
                    </Label>
                </Button>
                { location &&
                <Button href={`/explore/locations/${location.id}/${location.slug}`}>
                    <Info>
                        {location.name}
                    </Info>
                </Button>
                }
            </div>
            <div style={{ marginLeft: "auto "}}>
                <More />
            </div>
        </div>
    );
}

export default FeedItemHeader