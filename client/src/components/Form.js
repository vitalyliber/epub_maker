import React, { useRef, useState } from "react";
import useStoreon from "storeon/react";
import { bookDownloadApi } from "../api/downloads";
import { coverUploadApi } from "../api/uploads";
import notifyError from "../utils/notifyError";
import notifySuccess from "../utils/notifySuccess";

function Form() {
  const {
    dispatch,
    book,
    book: { author, title, sections }
  } = useStoreon("book");

  const [isCreatingBook, setCreatingBook] = useState(false);

  const coverInput = useRef(null);

  const updateFields = e => {
    console.log(e);
    dispatch("book/update", { [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              className="form-control"
              value={author}
              id="author"
              placeholder="Enter author name"
              onChange={updateFields}
              name="author"
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              id="title"
              placeholder="Enter book title"
              onChange={updateFields}
              name="title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">Cover image</label>
            <input
              type="file"
              className="form-control-file"
              id="file"
              accept="image/x-png,image/jpeg"
              ref={coverInput}
            />
          </div>
          {sections.map(({ body }, index) => {
            return (
              <div key={index} className="form-group">
                <div className="d-flex justify-content-between mb-2">
                  <label htmlFor={index}>Section {index + 1}</label>
                  <button
                    onClick={() => dispatch("book/removeSection", { index })}
                    type="button"
                    className="close text-danger"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <textarea
                  value={body}
                  className="form-control"
                  id={index}
                  rows="3"
                  onChange={el => {
                    dispatch("book/updateSection", {
                      index,
                      body: el.target.value
                    });
                  }}
                />
                <small id={index} className="form-text text-muted">
                  You can use Markdown for adding some styles.
                </small>
              </div>
            );
          })}
          <button
            onClick={() => dispatch("book/addNewSection")}
            type="button"
            className="btn btn-primary btn-lg btn-block"
          >
            Add section
          </button>
          <button
            disabled={isCreatingBook}
            onClick={async () => {
              if (coverInput.current.files[0]) {
                // limit is 5 mb
                const sizeInMb = coverInput.current.files[0].size / 1024 / 1024;
                if (sizeInMb > 5) {
                  notifyError("Cover size must be less than 5 mb");
                  return;
                }
              }
              try {
                setCreatingBook(true);
                await coverUploadApi(coverInput.current);
                await bookDownloadApi(book);
                notifySuccess("Book successfully created");
              } catch (e) {
                console.log(e);
                notifyError("Something went wrong");
              } finally {
                setCreatingBook(false);
              }
            }}
            type="button"
            className="btn btn-success btn-lg btn-block mt-3"
          >
            Create book
          </button>
        </div>
      </div>
    </div>
  );
}

export default Form;
