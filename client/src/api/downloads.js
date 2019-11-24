import axios from "axios";
import fileDownload from "js-file-download";
import showdown from "showdown";

export const bookDownloadApi = book => {
  const converter = new showdown.Converter();

  return axios({
    method: "post",
    url: "/epubs",
    responseType: "arraybuffer",
    data: {
      ...book,
      sections: book.sections.map(({ body }) => ({
        body: converter.makeHtml(body)
      }))
    },
    headers: {
      "Content-type": "application/json"
    }
  }).then(({ data }) => {
    fileDownload(data, "book.epub");
    console.log("bookDownloadApi", data);
    return data;
  });
};
