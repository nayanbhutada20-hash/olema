import axios from "axios";

export const BASE_URL = "http://localhost:3022/";

class ApiModel {
     UserDetails=[];
    // Generic POST method
    async PostMethod(data, method, isFileUpload = false) {
        try {
            let config = {};

            if (isFileUpload) {
                config.headers = {
                    "Content-Type": "multipart/form-data"
                };
            }

            const response = await axios.post(BASE_URL + method, data, config);
            return response.data;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    // Helper to read image path
    ReadImage(imageName) {
        return BASE_URL  + imageName;
    }

    GetImageUrl(imgUrl){

        return BASE_URL+imgUrl;
    }

}

export default ApiModel;
