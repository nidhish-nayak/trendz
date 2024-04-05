import request from "supertest";
import authRoutes from "../../routes/auth.route";
import postRoutes from "../../routes/post.route";
import uploadRoute from "../../routes/upload.route";

import { existingUserLogin, guestUserLogin } from "../utils/auth.util";
import { createApp } from "../utils/setup.util";

// Initial setup
const app = createApp();

// Test Globals (Guest user to test post method unauthorized)
let userId: number;
let guestId: number;
let accessToken: string;
let guestAccessToken: string;

describe("Post controllers test", () => {
	beforeAll(async () => {
		app.use("/api/auth", authRoutes);

		// Login to both guest & existing user
		const { userId: existingUserId, token: existingUserToken } =
			await existingUserLogin(app);
		const { userId: guestUserId, token: guestUserToken } =
			await guestUserLogin(app);

		// Update global values
		userId = existingUserId;
		guestId = guestUserId;
		accessToken = existingUserToken;
		guestAccessToken = guestUserToken;

		// Tested Routes
		app.use("/api/posts", postRoutes);
		app.use("/api/upload", uploadRoute);
	});

	it("responds for GET /api/posts", async () => {
		const resNoCookie = await request(app).get("/api/posts");
		expect(resNoCookie.status).toBe(401);
		const exploreResNoCookie = await request(app).get("/api/posts/explore");
		expect(exploreResNoCookie.status).toBe(401);

		// GET ALL POSTS
		const response = await request(app)
			.get("/api/posts")
			.set("Cookie", [`accessToken=${accessToken}`]);
		expect(response.status).toBe(200);

		// GET EXPLORE POSTS
		const exploreRes = await request(app)
			.get("/api/posts/explore")
			.set("Cookie", [`accessToken=${accessToken}`]);
		expect(exploreRes.status).toBe(200);

		// GET POST DATA TO TEST SINGLE POST
		const posts = response.body;
		const getSingleRes = await request(app)
			.get(`/api/posts/${posts[0]}`)
			.set("Cookie", [`accessToken=${accessToken}`]);
		expect(getSingleRes.status).toBe(200);
	});

	it("responds for POST /api/posts", async () => {
		const postData = {
			img: null,
			desc: "test",
			userId: userId,
			fileName: null,
		};
		const addPost = await request(app)
			.post("/api/posts")
			.set("Cookie", [`accessToken=${accessToken}`])
			.send(postData);
		expect(addPost.status).toBe(200);
		expect(typeof addPost.body[0].id).toBe("number");

		const postId = addPost.body[0].id;
		const deletePost = await request(app)
			.delete(`/api/posts/${postId}`)
			.set("Cookie", [`accessToken=${accessToken}`]);
		expect(deletePost.status).toBe(200);

		// Test No Cookie
		const addPostNoCookie = await request(app)
			.post("/api/posts")
			.send(postData);
		expect(addPostNoCookie.status).toBe(401);

		const deletePostNoCookie = await request(app).delete(
			`/api/posts/${postId}`
		);
		expect(deletePostNoCookie.status).toBe(401);

		// Test Guest user no access to Post
		const addPostGuest = await request(app)
			.post("/api/posts")
			.set("Cookie", [`accessToken=${guestAccessToken}`])
			.send(postData);
		expect(addPostGuest.status).toBe(401);

		const deletePostGuest = await request(app)
			.delete(`/api/posts/${postId}`)
			.set("Cookie", [`accessToken=${guestAccessToken}`]);
		expect(deletePostGuest.status).toBe(401);
	});

	afterAll(() => {
		return new Promise<void>((done) => {
			// Clean up any resources if necessary
			done();
		});
	});
});
