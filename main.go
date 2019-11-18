package main

import (
	"encoding/json"
	"github.com/bmaupin/go-epub"
	"log"
	"net/http"
)

type section struct {
	Body  string
	Title string
}

type book struct {
	Title    string
	Author   string
	Sections []section
}

// {"title": "Wow Book", "author": "Vitaly", "sections": [{"body": "<h1>Aha</h1><p>Oho</p>"}]}
func create_epub(rw http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	var b book
	err := decoder.Decode(&b)
	if err != nil {
		panic(err)
	}
	// Create a new EPUB
	epub := epub.NewEpub(b.Title)

	// Set the author
	epub.SetAuthor(b.Author)

	// Add a section
	for e := range b.Sections {
		log.Println(b.Sections[e])
		epub.AddSection(b.Sections[e].Body, b.Sections[e].Title, "", "")
	}

	// Write the EPUB
	err = epub.Write("My EPUB.epub")
	if err != nil {
		// handle error
	}
	log.Println(b)
}

func main() {
	http.HandleFunc("/epubs", create_epub)
	log.Fatal(http.ListenAndServe(":8082", nil))
}
