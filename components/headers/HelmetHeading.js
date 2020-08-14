import React from "react";
import Helmet from "react-helmet";

function HelmetHeading(props) {
  return (
    <Helmet>
      <title>{props.title}</title>
      <meta name="description" content={props.desc}></meta>
      <meta property="title" content={props.title}></meta>
      <meta property="og:title" content={props.title}></meta>
      <meta property="og:site_name" content="Expat Jobs - Expatriant"></meta>
      <meta property="og:image" content={props.img}></meta>
    </Helmet>
  );
}

export default HelmetHeading;
