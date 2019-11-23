import axios from "axios";

export const coverUploadApi = cover => {
  if (!cover.files[0]) {
    return;
  }
  const formData = new FormData();
  formData.append("coverFile", cover.files[0]);

  return axios({
    method: "post",
    url: "/covers",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then(({ data }) => {
    console.log("coverUploadApi", data);
    return data;
  });
};
