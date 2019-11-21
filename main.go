package main

import (
	"encoding/json"
	"fmt"
	"github.com/bmaupin/go-epub"
	"io"
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
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

func renderError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte(message))
}

const maxUploadSize = 5 * 1024 * 1024 // 5 MB
const uploadPath = "./tmp"

// {"title": "Wow Book", "author": "Vitaly", "sections": [{"body": "<h1>Aha</h1><p>Oho</p>"}]}
func createEpub(rw http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	var b book
	err := decoder.Decode(&b)
	if err != nil {
		renderError(rw, "Can't parse json", http.StatusBadRequest)
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

	// Set the cover. The CSS file is optional
	coverImagePath, _ := epub.AddImage("tmp/cover.png", "cover.png")
	epub.SetCover(coverImagePath, "")

	filePath := "tmp/book.epub"

	// Write the EPUB
	err = epub.Write(filePath)
	if err != nil {
		renderError(rw, "Can't create a file", http.StatusBadRequest)
	}
	log.Println(b)
	file, err := os.Open(filePath) // For read access.
	if err != nil {
		renderError(rw, "Can't open epub file", http.StatusBadRequest)
	}
	rw.Header().Set("Content-Disposition", "attachment; filename=book.epub")
	io.Copy(rw, file)
}

// example from https://github.com/zupzup/golang-http-file-upload-download/blob/master/main.go
func uploadCover() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// validate file size
		r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
		if err := r.ParseMultipartForm(maxUploadSize); err != nil {
			renderError(w, "FILE_TOO_BIG", http.StatusBadRequest)
			return
		}

		// parse and validate file and post parameters
		file, _, err := r.FormFile("coverFile")
		if err != nil {
			renderError(w, "INVALID_FILE", http.StatusBadRequest)
			return
		}
		defer file.Close()
		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			renderError(w, "INVALID_FILE", http.StatusBadRequest)
			return
		}

		// check file type, detectcontenttype only needs the first 512 bytes
		detectedFileType := http.DetectContentType(fileBytes)
		switch detectedFileType {
		case "image/jpeg", "image/jpg":
		case "image/gif", "image/png":
		case "application/pdf":
			break
		default:
			renderError(w, "INVALID_FILE_TYPE", http.StatusBadRequest)
			return
		}
		fileName := "cover"
		fileEndings, err := mime.ExtensionsByType(detectedFileType)
		if err != nil {
			renderError(w, "CANT_READ_FILE_TYPE", http.StatusInternalServerError)
			return
		}
		newPath := filepath.Join(uploadPath, fileName+fileEndings[0])
		fmt.Printf("FileType: %s, File: %s\n", detectedFileType, newPath)

		// write file
		newFile, err := os.Create(newPath)
		if err != nil {
			renderError(w, "CANT_WRITE_FILE", http.StatusInternalServerError)
			return
		}
		defer newFile.Close() // idempotent, okay to call twice
		if _, err := newFile.Write(fileBytes); err != nil || newFile.Close() != nil {
			renderError(w, "CANT_WRITE_FILE", http.StatusInternalServerError)
			return
		}
		w.Write([]byte("SUCCESS"))
	})
}

func main() {
	http.HandleFunc("/epubs", createEpub)
	http.HandleFunc("/covers", uploadCover())
	log.Fatal(http.ListenAndServe(":8082", nil))
}
