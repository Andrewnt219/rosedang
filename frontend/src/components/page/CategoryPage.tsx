import React, { ReactElement, useMemo, useRef } from "react";
import tw, { styled, theme } from "twin.macro";

import {
	NUMBER_CONSTANTS,
	STYLE_CONSTANTS,
} from "@src/assets/constants/StyleConstants";
import Broken from "@src/components/Broken";
import Loading from "@src/components/Loading";
import Pagination from "@src/components/Pagination";
import { RecentPost } from "@src/components/post/RecentPostSet";
import SidePostSet from "@src/components/post/SidePostSet";
import { useCategoryPageContent, useQueryPaginationItems } from "@src/hooks";
import SidebarLayout from "@src/layouts/SidebarLayout";
import { CategoryPageContent } from "@src/model/CategoryPageContent";
import { createSrcSet, lqipBackground, renderPosts } from "@src/utils";
import { AnimatePresence, motion } from "framer-motion";
import { headerVariants, recentPostsVariants } from "@src/assets/variants";

type Props = {
	prefetchedContent: CategoryPageContent;
};

function CategoryPage({ prefetchedContent }: Props): ReactElement {
	const { data: content, error } = useCategoryPageContent(prefetchedContent);

	const { items } = useQueryPaginationItems({
		count: Math.ceil(content.postsCount / NUMBER_CONSTANTS.defaultPerPage),
	});

	const {
		currentCategory: {
			thumbnail: { url },
		},
	} = content;

	const srcset = useMemo(
		() =>
			createSrcSet(url, {
				format: "webp",
				quality: 50,
			}),
		[url]
	);

	const headerRef = useRef<HTMLElement | null>(null);

	const onPaginationItemClicked = () => {
		setTimeout(() => {
			headerRef.current?.scrollIntoView();
		}, 300);
	};

	if (!content) {
		return <Loading height="20rem" loadingText="Fetching posts" />;
	}

	if (error) {
		return <Broken height="20rem" errorText="Cannot fetch posts" />;
	}

	const renderedSidePosts = renderPosts(
		content.sidePosts,
		error,
		<SidePostSet
			posts={content.sidePosts}
			imageSizes={STYLE_CONSTANTS.sidePostsSizes}
			title="Latest posts"
		/>
	);

	const { posts, currentCategory } = content;

	return (
		<>
			<Header
				ref={headerRef}
				variants={headerVariants}
				animate="visible"
				initial="hidden"
				key={currentCategory.slug}
			>
				<Thumbnail
					src={content.currentCategory.thumbnail.url}
					srcSet={srcset}
					lqip={content.currentCategory.thumbnail.metadata.lqip}
					sizes="100vw"
				/>
				<Heading>
					Category
					<CategoryName>{content.currentCategory.title}</CategoryName>
				</Heading>
			</Header>

			<SidebarLayout>
				<Main>
					{content.posts.length === 0 ? (
						<Broken height="10rem" errorText="Wow, such empty, much space" />
					) : (
						<AnimatePresence exitBeforeEnter>
							<PostSetContainer
								variants={recentPostsVariants.postSet}
								animate="visible"
								initial="hidden"
								exit="exit"
								key={currentCategory.slug + posts[0].slug}
							>
								{content.posts.map((post) => (
									<li key={post.slug}>
										<RecentPost
											isMain
											data={post}
											imageSizes={STYLE_CONSTANTS.recentPostSizes}
										/>
									</li>
								))}
							</PostSetContainer>
						</AnimatePresence>
					)}
				</Main>

				{renderedSidePosts}

				<Pagination items={items} onItemClicked={onPaginationItemClicked} />
			</SidebarLayout>
		</>
	);
}

type MainProps = {};
const Main = styled.main<MainProps>`
	padding: 2rem 0;
`;

type HeaderProps = {};
const Header = styled(motion.header)<HeaderProps>`
	${tw`relative`}
	padding-bottom: min(45%, 15rem);
	width: 100%;
`;

type ThumbnailProps = {
	lqip: string;
};
const Thumbnail = styled.img<ThumbnailProps>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;

	${(p) => lqipBackground(p.lqip)}
`;

type HeadingProps = {};
const Heading = styled.h1<HeadingProps>`
	${tw`text-2xl text-white font-700`}
	${tw`flex flex-col items-center justify-center w-full h-full`}
	${tw`z-10 absolute top-0 left-0`}
	background: rgba(0, 0,0, .7);

	@media screen and (min-width: ${theme`screens.mdTablet`}) {
		${tw`text-4xl`}
	}
`;

type CategoryNameProps = {};
const CategoryName = styled.span<CategoryNameProps>`
	${tw`text-base font-400`}
	${tw`inline-block mt-2`}

	@media screen and (min-width: ${theme`screens.mdTablet`}) {
		${tw`text-xl`}
	}
`;

type PostSetContainerProps = {};
const PostSetContainer = styled(motion.ul)<PostSetContainerProps>`
	${tw`space-y-10`}
`;

export default CategoryPage;
