export default store => {
  store.on("@init", () => ({
    book: {
      title: "",
      author: "",
      sections: [{ body: "<h1>Example title</h1><p>Example text</p>" }]
    }
  }));

  store.on("book/update", ({ book }, fields) => {
    return { book: { ...book, ...fields } };
  });

  store.on("book/addNewSection", ({ book, book: { sections } }, _) => {
    return { book: { ...book, sections: [...sections, { body: "" }] } };
  });

  store.on("book/removeSection", ({ book, book: { sections } }, { index }) => {
    return {
      book: {
        ...book,
        sections: [...sections.filter((el, elIndex) => elIndex !== index)]
      }
    };
  });

  store.on(
    "book/updateSection",
    ({ book, book: { sections } }, { index, body }) => {
      return {
        book: {
          ...book,
          sections: [
            ...sections.map((el, elIndex) =>
              elIndex === index ? { body } : el
            )
          ]
        }
      };
    }
  );
};
