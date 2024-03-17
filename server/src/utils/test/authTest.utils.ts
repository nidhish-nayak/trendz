// TEST CASES - CREDENTIALS

// REGISTER TEST
export const RegisterInputFail = {
	username: 10,
	password: true,
	email: "nidhish@gmail.com",
	name: "Admin",
};

export const RegisterUserExists = {
	username: "guest",
	password: "password",
	name: "Guest",
	email: "guest@gmail.com",
};

export const RegisterPass = {
	username: "admin",
	password: "password",
	name: "Admin",
	email: "admin@gmail.com",
};

// LOGIN TEST
export const LoginInputFail = {
	username: 10,
	password: false,
};

export const LoginUserDoesNotExist = {
	username: "asdaskdnasdhasdi",
	password: "sjjansdjndnd",
};

export const LoginWrongPassword = {
	username: "admin",
	password: "wrong-password",
};

export const LoginUserPass = {
	username: "admin",
	password: "password",
};

// DEREGISTER TEST
export const DeregisterInputFail = {
	username: false,
	password: 10,
};

export const DeregisterUnauthorized = {
	username: "unknown-user",
	password: "password",
};

export const DeregisterAnotherUser = {
	username: "guest",
	password: "password",
};

export const DeregisterWrongPassword = {
	username: "admin",
	password: "wrong-password",
};

export const DeregisterPass = {
	username: "admin",
	password: "password",
};
