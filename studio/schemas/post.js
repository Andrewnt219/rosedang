// TODO generate slug on publish action
export default {
	name: "post",
	title: "Post",
	type: "document",

	initialValue: {
		isArchived: false,
		publishedAt: new Date().toISOString(),
		isPinned: false,
		views: 0,
		author: {
			_ref: "efb8191b-4ada-41cf-9465-e3d348a5c0eb", // Rose
		},
	},

	fields: [
		{
			name: "isPinned",
			title: "Pinned Post",
			type: "boolean",
			description: "Nếu bật thì bài post sẽ nằm trong slider ở đầu trang chủ.",
		},

		{
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => [
				Rule.required().error("Em quên đặt tựa nè."),
				Rule.max(70).warning(
					"Tựa quá dài có thể ảnh hưởng tới thẩm mỹ của web, cơ mà tùy em =))"
				),
			],
		},

		{
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 96,
			},
			validation: (Rule) =>
				Rule.required().error(
					"Không có cái này không lấy bài được, ấn generate nếu lười type."
				),
		},

		{
			name: "categories",
			title: "Categories",
			type: "array",
			of: [
				{
					type: "reference",
					name: "mainCategory",
					title: "Main Category",
					to: { type: "category" },
				},
				{
					type: "reference",
					to: { type: "category" },
					title: "Sub Category",
					name: "subcategory",
				},
			],
			validation: (Rule) => [
				Rule.required()
					.min(1)
					.error(
						"Em nên phân loại, không có ô này nó xuất hiện undefined web có sụp ráng chịu =))."
					),
				Rule.unique().error(
					"Say hay là một ngày dài? Có category bị trùng nè."
				),
				Rule.custom((categories) => {
					if (
						categories.filter((category) => category._type === "mainCategory")
							.length > 1
					) {
						return "Chỉ được một main category thôi nha 😃";
					}

					if (
						categories.length >
						new Set(categories.map((category) => category._ref)).size
					) {
						return "Say hay là một ngày dài? Có category bị trùng nè.";
					}

					if (
						categories.filter((category) => category._type === "mainCategory")
							.length === 0
					) {
						return "Main category phải có, sub category có hay không cũng được";
					}

					return true;
				}),
			],
		},

		{
			name: "body",
			title: "Body",
			type: "blockContent",
			validation: (Rule) =>
				Rule.required().error(
					"Chờ chút, bài này là clickbait à? Nội dung bài viết đâu rồi =))."
				),
			options: {
				metadata: ["lqip"],
			},
		},

		{
			name: "mainImage",
			title: "Main image",
			type: "image",
			fields: [
				{
					name: "alt",
					title: "Alternate text",
					type: "string",
					options: {
						isHightlighted: true,
					},
				},
			],
			options: {
				hotspot: true,
				metadata: ["lqip"],
			},
			validation: (Rule) =>
				Rule.required().error(
					"Main image (thumbnail) như avatar của bài viết á, cũng là tấm hình đầu tiên của bài viết."
				),
		},

		{
			name: "snippet",
			title: "Content snippet",
			type: "text",
			description: "A short introduction about the post",
			validation: (Rule) => [
				Rule.required().error("Vì tính thẩm mỹ của web, em nên ghi cái này."),
				Rule.max(300).warning("Ngắn ngắn thôi em, 300 letters đổ lại."),
			],
			rows: 3,
		},

		{
			name: "publishedAt",
			title: "Published at",
			type: "datetime",
			options: {
				dateFormat: "MMM DD YYYY",
			},
			validation: (Rule) => Rule.required().error("Em quên để ngày đăng nè."),
			description: "Current time is generated by default.",
		},

		{
			name: "author",
			title: "Author",
			type: "reference",
			to: { type: "author" },
			validation: (Rule) =>
				Rule.required().error(
					"Hey, đừng ngại, cho mọi người biết ai đã viết bày này."
				),
		},

		{
			name: "isArchived",
			title: "Archived",
			type: "boolean",
			description:
				"Nếu bật thì post này sẽ không xuất hiện trên web nữa, nhưng vẫn còn ở trong studio",
			validation: (Rule) =>
				Rule.custom((isArchived, context) => {
					if (context.document.isPinned && isArchived) {
						return "Em tháo pin rồi hãy archive nha.";
					}

					return true;
				}),
		},

		{
			name: "views",
			title: "Views",
			type: "number",
			description: "Số lượt xem của bài viết",
			readOnly: true,
		},
	],

	preview: {
		select: {
			title: "title",
			author: "author.name",
			views: "views",
			media: "mainImage",
			isPinned: "isPinned",
			isArchived: "isArchived",
		},
		prepare(selection) {
			const { author, views, isPinned, title, isArchived } = selection;

			let attributedTitle = title;

			if (isArchived) {
				attributedTitle = "📦 " + attributedTitle;
			}

			if (isPinned) {
				attributedTitle = "📌 " + attributedTitle;
			}

			return {
				...selection,
				title: attributedTitle,
				subtitle: `By ${author} (${views} view${views > 1 ? "s" : ""})`,
			};
		},
	},

	orderings: [
		{
			title: "Least views",
			name: "viewsAsc",
			by: [
				{ field: "views", direction: "asc" },
				{ field: "title", direction: "asc" },
			],
		},
		{
			title: "Most views",
			name: "viewsDesc",
			by: [
				{ field: "views", direction: "desc" },
				{ field: "title", direction: "asc" },
			],
		},
	],
};
