import React from "react";
import { Heading } from "grommet";

import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const JobDescriptionField = ({ handleObject, html_desc }) => {
  return (
    <>
      <Heading level={3}>Job Description:</Heading>
      <CKEditor
        editor={ClassicEditor}
        data={html_desc}
        onInit={(editor) => {
          const editorData = editor.getData();
          handleObject({ html_desc: editorData });
        }}
        onChange={(event, editor) => {
          const editorData = editor.getData();
          handleObject({ html_desc: editorData });
        }}
        onBlur={(event, editor) => {
          const editorData = editor.getData();
          handleObject({ html_desc: editorData });
        }}
      />
    </>
  );
};

export default JobDescriptionField;
