const sectionExample = `
# Title of section

Hi everyone...

– I'm going to make a epub.
`.substring(1);

export default store => {
  store.on("@init", () => ({
    book: {
      title: "Random writer and the cursed epub",
      author: "Jacob Growling",
      sections: [{ body: sectionExample }]
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
