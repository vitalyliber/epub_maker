import axios from "axios";
import fileDownload from "js-file-download";

export const bookDownloadApi = book => {
  return axios({
    method: "post",
    url: "/epubs",
    responseType: "arraybuffer",
    data: book,
    headers: {
      "Content-type": "application/json"
    }
  }).then(({ data }) => {
    fileDownload(data, "book.epub");
    console.log("bookDownloadApi", data);
    return data;
  });
};
