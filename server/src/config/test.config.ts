// TEST CASES - CREDENTIALS
import dotenv from "dotenv";

// IMPORTANT TEST EXPORT UTILS
export const testConfig = {
	upload: {
		path: "./src/__tests__/utils/assets/test.png",
		data: "test data",
	},
};

dotenv.config();

if (
	!process.env.QA_NAME ||
	!process.env.QA_EMAIL ||
	!process.env.QA_USERNAME ||
	!process.env.QA_PASSWORD ||
	!process.env.QA_NAME_EXISTS ||
	!process.env.QA_EMAIL_EXISTS ||
	!process.env.QA_USERNAME_EXISTS ||
	!process.env.QA_PASSWORD_EXISTS
) {
	throw Error(".env TEST USER SETUP not found!");
}

const user = {
	name: process.env.QA_NAME,
	email: process.env.QA_EMAIL,
	username: process.env.QA_USERNAME,
	password: process.env.QA_PASSWORD,
};

// EXISTING USER
export const ExistingUser = {
	name: process.env.QA_NAME_EXISTS,
	email: process.env.QA_EMAIL_EXISTS,
	username: process.env.QA_USERNAME_EXISTS,
	password: process.env.QA_PASSWORD_EXISTS,
};

// GUEST USER
export const GuestUser = {
	name: process.env.QA_NAME_GUEST,
	email: process.env.QA_EMAIL_GUEST,
	username: process.env.QA_USERNAME_GUEST,
	password: process.env.QA_PASSWORD_GUEST,
};

// REGISTER TEST
export const RegisterInputFail = {
	username: 10,
	password: true,
	email: user.email,
	name: user.name,
};

export const RegisterUserExists = {
	username: ExistingUser.username,
	password: ExistingUser.password,
	name: ExistingUser.name,
	email: ExistingUser.email,
};

export const RegisterPass = {
	username: user.username,
	password: user.password,
	name: user.name,
	email: user.email,
};

// LOGIN TEST
export const LoginInputFail = {
	username: 10,
	password: false,
};

export const LoginUserDoesNotExist = {
	username: user.username + "user_does_not_exist",
	password: user.password,
};

export const LoginWrongPassword = {
	username: user.username,
	password: user.password + "wrong_password",
};

export const LoginUserPass = {
	username: user.username,
	password: user.password,
};

// DEREGISTER TEST
export const DeregisterInputFail = {
	username: false,
	password: 10,
};

export const DeregisterUnauthorized = {
	username: user.username + "unknown_user",
	password: user.password,
};

export const DeregisterAnotherUser = {
	username: ExistingUser.username,
	password: user.password,
};

export const DeregisterWrongPassword = {
	username: user.username,
	password: user.password + "wrong_password",
};

export const DeregisterPass = {
	username: user.username,
	password: user.password,
};
