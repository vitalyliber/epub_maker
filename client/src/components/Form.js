import React, { useRef } from "react";
import useStoreon from "storeon/react";
import { bookDownloadApi } from "../api/downloads";
import { coverUploadApi } from "../api/uploads";

function Form() {
  const {
    dispatch,
    book,
    book: { author, title, sections }
  } = useStoreon("book");

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
            onClick={async () => {
              await coverUploadApi(coverInput.current);
              await bookDownloadApi(book);
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
