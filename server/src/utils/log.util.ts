import { supabase } from "$/db/connect";

const logDetails = async (userId: number, imageUrl: string, type: string) => {
    const { error: logError } = await supabase
        .from("logs")
        .insert({ user_id: userId, img: imageUrl, type: type });

    if (logError) return console.log(`Error during ${type} log!`);
};

export default logDetails;
