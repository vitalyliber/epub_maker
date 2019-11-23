import createStore from "storeon";
import persistState from "@storeon/localstorage";

import book from "./book";

export default createStore([
  book,
  persistState(["book"]),
  process.env.NODE_ENV !== "production" && require("storeon/devtools"),
  process.env.NODE_ENV !== "production" && require("storeon/devtools/logger")
]);
