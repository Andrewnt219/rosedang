import React, { ReactElement } from "react";
import tw, { styled } from "twin.macro";
import { PostComment } from "@src/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaReply } from "react-icons/fa";

dayjs.extend(relativeTime);

type CommentSetProps = {
	comments: PostComment[];
};

function CommentSet({ comments }: CommentSetProps): ReactElement {
	return (
		<StyledCommentSet>
			{comments.map((comment) => (
				<li key={comment.id}>
					<Comment data={comment} />
				</li>
			))}
		</StyledCommentSet>
	);
}

type StyledCommentSetProps = {};
const StyledCommentSet = styled.ul<StyledCommentSetProps>`
	&& {
		${tw`mt-0`}
	}
`;

/* -------------------------------------------------------------------------- */
/*                                   Comment                                  */
/* -------------------------------------------------------------------------- */
type CommentProps = {
	data: PostComment;
};
function Comment({ data }: CommentProps) {
	const { _createdAt, name, text } = data;
	return (
		<StyledComment>
			<Avatar src="/svg/user-avatar.svg" />
			<Name>{name}</Name>
			{/* TODO: add hover show exact date */}
			<Date>{dayjs(_createdAt).fromNow()}</Date>
			<Body>{text}</Body>
			<Button>
				<FaReply /> Reply
			</Button>
		</StyledComment>
	);
}

type StyledCommentProps = {};
const StyledComment = styled.article<StyledCommentProps>`
	${tw`text-sm`}
	${tw`py-8 border-b border-lborderColor border-solid`}

	display: grid;
	grid-template-columns: 3rem 1fr auto;
	grid-template-areas:
		"avatar name reply"
		"avatar date ..."
		"... body body";
	gap: 0 1rem;
`;

type AvatarProps = {};
const Avatar = styled.img<AvatarProps>`
	grid-area: avatar;
`;

type NameProps = {};
const Name = styled.span<NameProps>`
	${tw`font-500`}
	grid-area: name;
	font-size: 1.1em;
`;

type DateProps = {};
const Date = styled.time<DateProps>`
	${tw`uppercase font-500 tracking-widest text-ltextColor`}
	grid-area: date;
	font-size: 0.75em;
`;

type BodyProps = {};
const Body = styled.p<BodyProps>`
	${tw`mt-2`}
	grid-area: body;
`;

type ButtonProps = {};
const Button = styled.button<ButtonProps>`
	${tw`uppercase text-accent font-500 tracking-widest`}
	${tw`flex items-center`}
	grid-area: reply;
	font-size: 0.75em;

	svg {
		height: 0.5em;
		${tw`text-xs text-ltextColor mr-1`}
	}
`;

export default CommentSet;
