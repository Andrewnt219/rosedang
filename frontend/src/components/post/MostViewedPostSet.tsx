import dayjs from "dayjs";
import React, { ReactElement } from "react";
import tw, { styled, theme } from "twin.macro";

import { FORMAT_CONSTANTS } from "@src/assets/constants/StyleConstants";
import { MostViewedPostModel } from "@src/model/sanity";
import {
	blocksToText,
	calculateReadingMinutes,
	formatQuantityWithUnit,
} from "@src/utils";

import { Post } from "../Post";
import {
	FacebookShareButton,
	LinkedinShareButton,
	TwitterShareButton,
} from "react-share";
import { useCurrentLocation } from "@src/hooks";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

type MostViewedPostSetProps = {
	posts: MostViewedPostProps["data"][];
	imageSizes: MostViewedPostProps["imageSizes"];
};

type MostViewedPostProps = {
	data: MostViewedPostModel;
	imageSizes: string;
};

function MostViewedPostSet({ posts, imageSizes }: MostViewedPostSetProps) {
	return (
		<MostViewedPostSetContainer>
			{posts.map((post) => (
				<li key={post.slug}>
					<MostViewedPost data={post} imageSizes={imageSizes} />
				</li>
			))}
		</MostViewedPostSetContainer>
	);
}

function MostViewedPost({
	data,
	imageSizes,
}: MostViewedPostProps): ReactElement {
	const {
		views,
		body,
		category,
		title,
		publishedAt,
		slug,
		snippet,
		thumbnail,
	} = data;

	const linkToPost = "/" + slug;

	const location = useCurrentLocation();

	const shareUrl = location?.href + slug;

	return (
		<MostViewedPostContainer>
			<Thumbnail data={{ linkToPost, thumbnail }} sizes={imageSizes} />

			<CustomInfoContainer>
				<Category data={category} />

				<Title data={{ title, linkToPost }} />
				<SubInfoContainer>
					<SubInfo isTime>
						{dayjs(publishedAt).format(FORMAT_CONSTANTS.dateFormat)}
					</SubInfo>

					<SubInfo>
						&nbsp;&nbsp;-&nbsp;&nbsp;
						{calculateReadingMinutes(blocksToText(body))}
					</SubInfo>
				</SubInfoContainer>

				<Snippet>{snippet}</Snippet>

				<Footer>
					<ViewCount>
						{formatQuantityWithUnit(views, "view", "views")}
					</ViewCount>
					<SocialMediaSet>
						<li title="Share to Facebook">
							<FacebookShareButton url={shareUrl}>
								<FaFacebookF />
							</FacebookShareButton>
						</li>
						<li title="Share to LinkedIn">
							<LinkedinShareButton url={shareUrl}>
								<FaLinkedinIn />
							</LinkedinShareButton>
						</li>
						<li title="Share to Twitter">
							<TwitterShareButton url={shareUrl}>
								<FaTwitter />
							</TwitterShareButton>
						</li>
					</SocialMediaSet>
				</Footer>
			</CustomInfoContainer>
		</MostViewedPostContainer>
	);
}

type MostViewedPostSetContainerProps = {};
const MostViewedPostSetContainer = styled.ul<MostViewedPostSetContainerProps>`
	display: grid;
	gap: 3rem 1.5rem;

	@media screen and (min-width: ${theme`screens.smTablet`}) {
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	}
`;

type MostViewedPostContainerProps = {};
const MostViewedPostContainer = styled.article<MostViewedPostContainerProps>`
	height: 100%;

	${tw`flex flex-col`}
`;

const {
	Category,
	Title,
	SubInfo,
	InfoContainer,
	SubInfoContainer,
	Snippet,
	Thumbnail,
} = Post;

const CustomInfoContainer = styled(InfoContainer)`
	padding-bottom: 5rem;
`;

type FooterProps = {};
const Footer = styled.footer<FooterProps>`
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	font-size: smaller;
	${tw`flex items-center justify-center `}
	${tw`border-t border-lborderColor border-b border-solid`}
	${tw`mt-5 p-3 space-x-3`}
`;

type SocialMediaSetProps = {};
const SocialMediaSet = styled.ul<SocialMediaSetProps>`
	${tw`flex items-center justify-center space-x-3`}

	svg {
		transition: fill 200ms ease;

		:hover,
		:focus {
			fill: var(--accent-color);
		}
	}
`;

type ViewCountProps = {};
const ViewCount = styled.span<ViewCountProps>`
	/* font-size: smaller; */
	${tw`flex items-center font-500 text-ltextColor`}

	// NOTE pr-3 should equal space-x-3 of parent
	${tw`pr-3 border-r border-solid border-borderColor`}
`;

export default MostViewedPostSet;
