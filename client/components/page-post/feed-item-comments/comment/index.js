import React from "react";
import Link from "next/link";
import Avatar from "../../../avatar";
import Button from "../../../button";
import {Info, Label} from "../../../Text";
import { Like, Verified } from "../../../icons";
import { timeFormatter, hashtagFormatter } from "../../../../util/formatter";

import styles from "./feed-item-comment.module.css";

const Comment = ({ feedDescription, owner, text, createdAt, likes }) => {

    return (
        <div className={styles.commentContainer}>
            <Avatar src={owner.userImageUrl} size={32} />
            <div className={styles.commentContent}>
                <Button href="/[username]" as={`/${owner.username}`} style={{ display: "inline" }}>
                    <Label verified={owner.isVerified} useHover>{owner.username}</Label>
                </Button>
                { hashtagFormatter(text) }
                <div className={styles.commentActions}>
                    <Info color={"#8e8e8e"}>{timeFormatter(createdAt)}</Info>
                    { !feedDescription &&
                            <>
                            { likes && <Button><Info color={"#8e8e8e"} weight={600}>{likes} like</Info></Button> }
                                <Button><Info color={"#8e8e8e"} weight={600}>Reply</Info></Button>
                            </>
                    }
                </div>
            </div>
            { !feedDescription &&
                <div>
                    <Like/>
                </div>
            }
        </div>
    );
}

export default Comment