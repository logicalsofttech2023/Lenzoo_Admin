import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";
import "react-quill/dist/quill.snow.css";

// Register image uploader module
Quill.register("modules/imageUploader", ImageUploader);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.reactQuillRef = React.createRef();
  }

  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"]
    ],
    imageUploader: {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", file);

          fetch("https://api.imgbb.com/1/upload?key=334ecea9ec1213784db5cb9a14dac265", {
            method: "POST",
            body: formData
          })
            .then((response) => response.json())
            .then((result) => {
              resolve(result.data.url);
            })
            .catch((error) => {
              reject("Upload failed");
              console.error("Error:", error);
            });
        });
      }
    }
  };

  formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
  ];

  render() {
    const { value, onChange } = this.props;

    return (
      <ReactQuill
        ref={(el) => { this.reactQuillRef = el }}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={this.modules}
        formats={this.formats}
        style={{ minHeight: "25vh" }}
      />
    );
  }
}

export default Editor;
